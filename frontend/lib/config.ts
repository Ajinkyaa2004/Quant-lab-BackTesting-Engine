// Application Configuration
export const config = {
    // API Configuration
    apiUrl: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000",

    // Default Trading Parameters
    defaults: {
        broker: process.env.NEXT_PUBLIC_DEFAULT_BROKER || "binance",
        symbol: process.env.NEXT_PUBLIC_DEFAULT_SYMBOL || "BTCUSDT",
        interval: process.env.NEXT_PUBLIC_DEFAULT_INTERVAL || "1h",
        initialCapital: parseInt(process.env.NEXT_PUBLIC_DEFAULT_INITIAL_CAPITAL || "10000"),
        riskPerTrade: parseFloat(process.env.NEXT_PUBLIC_DEFAULT_RISK_PER_TRADE || "2.0"),
        maxPositions: parseInt(process.env.NEXT_PUBLIC_DEFAULT_MAX_POSITIONS || "1"),
        limit: parseInt(process.env.NEXT_PUBLIC_DEFAULT_LIMIT || "1000"),
        commissionPct: 0.1,   // percent per fill (Binance spot taker)
        slippagePct: 0.05,    // percent per fill
    },

    // UI Configuration
    ui: {
        animationDuration: 300,
        chartHeight: 400,
        tablePageSize: 15,
    },

    // Trading Intervals
    intervals: [
        { value: "1m", label: "1 minute" },
        { value: "5m", label: "5 minutes" },
        { value: "15m", label: "15 minutes" },
        { value: "30m", label: "30 minutes" },
        { value: "1h", label: "1 hour" },
        { value: "4h", label: "4 hours" },
        { value: "1d", label: "1 day" },
        { value: "1w", label: "1 week" }
    ],

    // Popular Trading Symbols
    popularSymbols: [
        "BTCUSDT", "ETHUSDT", "SOLUSDT", "BNBUSDT", "XRPUSDT",
        "ADAUSDT", "DOGEUSDT", "AVAXUSDT", "LINKUSDT", "DOTUSDT"
    ],

    // Validation Rules
    validation: {
        minInitialCapital: 100,
        maxInitialCapital: 10000000,
        minRiskPerTrade: 0.1,
        maxRiskPerTrade: 10,
        minLimit: 100,
        maxLimit: 10000,
    },

    // Subscription plans (billing integration pending — UI + limits scaffold)
    plans: [
        {
            id: "free",
            name: "Free",
            price: 0,
            period: "forever",
            tagline: "For getting started",
            features: [
                "3 saved strategies",
                "1,000 candles per backtest",
                "Core performance metrics",
                "Binance market data",
            ],
            cta: "Start free",
            highlighted: false,
        },
        {
            id: "pro",
            name: "Pro",
            price: 29,
            period: "per month",
            tagline: "For serious strategy developers",
            features: [
                "Unlimited strategies",
                "10,000 candles per backtest",
                "Full analytics suite (Sortino, Calmar, expectancy…)",
                "Benchmark comparison & monthly returns",
                "Commission & slippage modeling",
                "Priority backtest queue",
            ],
            cta: "Upgrade to Pro",
            highlighted: true,
        },
        {
            id: "quant",
            name: "Quant",
            price: 99,
            period: "per month",
            tagline: "For teams and power users",
            features: [
                "Everything in Pro",
                "Multi-broker data (roadmap)",
                "Parameter optimization (roadmap)",
                "Portfolio backtests (roadmap)",
                "API access & CSV exports",
                "Dedicated support",
            ],
            cta: "Contact us",
            highlighted: false,
        },
    ],
};

export default config;
