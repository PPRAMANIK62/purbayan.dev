import { useEffect, useRef, useState } from "react"
import { onInspectorToggle } from "@/lib/inspector"

/**
 * Identify an element the way devtools would. Deliberately no class name: every
 * class here is a Tailwind utility, so `div.mt-3.5` is noise where the tag and
 * the id carry the actual structure.
 */
function describe(el: Element): string {
  const tag = el.tagName.toLowerCase()
  if (el.id) return `${tag}#${el.id}`
  const slot = el.getAttribute("data-slot")
  return slot ? `${tag}[${slot}]` : tag
}

/** Ancestor chain, root-most first, capped so the bar never needs to scroll. */
function ancestry(el: Element): string[] {
  const chain: string[] = []
  let node: Element | null = el

  while (node && node !== document.body && chain.length < 5) {
    chain.unshift(describe(node))
    node = node.parentElement
  }

  return ["body", ...chain]
}

/**
 * Press `i` to overlay inspector chrome on the page — a nod to the element
 * inspector built at fiddle-factory, and the replacement for the old terminal
 * easter egg. Esc exits.
 */
export function InspectorMode() {
  const [on, setOn] = useState(false)
  const boxRef = useRef<HTMLDivElement>(null)
  const tagRef = useRef<HTMLSpanElement>(null)
  const pathRef = useRef<HTMLSpanElement>(null)
  const leafRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.metaKey || e.ctrlKey || e.altKey) return

      // Never steal the key while the user is typing (⌘K search, any input).
      const target = e.target as HTMLElement | null
      if (
        target &&
        (target.isContentEditable || /^(input|textarea|select)$/i.test(target.tagName))
      ) {
        return
      }

      if (e.key === "i" || e.key === "I") {
        e.preventDefault()
        setOn((prev) => !prev)
      } else if (e.key === "Escape") {
        setOn(false)
      }
    }

    window.addEventListener("keydown", onKeyDown)
    const offToggle = onInspectorToggle(() => setOn((prev) => !prev))

    return () => {
      window.removeEventListener("keydown", onKeyDown)
      offToggle()
    }
  }, [])

  // The picker cursor is a global CSS rule so it wins over per-element cursors.
  useEffect(() => {
    if (!on) return

    document.documentElement.dataset.inspector = "on"
    return () => {
      delete document.documentElement.dataset.inspector
    }
  }, [on])

  useEffect(() => {
    if (!on) return

    function onMove(e: MouseEvent) {
      const el = document.elementFromPoint(e.clientX, e.clientY)
      const box = boxRef.current
      const tag = tagRef.current
      if (!el || !box || !tag || el === document.body || el === document.documentElement) return

      const r = el.getBoundingClientRect()
      if (!r.width || !r.height) return

      box.style.transform = `translate(${r.left}px, ${r.top}px)`
      box.style.width = `${r.width}px`
      box.style.height = `${r.height}px`
      box.style.opacity = "1"
      tag.textContent = `${describe(el)}   ${Math.round(r.width)} × ${Math.round(r.height)}`
      tag.classList.toggle("top-full", r.top < 24)
      tag.classList.toggle("-top-5", r.top >= 24)

      // Written straight to the DOM, like the box above it — a per-frame React
      // render here would be doing state work for a cosmetic readout.
      const chain = ancestry(el)
      if (pathRef.current) pathRef.current.textContent = chain.slice(0, -1).join(" › ")
      if (leafRef.current) leafRef.current.textContent = chain[chain.length - 1]
    }

    window.addEventListener("mousemove", onMove, { passive: true })
    return () => window.removeEventListener("mousemove", onMove)
  }, [on])

  if (!on) return null

  return (
    <>
      <div className="pointer-events-none fixed inset-0 z-[90]" aria-hidden="true">
        <div
          ref={boxRef}
          className="absolute left-0 top-0 border border-brand bg-brand-wash opacity-0 transition-opacity duration-100"
        >
          <span
            ref={tagRef}
            className="absolute -left-px -top-5 whitespace-nowrap rounded-[3px] bg-brand px-1.5 py-0.5 text-[10.5px] font-semibold tracking-[0.03em] tabular-nums text-brand-ink"
          />
        </div>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-[91] flex items-center gap-x-3 border-t border-line bg-[rgba(var(--c-blur),0.92)] px-[14px] py-[9px] font-mono text-[11px] backdrop-blur-[10px]">
        <span className="shrink-0 font-medium tracking-[0.13em] text-brand">INSPECTOR</span>

        <span className="flex min-w-0 flex-1 items-center gap-1 text-faint">
          <span ref={pathRef} className="truncate" />
          <span aria-hidden="true" className="shrink-0">
            ›
          </span>
          <span ref={leafRef} className="shrink-0 text-ink" />
        </span>

        <span className="flex shrink-0 items-center gap-1.5 text-faint max-[640px]:hidden">
          <kbd className="rounded-[3px] border border-line-2 px-1.5 py-px font-mono text-[10px] text-dim">
            Esc
          </kbd>
          to exit
        </span>
      </div>
    </>
  )
}
