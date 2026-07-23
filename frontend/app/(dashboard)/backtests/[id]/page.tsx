"use client";

import { use, useState, useEffect } from "react";
import api from "@/lib/api";
import axios from "axios";
import { BacktestDetail, Candle, Trade } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { StatCard } from "@/components/ui/stat-card";
import EquityChart from "@/components/charts/equity-chart";
import DrawdownChart from "@/components/charts/drawdown-chart";
import MonthlyHeatmap from "@/components/charts/monthly-heatmap";
import TradePnlChart from "@/components/charts/trade-pnl-chart";
import PriceChart from "@/components/charts/price-chart";
import { fmtUsd, fmtPct, fmtPctRaw, fmtRatio, fmtDateTime, fmtDate } from "@/lib/format";
import {
    ArrowLeft,
    Download,
    FlaskConical,
    TrendingUp,
    TrendingDown,
    Target,
    Gauge,
    Scale,
    AlertTriangle,
} from "lucide-react";
import Link from "next/link";

function downloadFile(filename: string, content: string, mime: string) {
    const blob = new Blob([content], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
}

function tradesToCsv(trades: Trade[]): string {
    const header = "entry_time,exit_time,side,entry_price,exit_price,quantity,pnl,fees,return_pct,exit_reason,candles_held";
    const rows = trades.map((t) =>
        [
            new Date(t.entry_time).toISOString(),
            new Date(t.exit_time).toISOString(),
            t.side,
            t.entry_price,
            t.exit_price,
            t.quantity,
            t.pnl,
            t.fees ?? "",
            t.return_pct,
            t.exit_reason,
            t.candles_held,
        ].join(",")
    );
    return [header, ...rows].join("\n");
}

function MetricRow({ label, value, tone }: { label: string; value: string; tone?: "profit" | "loss" }) {
    const color =
        tone === "profit" ? "text-[var(--profit-text)]" :
        tone === "loss" ? "text-[var(--loss-text)]" :
        "text-[var(--text-primary)]";
    return (
        <div className="flex items-center justify-between border-b border-[var(--border)] py-2 last:border-0">
            <span className="text-sm text-[var(--text-secondary)]">{label}</span>
            <span className={`num text-sm font-medium ${color}`}>{value}</span>
        </div>
    );
}

export default function BacktestReportPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const [result, setResult] = useState<BacktestDetail | null>(null);
    const [candles, setCandles] = useState<Candle[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        api.get(`/strategies/backtest/results/${id}`)
            .then((res) => setResult(res.data))
            .catch((err: unknown) => {
                if (axios.isAxiosError(err) && err.response) {
                    setError(err.response.data.detail || "Failed to load backtest.");
                } else {
                    setError("Connection error.");
                }
            })
            .finally(() => setLoading(false));
    }, [id]);

    // Fetch price candles for the simulated window (for the candlestick chart)
    useEffect(() => {
        if (!result?.params?.data_start || !result?.params?.data_end) return;
        api.get("/brokers/ohlc", {
            params: {
                broker: result.params.broker || "binance",
                symbol: result.symbol,
                interval: result.interval,
                start_time: result.params.data_start,
                end_time: result.params.data_end,
                limit: Math.min(result.params.candles || 10000, 10000),
            },
        })
            .then((res) => setCandles(res.data.candles || []))
            .catch(() => setCandles([]));
    }, [result]);

    if (loading) {
        return (
            <div className="space-y-6">
                <div className="h-16 loading-skeleton" />
                <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-6">
                    {[1, 2, 3, 4, 5, 6].map((i) => <div key={i} className="h-24 loading-skeleton" />)}
                </div>
                <div className="h-96 loading-skeleton" />
            </div>
        );
    }

    if (error || !result) {
        return (
            <div className="animate-fade-in py-16 text-center">
                <AlertTriangle className="mx-auto mb-4 h-10 w-10 text-[var(--loss-text)]" />
                <h2 className="text-lg font-semibold">{error || "Report not found"}</h2>
                <Link href="/backtests" className="mt-6 inline-block">
                    <Button variant="outline">
                        <ArrowLeft className="mr-1.5 h-4 w-4" />
                        Back to history
                    </Button>
                </Link>
            </div>
        );
    }

    const m = result.metrics;
    const netPnl = result.final_capital - result.initial_capital;
    const positive = m.total_return >= 0;
    const hasCurves = result.equity_curve && result.equity_curve.length > 1;
    const alpha = m.alpha ?? (m.benchmark_return !== undefined ? m.total_return - m.benchmark_return : undefined);

    return (
        <div className="animate-fade-in space-y-6">
            {/* Header */}
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <Link href="/backtests">
                        <Button variant="outline" size="icon">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <div>
                        <div className="flex flex-wrap items-center gap-2.5">
                            <h2 className="text-xl font-bold tracking-tight">{result.strategy_name}</h2>
                            <Badge variant="secondary" className="num">{result.symbol} · {result.interval}</Badge>
                            <Badge variant={positive ? "profit" : "loss"} className="num">
                                {fmtPct(m.total_return)}
                            </Badge>
                        </div>
                        <p className="num mt-0.5 text-xs text-[var(--text-muted)]">
                            {result.params?.data_start
                                ? `${fmtDate(result.params.data_start)} → ${fmtDate(result.params.data_end)} · ${result.params.candles?.toLocaleString()} candles`
                                : ""}
                            {result.created_at ? ` · Run ${fmtDateTime(new Date(result.created_at).getTime())}` : ""}
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => downloadFile(`backtest-${id}-trades.csv`, tradesToCsv(result.trades), "text/csv")}
                        disabled={!result.trades.length}
                    >
                        <Download className="mr-1.5 h-3.5 w-3.5" />
                        CSV
                    </Button>
                    <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => downloadFile(`backtest-${id}.json`, JSON.stringify(result, null, 2), "application/json")}
                    >
                        <Download className="mr-1.5 h-3.5 w-3.5" />
                        JSON
                    </Button>
                    {result.strategy_id && (
                        <Link href={`/strategies/${result.strategy_id}`}>
                            <Button size="sm">
                                <FlaskConical className="mr-1.5 h-3.5 w-3.5" />
                                Open in lab
                            </Button>
                        </Link>
                    )}
                </div>
            </div>

            {/* KPI row */}
            <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-6">
                <StatCard
                    label="Total Return"
                    value={fmtPct(m.total_return)}
                    sub={`${netPnl >= 0 ? "+" : ""}${fmtUsd(netPnl)} net`}
                    tone={positive ? "profit" : "loss"}
                    icon={positive ? TrendingUp : TrendingDown}
                />
                <StatCard
                    label="vs Buy & Hold"
                    value={alpha !== undefined ? fmtPct(alpha) : "—"}
                    sub={m.benchmark_return !== undefined ? `Benchmark ${fmtPct(m.benchmark_return)}` : undefined}
                    tone={alpha !== undefined ? (alpha >= 0 ? "profit" : "loss") : "neutral"}
                    icon={Scale}
                />
                <StatCard
                    label="Sharpe"
                    value={fmtRatio(m.sharpe_ratio)}
                    sub={m.sortino_ratio !== undefined ? `Sortino ${fmtRatio(m.sortino_ratio)}` : undefined}
                    tone="neutral"
                    icon={Gauge}
                />
                <StatCard
                    label="Max Drawdown"
                    value={fmtPct(m.max_drawdown, 1, false)}
                    sub={m.max_drawdown_duration ? `${Math.round(m.max_drawdown_duration)} candles underwater` : undefined}
                    tone="loss"
                    icon={TrendingDown}
                />
                <StatCard
                    label="Win Rate"
                    value={fmtPct(m.win_rate, 1, false)}
                    sub={`${result.winning_trades}W / ${result.losing_trades}L of ${result.total_trades}`}
                    tone="neutral"
                    icon={Target}
                />
                <StatCard
                    label="Profit Factor"
                    value={fmtRatio(m.profit_factor)}
                    sub={m.expectancy !== undefined ? `Expectancy ${fmtUsd(m.expectancy)}` : undefined}
                    tone={m.profit_factor >= 1 ? "profit" : "loss"}
                    icon={Gauge}
                />
            </div>

            {!hasCurves && (
                <div className="flex items-center gap-2 rounded-lg border border-[rgba(245,158,11,0.25)] bg-[var(--warning-soft)] p-3 text-sm text-[var(--warning)]">
                    <AlertTriangle className="h-4 w-4 shrink-0" />
                    This run predates the full analytics engine — re-run the strategy to get equity curves,
                    benchmark comparison and the complete metrics suite.
                </div>
            )}

            {hasCurves && (
                <>
                    {/* Equity */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Equity Curve</CardTitle>
                            <CardDescription>Strategy vs. buy &amp; hold, marked to market every candle</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <EquityChart
                                timestamps={result.equity_timestamps}
                                equity={result.equity_curve}
                                benchmark={result.benchmark_curve}
                                initialCapital={result.initial_capital}
                            />
                        </CardContent>
                    </Card>

                    {/* Drawdown */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Drawdown</CardTitle>
                            <CardDescription>Depth below the running equity peak</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <DrawdownChart
                                timestamps={result.equity_timestamps}
                                drawdown={result.drawdown_curve}
                            />
                        </CardContent>
                    </Card>

                    {/* Monthly + distribution */}
                    <div className="grid gap-6 lg:grid-cols-2">
                        <Card>
                            <CardHeader>
                                <CardTitle>Monthly Returns</CardTitle>
                                <CardDescription>Calendar-month performance of the equity curve</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <MonthlyHeatmap data={result.monthly_returns} />
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader>
                                <CardTitle>Trade P&amp;L Distribution</CardTitle>
                                <CardDescription>Net result of each closed trade, in order</CardDescription>
                            </CardHeader>
                            <CardContent>
                                {result.trades.length ? (
                                    <TradePnlChart trades={result.trades} />
                                ) : (
                                    <p className="py-8 text-center text-sm text-[var(--text-muted)]">No trades executed.</p>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </>
            )}

            {/* Price chart with trades */}
            {candles.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle>Price Action &amp; Trades</CardTitle>
                        <CardDescription>
                            {result.symbol} {result.interval} candles with every entry and exit marked
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <PriceChart candles={candles} trades={result.trades} />
                    </CardContent>
                </Card>
            )}

            {/* Full metrics */}
            <Card>
                <CardHeader>
                    <CardTitle>Full Metrics</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-x-10 md:grid-cols-2 lg:grid-cols-3">
                        <div>
                            <p className="mb-1 pt-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--text-muted)]">Returns</p>
                            <MetricRow label="Total return" value={fmtPct(m.total_return)} tone={positive ? "profit" : "loss"} />
                            <MetricRow label="CAGR" value={m.cagr !== undefined ? fmtPct(m.cagr) : "—"} />
                            <MetricRow label="Benchmark (buy & hold)" value={m.benchmark_return !== undefined ? fmtPct(m.benchmark_return) : "—"} />
                            <MetricRow label="Alpha" value={alpha !== undefined ? fmtPct(alpha) : "—"} tone={alpha !== undefined ? (alpha >= 0 ? "profit" : "loss") : undefined} />
                            <MetricRow label="Volatility (ann.)" value={m.volatility !== undefined ? fmtPct(m.volatility, 1, false) : "—"} />
                            <MetricRow label="Exposure" value={m.exposure !== undefined ? fmtPct(m.exposure, 0, false) : "—"} />
                        </div>
                        <div>
                            <p className="mb-1 pt-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--text-muted)]">Risk</p>
                            <MetricRow label="Sharpe ratio" value={fmtRatio(m.sharpe_ratio)} />
                            <MetricRow label="Sortino ratio" value={m.sortino_ratio !== undefined ? fmtRatio(m.sortino_ratio) : "—"} />
                            <MetricRow label="Calmar ratio" value={m.calmar_ratio !== undefined ? fmtRatio(m.calmar_ratio) : "—"} />
                            <MetricRow label="Max drawdown" value={fmtPct(m.max_drawdown, 2, false)} tone="loss" />
                            <MetricRow label="Longest drawdown" value={m.max_drawdown_duration !== undefined ? `${Math.round(m.max_drawdown_duration)} candles` : "—"} />
                            <MetricRow label="Total fees paid" value={m.total_fees !== undefined ? fmtUsd(m.total_fees) : "—"} />
                        </div>
                        <div>
                            <p className="mb-1 pt-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--text-muted)]">Trades</p>
                            <MetricRow label="Win rate" value={fmtPct(m.win_rate, 1, false)} />
                            <MetricRow label="Profit factor" value={fmtRatio(m.profit_factor)} />
                            <MetricRow label="Expectancy / trade" value={m.expectancy !== undefined ? fmtUsd(m.expectancy) : "—"} />
                            <MetricRow label="Avg win / avg loss" value={`${fmtUsd(m.avg_win)} / ${fmtUsd(m.avg_loss)}`} />
                            <MetricRow label="Best / worst trade" value={m.best_trade_pct !== undefined ? `${fmtPctRaw(m.best_trade_pct, 1)} / ${fmtPctRaw(m.worst_trade_pct ?? 0, 1)}` : "—"} />
                            <MetricRow label="Win / loss streaks" value={m.max_consecutive_wins !== undefined ? `${m.max_consecutive_wins} / ${m.max_consecutive_losses}` : "—"} />
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Trade log */}
            <Card>
                <CardHeader>
                    <CardTitle>Trade Log</CardTitle>
                    <CardDescription>{result.trades.length} closed trades, net of fees</CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="max-h-[480px] overflow-auto">
                        <table className="w-full text-sm">
                            <thead className="sticky top-0 z-10 border-b border-[var(--border)] bg-[var(--surface-2)]">
                                <tr>
                                    {["#", "Side", "Entry", "Exit", "Qty", "Fees", "P&L", "Return", "Reason"].map((h, i) => (
                                        <th
                                            key={h}
                                            className={`px-4 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-[var(--text-muted)] ${i >= 4 && i <= 7 ? "text-right" : "text-left"}`}
                                        >
                                            {h}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {result.trades.length === 0 ? (
                                    <tr>
                                        <td colSpan={9} className="px-4 py-10 text-center text-[var(--text-muted)]">
                                            No trades were executed in this simulation.
                                        </td>
                                    </tr>
                                ) : (
                                    result.trades.map((trade, i) => (
                                        <tr key={i} className="border-b border-[var(--border)] transition-colors last:border-0 hover:bg-[rgba(148,163,184,0.04)]">
                                            <td className="num px-4 py-2.5 text-[var(--text-muted)]">{i + 1}</td>
                                            <td className="px-4 py-2.5">
                                                <Badge variant={trade.side === "LONG" ? "profit" : "loss"} className="text-[10px]">
                                                    {trade.side}
                                                </Badge>
                                            </td>
                                            <td className="px-4 py-2.5">
                                                <p className="num text-xs">{fmtDateTime(trade.entry_time)}</p>
                                                <p className="num text-xs text-[var(--text-muted)]">{fmtUsd(trade.entry_price)}</p>
                                            </td>
                                            <td className="px-4 py-2.5">
                                                <p className="num text-xs">{fmtDateTime(trade.exit_time)}</p>
                                                <p className="num text-xs text-[var(--text-muted)]">{fmtUsd(trade.exit_price)}</p>
                                            </td>
                                            <td className="num px-4 py-2.5 text-right text-xs text-[var(--text-secondary)]">
                                                {trade.quantity.toFixed(4)}
                                            </td>
                                            <td className="num px-4 py-2.5 text-right text-xs text-[var(--text-muted)]">
                                                {trade.fees !== undefined && trade.fees !== null ? fmtUsd(trade.fees) : "—"}
                                            </td>
                                            <td className={`num px-4 py-2.5 text-right text-xs font-semibold ${trade.pnl >= 0 ? "text-[var(--profit-text)]" : "text-[var(--loss-text)]"}`}>
                                                {trade.pnl >= 0 ? "+" : ""}{fmtUsd(trade.pnl)}
                                            </td>
                                            <td className={`num px-4 py-2.5 text-right text-xs ${trade.return_pct >= 0 ? "text-[var(--profit-text)]" : "text-[var(--loss-text)]"}`}>
                                                {fmtPctRaw(trade.return_pct)}
                                            </td>
                                            <td className="px-4 py-2.5 text-xs text-[var(--text-muted)]">
                                                {trade.exit_reason.replaceAll("_", " ").toLowerCase()}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>

            <p className="pb-4 text-center text-xs text-[var(--text-muted)]">
                Historical simulation · costs modeled at {result.params?.commission_pct !== undefined ? fmtPct(result.params.commission_pct, 2, false) : "—"} commission,{" "}
                {result.params?.slippage_pct !== undefined ? fmtPct(result.params.slippage_pct, 2, false) : "—"} slippage per fill · not investment advice
            </p>
        </div>
    );
}
