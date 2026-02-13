import { useEffect } from "react"
import { Outlet, useLocation, matchPath } from "react-router-dom"
import { ScrollProgress } from "@/components/scroll-progress"
import { ScrollToTop } from "@/components/scroll-to-top"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { TerminalOverlay } from "@/components/terminal/terminal-overlay"
import { useTerminalStore } from "@/stores/terminal-store"

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

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === "T") {
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
        <Outlet />
      </main>
      {isKnownRoute && <Footer />}
      <TerminalOverlay />
    </div>
  )
}
