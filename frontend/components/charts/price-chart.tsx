"use client";

import { useEffect, useRef } from "react";
import {
    createChart,
    ColorType,
    CandlestickSeries,
    HistogramSeries,
    createSeriesMarkers,
    type IChartApi,
    type UTCTimestamp,
    type SeriesMarker,
    type Time,
} from "lightweight-charts";
import { Candle, Trade } from "@/lib/types";

interface PriceChartProps {
    candles: Candle[];
    trades?: Trade[];
    height?: number;
}

/**
 * TradingView-style candlestick chart with volume and trade entry/exit markers.
 */
export default function PriceChart({ candles, trades = [], height = 420 }: PriceChartProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const chartRef = useRef<IChartApi | null>(null);

    useEffect(() => {
        if (!containerRef.current || candles.length === 0) return;

        const chart = createChart(containerRef.current, {
            height,
            layout: {
                background: { type: ColorType.Solid, color: "transparent" },
                textColor: "#5d6b80",
                fontSize: 11,
                attributionLogo: false,
            },
            grid: {
                vertLines: { color: "rgba(148,163,184,0.06)" },
                horzLines: { color: "rgba(148,163,184,0.06)" },
            },
            crosshair: {
                vertLine: { color: "rgba(148,163,184,0.3)", labelBackgroundColor: "#161d2e" },
                horzLine: { color: "rgba(148,163,184,0.3)", labelBackgroundColor: "#161d2e" },
            },
            rightPriceScale: { borderColor: "rgba(148,163,184,0.12)" },
            timeScale: { borderColor: "rgba(148,163,184,0.12)", timeVisible: true },
        });
        chartRef.current = chart;

        const candleSeries = chart.addSeries(CandlestickSeries, {
            upColor: "#10b981",
            downColor: "#ef4444",
            borderUpColor: "#10b981",
            borderDownColor: "#ef4444",
            wickUpColor: "rgba(16,185,129,0.6)",
            wickDownColor: "rgba(239,68,68,0.6)",
        });
        candleSeries.setData(
            candles.map((c) => ({
                time: (c.timestamp / 1000) as UTCTimestamp,
                open: c.open,
                high: c.high,
                low: c.low,
                close: c.close,
            }))
        );

        const volumeSeries = chart.addSeries(HistogramSeries, {
            priceFormat: { type: "volume" },
            priceScaleId: "volume",
        });
        chart.priceScale("volume").applyOptions({
            scaleMargins: { top: 0.82, bottom: 0 },
        });
        volumeSeries.setData(
            candles.map((c) => ({
                time: (c.timestamp / 1000) as UTCTimestamp,
                value: c.volume,
                color: c.close >= c.open ? "rgba(16,185,129,0.25)" : "rgba(239,68,68,0.25)",
            }))
        );

        if (trades.length > 0) {
            // Snap marker times to existing candle times so they always render
            const candleTimes = candles.map((c) => c.timestamp);
            const snap = (ms: number): UTCTimestamp => {
                let best = candleTimes[0];
                for (const t of candleTimes) {
                    if (t <= ms) best = t;
                    else break;
                }
                return (best / 1000) as UTCTimestamp;
            };

            const markers: SeriesMarker<Time>[] = [];
            for (const trade of trades) {
                const isLong = trade.side === "LONG";
                markers.push({
                    time: snap(trade.entry_time),
                    position: isLong ? "belowBar" : "aboveBar",
                    color: isLong ? "#10b981" : "#ef4444",
                    shape: isLong ? "arrowUp" : "arrowDown",
                    text: isLong ? "L" : "S",
                });
                markers.push({
                    time: snap(trade.exit_time),
                    position: isLong ? "aboveBar" : "belowBar",
                    color: trade.pnl >= 0 ? "#34d399" : "#f87171",
                    shape: "circle",
                    text: "×",
                });
            }
            markers.sort((a, b) => (a.time as number) - (b.time as number));
            createSeriesMarkers(candleSeries, markers);
        }

        chart.timeScale().fitContent();

        const observer = new ResizeObserver((entries) => {
            const width = entries[0]?.contentRect.width;
            if (width) chart.applyOptions({ width });
        });
        observer.observe(containerRef.current);

        return () => {
            observer.disconnect();
            chart.remove();
            chartRef.current = null;
        };
    }, [candles, trades, height]);

    if (candles.length === 0) {
        return (
            <div className="flex h-40 items-center justify-center text-sm text-[var(--text-muted)]">
                No price data available.
            </div>
        );
    }

    return (
        <div>
            <div className="mb-2 flex items-center gap-4 text-[11px] text-[var(--text-secondary)]">
                <span className="flex items-center gap-1.5">
                    <span className="inline-block h-2 w-2 rounded-[2px] bg-[#10b981]" /> Long entry ▲
                </span>
                <span className="flex items-center gap-1.5">
                    <span className="inline-block h-2 w-2 rounded-[2px] bg-[#ef4444]" /> Short entry ▼
                </span>
                <span className="flex items-center gap-1.5">
                    <span className="inline-block h-2 w-2 rounded-full border border-[var(--text-muted)]" /> Exit
                </span>
            </div>
            <div ref={containerRef} className="w-full" />
        </div>
    );
}
