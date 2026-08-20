import { cn } from "@/lib/utils"

interface SectionHeadProps {
  title: string
  /** Right-aligned meta, e.g. "Four roles · three companies". */
  note?: string
  className?: string
  as?: "h1" | "h2"
}

/**
 * Section title with a hairline rule beneath. No `>` prefix — the old terminal
 * motif is gone; hierarchy comes from type and the rule instead.
 */
export function SectionHead({ title, note, className, as = "h2" }: SectionHeadProps) {
  const Heading = as

  return (
    <header
      className={cn(
        "flex flex-wrap items-baseline justify-between gap-x-5 gap-y-2",
        "border-b border-line pb-4 mb-[clamp(28px,3.6vw,44px)]",
        className,
      )}
    >
      <Heading className="font-display text-[clamp(1.15rem,1.9vw,1.4rem)] font-semibold tracking-[-0.02em] [font-variation-settings:'wdth'_94]">
        {title}
      </Heading>
      {note && <span className="label-xs text-dim">{note}</span>}
    </header>
  )
}
