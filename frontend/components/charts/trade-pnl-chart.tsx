"use client";

import {
    BarChart,
    Bar,
    Cell,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    ReferenceLine,
} from "recharts";
import { Trade } from "@/lib/types";
import { fmtUsd, fmtUsdCompact, fmtDateTime, fmtPctRaw } from "@/lib/format";

interface TradePnlChartProps {
    trades: Trade[];
    height?: number;
}

function PnlTooltip({ active, payload }: {
    active?: boolean;
    payload?: Array<{ payload: Trade & { idx: number } }>;
}) {
    if (!active || !payload?.length) return null;
    const t = payload[0].payload;
    const positive = t.pnl >= 0;
    return (
        <div className="rounded-lg border border-[var(--border-strong)] bg-[var(--surface-2)] px-3 py-2 shadow-lg">
            <p className="text-[11px] text-[var(--text-muted)]">
                #{t.idx + 1} · {t.side} · {fmtDateTime(t.exit_time)}
            </p>
            <p className={`num mt-1 text-sm font-semibold ${positive ? "text-[var(--profit-text)]" : "text-[var(--loss-text)]"}`}>
                {positive ? "+" : ""}{fmtUsd(t.pnl)} ({fmtPctRaw(t.return_pct)})
            </p>
            <p className="text-[11px] text-[var(--text-muted)]">{t.exit_reason}</p>
        </div>
    );
}

export default function TradePnlChart({ trades, height = 220 }: TradePnlChartProps) {
    const data = trades.map((t, idx) => ({ ...t, idx }));

    return (
        <ResponsiveContainer width="100%" height={height}>
            <BarChart data={data} margin={{ top: 4, right: 8, bottom: 0, left: 4 }}>
                <CartesianGrid stroke="var(--grid)" vertical={false} />
                <XAxis
                    dataKey="idx"
                    tickFormatter={(i) => `${Number(i) + 1}`}
                    axisLine={false}
                    tickLine={false}
                    minTickGap={24}
                />
                <YAxis
                    tickFormatter={(v) => fmtUsdCompact(v)}
                    axisLine={false}
                    tickLine={false}
                    width={56}
                />
                <Tooltip content={<PnlTooltip />} cursor={{ fill: "rgba(148,163,184,0.06)" }} />
                <ReferenceLine y={0} stroke="var(--border-strong)" />
                <Bar dataKey="pnl" radius={[3, 3, 0, 0]} maxBarSize={18} isAnimationActive={false}>
                    {data.map((t) => (
                        <Cell key={t.idx} fill={t.pnl >= 0 ? "#10b981" : "#ef4444"} />
                    ))}
                </Bar>
            </BarChart>
        </ResponsiveContainer>
    );
}
