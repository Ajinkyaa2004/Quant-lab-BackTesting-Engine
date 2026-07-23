"""
Backtesting engine - executes strategies on historical data.

Simulates order fills candle-by-candle with transaction cost modeling
(commission + slippage), tracks a timestamped equity curve, a buy & hold
benchmark, and computes an institutional-grade metrics suite.
"""
from typing import List, Dict, Any, Optional
from core.candle import Candle
from strategies.base import BaseStrategy
from strategies.loader import StrategyLoader
from brokers.base import BrokerBase
from brokers.factory import BrokerFactory
from engine.position import Position
import math

MS_PER_YEAR = 365.25 * 24 * 60 * 60 * 1000

# Candles per year for annualization (crypto trades 24/7)
_INTERVAL_MINUTES = {
    "1m": 1, "3m": 3, "5m": 5, "15m": 15, "30m": 30,
    "1h": 60, "2h": 120, "4h": 240, "6h": 360, "8h": 480, "12h": 720,
    "1d": 1440, "3d": 4320, "1w": 10080, "1M": 43200,
}


def periods_per_year(interval: str) -> float:
    """Number of candles of `interval` in one year (24/7 markets)."""
    minutes = _INTERVAL_MINUTES.get(interval, 60)
    return 525600.0 / minutes


