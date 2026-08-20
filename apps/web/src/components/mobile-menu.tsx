import { useRef } from "react"
import { Link, useLocation } from "react-router-dom"
import { ArrowUpRight, Search, X } from "lucide-react"
import { motion, useReducedMotion } from "motion/react"
import { EASE_BRAND_OUT } from "@/lib/animation"
import { SOCIAL } from "@/data/social-links"
import { cn } from "@/lib/utils"
import { Sheet, SheetContent, SheetDescription, SheetTitle } from "@/components/ui/sheet"

interface MenuLink {
  label: string
  to: string
}

interface MobileMenuProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  links: readonly MenuLink[]
  onSearch: () => void
}

const SOCIALS = [SOCIAL.github, SOCIAL.linkedin, SOCIAL.x] as const

/**
 * A full-bleed index rather than a drawer. The partial-width sheet left a dead
 * strip of blurred page on one side and half a screen of empty space below the
 * links; at this type size the menu earns the whole viewport instead.
 */
export function MobileMenu({ open, onOpenChange, links, onSearch }: MobileMenuProps) {
  const panelRef = useRef<HTMLDivElement>(null)
  const { pathname } = useLocation()
  const reduced = useReducedMotion()

  const rows = [...links, { label: "Resume", to: "/resume" }]

  /** Hash links all point at the home page, so only real routes can be current. */
  const isCurrent = (to: string) => !to.includes("#") && pathname.startsWith(to)

  const rise = (index: number) =>
    reduced
      ? {}
      : {
          initial: { opacity: 0, y: 14 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.5, delay: 0.06 + index * 0.045, ease: EASE_BRAND_OUT },
        }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        showCloseButton={false}
        // Radix focuses the first tabbable child on open, and programmatic focus
        // matches :focus-visible — which painted the global lime ring around the
        // close button every time the menu opened. Focus the panel instead: the
        // trap still holds, nothing looks pre-selected.
        onOpenAutoFocus={(event) => {
          event.preventDefault()
          panelRef.current?.focus()
        }}
        className="w-full border-l-0 bg-ground sm:max-w-none"
      >
        <SheetTitle className="sr-only">Navigation</SheetTitle>
        <SheetDescription className="sr-only">Site sections and contact links</SheetDescription>

        <div
          ref={panelRef}
          tabIndex={-1}
          className="flex h-full flex-col px-[22px] pb-[max(26px,env(safe-area-inset-bottom))] pt-[max(18px,env(safe-area-inset-top))] outline-none"
        >
          <div className="flex items-center justify-between">
            <span className="label-xs text-faint">Index</span>
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              aria-label="Close navigation menu"
              className="grid size-9 place-items-center rounded-full border border-line text-dim transition-colors duration-[260ms] active:border-line-2 active:text-ink"
            >
              <X className="size-4" />
            </button>
          </div>

          <motion.button
            {...rise(0)}
            type="button"
            onClick={onSearch}
            className="mt-6 flex w-full items-center gap-2.5 rounded-full border border-line px-4 py-2.5 text-[14px] text-faint transition-colors duration-[260ms] active:border-line-2 active:text-dim"
          >
            <Search className="size-4" />
            Search the site
          </motion.button>

          <nav className="mt-7">
            {rows.map((link, i) => {
              const current = isCurrent(link.to)

              return (
                <motion.div key={link.to} {...rise(i + 1)}>
                  <Link
                    to={link.to}
                    onClick={() => onOpenChange(false)}
                    aria-current={current ? "page" : undefined}
                    className="group grid grid-cols-[auto_minmax(0,1fr)_auto] items-baseline gap-x-4 border-b border-line py-[18px]"
                  >
                    <span
                      className={cn("label-xs tabular-nums", current ? "text-brand" : "text-faint")}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span
                      className={cn(
                        "font-display text-[clamp(2rem,10vw,3rem)] font-semibold leading-[1.05] tracking-[-0.032em] [font-variation-settings:'wdth'_94] transition-colors duration-[260ms]",
                        current ? "text-brand" : "text-ink",
                      )}
                    >
                      {link.label}
                    </span>
                    <ArrowUpRight
                      aria-hidden="true"
                      className={cn(
                        "size-4 self-center transition-all duration-[380ms] ease-brand",
                        current
                          ? "text-brand"
                          : "text-faint group-active:-translate-y-0.5 group-active:translate-x-0.5 group-active:text-brand",
                      )}
                    />
                  </Link>
                </motion.div>
              )
            })}
          </nav>

          <motion.div {...rise(rows.length + 1)} className="mt-auto pt-10">
            <span className="label-xs text-faint">Get in touch</span>

            <a
              href={SOCIAL.email.url}
              className="mt-3 block break-words font-display text-[clamp(1.1rem,5.2vw,1.5rem)] font-medium tracking-[-0.02em] text-ink transition-colors duration-[260ms] active:text-brand"
            >
              {SOCIAL.email.display}
            </a>

            <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2.5">
              {SOCIALS.map((social) => (
                <a
                  key={social.label}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="label-xs text-dim transition-colors duration-[260ms] active:text-brand"
                >
                  {social.label}
                </a>
              ))}
            </div>

            <div className="mt-7 flex items-center justify-between gap-4 border-t border-line pt-4 text-[12px] text-faint">
              <span className="inline-flex items-center gap-2">
                <span aria-hidden="true" className="relative grid size-1.5 place-items-center">
                  <span className="absolute size-1.5 rounded-full bg-brand" />
                  <span className="absolute size-1.5 animate-ping rounded-full bg-brand opacity-60" />
                </span>
                Open to new roles
              </span>
              <span>Kolkata · IST</span>
            </div>
          </motion.div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
