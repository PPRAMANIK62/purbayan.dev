import { useState } from "react"
import { Link, useLocation } from "react-router-dom"
import { Menu } from "lucide-react"
import { useScroll, useMotionValueEvent, motion } from "motion/react"
import { cn } from "@/lib/utils"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { CommandPalette } from "@/components/command-palette"

const navLinks = [
  { label: "projects", path: "/projects" },
  { label: "blog", path: "/blog" },
  { label: "uses", path: "/uses" },
  { label: "about", path: "/about" },
  { label: "vault", path: "/vault" },
] as const

function NavLink({
  to,
  active,
  children,
  onClick,
  variant = "desktop",
}: {
  to: string
  active: boolean
  children: React.ReactNode
  onClick?: () => void
  variant?: "desktop" | "mobile"
}) {
  if (variant === "mobile") {
    return (
      <Link
        to={to}
        onClick={onClick}
        className={cn(
          "block py-3 font-mono text-lg transition-colors duration-150",
          active ? "text-primary" : "text-muted-foreground hover:text-foreground",
        )}
      >
        {children}
      </Link>
    )
  }

  return (
    <Link
      to={to}
      onClick={onClick}
      className={cn(
        "group relative font-mono text-sm transition-colors duration-150",
        active ? "text-primary" : "text-muted-foreground hover:text-foreground",
      )}
    >
      {children}
      <span
        className={cn(
          "absolute -bottom-1 left-0 h-px w-full origin-left transition-transform duration-150",
          active ? "scale-x-100 bg-primary" : "scale-x-0 bg-foreground group-hover:scale-x-100",
        )}
      />
    </Link>
  )
}

export function Navbar() {
  const [commandOpen, setCommandOpen] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const location = useLocation()
  const { scrollY } = useScroll()

  useMotionValueEvent(scrollY, "change", (latest) => {
    setScrolled(latest > 80)
  })

  return (
    <>
      <motion.header
        className={cn(
          "fixed top-0 w-full z-50 h-16 flex items-center justify-between px-6 md:px-8 transition-colors duration-300",
          scrolled
            ? "bg-background/80 backdrop-blur-md border-b border-border/50"
            : "bg-transparent",
        )}
      >
        <Link
          to="/"
          className="font-mono font-bold text-lg text-foreground hover:text-primary transition-colors duration-150"
        >
          Purbayan
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <NavLink key={link.path} to={link.path} active={location.pathname === link.path}>
              {link.label}
            </NavLink>
          ))}

          <button
            type="button"
            onClick={() => setCommandOpen(true)}
            className="border border-border/50 text-muted-foreground text-xs font-mono px-2 py-1 rounded-md hover:text-primary hover:border-primary/50 transition-colors duration-150 active:scale-[0.98] active:duration-[50ms]"
          >
            ⌘K
          </button>
        </nav>

        <button
          type="button"
          onClick={() => setMobileOpen(true)}
          className="md:hidden text-muted-foreground hover:text-foreground transition-colors duration-150 active:scale-[0.98] active:duration-[50ms]"
          aria-label="Open navigation menu"
        >
          <Menu className="size-5" />
        </button>
      </motion.header>

      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="right" className="w-72">
          <SheetHeader>
            <SheetTitle className="sr-only">Navigation</SheetTitle>
          </SheetHeader>
          <nav className="flex flex-col px-2 pt-4">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                active={location.pathname === link.path}
                onClick={() => setMobileOpen(false)}
                variant="mobile"
              >
                {link.label}
              </NavLink>
            ))}
            <div className="mt-4 border-t border-border/50 pt-4">
              <button
                type="button"
                onClick={() => {
                  setMobileOpen(false)
                  setCommandOpen(true)
                }}
                className="flex items-center gap-2 font-mono text-sm text-muted-foreground hover:text-foreground transition-colors duration-150"
              >
                <span className="border border-border/50 text-xs px-2 py-0.5 rounded-md">⌘K</span>
                <span>Command palette</span>
              </button>
            </div>
          </nav>
        </SheetContent>
      </Sheet>

      <CommandPalette open={commandOpen} onOpenChange={setCommandOpen} />
    </>
  )
}
