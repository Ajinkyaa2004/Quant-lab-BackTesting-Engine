import Link from "next/link";
import { CandlestickChart, Check } from "lucide-react";

const points = [
    "Backtest on up to 10,000 real market candles",
    "20+ institutional metrics per run",
    "Commission & slippage modeled on every fill",
    "Free forever plan — no credit card",
];

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex min-h-screen">
            {/* Brand panel */}
            <div className="relative hidden w-[46%] flex-col justify-between overflow-hidden border-r border-[var(--border)] bg-[var(--surface)] p-10 lg:flex">
                <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-[radial-gradient(closest-side,rgba(99,102,241,0.18),transparent)]" />
                <div className="absolute -bottom-40 -left-20 h-96 w-96 rounded-full bg-[radial-gradient(closest-side,rgba(34,211,238,0.08),transparent)]" />

                <Link href="/" className="relative flex items-center gap-2.5">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--accent)] shadow-[0_0_18px_var(--accent-glow)]">
                        <CandlestickChart className="h-5 w-5 text-white" strokeWidth={2.2} />
                    </div>
                    <span className="text-lg font-bold tracking-tight">
                        Quant<span className="text-[var(--accent-hover)]">Lab</span>
                    </span>
                </Link>

                <div className="relative">
                    <h2 className="text-balance text-3xl font-bold leading-tight tracking-tight">
                        The fastest way from trading idea to{" "}
                        <span className="text-gradient">verified edge</span>.
                    </h2>
                    <ul className="mt-8 space-y-4">
                        {points.map((p) => (
                            <li key={p} className="flex items-start gap-3 text-sm text-[var(--text-secondary)]">
                                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[var(--profit-soft)]">
                                    <Check className="h-3 w-3 text-[var(--profit-text)]" />
                                </span>
                                {p}
                            </li>
                        ))}
                    </ul>
                </div>

                <p className="relative text-xs text-[var(--text-muted)]">
                    Historical simulation only — no live trading, no real funds.
                </p>
            </div>

            {/* Form panel */}
            <div className="flex flex-1 items-center justify-center p-6">
                <div className="w-full max-w-md">
                    <Link href="/" className="mb-8 flex items-center justify-center gap-2.5 lg:hidden">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--accent)]">
                            <CandlestickChart className="h-4.5 w-4.5 text-white" strokeWidth={2.2} />
                        </div>
                        <span className="text-lg font-bold tracking-tight">
                            Quant<span className="text-[var(--accent-hover)]">Lab</span>
                        </span>
                    </Link>
                    {children}
                </div>
            </div>
        </div>
    );
}
