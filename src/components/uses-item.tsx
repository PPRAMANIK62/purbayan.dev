import type { ReactNode } from "react"

interface UsesItemProps {
  category: string
  tool: ReactNode
  note?: string
}

export function UsesItem({ category, tool, note }: UsesItemProps) {
  return (
    <div className="group flex items-baseline gap-4 py-2 px-3 -mx-3 rounded-md transition-colors duration-150 hover:bg-muted/50">
      <span className="text-muted-foreground font-mono text-sm w-32 shrink-0">{category}</span>
      <span className="font-mono text-foreground">{tool}</span>
      {note && (
        <span className="text-muted-foreground text-sm font-mono hidden sm:inline">— {note}</span>
      )}
    </div>
  )
}
