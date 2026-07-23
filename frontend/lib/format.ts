/** Shared number/date formatting for the analytics UI. */

export function fmtUsd(v: number | null | undefined, digits = 2): string {
    if (v === null || v === undefined || isNaN(v)) return "—";
    return v.toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: digits,
        maximumFractionDigits: digits,
    });
}

export function fmtUsdCompact(v: number | null | undefined): string {
    if (v === null || v === undefined || isNaN(v)) return "—";
    if (Math.abs(v) >= 1_000_000) return `$${(v / 1_000_000).toFixed(1)}M`;
    if (Math.abs(v) >= 10_000) return `$${(v / 1_000).toFixed(1)}k`;
    return fmtUsd(v, 0);
}

/** Format a decimal ratio (0.153 → "+15.30%"). */
export function fmtPct(v: number | null | undefined, digits = 2, signed = true): string {
    if (v === null || v === undefined || isNaN(v)) return "—";
    const pct = v * 100;
    const sign = signed && pct > 0 ? "+" : "";
    return `${sign}${pct.toFixed(digits)}%`;
}

/** Format an already-percent number (15.3 → "+15.30%"). */
export function fmtPctRaw(v: number | null | undefined, digits = 2, signed = true): string {
    if (v === null || v === undefined || isNaN(v)) return "—";
    const sign = signed && v > 0 ? "+" : "";
    return `${sign}${v.toFixed(digits)}%`;
}

export function fmtRatio(v: number | null | undefined, digits = 2): string {
    if (v === null || v === undefined || isNaN(v)) return "—";
    return v.toFixed(digits);
}

export function fmtDate(ms: number | null | undefined): string {
    if (!ms) return "—";
    return new Date(ms).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
}

export function fmtDateTime(ms: number | null | undefined): string {
    if (!ms) return "—";
    return new Date(ms).toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
    });
}

export function fmtDateShort(ms: number): string {
    return new Date(ms).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export const MONTH_LABELS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
