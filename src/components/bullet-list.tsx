import type { ReactNode } from "react"

interface BulletListProps {
  items: ReactNode[]
  bullet?: string
  className?: string
}

export function BulletList({
  items,
  bullet = "\u00b7",
  className,
}: BulletListProps) {
  return (
    <ul className={className ?? "space-y-3 mt-4"}>
      {items.map((item, i) => (
        <li
          key={i}
          className="text-secondary-foreground leading-relaxed flex items-start"
        >
          <span className="text-primary mr-2 mt-1">{bullet}</span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  )
}
