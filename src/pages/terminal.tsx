import { useEffect } from "react"
import { TerminalOverlay } from "@/components/terminal/terminal-overlay"
import { useTerminalStore } from "@/stores/terminal-store"
import { usePageMeta } from "@/hooks/use-page-meta"

export default function TerminalPage() {
  usePageMeta({
    title: "PurbayanOS",
    description:
      "PurbayanOS — a developer portfolio disguised as a Linux terminal.",
  })

  const openTerminal = useTerminalStore((s) => s.openTerminal)
  const unlockKonami = useTerminalStore((s) => s.unlockKonami)
  const discoverTerminal = useTerminalStore((s) => s.discoverTerminal)

  useEffect(() => {
    unlockKonami()
    discoverTerminal()
    openTerminal()
  }, [openTerminal, unlockKonami, discoverTerminal])

  return (
    <>
      <div className="hidden md:block">
        <TerminalOverlay />
      </div>
      <div className="flex md:hidden min-h-screen items-center justify-center bg-background p-6">
        <p className="font-mono text-sm text-muted-foreground text-center leading-relaxed">
          PurbayanOS requires a keyboard.<br />
          Come back on desktop.
        </p>
      </div>
    </>
  )
}
