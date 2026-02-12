import { Outlet, useLocation, matchPath } from "react-router-dom"
import { ScrollProgress } from "@/components/scroll-progress"
import { ScrollToTop } from "@/components/scroll-to-top"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"

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

  return (
    <div className="min-h-screen flex flex-col">
      <ScrollToTop />
      <ScrollProgress />
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      {isKnownRoute && <Footer />}
    </div>
  )
}
