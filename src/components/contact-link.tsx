import type { LucideIcon } from "lucide-react"
import { ArrowRight } from "lucide-react"

interface ContactLinkProps {
  href: string
  label: string
  display: string
  icon: LucideIcon
  external?: boolean
}

export function ContactLink({
  href,
  label,
  display,
  icon: Icon,
  external = false,
}: ContactLinkProps) {
  return (
    <a
      href={href}
      className="group flex items-center gap-4 p-4 rounded-lg hover:bg-muted transition-colors duration-150"
      {...(external && {
        target: "_blank",
        rel: "noopener noreferrer",
      })}
    >
      <Icon className="size-5 text-primary shrink-0" />
      <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2 min-w-0">
        <span className="font-mono font-medium text-foreground">{label}</span>
        <span className="text-sm text-muted-foreground truncate">{display}</span>
      </div>
      <ArrowRight className="size-4 text-muted-foreground ml-auto shrink-0 group-hover:translate-x-1 transition-transform duration-150" />
    </a>
  )
}
