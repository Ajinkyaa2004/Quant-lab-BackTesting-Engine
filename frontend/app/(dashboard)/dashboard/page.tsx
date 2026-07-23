"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { Backtest, Strategy } from "@/lib/types";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StatCard } from "@/components/ui/stat-card";
import { fmtPct, fmtDateTime, fmtRatio } from "@/lib/format";
import {
    FlaskConical,
    TrendingUp,
    Target,
    BarChart3,
    Plus,
    ArrowRight,
    ArrowUpRight,
    ArrowDownRight,
    History,
    BookOpen,
} from "lucide-react";

export default function DashboardPage() {
    const [strategies, setStrategies] = useState<Strategy[]>([]);
    const [backtests, setBacktests] = useState<Backtest[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            try {
                const [strategiesRes, backtestsRes] = await Promise.all([
                    api.get("/strategies"),
                    api.get("/strategies/backtest/results"),
                ]);
                setStrategies(strategiesRes.data);
                const sorted = [...backtestsRes.data].sort(
                    (a: Backtest, b: Backtest) =>
                        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
                );
                setBacktests(sorted);
            } catch (error) {
                console.error("Failed to fetch dashboard data", error);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="h-28 loading-skeleton" />
                    ))}
                </div>
                <div className="grid gap-6 lg:grid-cols-3">
                    <div className="h-96 loading-skeleton lg:col-span-2" />
                    <div className="h-96 loading-skeleton" />
                </div>
            </div>
        );
    }

    const returns = backtests.map((b) => b.total_return).filter((r) => r !== null);
    const winRates = backtests.map((b) => b.win_rate).filter((w): w is number => w !== null);
    const bestReturn = returns.length ? Math.max(...returns) : 0;
    const avgReturn = returns.length ? returns.reduce((a, b) => a + b, 0) / returns.length : 0;
    const avgWinRate = winRates.length ? winRates.reduce((a, b) => a + b, 0) / winRates.length : 0;
    const totalTrades = backtests.reduce((sum, b) => sum + (b.total_trades || 0), 0);
    const recent = backtests.slice(0, 6);

    return (
        <div className="animate-fade-in space-y-6">
            {/* KPI row */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <StatCard
                    label="Strategies"
                    value={String(strategies.length)}
                    sub={`${strategies.length} in your library`}
                    tone="accent"
                    icon={FlaskConical}
                />
                <StatCard
                    label="Backtests Run"
                    value={String(backtests.length)}
                    sub={`${totalTrades.toLocaleString()} simulated trades`}
                    tone="neutral"
                    icon={BarChart3}
                />
                <StatCard
                    label="Best Return"
                    value={fmtPct(bestReturn)}
                    sub={`Average ${fmtPct(avgReturn)}`}
                    tone={bestReturn >= 0 ? "profit" : "loss"}
                    icon={TrendingUp}
                />
                <StatCard
                    label="Avg Win Rate"
                    value={fmtPct(avgWinRate, 1, false)}
                    sub="Across all backtests"
                    tone="neutral"
                    icon={Target}
                />
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
                {/* Recent backtests */}
                <Card className="lg:col-span-2">
                    <CardHeader className="flex-row items-center justify-between space-y-0">
                        <div>
                            <CardTitle>Recent Backtests</CardTitle>
                            <CardDescription className="mt-1">Your latest simulation runs</CardDescription>
                        </div>
                        <Link href="/backtests">
                            <Button variant="ghost" size="sm">
                                View all
                                <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                            </Button>
                        </Link>
                    </CardHeader>
                    <CardContent>
                        {recent.length === 0 ? (
                            <div className="py-14 text-center">
                                <BarChart3 className="mx-auto mb-4 h-10 w-10 text-[var(--text-muted)]" strokeWidth={1.5} />
                                <h3 className="font-semibold text-[var(--text-primary)]">No backtests yet</h3>
                                <p className="mx-auto mt-1.5 max-w-sm text-sm text-[var(--text-muted)]">
                                    Create a strategy and run your first simulation to see performance here.
                                </p>
                                <Link href="/strategies/new" className="mt-5 inline-block">
                                    <Button>
                                        <Plus className="mr-1.5 h-4 w-4" />
                                        Create strategy
                                    </Button>
                                </Link>
                            </div>
                        ) : (
                            <div className="space-y-2">
                                {recent.map((bt) => {
                                    const positive = bt.total_return >= 0;
                                    return (
                                        <Link
                                            key={bt.id}
                                            href={`/backtests/${bt.id}`}
                                            className="flex items-center justify-between gap-4 rounded-lg border border-[var(--border)] bg-[var(--surface-2)] px-4 py-3 transition-all hover:border-[var(--border-strong)] hover:bg-[var(--surface-3)]"
                                        >
                                            <div className="flex min-w-0 items-center gap-3.5">
                                                <div
                                                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${positive ? "bg-[var(--profit-soft)] text-[var(--profit-text)]" : "bg-[var(--loss-soft)] text-[var(--loss-text)]"}`}
                                                >
                                                    {positive ? <ArrowUpRight className="h-4.5 w-4.5" /> : <ArrowDownRight className="h-4.5 w-4.5" />}
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="truncate text-sm font-medium text-[var(--text-primary)]">
                                                        {bt.strategy_name}
                                                    </p>
                                                    <p className="num text-xs text-[var(--text-muted)]">
                                                        {bt.symbol} · {bt.interval} · {fmtDateTime(new Date(bt.created_at).getTime())}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="shrink-0 text-right">
                                                <p className={`num text-sm font-semibold ${positive ? "text-[var(--profit-text)]" : "text-[var(--loss-text)]"}`}>
                                                    {fmtPct(bt.total_return)}
                                                </p>
                                                <p className="num text-xs text-[var(--text-muted)]">
                                                    Sharpe {fmtRatio(bt.sharpe_ratio)} · {bt.total_trades} trades
                                                </p>
                                            </div>
                                        </Link>
                                    );
                                })}
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Side column */}
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Quick Actions</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2.5">
                            <Link href="/strategies/new" className="block">
                                <Button className="w-full justify-start">
                                    <Plus className="mr-2 h-4 w-4" />
                                    New strategy
                                </Button>
                            </Link>
                            <Link href="/strategies" className="block">
                                <Button variant="secondary" className="w-full justify-start">
                                    <FlaskConical className="mr-2 h-4 w-4" />
                                    Strategy library
                                </Button>
                            </Link>
                            <Link href="/backtests" className="block">
                                <Button variant="secondary" className="w-full justify-start">
                                    <History className="mr-2 h-4 w-4" />
                                    Backtest history
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <BookOpen className="h-4 w-4 text-[var(--accent-hover)]" />
                                Research Playbook
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3 text-sm text-[var(--text-secondary)]">
                            {[
                                ["Test across regimes", "Run the same strategy on bull, bear and sideways periods before trusting it."],
                                ["Respect costs", "Keep commission & slippage on — most \"edges\" die there."],
                                ["Beat the benchmark", "A strategy that underperforms buy & hold isn't worth its risk."],
                            ].map(([title, text]) => (
                                <div key={title} className="rounded-lg border border-[var(--border)] bg-[var(--surface-2)] p-3">
                                    <p className="text-xs font-semibold text-[var(--text-primary)]">{title}</p>
                                    <p className="mt-1 text-xs leading-relaxed text-[var(--text-muted)]">{text}</p>
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    <div className="rounded-xl border border-[var(--border)] bg-[var(--surface-2)] p-4">
                        <Badge variant="warning" className="mb-2">Simulation only</Badge>
                        <p className="text-xs leading-relaxed text-[var(--text-muted)]">
                            All results are historical simulations. No live orders, no real funds.
                            Past performance never guarantees future results.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
