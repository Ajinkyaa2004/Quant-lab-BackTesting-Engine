"use client";

import { useEffect, useMemo, useState } from "react";
import api from "@/lib/api";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Backtest } from "@/lib/types";
import { fmtPct, fmtDateTime, fmtRatio } from "@/lib/format";
import { ArrowRight, History, Search } from "lucide-react";

type SortKey = "created_at" | "total_return" | "sharpe_ratio" | "max_drawdown" | "total_trades";

export default function BacktestsPage() {
    const [backtests, setBacktests] = useState<Backtest[]>([]);
    const [loading, setLoading] = useState(true);
    const [query, setQuery] = useState("");
    const [sortKey, setSortKey] = useState<SortKey>("created_at");
    const [sortDesc, setSortDesc] = useState(true);

    useEffect(() => {
        api.get("/strategies/backtest/results")
            .then((res) => setBacktests(res.data))
            .catch((err) => console.error("Failed to fetch backtests", err))
            .finally(() => setLoading(false));
    }, []);

    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase();
        const list = q
            ? backtests.filter(
                (b) =>
                    b.strategy_name.toLowerCase().includes(q) ||
                    b.symbol.toLowerCase().includes(q)
            )
            : backtests;
        return [...list].sort((a, b) => {
            const dir = sortDesc ? -1 : 1;
            if (sortKey === "created_at") {
                return dir * (new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
            }
            const av = (a[sortKey] ?? 0) as number;
            const bv = (b[sortKey] ?? 0) as number;
            return dir * (av - bv);
        });
    }, [backtests, query, sortKey, sortDesc]);

    const toggleSort = (key: SortKey) => {
        if (sortKey === key) setSortDesc((d) => !d);
        else {
            setSortKey(key);
            setSortDesc(true);
        }
    };

    const headerCell = (label: string, key: SortKey, align: "left" | "right" = "right") => (
        <th
            onClick={() => toggleSort(key)}
            className={`cursor-pointer select-none px-4 py-3 ${align === "left" ? "text-left" : "text-right"} text-[11px] font-semibold uppercase tracking-wider text-[var(--text-muted)] transition-colors hover:text-[var(--text-secondary)]`}
        >
            {label}
            {sortKey === key && <span className="ml-1">{sortDesc ? "↓" : "↑"}</span>}
        </th>
    );

    if (loading) {
        return <div className="h-96 loading-skeleton" />;
    }

    return (
        <div className="animate-fade-in space-y-6">
            <div className="flex flex-wrap items-end justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Backtest History</h2>
                    <p className="mt-1 text-sm text-[var(--text-secondary)]">
                        {backtests.length} simulation {backtests.length === 1 ? "run" : "runs"} on record
                    </p>
                </div>
                <div className="relative w-64">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--text-muted)]" />
                    <Input
                        placeholder="Filter by strategy or symbol…"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        className="pl-9"
                    />
                </div>
            </div>

            <div className="panel overflow-hidden">
                {filtered.length === 0 ? (
                    <div className="p-14 text-center">
                        <History className="mx-auto mb-4 h-10 w-10 text-[var(--text-muted)]" strokeWidth={1.5} />
                        <h3 className="font-semibold">No backtests found</h3>
                        <p className="mt-1.5 text-sm text-[var(--text-muted)]">
                            {query ? "Try a different filter." : "Run a backtest from any strategy's lab page."}
                        </p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="border-b border-[var(--border)] bg-[var(--surface-2)]">
                                <tr>
                                    {headerCell("Run", "created_at", "left")}
                                    <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-[var(--text-muted)]">
                                        Market
                                    </th>
                                    {headerCell("Return", "total_return")}
                                    {headerCell("Sharpe", "sharpe_ratio")}
                                    {headerCell("Max DD", "max_drawdown")}
                                    <th className="px-4 py-3 text-right text-[11px] font-semibold uppercase tracking-wider text-[var(--text-muted)]">
                                        Win rate
                                    </th>
                                    {headerCell("Trades", "total_trades")}
                                    <th className="w-16 px-4 py-3" />
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.map((bt) => (
                                    <tr
                                        key={bt.id}
                                        className="border-b border-[var(--border)] transition-colors last:border-0 hover:bg-[rgba(148,163,184,0.04)]"
                                    >
                                        <td className="px-4 py-3.5">
                                            <p className="font-medium text-[var(--text-primary)]">{bt.strategy_name}</p>
                                            <p className="num mt-0.5 text-xs text-[var(--text-muted)]">
                                                {fmtDateTime(new Date(bt.created_at).getTime())}
                                            </p>
                                        </td>
                                        <td className="px-4 py-3.5">
                                            <Badge variant="secondary" className="num">
                                                {bt.symbol} · {bt.interval}
                                            </Badge>
                                        </td>
                                        <td className={`num px-4 py-3.5 text-right font-semibold ${bt.total_return >= 0 ? "text-[var(--profit-text)]" : "text-[var(--loss-text)]"}`}>
                                            {fmtPct(bt.total_return)}
                                        </td>
                                        <td className="num px-4 py-3.5 text-right text-[var(--text-secondary)]">
                                            {fmtRatio(bt.sharpe_ratio)}
                                        </td>
                                        <td className="num px-4 py-3.5 text-right text-[var(--loss-text)]">
                                            {fmtPct(bt.max_drawdown, 1, false)}
                                        </td>
                                        <td className="num px-4 py-3.5 text-right text-[var(--text-secondary)]">
                                            {bt.win_rate !== null ? fmtPct(bt.win_rate, 0, false) : "—"}
                                        </td>
                                        <td className="num px-4 py-3.5 text-right text-[var(--text-secondary)]">
                                            {bt.total_trades}
                                        </td>
                                        <td className="px-4 py-3.5 text-right">
                                            <Link href={`/backtests/${bt.id}`}>
                                                <Button variant="ghost" size="sm">
                                                    Report
                                                    <ArrowRight className="ml-1 h-3.5 w-3.5" />
                                                </Button>
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
