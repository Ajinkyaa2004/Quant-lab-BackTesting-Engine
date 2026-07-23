export interface Backtest {
    id: number;
    strategy_id: number;
    strategy_name: string;
    symbol: string;
    interval: string;
    start_time: number;
    end_time: number;
    initial_capital: number;
    final_capital: number;
    total_return: number;         // decimal, e.g. 0.15 = +15%
    sharpe_ratio: number | null;
    max_drawdown: number;         // negative decimal, e.g. -0.08
    win_rate: number | null;      // decimal, e.g. 0.55
    total_trades: number;
    winning_trades: number;
    losing_trades: number;
    created_at: string;
}

export interface Trade {
    entry_time: number;
    exit_time: number;
    side: string;
    entry_price: number;
    exit_price: number;
    quantity: number;
    pnl: number;
    gross_pnl?: number | null;
    fees?: number | null;
    return_pct: number;
    exit_reason: string;
    candles_held: number;
}

/** Full metrics suite returned by the engine. All ratios are decimals. */
export interface BacktestMetrics {
    total_return: number;
    benchmark_return?: number;
    alpha?: number;
    cagr?: number;
    sharpe_ratio: number;
    sortino_ratio?: number;
    calmar_ratio?: number;
    volatility?: number;
    max_drawdown: number;
    max_drawdown_duration?: number;
    win_rate: number;
    profit_factor: number;
    expectancy?: number;
    payoff_ratio?: number;
    avg_win: number;
    avg_loss: number;
    best_trade_pct?: number;
    worst_trade_pct?: number;
    avg_trade_pct?: number;
    avg_candles_held?: number;
    max_consecutive_wins?: number;
    max_consecutive_losses?: number;
    exposure?: number;
    total_fees?: number;
    [key: string]: number | undefined;
}

export interface MonthlyReturn {
    year: number;
    month: number;
    return: number;
}

export interface BacktestParams {
    broker?: string;
    symbol?: string;
    interval?: string;
    commission_pct?: number;
    slippage_pct?: number;
    risk_per_trade?: number;
    max_positions?: number;
    candles?: number;
    data_start?: number;
    data_end?: number;
}

export interface BacktestDetail {
    backtest_id: number | null;
    strategy_id?: number | null;
    strategy_name: string;
    symbol: string;
    interval: string;
    initial_capital: number;
    final_capital: number;
    metrics: BacktestMetrics;
    total_trades: number;
    winning_trades: number;
    losing_trades: number;
    trades: Trade[];
    equity_curve: number[];
    equity_timestamps: number[];
    benchmark_curve: number[];
    drawdown_curve: number[];
    monthly_returns: MonthlyReturn[];
    params?: BacktestParams | null;
    created_at: string | null;
}

export interface Strategy {
    id: number;
    name: string;
    description: string | null;
    class_name: string;
    is_active: boolean;
    user_id: number;
    created_at: string;
    updated_at: string;
    code: string;
}

export interface Candle {
    timestamp: number;
    open: number;
    high: number;
    low: number;
    close: number;
    volume: number;
}

export interface User {
    id: number;
    email: string;
    is_active: boolean;
    plan: string;
    created_at: string;
    updated_at: string;
}
