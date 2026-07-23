"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import config from "@/lib/config";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    CandlestickChart,
    LineChart,
    ShieldCheck,
    Gauge,
    Code2,
    Layers,
    ArrowRight,
    Check,
    Sparkles,
    TrendingUp,
    Timer,
    SlidersHorizontal,
} from "lucide-react";

const features = [
    {
        icon: Code2,
        title: "Python strategy engine",
        text: "Write strategies in Python with a clean on_candle API, or start from battle-tested templates — MA cross, RSI reversion, MACD momentum.",
    },
    {
        icon: CandlestickChart,
        title: "Real market data",
        text: "Backtest against up to 10,000 real Binance candles per run, from 1-minute scalps to weekly swings.",
    },
    {
        icon: Gauge,
        title: "20+ institutional metrics",
        text: "Sharpe, Sortino, Calmar, CAGR, expectancy, payoff ratio, exposure, streaks — the numbers a real desk looks at.",
    },
    {
        icon: SlidersHorizontal,
        title: "Realistic cost modeling",
        text: "Commission and slippage applied to every fill, so your edge survives contact with the real market.",
    },
    {
        icon: LineChart,
        title: "Deep visual analytics",
        text: "Equity vs. buy & hold, underwater drawdown curves, monthly return heatmaps, and per-trade P&L distribution.",
    },
    {
        icon: ShieldCheck,
        title: "Risk-first simulation",
        text: "Stop loss, take profit, trailing stops, position sizing by risk — long and short, tested candle by candle.",
    },
];

const steps = [
    { n: "01", title: "Build", text: "Pick a template or write your own Python logic in the built-in Monaco editor." },
    { n: "02", title: "Simulate", text: "Run it on real historical data with realistic fees, slippage and risk controls." },
    { n: "03", title: "Analyze", text: "Read the full tear sheet — then iterate until the edge is real." },
];

// Hand-drawn equity path for the hero mockup (viewBox 0 0 560 200)
const HERO_EQUITY = "M0,168 L28,160 L56,163 L84,148 L112,152 L140,135 L168,140 L196,120 L224,126 L252,104 L280,110 L308,88 L336,95 L364,72 L392,80 L420,58 L448,64 L476,42 L504,48 L532,28 L560,18";
const HERO_BENCH = "M0,172 L56,166 L112,158 L168,152 L224,148 L280,138 L336,132 L392,124 L448,120 L504,112 L560,104";

