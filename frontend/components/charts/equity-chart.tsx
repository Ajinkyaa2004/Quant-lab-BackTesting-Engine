"use client";

import {
    ComposedChart,
    Area,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    ReferenceLine,
} from "recharts";
import { fmtUsd, fmtUsdCompact, fmtDateShort, fmtDateTime } from "@/lib/format";

interface EquityChartProps {
    timestamps: number[];
    equity: number[];
    benchmark?: number[];
    initialCapital: number;
    height?: number;
}

interface Point {
    t: number;
    equity: number;
    benchmark?: number;
}

function ChartTooltip({ active, payload, label }: {
    active?: boolean;
    payload?: Array<{ dataKey: string; value: number }>;
    label?: number;
}) {
    if (!active || !payload?.length) return null;
    const equity = payload.find((p) => p.dataKey === "equity")?.value;
    const bench = payload.find((p) => p.dataKey === "benchmark")?.value;
    return (
        <div className="rounded-lg border border-[var(--border-strong)] bg-[var(--surface-2)] px-3 py-2 shadow-lg">
            <p className="text-[11px] text-[var(--text-muted)]">{fmtDateTime(label)}</p>
            {equity !== undefined && (
                <p className="num mt-1 text-sm font-semibold text-[var(--accent-hover)]">
                    Strategy {fmtUsd(equity)}
                </p>
            )}
            {bench !== undefined && (
                <p className="num text-xs text-[var(--text-secondary)]">
                    Buy &amp; hold {fmtUsd(bench)}
                </p>
            )}
        </div>
    );
}

export default function EquityChart({ timestamps, equity, benchmark, initialCapital, height = 320 }: EquityChartProps) {
    const hasBenchmark = benchmark && benchmark.length === equity.length;
    const data: Point[] = equity.map((value, i) => ({
        t: timestamps[i] ?? i,
        equity: value,
        ...(hasBenchmark ? { benchmark: benchmark![i] } : {}),
    }));

    return (
        <div>
            <div className="mb-3 flex items-center gap-4 text-[11px] text-[var(--text-secondary)]">
                <span className="flex items-center gap-1.5">
                    <span className="h-0.5 w-4 rounded bg-[#818cf8]" /> Strategy
                </span>
                {hasBenchmark && (
                    <span className="flex items-center gap-1.5">
                        <span
                            className="h-0.5 w-4 rounded"
                            style={{ backgroundImage: "repeating-linear-gradient(90deg, var(--chart-benchmark) 0 4px, transparent 4px 7px)" }}
                        />
                        Buy &amp; hold
                    </span>
                )}
            </div>
            <ResponsiveContainer width="100%" height={height}>
                <ComposedChart data={data} margin={{ top: 4, right: 8, bottom: 0, left: 4 }}>
                    <defs>
                        <linearGradient id="equityFill" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#6366f1" stopOpacity={0.28} />
                            <stop offset="100%" stopColor="#6366f1" stopOpacity={0} />
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
                        tickFormatter={(v) => fmtUsdCompact(v)}
                        axisLine={false}
                        tickLine={false}
                        width={64}
                        domain={["auto", "auto"]}
                    />
                    <Tooltip content={<ChartTooltip />} />
                    <ReferenceLine y={initialCapital} stroke="var(--border-strong)" strokeDasharray="3 3" />
                    {hasBenchmark && (
                        <Line
                            type="monotone"
                            dataKey="benchmark"
                            stroke="var(--chart-benchmark)"
                            strokeWidth={1.5}
                            strokeDasharray="4 4"
                            dot={false}
                            isAnimationActive={false}
                        />
                    )}
                    <Area
                        type="monotone"
                        dataKey="equity"
                        stroke="#818cf8"
                        strokeWidth={2}
                        fill="url(#equityFill)"
                        dot={false}
                        activeDot={{ r: 4, fill: "#818cf8", stroke: "var(--surface)", strokeWidth: 2 }}
                        isAnimationActive={false}
                    />
                </ComposedChart>
            </ResponsiveContainer>
        </div>
    );
}
