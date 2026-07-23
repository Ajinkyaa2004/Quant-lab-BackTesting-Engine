import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
    "inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium transition-colors",
    {
        variants: {
            variant: {
                default:
                    "border-[rgba(99,102,241,0.3)] bg-[var(--accent-soft)] text-[var(--accent-hover)]",
                profit:
                    "border-[rgba(16,185,129,0.3)] bg-[var(--profit-soft)] text-[var(--profit-text)]",
                loss:
                    "border-[rgba(239,68,68,0.3)] bg-[var(--loss-soft)] text-[var(--loss-text)]",
                warning:
                    "border-[rgba(245,158,11,0.3)] bg-[var(--warning-soft)] text-[var(--warning)]",
                outline:
                    "border-[var(--border-strong)] text-[var(--text-secondary)]",
                secondary:
                    "border-transparent bg-[var(--surface-3)] text-[var(--text-secondary)]",
            },
        },
        defaultVariants: {
            variant: "default",
        },
    }
)

export interface BadgeProps
    extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> { }

function Badge({ className, variant, ...props }: BadgeProps) {
    return (
        <div className={cn(badgeVariants({ variant }), className)} {...props} />
    )
}

export { Badge, badgeVariants }
