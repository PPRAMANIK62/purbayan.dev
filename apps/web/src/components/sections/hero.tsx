import { useRef } from "react"
import { motion, useReducedMotion } from "motion/react"
import { EASE_BRAND } from "@/lib/animation"
import { Container } from "@/components/container"
import { HeroCanvas } from "@/components/hero-canvas"
import { LineReveal } from "@/components/line-reveal"

const LEDE = [
  {
    text: "Full-stack engineer based out of Kolkata, India. This year I've built ",
  },
  {
    text: "a canvas rendering system, storyboard tools for an AI film studio, and an open-source component registry",
    strong: true,
  },
  {
    text: ". I write the backend behind them too, and when I want to know how something works underneath, I build something small in Rust or C.",
  },
] as const

const META = ["Graduated 2026", "React & TypeScript", "Canvas & rendering", "Open to new roles"]

/**
 * Splits the lede into words so they can light up in sequence.
 * This runs on load rather than on scroll: the lede sits above the fold, and
 * scroll-linking left it partly faded at rest, which reads as a bug.
 */
function useLedeWords() {
  return LEDE.flatMap((part, partIndex) =>
    part.text.split(/(\s+)/).map((token, i) => ({
      token,
      strong: "strong" in part && part.strong === true,
      key: `${partIndex}-${i}`,
    })),
  )
}

export function Hero() {
  const surfaceRef = useRef<HTMLElement>(null)
  const words = useLedeWords()
  const reduced = useReducedMotion()
  let wordIndex = 0

  return (
    <section
      ref={surfaceRef}
      className="relative flex min-h-[clamp(600px,94vh,900px)] items-center pt-[70px] max-[520px]:min-h-0 max-[520px]:pb-20 max-[520px]:pt-[120px]"
    >
      <HeroCanvas surfaceRef={surfaceRef} />

      <Container className="relative z-[2]">
        <h1 className="max-w-[15ch] font-display text-[clamp(2.5rem,7vw,5.4rem)] font-semibold leading-[1.03] tracking-[-0.032em] [font-variation-settings:'wdth'_96,'opsz'_84] max-[860px]:max-w-none">
          <LineReveal
            lines={[
              "I build the part",
              "of the product",
              <>
                people actually <span className="text-brand">touch</span>.
              </>,
            ]}
          />
        </h1>

        <p className="mt-[clamp(26px,3.4vw,40px)] max-w-[54ch] text-[clamp(16px,1.1vw,17.5px)] leading-[1.72] text-dim">
          {words.map((w) => {
            if (!w.token.trim()) return <span key={w.key}>{w.token}</span>
            const delay = 0.62 + wordIndex * 0.016
            wordIndex += 1
            return (
              <motion.span
                key={w.key}
                initial={reduced ? false : { opacity: 0.17 }}
                animate={{ opacity: 1 }}
                transition={reduced ? { duration: 0 } : { duration: 0.2, delay, ease: "linear" }}
                className={w.strong ? "font-medium text-ink" : undefined}
              >
                {w.token}
              </motion.span>
            )
          })}
        </p>

        <motion.ul
          initial={reduced ? false : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={reduced ? { duration: 0 } : { duration: 0.8, delay: 0.9, ease: EASE_BRAND }}
          className="mt-[clamp(34px,4.4vw,52px)] flex flex-wrap items-center gap-y-2.5 gap-x-[clamp(16px,2.4vw,26px)]"
        >
          {META.map((item, i) => (
            <li key={item} className="relative label-xs text-dim">
              {i > 0 && (
                <span
                  aria-hidden="true"
                  className="absolute -left-[clamp(8px,1.2vw,13px)] top-1/2 hidden size-[3px] -translate-y-1/2 rounded-full bg-faint sm:block"
                />
              )}
              {item}
            </li>
          ))}
        </motion.ul>
      </Container>
    </section>
  )
}
