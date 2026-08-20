import { useRef, type ReactNode } from "react"
import { motion, useInView, useReducedMotion } from "motion/react"
import { EASE_BRAND } from "@/lib/animation"

interface RevealProps {
  children: ReactNode
  /** Stagger offset in seconds. */
  delay?: number
  className?: string
}

/**
 * Scroll-triggered rise. Replaces the old FadeUp — shorter travel (18px vs 24px)
 * and a longer, softer curve so the motion reads as calm rather than snappy.
 */
export function Reveal({ children, delay = 0, className }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: "0px 0px -6% 0px" })
  const reduced = useReducedMotion()

  // motion animates via inline styles, so the global prefers-reduced-motion CSS
  // rule cannot reach it — the component has to opt out itself.
  if (reduced) return <div className={className}>{children}</div>

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 18 }}
      animate={inView ? { opacity: 1, y: 0 } : undefined}
      transition={{ duration: 0.82, delay, ease: EASE_BRAND }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
