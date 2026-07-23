"use client";

import { Badge } from "./badge";
import { Button } from "./button";
import { Code2, TrendingUp, Activity, Zap, Check, PenLine } from "lucide-react";

export interface StrategyTemplate {
    id: string;
    name: string;
    description: string;
    difficulty: "Beginner" | "Intermediate" | "Advanced";
    type: "Trend Following" | "Mean Reversion" | "Momentum" | "Custom";
    code: string;
    className: string;
    features: string[];
}

const strategyTemplates: StrategyTemplate[] = [
    {
        id: "ma_crossover",
        name: "Moving Average Crossover",
        description: "Classic trend-following: go long when the fast MA crosses above the slow MA, exit on the cross back down.",
        difficulty: "Beginner",
        type: "Trend Following",
        className: "MACrossoverStrategy",
        features: ["Long-only trading", "Stop loss & take profit", "Risk-based position sizing"],
        code: `"""
Simple Moving Average Crossover Strategy
LONG-only trend following with risk-based sizing.
"""
from strategies.base import BaseStrategy
from core.candle import Candle
from typing import Optional, Dict
from strategies import indicators


class MACrossoverStrategy(BaseStrategy):
    """
    Entry: Fast MA crosses above Slow MA
    Exit:  Fast MA crosses below Slow MA OR stop loss / take profit
    """

    def __init__(self, broker, config=None):
        super().__init__(broker, config)
        self.fast_period = 10
        self.slow_period = 20
        self.price_history = []
        self.position = None

    def initialize(self):
        self.initialized = True

    def on_candle(self, candle: Candle) -> Optional[Dict]:
        self.price_history.append(candle.close)
        if len(self.price_history) > 100:
            self.price_history.pop(0)

        if len(self.price_history) < self.slow_period:
            return None

        fast_ma = sum(self.price_history[-self.fast_period:]) / self.fast_period
        slow_ma = sum(self.price_history[-self.slow_period:]) / self.slow_period

        # Entry: fast MA above slow MA
        if self.position is None and fast_ma > slow_ma:
            self.position = "LONG"
            stop_loss_price = candle.close * 0.98
            quantity = self.calculate_position_size(
                entry_price=candle.close,
                stop_loss_price=stop_loss_price
            )
            return {
                "action": "BUY",
                "quantity": quantity,
                "order_type": "MARKET",
                "stop_loss_pct": 0.02,
                "take_profit_pct": 0.05,
                "exit_reason": "MA_CROSSOVER_ENTRY"
            }

        # Exit: fast MA back below slow MA
        if self.position == "LONG" and fast_ma < slow_ma:
            self.position = None
            return {
                "action": "CLOSE_ALL",
                "exit_reason": "MA_CROSSOVER_EXIT"
            }

        return None`,
    },
    {
        id: "rsi_mean_reversion",
        name: "RSI Mean Reversion",
        description: "Buy oversold, short overbought, exit when RSI normalizes. Trades both directions.",
        difficulty: "Intermediate",
        type: "Mean Reversion",
        className: "RSIMeanReversionStrategy",
        features: ["Long & short trading", "RSI-based signals", "Neutral-zone exits"],
        code: `"""
RSI Mean Reversion Strategy
Trades both LONG (oversold) and SHORT (overbought).
"""
from strategies.base import BaseStrategy
from core.candle import Candle
from typing import Optional, Dict
from strategies import indicators


class RSIMeanReversionStrategy(BaseStrategy):
    """
    Entry LONG:  RSI < 30 (oversold)
    Entry SHORT: RSI > 70 (overbought)
    Exit:        RSI back in the 40-60 neutral zone
    """

    def __init__(self, broker, config=None):
        super().__init__(broker, config)
        self.rsi_period = 14
        self.rsi_oversold = 30
        self.rsi_overbought = 70
        self.price_history = []

    def initialize(self):
        self.initialized = True

    def on_candle(self, candle: Candle) -> Optional[Dict]:
        self.price_history.append(candle.close)
        if len(self.price_history) > 200:
            self.price_history.pop(0)

        if len(self.price_history) < self.rsi_period + 1:
            return None

        rsi_values = indicators.calculate_rsi(self.price_history, self.rsi_period)
        current_rsi = rsi_values[-1]
        if current_rsi is None:
            return None

        if current_rsi < self.rsi_oversold:
            stop_loss_price = candle.close * 0.97
            quantity = self.calculate_position_size(
                entry_price=candle.close,
                stop_loss_price=stop_loss_price
            )
            return {
                "action": "BUY",
                "quantity": quantity,
                "order_type": "MARKET",
                "stop_loss_pct": 0.03,
                "take_profit_pct": 0.06,
                "exit_reason": "RSI_OVERSOLD_ENTRY"
            }

        if current_rsi > self.rsi_overbought:
            stop_loss_price = candle.close * 1.03
            quantity = self.calculate_position_size(
                entry_price=candle.close,
                stop_loss_price=stop_loss_price
            )
            return {
                "action": "SELL",
                "quantity": quantity,
                "order_type": "MARKET",
                "position_side": "SHORT",
                "stop_loss_pct": 0.03,
                "take_profit_pct": 0.06,
                "exit_reason": "RSI_OVERBOUGHT_ENTRY"
            }

        if 40 <= current_rsi <= 60:
            return {
                "action": "CLOSE_ALL",
                "exit_reason": "RSI_NEUTRAL_EXIT"
            }

        return None`,
    },
    {
        id: "macd_momentum",
        name: "MACD Momentum",
        description: "Ride momentum on bullish MACD crossovers, protected by a trailing stop.",
        difficulty: "Advanced",
        type: "Momentum",
        className: "MACDMomentumStrategy",
        features: ["MACD crossover signals", "Trailing stops", "Momentum entries"],
        code: `"""
MACD Momentum Strategy
Bullish crossover entries with a trailing stop.
"""
from strategies.base import BaseStrategy
from core.candle import Candle
from typing import Optional, Dict
from strategies import indicators


class MACDMomentumStrategy(BaseStrategy):
    """
    Entry: MACD line crosses above signal line
    Exit:  MACD line crosses below signal line OR trailing stop
    """

    def __init__(self, broker, config=None):
        super().__init__(broker, config)
        self.fast_period = 12
        self.slow_period = 26
        self.signal_period = 9
        self.price_history = []
        self.position = None

    def initialize(self):
        self.initialized = True

    def on_candle(self, candle: Candle) -> Optional[Dict]:
        self.price_history.append(candle.close)
        if len(self.price_history) > 200:
            self.price_history.pop(0)

        if len(self.price_history) < self.slow_period:
            return None

        macd_data = indicators.calculate_macd(
            self.price_history,
            fast=self.fast_period,
            slow=self.slow_period,
            signal=self.signal_period
        )
        macd_line = macd_data['macd']
        signal_line = macd_data['signal']

        if len(macd_line) < 2 or macd_line[-1] is None or signal_line[-1] is None:
            return None
        prev_macd, prev_signal = macd_line[-2], signal_line[-2]
        if prev_macd is None or prev_signal is None:
            return None
        current_macd, current_signal = macd_line[-1], signal_line[-1]

        if self.position is None:
            if prev_macd <= prev_signal and current_macd > current_signal:
                self.position = "LONG"
                stop_loss_price = candle.close * 0.95
                quantity = self.calculate_position_size(
                    entry_price=candle.close,
                    stop_loss_price=stop_loss_price
                )
                return {
                    "action": "BUY",
                    "quantity": quantity,
                    "order_type": "MARKET",
                    "stop_loss_pct": 0.05,
                    "take_profit_pct": 0.10,
                    "trailing_stop": 0.03,
                    "exit_reason": "MACD_BULLISH_CROSSOVER"
                }
        elif self.position == "LONG":
            if prev_macd >= prev_signal and current_macd < current_signal:
                self.position = None
                return {
                    "action": "CLOSE_ALL",
                    "exit_reason": "MACD_BEARISH_CROSSOVER"
                }

        return None`,
    },
];

