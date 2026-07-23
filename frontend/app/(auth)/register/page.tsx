"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle, ArrowRight } from "lucide-react";

export default function RegisterPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }
        if (password.length < 8) {
            setError("Password must be at least 8 characters");
            return;
        }

        setLoading(true);
        try {
            await api.post("/auth/register", { email, password });
            router.push("/login?registered=true");
        } catch (err: unknown) {
            if (axios.isAxiosError(err) && err.response) {
                setError(err.response.data.detail || "Registration failed");
            } else {
                setError("Connection error. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="animate-fade-in">
            <h1 className="text-2xl font-bold tracking-tight">Create your account</h1>
            <p className="mt-1.5 text-sm text-[var(--text-secondary)]">
                Free forever plan. Start backtesting in under a minute.
            </p>

            <form onSubmit={handleRegister} className="mt-8 space-y-5">
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
                        placeholder="At least 8 characters"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        autoComplete="new-password"
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm password</Label>
                    <Input
                        id="confirmPassword"
                        type="password"
                        placeholder="••••••••"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        autoComplete="new-password"
                    />
                </div>
                <Button type="submit" className="w-full" size="lg" disabled={loading}>
                    {loading ? "Creating account…" : "Create free account"}
                    {!loading && <ArrowRight className="ml-2 h-4 w-4" />}
                </Button>
                <p className="text-center text-xs leading-relaxed text-[var(--text-muted)]">
                    Simulation platform only — no live trading, no real funds.
                </p>
            </form>

            <p className="mt-8 text-center text-sm text-[var(--text-secondary)]">
                Already have an account?{" "}
                <Link href="/login" className="font-medium text-[var(--accent-hover)] hover:underline">
                    Sign in
                </Link>
            </p>
        </div>
    );
}
