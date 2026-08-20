import { Outlet, useLocation } from "react-router-dom"
import { ScrollToTop } from "@/components/scroll-to-top"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { InspectorMode } from "@/components/inspector-mode"
import { ErrorBoundary } from "@/components/error-boundary"

/** Routes that render their own ending instead of the shared contact footer. */
const NO_FOOTER = ["/resume", "/404"]

export function Layout() {
  const location = useLocation()
  const showFooter = !NO_FOOTER.includes(location.pathname)

  return (
    <div className="flex min-h-screen flex-col">
      <ScrollToTop />
      <Navbar />
      <main className="flex-1">
        <ErrorBoundary resetKey={location.pathname}>
          <Outlet />
        </ErrorBoundary>
      </main>
      {showFooter && <Footer />}
      <InspectorMode />
    </div>
  )
}