export const CUSTOM_TEMPLATE: StrategyTemplate = {
    id: "custom",
    name: "Custom Strategy",
    description: "Build your own trading algorithm from a clean scaffold.",
    difficulty: "Advanced",
    type: "Custom",
    className: "MyCustomStrategy",
    features: ["Full control", "All order types", "Long & short"],
    code: `"""
Custom Trading Strategy
Implement your logic in on_candle() and return order dicts.
"""
from strategies.base import BaseStrategy
from core.candle import Candle
from typing import Optional, Dict
from strategies import indicators


class MyCustomStrategy(BaseStrategy):
    """Your custom trading strategy."""

    def __init__(self, broker, config=None):
        super().__init__(broker, config)
        self.price_history = []

    def initialize(self):
        self.initialized = True

    def on_candle(self, candle: Candle) -> Optional[Dict]:
        self.price_history.append(candle.close)
        if len(self.price_history) > 200:
            self.price_history.pop(0)

        # Your logic here. Return None for no action, or an order dict:
        # return {
        #     "action": "BUY",              # BUY | SELL | CLOSE | CLOSE_ALL
        #     "quantity": self.calculate_position_size(
        #         entry_price=candle.close,
        #         stop_loss_price=candle.close * 0.98,
        #     ),
        #     "order_type": "MARKET",       # MARKET | LIMIT
        #     "stop_loss_pct": 0.02,
        #     "take_profit_pct": 0.05,
        #     "trailing_stop": 0.03,        # optional
        # }
        return None`,
};

