import { useEffect } from "react"
import { FileText, Terminal } from "lucide-react"
import { cn } from "@/lib/utils"
import type { ViewMode } from "@/pages/vault"

const modes = [
  { key: "redacted" as const, label: "Redacted", icon: FileText, shortcut: "1" },
  { key: "terminal" as const, label: "Terminal", icon: Terminal, shortcut: "2" },
]

interface VaultModeSwitcherProps {
  mode: ViewMode
  onModeChange: (mode: ViewMode) => void
}

export function VaultModeSwitcher({ mode, onModeChange }: VaultModeSwitcherProps) {
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      const tag = (e.target as HTMLElement).tagName
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return

      const match = modes.find((m) => m.shortcut === e.key)
      if (match) onModeChange(match.key)
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [onModeChange])

  return (
    <div className="inline-flex rounded-lg border border-border bg-muted/30 p-1">
      {modes.map((m) => (
        <button
          key={m.key}
          type="button"
          onClick={() => onModeChange(m.key)}
          className={cn(
            "px-3 py-1.5 rounded-md font-mono text-xs transition-colors inline-flex items-center",
            mode === m.key
              ? "bg-primary/10 text-primary"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          <m.icon className="size-3.5 md:mr-1.5" />
          <span className="hidden md:inline">{m.label}</span>
        </button>
      ))}
    </div>
  )
}
