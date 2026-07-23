"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { Plus, Globe } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

const titles: Array<{ match: (p: string) => boolean; title: string; subtitle: string }> = [
    { match: (p) => p === "/dashboard", title: "Dashboard", subtitle: "Portfolio performance at a glance" },
    { match: (p) => p === "/strategies", title: "Strategies", subtitle: "Your algorithmic trading library" },
    { match: (p) => p.startsWith("/strategies/new"), title: "New Strategy", subtitle: "Build and validate trading logic" },
    { match: (p) => p.startsWith("/strategies/"), title: "Strategy Lab", subtitle: "Configure and run simulations" },
    { match: (p) => p === "/backtests", title: "Backtests", subtitle: "Full simulation history" },
    { match: (p) => p.startsWith("/backtests/"), title: "Backtest Report", subtitle: "Deep performance analytics" },
];

export default function Header() {
    const pathname = usePathname();
    const [clock, setClock] = useState("");

    useEffect(() => {
        const tick = () => {
            const now = new Date();
            setClock(
                now.toLocaleTimeString("en-GB", { hour12: false, timeZone: "UTC" }) + " UTC"
            );
        };
        tick();
        const id = setInterval(tick, 1000);
        return () => clearInterval(id);
    }, []);

    const entry = titles.find((t) => t.match(pathname));

    return (
        <header className="glass sticky top-0 z-40 flex h-16 shrink-0 items-center justify-between px-6">
            <div>
                <h1 className="text-[17px] font-semibold tracking-tight text-[var(--text-primary)]">
                    {entry?.title || "QuantLab"}
                </h1>
                <p className="text-xs text-[var(--text-muted)]">
                    {entry?.subtitle || "Professional backtesting"}
                </p>
            </div>

            <div className="flex items-center gap-4">
                <div className="num hidden items-center gap-2 rounded-lg border border-[var(--border)] bg-[var(--surface-2)] px-3 py-1.5 text-xs text-[var(--text-secondary)] md:flex">
                    <Globe className="h-3.5 w-3.5 text-[var(--text-muted)]" />
                    {clock || "—"}
                </div>
                <div className="hidden items-center gap-1.5 rounded-lg border border-[rgba(16,185,129,0.25)] bg-[var(--profit-soft)] px-3 py-1.5 text-xs font-medium text-[var(--profit-text)] md:flex">
                    <span className="h-1.5 w-1.5 animate-pulse-soft rounded-full bg-[var(--profit)]" />
                    Live data
                </div>
                <Link href="/strategies/new">
                    <Button size="sm">
                        <Plus className="mr-1.5 h-3.5 w-3.5" />
                        New Strategy
                    </Button>
                </Link>
            </div>
        </header>
    );
}
