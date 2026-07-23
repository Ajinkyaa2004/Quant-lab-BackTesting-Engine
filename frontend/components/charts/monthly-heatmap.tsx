"use client";

import { Fragment } from "react";
import { MonthlyReturn } from "@/lib/types";
import { fmtPct, MONTH_LABELS } from "@/lib/format";

interface MonthlyHeatmapProps {
    data: MonthlyReturn[];
}

/**
 * Diverging green/red heatmap of calendar-month returns.
 * Every cell carries its value as text, so color never works alone.
 */
export default function MonthlyHeatmap({ data }: MonthlyHeatmapProps) {
    if (!data.length) {
        return <p className="py-8 text-center text-sm text-[var(--text-muted)]">No monthly data.</p>;
    }

    const years = Array.from(new Set(data.map((d) => d.year))).sort();
    const byKey = new Map(data.map((d) => [`${d.year}-${d.month}`, d.return]));
    const maxAbs = Math.max(0.0001, ...data.map((d) => Math.abs(d.return)));

    const cellStyle = (r: number | undefined) => {
        if (r === undefined) return { background: "var(--surface-2)" };
        const intensity = Math.min(1, Math.abs(r) / maxAbs);
        const alpha = 0.08 + intensity * 0.55;
        return {
            background: r >= 0
                ? `rgba(16, 185, 129, ${alpha.toFixed(3)})`
                : `rgba(239, 68, 68, ${alpha.toFixed(3)})`,
        };
    };

    return (
        <div className="overflow-x-auto">
            <div className="min-w-[640px]">
                <div className="grid grid-cols-[56px_repeat(12,1fr)] gap-[3px]">
                    <div />
                    {MONTH_LABELS.map((m) => (
                        <div key={m} className="pb-1 text-center text-[10px] font-semibold uppercase tracking-wider text-[var(--text-muted)]">
                            {m}
                        </div>
                    ))}
                    {years.map((year) => (
                        <Fragment key={year}>
                            <div className="num flex items-center text-xs font-medium text-[var(--text-secondary)]">
                                {year}
                            </div>
                            {MONTH_LABELS.map((_, mi) => {
                                const r = byKey.get(`${year}-${mi + 1}`);
                                return (
                                    <div
                                        key={`${year}-${mi}`}
                                        style={cellStyle(r)}
                                        className="num flex h-9 items-center justify-center rounded-md text-[11px] font-medium text-[var(--text-primary)]"
                                        title={r !== undefined ? `${MONTH_LABELS[mi]} ${year}: ${fmtPct(r)}` : `${MONTH_LABELS[mi]} ${year}: no data`}
                                    >
                                        {r !== undefined ? fmtPct(r, 1) : ""}
                                    </div>
                                );
                            })}
                        </Fragment>
                    ))}
                </div>
            </div>
        </div>
    );
}
