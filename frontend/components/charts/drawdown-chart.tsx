"use client";

import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";
import { fmtPct, fmtDateShort, fmtDateTime } from "@/lib/format";

interface DrawdownChartProps {
    timestamps: number[];
    drawdown: number[]; // negative decimals
    height?: number;
}

function DDTooltip({ active, payload, label }: {
    active?: boolean;
    payload?: Array<{ value: number }>;
    label?: number;
}) {
    if (!active || !payload?.length) return null;
    return (
        <div className="rounded-lg border border-[var(--border-strong)] bg-[var(--surface-2)] px-3 py-2 shadow-lg">
            <p className="text-[11px] text-[var(--text-muted)]">{fmtDateTime(label)}</p>
            <p className="num mt-1 text-sm font-semibold text-[var(--loss-text)]">
                Drawdown {fmtPct(payload[0].value, 2, false)}
            </p>
        </div>
    );
}

export default function DrawdownChart({ timestamps, drawdown, height = 220 }: DrawdownChartProps) {
    const data = drawdown.map((value, i) => ({ t: timestamps[i] ?? i, dd: value }));

    return (
        <ResponsiveContainer width="100%" height={height}>
            <AreaChart data={data} margin={{ top: 4, right: 8, bottom: 0, left: 4 }}>
                <defs>
                    <linearGradient id="ddFill" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#ef4444" stopOpacity={0} />
                        <stop offset="100%" stopColor="#ef4444" stopOpacity={0.3} />
                    </linearGradient>
                </defs>
                <CartesianGrid stroke="var(--grid)" vertical={false} />
                <XAxis
                    dataKey="t"
                    tickFormatter={(t) => fmtDateShort(t)}
                    axisLine={false}
                    tickLine={false}
                    minTickGap={64}
                />
                <YAxis
                    tickFormatter={(v) => `${(v * 100).toFixed(0)}%`}
                    axisLine={false}
                    tickLine={false}
                    width={48}
                />
                <Tooltip content={<DDTooltip />} />
                <Area
                    type="monotone"
                    dataKey="dd"
                    stroke="#f87171"
                    strokeWidth={1.5}
                    fill="url(#ddFill)"
                    dot={false}
                    isAnimationActive={false}
                />
            </AreaChart>
        </ResponsiveContainer>
    );
}
