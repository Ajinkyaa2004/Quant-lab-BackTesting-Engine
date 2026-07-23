"use client";

import { use, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import config from "@/lib/config";
import axios from "axios";
import { Strategy } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import Editor from "@monaco-editor/react";
import {
    Play,
    ArrowLeft,
    AlertTriangle,
    Save,
    SlidersHorizontal,
    CandlestickChart,
} from "lucide-react";
import Link from "next/link";

export default function StrategyLabPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const router = useRouter();

    const [strategy, setStrategy] = useState<Strategy | null>(null);
    const [loadingStrategy, setLoadingStrategy] = useState(true);

    // Market config
    const [symbol, setSymbol] = useState(config.defaults.symbol);
    const [interval, setIntervalValue] = useState(config.defaults.interval);
    const [startTime, setStartTime] = useState("");
    const [endTime, setEndTime] = useState("");
    const [limit, setLimit] = useState(config.defaults.limit);

    // Capital & risk
    const [initialCapital, setInitialCapital] = useState(config.defaults.initialCapital);
    const [riskPerTrade, setRiskPerTrade] = useState(config.defaults.riskPerTrade);
    const [maxPositions, setMaxPositions] = useState(config.defaults.maxPositions);
    const [commissionPct, setCommissionPct] = useState(config.defaults.commissionPct);
    const [slippagePct, setSlippagePct] = useState(config.defaults.slippagePct);

    // Code editing
    const [code, setCode] = useState("");
    const [codeDirty, setCodeDirty] = useState(false);
    const [savingCode, setSavingCode] = useState(false);

    // Execution
    const [isRunning, setIsRunning] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        api.get(`/strategies/${id}`)
            .then((res) => {
                setStrategy(res.data);
                setCode(res.data.code || "");
            })
            .catch(() => setError("Failed to load strategy."))
            .finally(() => setLoadingStrategy(false));
    }, [id]);

    const handleSaveCode = async () => {
        if (!strategy) return;
        setSavingCode(true);
        setError("");
        try {
            const res = await api.put(`/strategies/${strategy.id}`, { code });
            setStrategy(res.data);
            setCodeDirty(false);
        } catch (err: unknown) {
            if (axios.isAxiosError(err) && err.response) {
                setError(err.response.data.detail || "Failed to save code.");
            } else {
                setError("Connection error while saving code.");
            }
        } finally {
            setSavingCode(false);
        }
    };

    const handleRunBacktest = async () => {
        setIsRunning(true);
        setError("");

        if (codeDirty) {
            await handleSaveCode();
        }

        const payload = {
            strategy_id: parseInt(id),
            broker: config.defaults.broker,
            symbol: symbol.toUpperCase().trim(),
            interval,
            initial_capital: initialCapital,
            start_time: startTime ? new Date(startTime).getTime() : null,
            end_time: endTime ? new Date(endTime).getTime() : null,
            limit,
            max_positions: maxPositions,
            risk_per_trade: riskPerTrade / 100,
            commission_pct: commissionPct / 100,
            slippage_pct: slippagePct / 100,
        };

        try {
            const response = await api.post("/strategies/backtest/run", payload);
            const backtestId = response.data.backtest_id;
            if (backtestId) {
                router.push(`/backtests/${backtestId}`);
            } else {
                setError("Backtest completed but no report id was returned.");
            }
        } catch (err: unknown) {
            if (axios.isAxiosError(err)) {
                setError(err.response?.data?.detail || "Backtest failed");
            } else {
                setError("An unexpected error occurred");
            }
        } finally {
            setIsRunning(false);
        }
    };

    if (loadingStrategy) {
        return (
            <div className="grid gap-6 lg:grid-cols-3">
                <div className="h-[480px] loading-skeleton" />
                <div className="h-[480px] loading-skeleton lg:col-span-2" />
            </div>
        );
    }

    if (!strategy) {
        return (
            <div className="animate-fade-in py-16 text-center">
                <AlertTriangle className="mx-auto mb-4 h-10 w-10 text-[var(--loss-text)]" />
                <h2 className="text-lg font-semibold">Strategy not found</h2>
                <p className="mt-1.5 text-sm text-[var(--text-muted)]">
                    It may have been deleted.
                </p>
                <Link href="/strategies" className="mt-6 inline-block">
                    <Button variant="outline">
                        <ArrowLeft className="mr-1.5 h-4 w-4" />
                        Back to library
                    </Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="animate-fade-in space-y-5">
            {/* Header */}
            <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-4">
                    <Link href="/strategies">
                        <Button variant="outline" size="icon">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <div>
                        <div className="flex items-center gap-2.5">
                            <h2 className="text-xl font-bold tracking-tight">{strategy.name}</h2>
                            <Badge variant="secondary" className="num text-[10px]">{strategy.class_name}</Badge>
                        </div>
                        <p className="max-w-xl truncate text-xs text-[var(--text-muted)]">
                            {strategy.description || "No description"}
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Button
                        variant="secondary"
                        onClick={handleSaveCode}
                        disabled={!codeDirty || savingCode}
                    >
                        <Save className="mr-1.5 h-4 w-4" />
                        {savingCode ? "Saving…" : codeDirty ? "Save code" : "Code saved"}
                    </Button>
                    <Button onClick={handleRunBacktest} disabled={isRunning} variant="profit">
                        {isRunning ? (
                            <>
                                <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                                Simulating…
                            </>
                        ) : (
                            <>
                                <Play className="mr-1.5 h-4 w-4" />
                                Run backtest
                            </>
                        )}
                    </Button>
                </div>
            </div>

            {error && (
                <div className="flex items-center gap-2 rounded-lg border border-[rgba(239,68,68,0.25)] bg-[var(--loss-soft)] p-3 text-sm text-[var(--loss-text)]">
                    <AlertTriangle className="h-4 w-4 shrink-0" />
                    {error}
                </div>
            )}

            <div className="grid gap-5 lg:grid-cols-3">
                {/* Config panel */}
                <div className="space-y-5">
                    <div className="panel p-5">
                        <div className="mb-4 flex items-center gap-2">
                            <CandlestickChart className="h-4 w-4 text-[var(--accent-hover)]" />
                            <h3 className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--text-secondary)]">
                                Market
                            </h3>
                        </div>
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="symbol">Symbol</Label>
                                <Input
                                    id="symbol"
                                    list="symbols"
                                    className="num"
                                    value={symbol}
                                    onChange={(e) => setSymbol(e.target.value)}
                                />
                                <datalist id="symbols">
                                    {config.popularSymbols.map((s) => (
                                        <option key={s} value={s} />
                                    ))}
                                </datalist>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-2">
                                    <Label>Timeframe</Label>
                                    <Select value={interval} onChange={(e) => setIntervalValue(e.target.value)}>
                                        {config.intervals.map((iv) => (
                                            <option key={iv.value} value={iv.value}>{iv.label}</option>
                                        ))}
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="limit">Max candles</Label>
                                    <Input
                                        id="limit"
                                        type="number"
                                        className="num"
                                        value={limit}
                                        min={config.validation.minLimit}
                                        max={config.validation.maxLimit}
                                        step={100}
                                        onChange={(e) => setLimit(parseInt(e.target.value) || config.defaults.limit)}
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-1 gap-3">
                                <div className="space-y-2">
                                    <Label htmlFor="start">From (optional)</Label>
                                    <Input
                                        id="start"
                                        type="datetime-local"
                                        className="num"
                                        value={startTime}
                                        onChange={(e) => setStartTime(e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="end">To (optional)</Label>
                                    <Input
                                        id="end"
                                        type="datetime-local"
                                        className="num"
                                        value={endTime}
                                        onChange={(e) => setEndTime(e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="panel p-5">
                        <div className="mb-4 flex items-center gap-2">
                            <SlidersHorizontal className="h-4 w-4 text-[var(--accent-hover)]" />
                            <h3 className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--text-secondary)]">
                                Capital & Costs
                            </h3>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-2">
                                <Label htmlFor="capital">Capital ($)</Label>
                                <Input
                                    id="capital"
                                    type="number"
                                    className="num"
                                    value={initialCapital}
                                    min={config.validation.minInitialCapital}
                                    step={100}
                                    onChange={(e) => setInitialCapital(parseFloat(e.target.value) || config.defaults.initialCapital)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="risk">Risk/trade (%)</Label>
                                <Input
                                    id="risk"
                                    type="number"
                                    className="num"
                                    value={riskPerTrade}
                                    min={config.validation.minRiskPerTrade}
                                    max={config.validation.maxRiskPerTrade}
                                    step={0.1}
                                    onChange={(e) => setRiskPerTrade(parseFloat(e.target.value) || config.defaults.riskPerTrade)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="maxpos">Max positions</Label>
                                <Input
                                    id="maxpos"
                                    type="number"
                                    className="num"
                                    value={maxPositions}
                                    min={1}
                                    max={10}
                                    onChange={(e) => setMaxPositions(parseInt(e.target.value) || 1)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="commission">Commission (%)</Label>
                                <Input
                                    id="commission"
                                    type="number"
                                    className="num"
                                    value={commissionPct}
                                    min={0}
                                    max={5}
                                    step={0.01}
                                    onChange={(e) => setCommissionPct(parseFloat(e.target.value) ?? config.defaults.commissionPct)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="slippage">Slippage (%)</Label>
                                <Input
                                    id="slippage"
                                    type="number"
                                    className="num"
                                    value={slippagePct}
                                    min={0}
                                    max={5}
                                    step={0.01}
                                    onChange={(e) => setSlippagePct(parseFloat(e.target.value) ?? config.defaults.slippagePct)}
                                />
                            </div>
                        </div>
                        <p className="mt-4 rounded-lg border border-[var(--border)] bg-[var(--surface-2)] p-3 text-xs leading-relaxed text-[var(--text-muted)]">
                            Historical simulation only — costs are applied to every fill so the results
                            stay honest. No live orders, no real funds.
                        </p>
                    </div>
                </div>

                {/* Code editor */}
                <div className="panel flex min-h-[560px] flex-col overflow-hidden lg:col-span-2">
                    <div className="flex items-center justify-between border-b border-[var(--border)] bg-[var(--surface-2)] px-4 py-2.5">
                        <div className="flex items-center gap-3">
                            <div className="flex items-center gap-1.5">
                                <span className="h-2.5 w-2.5 rounded-full bg-[#f87171]" />
                                <span className="h-2.5 w-2.5 rounded-full bg-[#fbbf24]" />
                                <span className="h-2.5 w-2.5 rounded-full bg-[#34d399]" />
                            </div>
                            <span className="num text-xs text-[var(--text-secondary)]">
                                {strategy.class_name}.py
                            </span>
                            {codeDirty && <Badge variant="warning" className="text-[10px]">Unsaved</Badge>}
                        </div>
                        <span className="text-xs text-[var(--text-muted)]">Python</span>
                    </div>
                    <div className="min-h-0 flex-1">
                        <Editor
                            height="100%"
                            defaultLanguage="python"
                            value={code}
                            onChange={(value) => {
                                setCode(value || "");
                                setCodeDirty(true);
                            }}
                            theme="vs-dark"
                            options={{
                                minimap: { enabled: false },
                                fontSize: 13,
                                fontFamily: "var(--font-geist-mono), ui-monospace, monospace",
                                scrollBeyondLastLine: false,
                                automaticLayout: true,
                                wordWrap: "on",
                                padding: { top: 12 },
                                bracketPairColorization: { enabled: true },
                            }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
