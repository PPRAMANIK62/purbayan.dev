import { cn } from "@/lib/utils"

interface PageContainerProps {
  children: React.ReactNode
  maxWidth?: "3xl" | "6xl"
  className?: string
}

const maxWidthMap = {
  "3xl": "max-w-3xl",
  "6xl": "max-w-6xl",
} as const

export function PageContainer({
  children,
  maxWidth = "3xl",
  className,
}: PageContainerProps) {
  return (
    <div
      className={cn(maxWidthMap[maxWidth], "mx-auto px-6 py-24", className)}
    >
      {children}
    </div>
  )
}
