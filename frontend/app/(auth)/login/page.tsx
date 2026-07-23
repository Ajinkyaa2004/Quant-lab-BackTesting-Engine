"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import api from "@/lib/api";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle, CheckCircle2, ArrowRight } from "lucide-react";

function LoginForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const justRegistered = searchParams.get("registered") === "true";

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const response = await api.post("/auth/login", { email, password });
            localStorage.setItem("token", response.data.access_token);
            router.push("/dashboard");
        } catch (err: unknown) {
            if (axios.isAxiosError(err) && err.response) {
                setError(err.response.data.detail || "Invalid email or password");
            } else {
                setError("Connection error. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="animate-fade-in">
            <h1 className="text-2xl font-bold tracking-tight">Welcome back</h1>
            <p className="mt-1.5 text-sm text-[var(--text-secondary)]">
                Sign in to your workspace to continue your research.
            </p>

            <form onSubmit={handleLogin} className="mt-8 space-y-5">
                {justRegistered && !error && (
                    <div className="flex items-center gap-2 rounded-lg border border-[rgba(16,185,129,0.25)] bg-[var(--profit-soft)] p-3 text-sm text-[var(--profit-text)]">
                        <CheckCircle2 className="h-4 w-4 shrink-0" />
                        Account created — sign in to get started.
                    </div>
                )}
                {error && (
                    <div className="flex items-center gap-2 rounded-lg border border-[rgba(239,68,68,0.25)] bg-[var(--loss-soft)] p-3 text-sm text-[var(--loss-text)]">
                        <AlertCircle className="h-4 w-4 shrink-0" />
                        {error}
                    </div>
                )}
                <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                        id="email"
                        type="email"
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        autoComplete="email"
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                        id="password"
                        type="password"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        autoComplete="current-password"
                    />
                </div>
                <Button type="submit" className="w-full" size="lg" disabled={loading}>
                    {loading ? "Signing in…" : "Sign in"}
                    {!loading && <ArrowRight className="ml-2 h-4 w-4" />}
                </Button>
            </form>

            <p className="mt-8 text-center text-sm text-[var(--text-secondary)]">
                New to QuantLab?{" "}
                <Link href="/register" className="font-medium text-[var(--accent-hover)] hover:underline">
                    Create a free account
                </Link>
            </p>
        </div>
    );
}

export default function LoginPage() {
    return (
        <Suspense>
            <LoginForm />
        </Suspense>
    );
}
