export const EASE_OUT = [0.25, 0.46, 0.45, 0.94] as const

export const FADE_UP_VARIANTS = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
} as const

export const LINE_VARIANTS = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0 },
} as const
