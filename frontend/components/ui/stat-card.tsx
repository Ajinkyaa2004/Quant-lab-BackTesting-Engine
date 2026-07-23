import * as React from "react";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

interface StatCardProps {
    label: string;
    value: string;
    sub?: string;
    tone?: "profit" | "loss" | "accent" | "neutral";
    icon?: LucideIcon;
    className?: string;
}

const toneClasses: Record<NonNullable<StatCardProps["tone"]>, string> = {
    profit: "text-[var(--profit-text)]",
    loss: "text-[var(--loss-text)]",
    accent: "text-[var(--accent-hover)]",
    neutral: "text-[var(--text-primary)]",
};

const iconToneClasses: Record<NonNullable<StatCardProps["tone"]>, string> = {
    profit: "bg-[var(--profit-soft)] text-[var(--profit-text)]",
    loss: "bg-[var(--loss-soft)] text-[var(--loss-text)]",
    accent: "bg-[var(--accent-soft)] text-[var(--accent-hover)]",
    neutral: "bg-[var(--surface-3)] text-[var(--text-secondary)]",
};

export function StatCard({ label, value, sub, tone = "neutral", icon: Icon, className }: StatCardProps) {
    return (
        <div className={cn("panel panel-hover p-5", className)}>
            <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--text-muted)]">
                        {label}
                    </p>
                    <p className={cn("num mt-2 whitespace-nowrap text-xl font-semibold leading-none xl:text-[22px]", toneClasses[tone])}>
                        {value}
                    </p>
                    {sub && (
                        <p className="mt-2 truncate text-xs text-[var(--text-muted)]">{sub}</p>
                    )}
                </div>
                {Icon && (
                    <div className={cn("flex h-9 w-9 shrink-0 items-center justify-center rounded-lg", iconToneClasses[tone])}>
                        <Icon className="h-4.5 w-4.5" strokeWidth={1.8} />
                    </div>
                )}
            </div>
        </div>
    );
}
