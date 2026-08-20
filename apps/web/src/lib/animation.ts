/** Primary easing — matches --ease-brand in index.css. */
export const EASE_BRAND = [0.22, 1, 0.36, 1] as const

/** Longer, softer easing for entrances — matches --ease-brand-out. */
export const EASE_BRAND_OUT = [0.16, 1, 0.3, 1] as const

export const RISE_VARIANTS = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0 },
} as const