const typeIcon = {
    "Trend Following": TrendingUp,
    "Mean Reversion": Activity,
    "Momentum": Zap,
    "Custom": Code2,
} as const;

const difficultyVariant = {
    Beginner: "profit",
    Intermediate: "warning",
    Advanced: "loss",
} as const;

interface StrategyTemplatesProps {
    onSelectTemplate: (template: StrategyTemplate) => void;
}

export default function StrategyTemplates({ onSelectTemplate }: StrategyTemplatesProps) {
    return (
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {strategyTemplates.map((template) => {
                const Icon = typeIcon[template.type];
                return (
                    <div key={template.id} className="panel panel-hover flex flex-col p-5">
                        <div className="flex items-start justify-between gap-2">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--accent-soft)]">
                                <Icon className="h-5 w-5 text-[var(--accent-hover)]" strokeWidth={1.8} />
                            </div>
                            <Badge variant={difficultyVariant[template.difficulty]}>{template.difficulty}</Badge>
                        </div>
                        <h3 className="mt-4 font-semibold text-[var(--text-primary)]">{template.name}</h3>
                        <p className="mt-1 text-xs font-medium uppercase tracking-wider text-[var(--text-muted)]">
                            {template.type}
                        </p>
                        <p className="mt-2.5 flex-1 text-sm leading-relaxed text-[var(--text-secondary)]">
                            {template.description}
                        </p>
                        <ul className="mt-4 space-y-1.5">
                            {template.features.map((feature) => (
                                <li key={feature} className="flex items-center gap-2 text-xs text-[var(--text-muted)]">
                                    <Check className="h-3 w-3 shrink-0 text-[var(--profit-text)]" />
                                    {feature}
                                </li>
                            ))}
                        </ul>
                        <Button
                            onClick={() => onSelectTemplate(template)}
                            variant="secondary"
                            size="sm"
                            className="mt-5 w-full"
                        >
                            Use template
                        </Button>
                    </div>
                );
            })}

            {/* Custom */}
            <div className="panel panel-hover flex flex-col border-dashed p-5">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--surface-3)]">
                    <PenLine className="h-5 w-5 text-[var(--text-secondary)]" strokeWidth={1.8} />
                </div>
                <h3 className="mt-4 font-semibold text-[var(--text-primary)]">Start from scratch</h3>
                <p className="mt-1 text-xs font-medium uppercase tracking-wider text-[var(--text-muted)]">Custom</p>
                <p className="mt-2.5 flex-1 text-sm leading-relaxed text-[var(--text-secondary)]">
                    A clean scaffold with the full order API documented inline. Total control.
                </p>
                <Button
                    onClick={() => onSelectTemplate(CUSTOM_TEMPLATE)}
                    variant="outline"
                    size="sm"
                    className="mt-5 w-full"
                >
                    Write my own
                </Button>
            </div>
        </div>
    );
}
