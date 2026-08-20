import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

interface ContainerProps {
  children: ReactNode
  className?: string
}

/** The single page measure: 1160px with fluid gutters. */
export function Container({ children, className }: ContainerProps) {
  return (
    <div className={cn("mx-auto w-full max-w-[1160px] px-[clamp(20px,5vw,72px)]", className)}>
      {children}
    </div>
  )
}
