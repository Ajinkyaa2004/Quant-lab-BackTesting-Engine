"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import StrategyTemplates, { StrategyTemplate, CUSTOM_TEMPLATE } from "@/components/ui/strategy-templates";
import Editor from "@monaco-editor/react";
import { ArrowLeft, Save, AlertCircle, Lightbulb } from "lucide-react";
import Link from "next/link";

export default function NewStrategyPage() {
    const router = useRouter();
    const [step, setStep] = useState<"template" | "code">("template");
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [className, setClassName] = useState("MyStrategy");
    const [code, setCode] = useState(CUSTOM_TEMPLATE.code);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [selectedTemplate, setSelectedTemplate] = useState<StrategyTemplate | null>(null);

    const handleTemplateSelect = (template: StrategyTemplate) => {
        setSelectedTemplate(template);
        setName(template.id === "custom" ? "" : template.name);
        setDescription(template.description);
        setClassName(template.className);
        setCode(template.code);
        setStep("code");
    };

    const handleSave = async () => {
        if (!name || !className || !code) {
            setError("Name, class name and code are required.");
            return;
        }
        setError("");
        setLoading(true);
        try {
            await api.post("/strategies/upload", {
                name,
                description,
                class_name: className,
                code,
            });
            router.push("/strategies");
        } catch (err: unknown) {
            if (axios.isAxiosError(err) && err.response) {
                setError(err.response.data.detail || "Failed to save strategy.");
            } else {
                setError("Connection error.");
            }
        } finally {
            setLoading(false);
        }
    };

    if (step === "template") {
        return (
            <div className="animate-fade-in space-y-6">
                <div className="flex items-center gap-4">
                    <Link href="/strategies">
                        <Button variant="outline" size="icon">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight">Choose a starting point</h2>
                        <p className="mt-1 text-sm text-[var(--text-secondary)]">
                            Battle-tested templates you can customize, or a blank scaffold.
                        </p>
                    </div>
                </div>
                <StrategyTemplates onSelectTemplate={handleTemplateSelect} />
            </div>
        );
    }

    return (
        <div className="animate-fade-in flex h-[calc(100vh-8.5rem)] flex-col space-y-4">
            {/* Header */}
            <div className="flex shrink-0 flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-4">
                    <Button variant="outline" size="icon" onClick={() => setStep("template")}>
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <div>
                        <div className="flex items-center gap-2.5">
                            <h2 className="text-xl font-bold tracking-tight">
                                {selectedTemplate && selectedTemplate.id !== "custom" ? selectedTemplate.name : "Custom strategy"}
                            </h2>
                            {selectedTemplate && selectedTemplate.id !== "custom" && (
                                <Badge>Template</Badge>
                            )}
                        </div>
                        <p className="text-xs text-[var(--text-muted)]">
                            Code is validated server-side before saving.
                        </p>
                    </div>
                </div>
                <Button onClick={handleSave} disabled={loading}>
                    <Save className="mr-1.5 h-4 w-4" />
                    {loading ? "Validating…" : "Save strategy"}
                </Button>
            </div>

            {error && (
                <div className="flex shrink-0 items-center gap-2 rounded-lg border border-[rgba(239,68,68,0.25)] bg-[var(--loss-soft)] p-3 text-sm text-[var(--loss-text)]">
                    <AlertCircle className="h-4 w-4 shrink-0" />
                    {error}
                </div>
            )}

            <div className="grid min-h-0 flex-1 gap-4 lg:grid-cols-4">
                {/* Metadata */}
                <div className="panel h-fit space-y-4 p-5">
                    <div className="space-y-2">
                        <Label htmlFor="name">Strategy name *</Label>
                        <Input
                            id="name"
                            placeholder="e.g. BTC Trend Rider"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="className">Python class name *</Label>
                        <Input
                            id="className"
                            className="num"
                            placeholder="MyStrategy"
                            value={className}
                            onChange={(e) => setClassName(e.target.value)}
                        />
                        <p className="flex items-center gap-1.5 text-xs text-[var(--text-muted)]">
                            <Lightbulb className="h-3 w-3" />
                            Must match the class in your code
                        </p>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <textarea
                            id="description"
                            className="flex min-h-[110px] w-full resize-none rounded-lg border border-[var(--border)] bg-[var(--surface-2)] px-3 py-2 text-sm text-[var(--text-primary)] transition-colors placeholder:text-[var(--text-muted)] hover:border-[var(--border-strong)] focus-visible:border-[var(--accent)] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--accent)]"
                            placeholder="What edge does this strategy capture?"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </div>
                    <div className="rounded-lg border border-[var(--border)] bg-[var(--surface-2)] p-3 text-xs leading-relaxed text-[var(--text-muted)]">
                        Your <code className="num text-[var(--accent-hover)]">on_candle()</code> receives each candle and
                        returns an order dict — <code className="num">BUY</code>, <code className="num">SELL</code>,{" "}
                        <code className="num">CLOSE</code>, <code className="num">CLOSE_ALL</code> — with optional stops,
                        targets and trailing stops.
                    </div>
                </div>

                {/* Editor */}
                <div className="panel flex min-h-[440px] flex-col overflow-hidden lg:col-span-3">
                    <div className="flex items-center justify-between border-b border-[var(--border)] bg-[var(--surface-2)] px-4 py-2.5">
                        <div className="flex items-center gap-3">
                            <div className="flex items-center gap-1.5">
                                <span className="h-2.5 w-2.5 rounded-full bg-[#f87171]" />
                                <span className="h-2.5 w-2.5 rounded-full bg-[#fbbf24]" />
                                <span className="h-2.5 w-2.5 rounded-full bg-[#34d399]" />
                            </div>
                            <span className="num text-xs text-[var(--text-secondary)]">strategy.py</span>
                        </div>
                        <span className="text-xs text-[var(--text-muted)]">Python</span>
                    </div>
                    <div className="min-h-0 flex-1">
                        <Editor
                            height="100%"
                            defaultLanguage="python"
                            value={code}
                            onChange={(value) => setCode(value || "")}
                            theme="vs-dark"
                            options={{
                                minimap: { enabled: false },
                                fontSize: 13,
                                fontFamily: "var(--font-geist-mono), ui-monospace, monospace",
                                scrollBeyondLastLine: false,
                                automaticLayout: true,
                                lineNumbers: "on",
                                wordWrap: "on",
                                folding: true,
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
