import type { ReactNode } from "react"
import { motion, useReducedMotion } from "motion/react"
import { EASE_BRAND_OUT } from "@/lib/animation"
import { cn } from "@/lib/utils"

interface LineRevealProps {
  /** Each entry becomes one masked line. */
  lines: ReactNode[]
  className?: string
  /** Seconds between each line. */
  stagger?: number
  baseDelay?: number
}

/**
 * Clip-masked per-line entrance: each line sits in an overflow-hidden box and
 * slides up from below its own baseline. Used for the hero headline.
 *
 * The lines are passed in pre-split rather than wrapped automatically, because
 * where a headline breaks is a typographic decision, not a layout accident.
 */
export function LineReveal({
  lines,
  className,
  stagger = 0.09,
  baseDelay = 0.06,
}: LineRevealProps) {
  const reduced = useReducedMotion()

  if (reduced) {
    return (
      <span className={cn("block", className)}>
        {lines.map((line, i) => (
          // eslint-disable-next-line react/no-array-index-key
          <span key={i} className="block">
            {line}
          </span>
        ))}
      </span>
    )
  }

  return (
    <span className={cn("block", className)}>
      {lines.map((line, i) => (
        // Lines are a fixed authored list, so index keys are stable here.
        // eslint-disable-next-line react/no-array-index-key
        <span key={i} className="block overflow-hidden pb-[0.06em] -mb-[0.06em]">
          <motion.span
            className="block"
            initial={{ y: "102%" }}
            animate={{ y: 0 }}
            transition={{ duration: 0.98, delay: baseDelay + i * stagger, ease: EASE_BRAND_OUT }}
          >
            {line}
          </motion.span>
        </span>
      ))}
    </span>
  )
}
