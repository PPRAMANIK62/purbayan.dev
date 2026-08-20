import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { Menu, Search } from "lucide-react"
import { useScroll, useMotionValueEvent } from "motion/react"
import { cn } from "@/lib/utils"
import { Container } from "@/components/container"
import { CommandPalette } from "@/components/command-palette"
import { MobileMenu } from "@/components/mobile-menu"

const navLinks = [
  { label: "Work", to: "/#work" },
  { label: "Projects", to: "/#projects" },
  { label: "Writing", to: "/blog" },
  { label: "Uses", to: "/uses" },
] as const

export function Navbar() {
  const [commandOpen, setCommandOpen] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [stuck, setStuck] = useState(false)
  const { scrollY } = useScroll()

  useMotionValueEvent(scrollY, "change", (latest) => setStuck(latest > 24))

  // Close the mobile sheet if the viewport grows past the breakpoint.
  useEffect(() => {
    const mq = matchMedia("(min-width: 768px)")
    const onChange = () => mq.matches && setMobileOpen(false)
    mq.addEventListener("change", onChange)
    return () => mq.removeEventListener("change", onChange)
  }, [])

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 flex h-[70px] items-center">
        {/* Progressive blur: a masked gradient rather than a hard border. */}
        <div
          aria-hidden="true"
          className={cn(
            "absolute inset-0 -z-10 backdrop-blur-[14px] transition-opacity duration-[420ms]",
            "bg-[linear-gradient(to_bottom,rgba(var(--c-blur),0.86),rgba(var(--c-blur),0.55)_62%,rgba(var(--c-blur),0))]",
            "[mask-image:linear-gradient(to_bottom,#000_52%,transparent)]",
            "[-webkit-mask-image:linear-gradient(to_bottom,#000_52%,transparent)]",
            stuck ? "opacity-100" : "opacity-0",
          )}
        />

        <Container className="flex items-center justify-between gap-4">
          <Link
            to="/"
            className="font-display text-base font-semibold tracking-[-0.02em] [font-variation-settings:'wdth'_92]"
          >
            Purbayan Pramanik
          </Link>

          <nav className="hidden items-center gap-[clamp(14px,2.4vw,30px)] md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="text-[13.5px] text-dim transition-colors duration-[260ms] hover:text-ink"
              >
                {link.label}
              </Link>
            ))}

            <button
              type="button"
              onClick={() => setCommandOpen(true)}
              aria-label="Open command palette"
              className="group inline-flex items-center gap-2 rounded-full border border-line py-1 pl-3 pr-1.5 text-[13px] text-faint transition-colors duration-[260ms] hover:border-line-2 hover:text-dim"
            >
              <Search className="size-3.5" />
              <kbd className="inline-flex h-[19px] items-center rounded-full border border-line px-1.5 font-sans text-[10.5px] text-faint transition-colors duration-[260ms] group-hover:text-dim">
                ⌘K
              </kbd>
            </button>
          </nav>

          <div className="flex items-center gap-3 md:hidden">
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              aria-label="Open navigation menu"
              className="text-dim transition-colors duration-150 hover:text-ink"
            >
              <Menu className="size-5" />
            </button>
          </div>
        </Container>
      </header>

      <MobileMenu
        open={mobileOpen}
        onOpenChange={setMobileOpen}
        links={navLinks}
        // Both are Radix dialogs. Opening the palette in the same tick as the
        // sheet closes races their scroll locks and can leave the body with
        // pointer-events: none, so wait out the sheet's 180ms close.
        onSearch={() => {
          setMobileOpen(false)
          window.setTimeout(() => setCommandOpen(true), 200)
        }}
      />

      <CommandPalette open={commandOpen} onOpenChange={setCommandOpen} />
    </>
  )
}
