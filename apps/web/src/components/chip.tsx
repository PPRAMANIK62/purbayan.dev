import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

interface ChipProps {
  children: ReactNode
  /** `stat` fills with the accent wash — reserve it for one number per group. */
  variant?: "default" | "stat"
  className?: string
}

export function Chip({ children, variant = "default", className }: ChipProps) {
  return (
    <span
      className={cn(
        "inline-block rounded-full px-[9px] py-[3px] text-xs tracking-[0.02em]",
        variant === "stat" ? "bg-brand-wash text-brand font-medium" : "border border-line text-dim",
        className,
      )}
    >
      {children}
    </span>
  )
}
