import { useEffect } from "react"
import { useLocation } from "react-router-dom"

/**
 * Resets scroll on navigation — but honours `#section` links so the navbar's
 * /#work and /#projects entries land where they should.
 */
export function ScrollToTop() {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    if (hash) {
      // The target section may mount in the same frame as this effect.
      const raf = requestAnimationFrame(() => {
        const el = document.querySelector(hash)
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "start" })
        } else {
          window.scrollTo(0, 0)
        }
      })
      return () => cancelAnimationFrame(raf)
    }

    window.scrollTo(0, 0)
  }, [pathname, hash])

  return null
}
