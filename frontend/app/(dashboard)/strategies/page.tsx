"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Strategy } from "@/lib/types";
import { fmtDate } from "@/lib/format";
import {
    Plus,
    Code2,
    Trash2,
    Play,
    FlaskConical,
    CalendarDays,
} from "lucide-react";

export default function StrategiesPage() {
    const [strategies, setStrategies] = useState<Strategy[]>([]);
    const [loading, setLoading] = useState(true);
    const [deleteLoading, setDeleteLoading] = useState<number | null>(null);

    useEffect(() => {
        fetchStrategies();
    }, []);

    const fetchStrategies = async () => {
        try {
            const response = await api.get("/strategies");
            setStrategies(response.data);
        } catch (error) {
            console.error("Failed to fetch strategies", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Delete this strategy? Its saved backtests remain, but the code is gone for good.")) return;
        setDeleteLoading(id);
        try {
            await api.delete(`/strategies/${id}`);
            setStrategies((prev) => prev.filter((s) => s.id !== id));
        } catch (error) {
            console.error("Failed to delete strategy", error);
            alert("Failed to delete strategy. Please try again.");
        } finally {
            setDeleteLoading(null);
        }
    };

    if (loading) {
        return (
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i} className="h-48 loading-skeleton" />
                ))}
            </div>
        );
    }

    return (
        <div className="animate-fade-in space-y-6">
            {/* Header */}
            <div className="flex flex-wrap items-end justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Strategy Library</h2>
                    <p className="mt-1 text-sm text-[var(--text-secondary)]">
                        {strategies.length} {strategies.length === 1 ? "strategy" : "strategies"} · Python, validated on upload
                    </p>
                </div>
                <Link href="/strategies/new">
                    <Button>
                        <Plus className="mr-1.5 h-4 w-4" />
                        New strategy
                    </Button>
                </Link>
            </div>

            {strategies.length === 0 ? (
                <div className="panel p-14 text-center">
                    <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--accent-soft)]">
                        <FlaskConical className="h-7 w-7 text-[var(--accent-hover)]" strokeWidth={1.6} />
                    </div>
                    <h3 className="text-lg font-semibold">Your library is empty</h3>
                    <p className="mx-auto mt-2 max-w-md text-sm text-[var(--text-secondary)]">
                        Start from a proven template — MA crossover, RSI mean reversion, MACD momentum —
                        or write your own logic from scratch.
                    </p>
                    <Link href="/strategies/new" className="mt-6 inline-block">
                        <Button size="lg">
                            <Plus className="mr-1.5 h-4 w-4" />
                            Create your first strategy
                        </Button>
                    </Link>
                </div>
            ) : (
                <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                    {strategies.map((strategy) => (
                        <div key={strategy.id} className="panel panel-hover group flex flex-col p-5">
                            <div className="flex items-start justify-between gap-3">
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[var(--accent-soft)]">
                                    <Code2 className="h-5 w-5 text-[var(--accent-hover)]" strokeWidth={1.8} />
                                </div>
                                <Badge variant="secondary" className="num text-[10px]">
                                    {strategy.class_name}
                                </Badge>
                            </div>

                            <h3 className="mt-4 font-semibold text-[var(--text-primary)] transition-colors group-hover:text-[var(--accent-hover)]">
                                {strategy.name}
                            </h3>
                            <p className="mt-1.5 line-clamp-2 flex-1 text-sm leading-relaxed text-[var(--text-muted)]">
                                {strategy.description || "No description provided."}
                            </p>

                            <div className="mt-4 flex items-center gap-1.5 text-xs text-[var(--text-muted)]">
                                <CalendarDays className="h-3.5 w-3.5" />
                                Created {fmtDate(new Date(strategy.created_at).getTime())}
                            </div>

                            <div className="mt-4 flex gap-2 border-t border-[var(--border)] pt-4">
                                <Link href={`/strategies/${strategy.id}`} className="flex-1">
                                    <Button size="sm" className="w-full">
                                        <Play className="mr-1.5 h-3.5 w-3.5" />
                                        Open lab
                                    </Button>
                                </Link>
                                <Button
                                    variant="destructive"
                                    size="sm"
                                    onClick={() => handleDelete(strategy.id)}
                                    disabled={deleteLoading === strategy.id}
                                    title="Delete strategy"
                                >
                                    {deleteLoading === strategy.id ? (
                                        <span className="h-3.5 w-3.5 animate-spin rounded-full border border-current border-t-transparent" />
                                    ) : (
                                        <Trash2 className="h-3.5 w-3.5" />
                                    )}
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