class BacktestingEngine:
    """
    Backtesting engine that executes strategies on historical candles.
    """

    def __init__(
        self,
        initial_capital: float = 10000.0,
        max_positions: int = 1,
        commission_pct: float = 0.001,
        slippage_pct: float = 0.0005,
    ):
        """
        Initialize backtesting engine.

        Args:
            initial_capital: Starting capital for backtest
            max_positions: Maximum concurrent positions allowed
            commission_pct: Commission per fill as decimal of notional (0.001 = 0.1%)
            slippage_pct: Adverse slippage applied to every fill price (0.0005 = 0.05%)
        """
        self.initial_capital = initial_capital
        self.capital = initial_capital
        self.max_positions = max_positions
        self.commission_pct = max(0.0, commission_pct or 0.0)
        self.slippage_pct = max(0.0, slippage_pct or 0.0)
        self.total_fees = 0.0
        self.positions: List[Position] = []
        self.closed_trades: List[Dict[str, Any]] = []
        self.equity_curve: List[float] = []
        self.equity_timestamps: List[int] = []
        self.exposure_candles = 0

    # ------------------------------------------------------------------ #
    # Run
    # ------------------------------------------------------------------ #

    def run_backtest(
        self,
        strategy_code: str,
        class_name: str,
        broker_name: str,
        symbol: str,
        interval: str,
        start_time: Optional[int] = None,
        end_time: Optional[int] = None,
        limit: Optional[int] = None,
        config: Optional[Dict[str, Any]] = None
    ) -> Dict[str, Any]:
        """
        Run backtest on historical data.

        Returns:
            Dictionary with backtest results, curves and metrics.
        """
        # Reset state
        self.capital = self.initial_capital
        self.total_fees = 0.0
        self.positions = []
        self.closed_trades = []
        self.equity_curve = []
        self.equity_timestamps = []
        self.exposure_candles = 0

        # Create broker instance
        broker = BrokerFactory.create_broker(broker_name)

        # Fetch historical data
        candles = broker.get_ohlc(
            symbol=symbol,
            interval=interval,
            limit=limit,
            start_time=start_time,
            end_time=end_time
        )

        if not candles:
            raise ValueError("No historical data available for backtest")

        # Prepare strategy config
        strategy_config = config or {}
        strategy_config.update({
            "max_positions": self.max_positions,
            "initial_capital": self.initial_capital,
            "risk_per_trade": strategy_config.get("risk_per_trade", 0.02)
        })

        # Load and instantiate strategy
        strategy = StrategyLoader.create_strategy_instance(
            code=strategy_code,
            class_name=class_name,
            broker=broker,
            config=strategy_config
        )

        strategy.initialize()

        # Process each candle
        for candle in candles:
            self._process_candle(strategy, candle)

        # Close any remaining positions at the end
        for position in self.positions[:]:
            self._close_position(position, candles[-1].close, "END_OF_BACKTEST", candles[-1].timestamp)
        # Re-mark final equity after forced liquidation
        if self.equity_curve:
            self.equity_curve[-1] = self.capital

        # Buy & hold benchmark scaled to initial capital
        first_close = candles[0].close
        benchmark_curve = [
            (c.close / first_close) * self.initial_capital for c in candles
        ] if first_close > 0 else [self.initial_capital] * len(candles)

        drawdown_curve = self._drawdown_series(self.equity_curve)
        metrics = self._calculate_metrics(candles, interval, benchmark_curve, drawdown_curve)
        monthly_returns = self._monthly_returns()

        return {
            "initial_capital": self.initial_capital,
            "final_capital": self.capital,
            "metrics": metrics,
            "trades": self.closed_trades,
            "equity_curve": self.equity_curve,
            "equity_timestamps": self.equity_timestamps,
            "benchmark_curve": benchmark_curve,
            "drawdown_curve": drawdown_curve,
            "monthly_returns": monthly_returns,
            "total_trades": len(self.closed_trades),
            "winning_trades": sum(1 for t in self.closed_trades if t["pnl"] > 0),
            "losing_trades": sum(1 for t in self.closed_trades if t["pnl"] <= 0),
            "config": {
                "symbol": symbol,
                "interval": interval,
                "commission_pct": self.commission_pct,
                "slippage_pct": self.slippage_pct,
                "max_positions": self.max_positions,
                "candles": len(candles),
                "data_start": candles[0].timestamp,
                "data_end": candles[-1].timestamp,
            },
        }

    # ------------------------------------------------------------------ #
    # Simulation
    # ------------------------------------------------------------------ #

    def _process_candle(self, strategy: BaseStrategy, candle: Candle):
        """Process a single candle through the strategy."""
        # Update positions (check stop loss, take profit, trailing stops)
        for position in self.positions[:]:
            position.increment_candles_held()

            if position.trailing_stop:
                position.update_trailing_stop(candle)

            if position.check_stop_loss(candle):
                self._close_position(position, position.stop_loss, "STOP_LOSS", candle.timestamp)
                continue

            if position.check_take_profit(candle):
                self._close_position(position, position.take_profit, "TAKE_PROFIT", candle.timestamp)
                continue

        # Get strategy signal (can be None, single order, or list of orders)
        order_result = strategy.on_candle(candle)

        if order_result:
            if isinstance(order_result, list):
                for order in order_result:
                    if order:
                        self._execute_order(order, candle)
            else:
                self._execute_order(order_result, candle)

        if self.positions:
            self.exposure_candles += 1

        self._update_equity_curve(candle)

    def _slipped(self, price: float, direction: str) -> float:
        """Apply adverse slippage: 'buy' fills higher, 'sell' fills lower."""
        if direction == "buy":
            return price * (1 + self.slippage_pct)
        return price * (1 - self.slippage_pct)

    def _fee(self, price: float, quantity: float) -> float:
        return price * quantity * self.commission_pct

    def _execute_order(self, order: Dict[str, Any], candle: Candle):
        """
        Execute an order (simulated).

        Supported actions:
        - BUY: Open LONG position
        - SELL: Open SHORT position (if no LONG position) or close LONG position
        - CLOSE: Close specific position
        - CLOSE_ALL: Close all positions
        """
        action = order.get("action", "").upper()
        quantity = order.get("quantity", 0)
        order_type = order.get("order_type", "MARKET").upper()
        price = order.get("price")
        stop_loss = order.get("stop_loss")
        stop_loss_pct = order.get("stop_loss_pct")
        take_profit = order.get("take_profit")
        take_profit_pct = order.get("take_profit_pct")
        trailing_stop = order.get("trailing_stop")
        position_side = order.get("position_side", "LONG").upper()
        exit_reason = order.get("exit_reason", "STRATEGY_SIGNAL")

        if action == "CLOSE_ALL":
            for position in self.positions[:]:
                self._close_position(position, candle.close, exit_reason, candle.timestamp)
            return

        if action == "CLOSE":
            if not self.positions:
                return
            position = None
            if position_side:
                for pos in self.positions:
                    if pos.side == position_side:
                        position = pos
                        break
            else:
                position = self.positions[0]
            if position:
                fill_price = candle.close if order_type == "MARKET" or price is None else price
                if order_type == "LIMIT" and price:
                    if not (candle.low <= price <= candle.high):
                        return  # Limit not filled
                self._close_position(position, fill_price, exit_reason, candle.timestamp)
            return

        # Resolve raw fill price for entries
        def resolve_fill() -> Optional[float]:
            if order_type == "MARKET" or price is None:
                return candle.close
            if order_type == "LIMIT":
                if candle.low <= price <= candle.high:
                    return price
                return None  # Not filled
            return candle.close

        entry_ref = price if price else candle.close

        if stop_loss_pct and not stop_loss:
            if action == "BUY" or position_side == "LONG":
                stop_loss = entry_ref * (1 - stop_loss_pct)
            else:
                stop_loss = entry_ref * (1 + stop_loss_pct)

        if take_profit_pct and not take_profit:
            if action == "BUY" or position_side == "LONG":
                take_profit = entry_ref * (1 + take_profit_pct)
            else:
                take_profit = entry_ref * (1 - take_profit_pct)

        if action == "BUY":
            raw_fill = resolve_fill()
            if raw_fill is None or quantity <= 0:
                return
            fill_price = self._slipped(raw_fill, "buy")

            # Cap quantity to what available capital (incl. fee) can afford
            max_affordable = self.capital / (fill_price * (1 + self.commission_pct))
            quantity = min(quantity, max_affordable)
            cost = fill_price * quantity
            fee = self._fee(fill_price, quantity)
            if quantity <= 0 or cost < 1e-9:
                return  # Nothing affordable
            if len(self.positions) >= self.max_positions:
                return

            position = Position(
                side="LONG",
                entry_price=fill_price,
                quantity=quantity,
                entry_time=candle.timestamp,
                stop_loss=stop_loss,
                take_profit=take_profit,
                trailing_stop=trailing_stop
            )
            position.entry_fee = fee
            self.positions.append(position)
            self.capital -= (cost + fee)
            self.total_fees += fee

        elif action == "SELL":
            long_positions = [p for p in self.positions if p.side == "LONG"]

            if long_positions:
                raw_fill = resolve_fill()
                if raw_fill is None:
                    return
                self._close_position(long_positions[0], raw_fill, exit_reason, candle.timestamp)
            else:
                # Open SHORT position
                raw_fill = resolve_fill()
                if raw_fill is None or quantity <= 0:
                    return
                fill_price = self._slipped(raw_fill, "sell")

                if len(self.positions) >= self.max_positions:
                    return

                # Cap quantity to what available margin (incl. fee) can support
                max_affordable = self.capital / (fill_price * (1 + self.commission_pct))
                quantity = min(quantity, max_affordable)
                margin_required = fill_price * quantity
                fee = self._fee(fill_price, quantity)
                if quantity <= 0 or margin_required < 1e-9:
                    return

                position = Position(
                    side="SHORT",
                    entry_price=fill_price,
                    quantity=quantity,
                    entry_time=candle.timestamp,
                    stop_loss=stop_loss,
                    take_profit=take_profit,
                    trailing_stop=trailing_stop
                )
                position.entry_fee = fee
                self.positions.append(position)
                self.capital -= (margin_required + fee)
                self.total_fees += fee

    def _close_position(
        self,
        position: Position,
        exit_price: float,
        exit_reason: str,
        exit_time: int
    ):
        """Close a position (with slippage + commission) and record the trade."""
        if position not in self.positions:
            return

        # Adverse slippage on the exit side
        if position.side == "LONG":
            fill_price = self._slipped(exit_price, "sell")
        else:
            fill_price = self._slipped(exit_price, "buy")

        exit_fee = self._fee(fill_price, position.quantity)
        entry_fee = getattr(position, "entry_fee", 0.0)
        gross_pnl = position.calculate_realized_pnl(fill_price)
        net_pnl = gross_pnl - exit_fee  # entry fee already deducted from capital

        if position.side == "LONG":
            self.capital += (fill_price * position.quantity) - exit_fee
        else:  # SHORT: return margin + pnl
            self.capital += (position.entry_price * position.quantity) + gross_pnl - exit_fee

        self.total_fees += exit_fee

        notional = position.entry_price * position.quantity
        trade_net = gross_pnl - exit_fee - entry_fee
        trade = {
            "entry_time": position.entry_time,
            "exit_time": exit_time,
            "side": position.side,
            "entry_price": position.entry_price,
            "exit_price": fill_price,
            "quantity": position.quantity,
            "pnl": trade_net,
            "gross_pnl": gross_pnl,
            "fees": entry_fee + exit_fee,
            "return_pct": (trade_net / notional) * 100 if notional > 0 else 0.0,
            "exit_reason": exit_reason,
            "candles_held": position.candles_held
        }

        self.closed_trades.append(trade)
        self.positions.remove(position)

    def _update_equity_curve(self, candle: Candle):
        """Mark-to-market equity = cash + margin locked + unrealized P&L."""
        locked = 0.0
        unrealized = 0.0
        for pos in self.positions:
            locked += pos.entry_price * pos.quantity
            unrealized += pos.calculate_unrealized_pnl(candle.close)
        self.equity_curve.append(self.capital + locked + unrealized)
        self.equity_timestamps.append(candle.timestamp)

    # ------------------------------------------------------------------ #
    # Metrics
    # ------------------------------------------------------------------ #

    @staticmethod
    def _drawdown_series(equity: List[float]) -> List[float]:
        """Drawdown at each point as negative decimal from running peak."""
        series = []
        peak = equity[0] if equity else 0.0
        for value in equity:
            if value > peak:
                peak = value
            series.append((value - peak) / peak if peak > 0 else 0.0)
        return series

    def _monthly_returns(self) -> List[Dict[str, Any]]:
        """Month-over-month equity returns keyed by calendar month."""
        from datetime import datetime, timezone

        if not self.equity_curve:
            return []

        months: List[Dict[str, Any]] = []
        current_key = None
        month_open = self.initial_capital
        last_value = self.initial_capital

        for ts, value in zip(self.equity_timestamps, self.equity_curve):
            dt = datetime.fromtimestamp(ts / 1000, tz=timezone.utc)
            key = (dt.year, dt.month)
            if key != current_key:
                if current_key is not None:
                    months.append({
                        "year": current_key[0],
                        "month": current_key[1],
                        "return": (last_value / month_open - 1) if month_open > 0 else 0.0,
                    })
                current_key = key
                month_open = last_value
            last_value = value

        if current_key is not None:
            months.append({
                "year": current_key[0],
                "month": current_key[1],
                "return": (last_value / month_open - 1) if month_open > 0 else 0.0,
            })
        return months

    def _calculate_metrics(
        self,
        candles: List[Candle],
        interval: str,
        benchmark_curve: List[float],
        drawdown_curve: List[float],
    ) -> Dict[str, float]:
        """Calculate the full performance metrics suite."""
        total_return = (self.capital - self.initial_capital) / self.initial_capital
        benchmark_return = (benchmark_curve[-1] - self.initial_capital) / self.initial_capital if benchmark_curve else 0.0

        # Elapsed years from data range (fallback: candle count)
        elapsed_ms = candles[-1].timestamp - candles[0].timestamp
        years = elapsed_ms / MS_PER_YEAR if elapsed_ms > 0 else len(candles) / periods_per_year(interval)

        cagr = 0.0
        if years > 0 and self.capital > 0:
            try:
                cagr = (self.capital / self.initial_capital) ** (1 / years) - 1
            except (OverflowError, ZeroDivisionError):
                cagr = 0.0

        # Per-candle returns of the equity curve
        returns = [
            (self.equity_curve[i] - self.equity_curve[i - 1]) / self.equity_curve[i - 1]
            for i in range(1, len(self.equity_curve))
            if self.equity_curve[i - 1] > 0
        ]

        ann = math.sqrt(periods_per_year(interval))
        sharpe_ratio = 0.0
        sortino_ratio = 0.0
        volatility = 0.0
        if returns:
            avg_return = sum(returns) / len(returns)
            variance = sum((r - avg_return) ** 2 for r in returns) / len(returns)
            std_dev = math.sqrt(variance) if variance > 0 else 0.0
            volatility = std_dev * ann
            if std_dev > 0:
                sharpe_ratio = (avg_return / std_dev) * ann
            downside = [r for r in returns if r < 0]
            if downside:
                downside_dev = math.sqrt(sum(r ** 2 for r in downside) / len(returns))
                if downside_dev > 0:
                    sortino_ratio = (avg_return / downside_dev) * ann

        max_drawdown = min(drawdown_curve) if drawdown_curve else 0.0
        calmar_ratio = (cagr / abs(max_drawdown)) if max_drawdown < 0 else 0.0

        # Longest drawdown spell (in candles)
        max_dd_duration = 0
        run = 0
        for dd in drawdown_curve:
            if dd < 0:
                run += 1
                max_dd_duration = max(max_dd_duration, run)
            else:
                run = 0

        # Trade statistics
        trades = self.closed_trades
        winning = [t for t in trades if t["pnl"] > 0]
        losing = [t for t in trades if t["pnl"] <= 0]
        win_rate = len(winning) / len(trades) if trades else 0.0
        avg_win = sum(t["pnl"] for t in winning) / len(winning) if winning else 0.0
        avg_loss = abs(sum(t["pnl"] for t in losing) / len(losing)) if losing else 0.0
        total_profit = sum(t["pnl"] for t in winning)
        total_loss = abs(sum(t["pnl"] for t in losing))
        profit_factor = total_profit / total_loss if total_loss > 0 else (0.0 if not winning else float("inf"))
        if math.isinf(profit_factor):
            profit_factor = 999.99
        expectancy = (win_rate * avg_win) - ((1 - win_rate) * avg_loss)
        payoff_ratio = avg_win / avg_loss if avg_loss > 0 else 0.0

        best_trade = max((t["return_pct"] for t in trades), default=0.0)
        worst_trade = min((t["return_pct"] for t in trades), default=0.0)
        avg_trade_pct = sum(t["return_pct"] for t in trades) / len(trades) if trades else 0.0
        avg_candles_held = sum(t["candles_held"] for t in trades) / len(trades) if trades else 0.0

        # Consecutive win/loss streaks
        max_consec_wins = 0
        max_consec_losses = 0
        streak_w = streak_l = 0
        for t in trades:
            if t["pnl"] > 0:
                streak_w += 1
                streak_l = 0
            else:
                streak_l += 1
                streak_w = 0
            max_consec_wins = max(max_consec_wins, streak_w)
            max_consec_losses = max(max_consec_losses, streak_l)

        exposure = self.exposure_candles / len(candles) if candles else 0.0

        return {
            "total_return": total_return,
            "benchmark_return": benchmark_return,
            "alpha": total_return - benchmark_return,
            "cagr": cagr,
            "sharpe_ratio": sharpe_ratio,
            "sortino_ratio": sortino_ratio,
            "calmar_ratio": calmar_ratio,
            "volatility": volatility,
            "max_drawdown": max_drawdown,
            "max_drawdown_duration": float(max_dd_duration),
            "win_rate": win_rate,
            "profit_factor": profit_factor,
            "expectancy": expectancy,
            "payoff_ratio": payoff_ratio,
            "avg_win": avg_win,
            "avg_loss": avg_loss,
            "best_trade_pct": best_trade,
            "worst_trade_pct": worst_trade,
            "avg_trade_pct": avg_trade_pct,
            "avg_candles_held": avg_candles_held,
            "max_consecutive_wins": float(max_consec_wins),
            "max_consecutive_losses": float(max_consec_losses),
            "exposure": exposure,
            "total_fees": self.total_fees,
        }
