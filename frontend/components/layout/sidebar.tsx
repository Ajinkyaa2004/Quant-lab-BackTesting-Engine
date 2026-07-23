"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import {
    LayoutDashboard,
    FlaskConical,
    History,
    LogOut,
    Zap,
    CandlestickChart,
} from "lucide-react";
import { useState, useEffect } from "react";
import api from "@/lib/api";
import { Badge } from "@/components/ui/badge";

const sidebarItems = [
    { title: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { title: "Strategies", href: "/strategies", icon: FlaskConical },
    { title: "Backtests", href: "/backtests", icon: History },
];

interface Me {
    email: string;
    plan: string;
}

export default function Sidebar() {
    const pathname = usePathname();
    const router = useRouter();
    const [user, setUser] = useState<Me | null>(null);

    useEffect(() => {
        api.get("/auth/me")
            .then((res) => setUser({ email: res.data.email, plan: res.data.plan || "free" }))
            .catch(() => setUser(null));
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("token");
        router.push("/login");
    };

    const isPro = user?.plan && user.plan !== "free";

    return (
        <aside className="flex h-screen w-60 shrink-0 flex-col border-r border-[var(--border)] bg-[var(--surface)]">
            {/* Logo */}
            <Link href="/dashboard" className="flex h-16 items-center gap-2.5 border-b border-[var(--border)] px-5">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--accent)] shadow-[0_0_18px_var(--accent-glow)]">
                    <CandlestickChart className="h-4.5 w-4.5 text-white" strokeWidth={2.2} />
                </div>
                <div className="leading-tight">
                    <span className="text-[15px] font-bold tracking-tight text-[var(--text-primary)]">
                        Quant<span className="text-[var(--accent-hover)]">Lab</span>
                    </span>
                    <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-[var(--text-muted)]">
                        Backtesting
                    </p>
                </div>
            </Link>

            {/* Navigation */}
            <nav className="flex flex-1 flex-col gap-1 overflow-y-auto p-3">
                <p className="px-3 pb-2 pt-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--text-muted)]">
                    Workspace
                </p>
                {sidebarItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-150",
                                isActive
                                    ? "bg-[var(--accent-soft)] text-[var(--accent-hover)]"
                                    : "text-[var(--text-secondary)] hover:bg-[rgba(148,163,184,0.06)] hover:text-[var(--text-primary)]"
                            )}
                        >
                            <Icon
                                className={cn(
                                    "h-4 w-4 transition-colors",
                                    isActive ? "text-[var(--accent-hover)]" : "text-[var(--text-muted)] group-hover:text-[var(--text-secondary)]"
                                )}
                                strokeWidth={1.9}
                            />
                            {item.title}
                            {isActive && (
                                <span className="glow-dot ml-auto h-1.5 w-1.5 rounded-full bg-[var(--accent-hover)]" />
                            )}
                        </Link>
                    );
                })}

                {/* Upgrade card */}
                {!isPro && (
                    <div className="mt-auto rounded-xl border border-[rgba(99,102,241,0.25)] bg-gradient-to-b from-[rgba(99,102,241,0.12)] to-transparent p-4">
                        <div className="flex items-center gap-2">
                            <Zap className="h-4 w-4 text-[var(--accent-hover)]" />
                            <p className="text-sm font-semibold text-[var(--text-primary)]">Go Pro</p>
                        </div>
                        <p className="mt-1.5 text-xs leading-relaxed text-[var(--text-secondary)]">
                            Longer histories, more candles, and advanced analytics.
                        </p>
                        <Link
                            href="/#pricing"
                            className="mt-3 block rounded-lg bg-[var(--accent)] px-3 py-2 text-center text-xs font-semibold text-white transition-colors hover:bg-[var(--accent-hover)]"
                        >
                            View plans
                        </Link>
                    </div>
                )}
            </nav>

            {/* User */}
            <div className="border-t border-[var(--border)] p-3">
                <div className="flex items-center gap-3 rounded-lg px-2 py-2">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--surface-3)] text-xs font-bold text-[var(--accent-hover)]">
                        {user?.email?.charAt(0).toUpperCase() || "·"}
                    </div>
                    <div className="min-w-0 flex-1">
                        <p className="truncate text-xs font-medium text-[var(--text-primary)]">
                            {user?.email || "Loading…"}
                        </p>
                        <Badge variant={isPro ? "default" : "secondary"} className="mt-0.5 px-1.5 py-0 text-[10px]">
                            {(user?.plan || "free").toUpperCase()}
                        </Badge>
                    </div>
                    <button
                        onClick={handleLogout}
                        title="Sign out"
                        className="cursor-pointer rounded-md p-2 text-[var(--text-muted)] transition-colors hover:bg-[var(--loss-soft)] hover:text-[var(--loss-text)]"
                    >
                        <LogOut className="h-4 w-4" />
                    </button>
                </div>
            </div>
        </aside>
    );
}
