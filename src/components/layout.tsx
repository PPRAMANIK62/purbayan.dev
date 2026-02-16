import { useEffect, useState } from "react"
import { Outlet, useLocation, matchPath } from "react-router-dom"
import { ScrollProgress } from "@/components/scroll-progress"
import { ScrollToTop } from "@/components/scroll-to-top"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { TerminalOverlay } from "@/components/terminal/terminal-overlay"
import { CrtGlitch } from "@/components/terminal/crt-glitch"
import { ErrorBoundary } from "@/components/error-boundary"
import { useTerminalStore } from "@/stores/terminal-store"
import { useKonamiCode } from "@/hooks/use-konami-code"

const knownRoutes = [
  "/",
  "/about",
  "/projects",
  "/projects/:slug",
  "/uses",
  "/blog",
  "/blog/:slug",
]

export function Layout() {
  const location = useLocation()
  const isKnownRoute = knownRoutes.some((pattern) =>
    matchPath(pattern, location.pathname),
  )
  const openTerminal = useTerminalStore((s) => s.openTerminal)
  const unlockKonami = useTerminalStore((s) => s.unlockKonami)
  const konamiUnlocked = useTerminalStore((s) => s.konamiUnlocked)
  const [glitchTrigger, setGlitchTrigger] = useState(false)

  useKonamiCode(() => {
    if (!konamiUnlocked) unlockKonami()
    setGlitchTrigger(true)
    // Small delay so glitch plays before terminal opens
    setTimeout(() => openTerminal(), 200)
  })

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.code === "Backquote") {
        e.preventDefault()
        openTerminal()
      }
    }
    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  }, [openTerminal])

  return (
    <div className="min-h-screen flex flex-col">
      <ScrollToTop />
      <ScrollProgress />
      <Navbar />
      <main className="flex-1">
        <ErrorBoundary resetKey={location.pathname}>
          <Outlet />
        </ErrorBoundary>
      </main>
      {isKnownRoute && <Footer />}
      <TerminalOverlay />
      <CrtGlitch trigger={glitchTrigger} onComplete={() => setGlitchTrigger(false)} />
    </div>
  )
}