export default function LandingPage() {
    const [hasToken, setHasToken] = useState(false);

    useEffect(() => {
        setHasToken(!!localStorage.getItem("token"));
    }, []);

    const appHref = hasToken ? "/dashboard" : "/register";

    return (
        <div className="min-h-screen">
            {/* Nav */}
            <nav className="glass sticky top-0 z-50">
                <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
                    <Link href="/" className="flex items-center gap-2.5">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--accent)] shadow-[0_0_18px_var(--accent-glow)]">
                            <CandlestickChart className="h-4.5 w-4.5 text-white" strokeWidth={2.2} />
                        </div>
                        <span className="text-[17px] font-bold tracking-tight">
                            Quant<span className="text-[var(--accent-hover)]">Lab</span>
                        </span>
                    </Link>
                    <div className="hidden items-center gap-8 text-sm text-[var(--text-secondary)] md:flex">
                        <a href="#features" className="transition-colors hover:text-[var(--text-primary)]">Features</a>
                        <a href="#how" className="transition-colors hover:text-[var(--text-primary)]">How it works</a>
                        <a href="#pricing" className="transition-colors hover:text-[var(--text-primary)]">Pricing</a>
                    </div>
                    <div className="flex items-center gap-3">
                        {hasToken ? (
                            <Link href="/dashboard">
                                <Button size="sm">Open dashboard</Button>
                            </Link>
                        ) : (
                            <>
                                <Link href="/login">
                                    <Button variant="ghost" size="sm">Sign in</Button>
                                </Link>
                                <Link href="/register">
                                    <Button size="sm">Get started</Button>
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </nav>

            {/* Hero */}
            <section className="relative overflow-hidden px-6 pb-24 pt-20">
                <div className="mx-auto max-w-6xl">
                    <div className="mx-auto max-w-3xl text-center">
                        <Badge className="mx-auto mb-6">
                            <Sparkles className="h-3 w-3" />
                            Institutional-grade backtesting, self-serve
                        </Badge>
                        <h1 className="text-balance text-5xl font-bold leading-[1.08] tracking-tight md:text-6xl">
                            Prove your trading edge{" "}
                            <span className="text-gradient">before you risk a dollar</span>
                        </h1>
                        <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-[var(--text-secondary)]">
                            QuantLab turns your trading ideas into Python strategies, runs them against
                            real market history with realistic costs, and hands you the full tear sheet —
                            Sharpe to drawdown to monthly heatmap.
                        </p>
                        <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
                            <Link href={appHref}>
                                <Button size="lg">
                                    Start backtesting free
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </Button>
                            </Link>
                            <a href="#features">
                                <Button variant="outline" size="lg">See what&apos;s inside</Button>
                            </a>
                        </div>
                        <p className="mt-4 text-xs text-[var(--text-muted)]">
                            Free forever plan · No credit card · Simulation only, never live money
                        </p>
                    </div>

                    {/* Terminal mockup */}
                    <div className="relative mx-auto mt-16 max-w-4xl">
                        <div className="absolute -inset-10 -z-10 rounded-[40px] bg-[radial-gradient(closest-side,rgba(99,102,241,0.16),transparent)]" />
                        <div className="panel overflow-hidden shadow-[var(--shadow-lg)]">
                            {/* Window chrome */}
                            <div className="flex items-center justify-between border-b border-[var(--border)] bg-[var(--surface-2)] px-4 py-2.5">
                                <div className="flex items-center gap-1.5">
                                    <span className="h-2.5 w-2.5 rounded-full bg-[#f87171]" />
                                    <span className="h-2.5 w-2.5 rounded-full bg-[#fbbf24]" />
                                    <span className="h-2.5 w-2.5 rounded-full bg-[#34d399]" />
                                </div>
                                <span className="num text-xs text-[var(--text-muted)]">BTCUSDT · 1h · MA Crossover</span>
                                <Badge variant="profit" className="text-[10px]">+42.7%</Badge>
                            </div>
                            {/* Stat strip */}
                            <div className="grid grid-cols-2 gap-px border-b border-[var(--border)] bg-[var(--border)] md:grid-cols-4">
                                {[
                                    { label: "Total Return", value: "+42.7%", tone: "text-[var(--profit-text)]" },
                                    { label: "Sharpe", value: "1.86", tone: "text-[var(--text-primary)]" },
                                    { label: "Max Drawdown", value: "−11.2%", tone: "text-[var(--loss-text)]" },
                                    { label: "Win Rate", value: "58.3%", tone: "text-[var(--text-primary)]" },
                                ].map((s) => (
                                    <div key={s.label} className="bg-[var(--surface)] px-4 py-3">
                                        <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--text-muted)]">{s.label}</p>
                                        <p className={`num mt-1 text-lg font-semibold ${s.tone}`}>{s.value}</p>
                                    </div>
                                ))}
                            </div>
                            {/* Chart */}
                            <div className="relative bg-[var(--surface)] p-4">
                                <div className="mb-2 flex items-center gap-4 text-[11px] text-[var(--text-muted)]">
                                    <span className="flex items-center gap-1.5">
                                        <span className="h-0.5 w-4 rounded bg-[var(--accent-hover)]" /> Strategy
                                    </span>
                                    <span className="flex items-center gap-1.5">
                                        <span className="h-0.5 w-4 rounded bg-[var(--chart-benchmark)]" style={{ backgroundImage: "repeating-linear-gradient(90deg, var(--chart-benchmark) 0 4px, transparent 4px 7px)" }} /> Buy &amp; hold
                                    </span>
                                </div>
                                <svg viewBox="0 0 560 200" className="w-full" role="img" aria-label="Strategy equity curve outperforming buy and hold">
                                    <defs>
                                        <linearGradient id="heroFill" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="0%" stopColor="#6366f1" stopOpacity="0.25" />
                                            <stop offset="100%" stopColor="#6366f1" stopOpacity="0" />
                                        </linearGradient>
                                    </defs>
                                    {[40, 80, 120, 160].map((y) => (
                                        <line key={y} x1="0" x2="560" y1={y} y2={y} stroke="var(--grid)" strokeWidth="1" />
                                    ))}
                                    <path d={`${HERO_EQUITY} L560,200 L0,200 Z`} fill="url(#heroFill)" />
                                    <path d={HERO_BENCH} fill="none" stroke="var(--chart-benchmark)" strokeWidth="1.5" strokeDasharray="4 4" />
                                    <path d={HERO_EQUITY} fill="none" stroke="#818cf8" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
                                    <circle cx="560" cy="18" r="4" fill="#818cf8" stroke="var(--surface)" strokeWidth="2" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    {/* Proof strip */}
                    <div className="mx-auto mt-14 grid max-w-3xl grid-cols-2 gap-6 text-center md:grid-cols-4">
                        {[
                            { icon: Timer, label: "10,000 candles per run" },
                            { icon: Gauge, label: "20+ performance metrics" },
                            { icon: TrendingUp, label: "Long & short simulation" },
                            { icon: Layers, label: "Fees & slippage modeled" },
                        ].map((item) => (
                            <div key={item.label} className="flex flex-col items-center gap-2 text-sm text-[var(--text-secondary)]">
                                <item.icon className="h-5 w-5 text-[var(--accent-hover)]" strokeWidth={1.8} />
                                {item.label}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features */}
            <section id="features" className="border-t border-[var(--border)] px-6 py-24">
                <div className="mx-auto max-w-6xl">
                    <div className="mx-auto max-w-2xl text-center">
                        <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
                            Everything a serious backtest needs
                        </h2>
                        <p className="mt-4 text-[var(--text-secondary)]">
                            Built like the internal tooling at a quant desk — without the desk.
                        </p>
                    </div>
                    <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                        {features.map((f) => (
                            <div key={f.title} className="panel panel-hover p-6">
                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--accent-soft)]">
                                    <f.icon className="h-5 w-5 text-[var(--accent-hover)]" strokeWidth={1.8} />
                                </div>
                                <h3 className="mt-4 font-semibold text-[var(--text-primary)]">{f.title}</h3>
                                <p className="mt-2 text-sm leading-relaxed text-[var(--text-secondary)]">{f.text}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* How it works */}
            <section id="how" className="border-t border-[var(--border)] px-6 py-24">
                <div className="mx-auto max-w-5xl">
                    <h2 className="text-center text-3xl font-bold tracking-tight md:text-4xl">
                        From idea to tear sheet in minutes
                    </h2>
                    <div className="mt-14 grid gap-6 md:grid-cols-3">
                        {steps.map((s) => (
                            <div key={s.n} className="panel relative p-6">
                                <span className="num text-4xl font-bold text-[var(--accent-soft)]" style={{ color: "rgba(99,102,241,0.35)" }}>{s.n}</span>
                                <h3 className="mt-3 text-lg font-semibold">{s.title}</h3>
                                <p className="mt-2 text-sm leading-relaxed text-[var(--text-secondary)]">{s.text}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Pricing */}
            <section id="pricing" className="border-t border-[var(--border)] px-6 py-24">
                <div className="mx-auto max-w-6xl">
                    <div className="mx-auto max-w-2xl text-center">
                        <h2 className="text-3xl font-bold tracking-tight md:text-4xl">Simple, honest pricing</h2>
                        <p className="mt-4 text-[var(--text-secondary)]">
                            Start free. Upgrade when your research outgrows the limits.
                        </p>
                    </div>
                    <div className="mt-14 grid gap-6 lg:grid-cols-3">
                        {config.plans.map((plan) => (
                            <div
                                key={plan.id}
                                className={`panel relative flex flex-col p-7 ${plan.highlighted
                                    ? "border-[rgba(99,102,241,0.45)] shadow-[0_0_40px_rgba(99,102,241,0.15)]"
                                    : ""
                                    }`}
                            >
                                {plan.highlighted && (
                                    <Badge className="absolute -top-3 left-1/2 -translate-x-1/2">Most popular</Badge>
                                )}
                                <h3 className="text-lg font-semibold">{plan.name}</h3>
                                <p className="mt-1 text-sm text-[var(--text-muted)]">{plan.tagline}</p>
                                <div className="mt-5 flex items-baseline gap-1.5">
                                    <span className="num text-4xl font-bold">${plan.price}</span>
                                    <span className="text-sm text-[var(--text-muted)]">/{plan.period}</span>
                                </div>
                                <ul className="mt-6 flex-1 space-y-3">
                                    {plan.features.map((feat) => (
                                        <li key={feat} className="flex items-start gap-2.5 text-sm text-[var(--text-secondary)]">
                                            <Check className="mt-0.5 h-4 w-4 shrink-0 text-[var(--profit-text)]" />
                                            {feat}
                                        </li>
                                    ))}
                                </ul>
                                <Link href={appHref} className="mt-7">
                                    <Button
                                        className="w-full"
                                        variant={plan.highlighted ? "default" : "secondary"}
                                    >
                                        {plan.cta}
                                    </Button>
                                </Link>
                            </div>
                        ))}
                    </div>
                    <p className="mt-8 text-center text-xs text-[var(--text-muted)]">
                        Paid plans are launching soon — every account starts on Free today.
                    </p>
                </div>
            </section>

            {/* Footer */}
            <footer className="border-t border-[var(--border)] px-6 py-12">
                <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 text-center">
                    <div className="flex items-center gap-2.5">
                        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[var(--accent)]">
                            <CandlestickChart className="h-4 w-4 text-white" strokeWidth={2.2} />
                        </div>
                        <span className="font-bold">Quant<span className="text-[var(--accent-hover)]">Lab</span></span>
                    </div>
                    <p className="max-w-2xl text-xs leading-relaxed text-[var(--text-muted)]">
                        QuantLab is a historical simulation tool for research and education. Nothing here is
                        investment advice, and backtested performance does not guarantee future results.
                        No live trading, no real funds — ever.
                    </p>
                    <p className="text-xs text-[var(--text-muted)]">© {new Date().getFullYear()} QuantLab</p>
                </div>
            </footer>
        </div>
    );
}
