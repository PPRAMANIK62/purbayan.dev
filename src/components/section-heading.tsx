import { cn } from "@/lib/utils"

interface HeadingProps {
  title: string
  className?: string
}

export function PageHeading({ title, className }: HeadingProps) {
  return (
    <h1
      className={cn(
        "text-3xl font-mono font-bold flex items-baseline",
        className,
      )}
    >
      <span className="text-muted-foreground mr-2">&gt;</span>
      {title}
    </h1>
  )
}

export function SectionHeading({ title, className }: HeadingProps) {
  return (
    <h2
      className={cn(
        "text-2xl font-mono font-semibold flex items-baseline",
        className,
      )}
    >
      <span className="text-muted-foreground mr-2">&gt;</span>
      {title}
    </h2>
  )
}
