import type { OutputLine } from "@/components/terminal/terminal-output"
import { getRandomHint } from "@/components/terminal/commands/meta"

// ---------------------------------------------------------------------------
// CTF Flag Detection
// ---------------------------------------------------------------------------

export const FLAG_MAP: Record<string, number> = {
  "PURBAYAN{y0u_r3ad_th3_d0tf1l3s}": 1,
  "PURBAYAN{h1dd3n_d1r_m4st3r}": 2,
  "PURBAYAN{f0ll0w_th3_wh1t3_r4bb1t}": 3,
  "PURBAYAN{h0w_ab0ut_a_n1c3_g4m3}": 4,
  "PURBAYAN{n30f3tch_h1dd3n_fl4g}": 5,
  // Flag 6 (snake game) handled separately via game.onFlag()
  "PURBAYAN{tmp_h4ck3r}": 7,
}

export const FLAG_PATTERN = /PURBAYAN\{[^}]+\}/g

export function detectFlags(
  lines: OutputLine[],
  alreadyFound: number[],
): { detectedFlags: number[]; celebrationLines: OutputLine[] } {
  const detectedFlags: number[] = []
  const celebrationLines: OutputLine[] = []

  for (const line of lines) {
    const matches = line.text.match(FLAG_PATTERN)
    if (!matches) continue
    for (const match of matches) {
      const flagNum = FLAG_MAP[match]
      if (flagNum === undefined) continue
      if (alreadyFound.includes(flagNum)) continue
      if (detectedFlags.includes(flagNum)) continue
      detectedFlags.push(flagNum)
    }
  }

  for (const flagNum of detectedFlags) {
    celebrationLines.push(
      { text: "", color: "default" },
      { text: `  PURBAYAN{...} — Flag ${flagNum} discovered!`, color: "warning" },
      { text: `  [✓] Flag ${flagNum}/7 captured!`, color: "success" },
    )
  }

  if (detectedFlags.length > 0) {
    // After celebrating, add a hint for a random OTHER uncaptured flag
    const allFound = [...alreadyFound, ...detectedFlags]
    const uncaptured = [1, 2, 3, 4, 5, 6, 7].filter((n) => !allFound.includes(n))
    if (uncaptured.length > 0) {
      const randomFlag = uncaptured[Math.floor(Math.random() * uncaptured.length)]
      celebrationLines.push(
        { text: `  Hint: ${getRandomHint(randomFlag)}`, color: "muted" },
      )
    }
    celebrationLines.push({ text: "", color: "default" })
  }

  return { detectedFlags, celebrationLines }
}

export function buildVictoryScreen(): OutputLine[] {
  return [
    { text: "", color: "default" },
    { text: "╔══════════════════════════════════════════════════╗", color: "warning" },
    { text: "║                                                  ║", color: "warning" },
    { text: "║   ALL FLAGS CAPTURED                             ║", color: "success" },
    { text: "║                                                  ║", color: "warning" },
    { text: "║   You found all 7 hidden flags in PurbayanOS.    ║", color: "warning" },
    { text: "║                                                  ║", color: "warning" },
    { text: "║   You're exactly the kind of person I'd love     ║", color: "warning" },
    { text: "║   to work with. Let's talk:                      ║", color: "warning" },
    { text: "║                                                  ║", color: "warning" },
    { text: "║   > purbayan.dev@gmail.com                       ║", color: "warning" },
    { text: "║   > github.com/PPRAMANIK62                       ║", color: "warning" },
    { text: "║                                                  ║", color: "warning" },
    { text: "║   Thanks for exploring. This was fun to build.   ║", color: "warning" },
    { text: "║                                                  ║", color: "warning" },
    { text: "╚══════════════════════════════════════════════════╝", color: "warning" },
    { text: "", color: "default" },
  ]
}
