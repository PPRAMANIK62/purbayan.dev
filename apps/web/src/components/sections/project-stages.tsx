import { useRef, type ReactNode } from "react"
import { motion, useInView, useReducedMotion } from "motion/react"
import { EASE_BRAND_OUT } from "@/lib/animation"

function Stage({
  label,
  bleed = false,
  children,
}: {
  label: string
  /** Screenshots run edge to edge; drawn stages sit inside the padded well. */
  bleed?: boolean
  children: ReactNode
}) {
  return (
    <figure className="relative aspect-[4/3] overflow-hidden rounded-[10px] border border-line bg-raise">
      <div className="flex h-[34px] items-center gap-1.5 border-b border-line bg-sink px-3">
        <span aria-hidden="true" className="size-[7px] rounded-full bg-line-2" />
        <span aria-hidden="true" className="size-[7px] rounded-full bg-line-2" />
        <span aria-hidden="true" className="size-[7px] rounded-full bg-line-2" />
        <span className="ml-1.5 text-[11px] tracking-[0.04em] text-faint">{label}</span>
      </div>
      <div
        className={`absolute inset-x-0 bottom-0 top-[34px] ${
          bleed ? "" : "grid place-items-center p-[18px]"
        }`}
      >
        {children}
      </div>
    </figure>
  )
}

/** A real screenshot inside the shared frame — used when a project has one. */
export function ShotStage({ src, alt, label }: { src: string; alt: string; label: string }) {
  return (
    <Stage label={label} bleed>
      <img
        src={src}
        alt={alt}
        loading="lazy"
        decoding="async"
        width={1600}
        height={1200}
        className="size-full object-cover object-left-top"
      />
    </Stage>
  )
}

/** canvas-kit — layers separating, mirroring what the project actually does. */
export function LayersStage() {
  const ref = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()
  const inView = useInView(ref, { once: true, margin: "0px 0px -12% 0px" }) || reduced

  // Ordered back-to-front. Heights are kept short so three planes read as a
  // stack rather than one overlapping mass.
  const layers = [
    { top: "54%", scale: 0.92, delay: 0.12, accent: false },
    { top: "31%", scale: 0.96, delay: 0.24, accent: false },
    { top: "8%", scale: 1, delay: 0.36, accent: true },
  ]

  return (
    <Stage label="canvas-kit / layers">
      <div ref={ref} className="relative aspect-[1/0.72] w-[min(280px,100%)]">
        {layers.map((layer) => (
          <motion.div
            key={layer.top}
            initial={{ opacity: 0, y: 16, scale: layer.scale }}
            animate={inView ? { opacity: 1, y: 0, scale: layer.scale } : undefined}
            transition={
              reduced
                ? { duration: 0 }
                : { duration: 0.9, delay: layer.delay, ease: EASE_BRAND_OUT }
            }
            style={{ top: layer.top }}
            className={`absolute left-[12%] h-[30%] w-[76%] rounded-md border ${
              layer.accent ? "border-brand bg-brand-wash" : "border-[var(--c-canvas-ink)] bg-ground"
            }`}
          />
        ))}

        <div className="absolute -right-[4%] top-[12%] flex flex-col gap-[7px]">
          <span className="block h-1.5 w-[26px] rounded-[3px] bg-brand" />
          <span className="block h-1.5 w-[26px] rounded-[3px] bg-line" />
          <span className="block h-1.5 w-[26px] rounded-[3px] bg-line" />
        </div>
      </div>
    </Stage>
  )
}
