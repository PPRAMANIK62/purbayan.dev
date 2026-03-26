import { registerCommand, type CommandContext, type CommandResult } from "./index"
import type { OutputLine } from "../terminal-output"

// ---------------------------------------------------------------------------
// cowsay
// ---------------------------------------------------------------------------

function cowsayCommand(args: string[], _ctx: CommandContext): CommandResult {
  const MAX_WIDTH = 40
  const text = args.length > 0 ? args.join(" ") : "Moo!"

  // Wrap text into lines of at most MAX_WIDTH characters
  const wrappedLines: string[] = []
  let remaining = text
  while (remaining.length > MAX_WIDTH) {
    let breakAt = remaining.lastIndexOf(" ", MAX_WIDTH)
    if (breakAt <= 0) breakAt = MAX_WIDTH
    wrappedLines.push(remaining.slice(0, breakAt))
    remaining = remaining.slice(breakAt).trimStart()
  }
  if (remaining.length > 0) wrappedLines.push(remaining)

  const maxLen = Math.max(...wrappedLines.map((l) => l.length))

  const top = ` ${"_".repeat(maxLen + 2)}`
  const bottom = ` ${"-".repeat(maxLen + 2)}`

  const bubbleLines: string[] = [top]
  if (wrappedLines.length === 1) {
    bubbleLines.push(`< ${wrappedLines[0].padEnd(maxLen)} >`)
  } else {
    wrappedLines.forEach((line, i) => {
      const padded = line.padEnd(maxLen)
      if (i === 0) {
        bubbleLines.push(`/ ${padded} \\`)
      } else if (i === wrappedLines.length - 1) {
        bubbleLines.push(`\\ ${padded} /`)
      } else {
        bubbleLines.push(`| ${padded} |`)
      }
    })
  }
  bubbleLines.push(bottom)

  const cow = [
    "        \\   ^__^",
    "         \\  (oo)\\_______",
    "            (__)\\       )\\/\\",
    "                ||----w |",
    "                ||     ||",
  ]

  const lines: OutputLine[] = [...bubbleLines, ...cow].map((l) => ({
    text: l,
    color: "default" as const,
  }))

  return { lines }
}

// ---------------------------------------------------------------------------
// fortune
// ---------------------------------------------------------------------------

const FORTUNES: string[] = [
  "There are only two hard things in CS: cache invalidation and naming things.",
  "It works on my machine.",
  "rm -rf node_modules && npm install // the universal fix",
  "// TODO: fix this later  — committed 3 years ago",
  "Mass of code = mass of bugs. Elegant code = elegant bugs.",
  "The best code is no code at all.",
  "It's not a bug, it's an undocumented feature.",
  "99 little bugs in the code, 99 little bugs. Take one down, patch it around... 127 little bugs in the code.",
  "Programming is 10% writing code and 90% understanding why it doesn't work.",
  "A SQL query walks into a bar, walks up to two tables and asks... 'Can I join you?'",
  "!false — it's funny because it's true.",
  "To understand recursion, you must first understand recursion.",
  "Weeks of coding can save you hours of planning.",
  "The cloud is just someone else's computer.",
  "There's no place like 127.0.0.1.",
]

function fortuneCommand(_args: string[], _ctx: CommandContext): CommandResult {
  const quote = FORTUNES[Math.floor(Math.random() * FORTUNES.length)]
  return { lines: [{ text: quote, color: "info" }] }
}

// ---------------------------------------------------------------------------
// figlet
// ---------------------------------------------------------------------------

const FIGLET_FONT: Record<string, string[]> = {
  A: [" ███ ", "█   █", "█████", "█   █", "█   █"],
  B: ["████ ", "█   █", "████ ", "█   █", "████ "],
  C: [" ████", "█    ", "█    ", "█    ", " ████"],
  D: ["████ ", "█   █", "█   █", "█   █", "████ "],
  E: ["█████", "█    ", "████ ", "█    ", "█████"],
  F: ["█████", "█    ", "████ ", "█    ", "█    "],
  G: [" ████", "█    ", "█  ██", "█   █", " ████"],
  H: ["█   █", "█   █", "█████", "█   █", "█   █"],
  I: ["█████", "  █  ", "  █  ", "  █  ", "█████"],
  J: ["█████", "    █", "    █", "█   █", " ███ "],
  K: ["█   █", "█  █ ", "███  ", "█  █ ", "█   █"],
  L: ["█    ", "█    ", "█    ", "█    ", "█████"],
  M: ["█   █", "██ ██", "█ █ █", "█   █", "█   █"],
  N: ["█   █", "██  █", "█ █ █", "█  ██", "█   █"],
  O: [" ███ ", "█   █", "█   █", "█   █", " ███ "],
  P: ["████ ", "█   █", "████ ", "█    ", "█    "],
  Q: [" ███ ", "█   █", "█ █ █", "█  █ ", " ██ █"],
  R: ["████ ", "█   █", "████ ", "█  █ ", "█   █"],
  S: [" ████", "█    ", " ███ ", "    █", "████ "],
  T: ["█████", "  █  ", "  █  ", "  █  ", "  █  "],
  U: ["█   █", "█   █", "█   █", "█   █", " ███ "],
  V: ["█   █", "█   █", "█   █", " █ █ ", "  █  "],
  W: ["█   █", "█   █", "█ █ █", "██ ██", "█   █"],
  X: ["█   █", " █ █ ", "  █  ", " █ █ ", "█   █"],
  Y: ["█   █", " █ █ ", "  █  ", "  █  ", "  █  "],
  Z: ["█████", "   █ ", "  █  ", " █   ", "█████"],
  "0": [" ███ ", "█  ██", "█ █ █", "██  █", " ███ "],
  "1": ["  █  ", " ██  ", "  █  ", "  █  ", "█████"],
  "2": [" ███ ", "█   █", "  ██ ", " █   ", "█████"],
  "3": ["████ ", "    █", " ███ ", "    █", "████ "],
  "4": ["█   █", "█   █", "█████", "    █", "    █"],
  "5": ["█████", "█    ", "████ ", "    █", "████ "],
  "6": [" ███ ", "█    ", "████ ", "█   █", " ███ "],
  "7": ["█████", "    █", "   █ ", "  █  ", "  █  "],
  "8": [" ███ ", "█   █", " ███ ", "█   █", " ███ "],
  "9": [" ███ ", "█   █", " ████", "    █", " ███ "],
  " ": ["     ", "     ", "     ", "     ", "     "],
  "!": ["  █  ", "  █  ", "  █  ", "     ", "  █  "],
  "?": [" ███ ", "█   █", "  ██ ", "     ", "  █  "],
  ".": ["     ", "     ", "     ", "     ", "  █  "],
  "-": ["     ", "     ", "█████", "     ", "     "],
}

function figletCommand(args: string[], _ctx: CommandContext): CommandResult {
  if (args.length === 0) {
    return { lines: [{ text: "Usage: figlet <text>", color: "info" }] }
  }

  const text = args.join(" ").toUpperCase()
  const outputLines: string[] = ["", "", "", "", ""]

  for (const ch of text) {
    const glyph = FIGLET_FONT[ch]
    if (glyph) {
      for (let row = 0; row < 5; row++) {
        outputLines[row] += glyph[row] + " "
      }
    } else {
      // Unknown character — render as space
      for (let row = 0; row < 5; row++) {
        outputLines[row] += "     " + " "
      }
    }
  }

  const lines: OutputLine[] = outputLines.map((l) => ({
    text: l,
    color: "info" as const,
  }))

  return { lines }
}

// ---------------------------------------------------------------------------
// sl (Steam Locomotive)
// ---------------------------------------------------------------------------

function slCommand(_args: string[], _ctx: CommandContext): CommandResult {
  const train = [
    "      ====        ________                ___________",
    "  _D _|  |_______/        \\__I_I_____===__|_________|",
    "   |(_)---  |   H\\________/ |   |        =|___ ___|",
    "   /     |  |   H  |  |     |   |         ||_| |_||",
    "  |      |  |   H  |__--------------------| [___] |",
    "  (| | H |  |   H  //|     |   |          |       |",
    "  |' | __ |  |   H // |_____/   |          |       |",
    "  +---+___[_]---+_//__/  \\_____/           |_______|",
    "  /|         \\_/                            _|     |_",
    " / |  _  _    /                             | | . | |",
    "|  |_| |_| __/                              |_|___|_|",
    "|______|__/                                 |___|___|",
  ]

  const lines: OutputLine[] = train.map((l) => ({
    text: l,
    color: "default" as const,
  }))

  lines.push({
    text: "You typed 'sl' instead of 'ls'. Classic.",
    color: "muted",
  })

  return { lines }
}

// ---------------------------------------------------------------------------
// lolcat
// ---------------------------------------------------------------------------

function lolcatCommand(_args: string[], _ctx: CommandContext): CommandResult {
  return {
    lines: [
      {
        text: "You need text to rainbow-ify. Try: fortune | cowsay",
        color: "warning",
      },
    ],
  }
}

// ---------------------------------------------------------------------------
// rickroll
// ---------------------------------------------------------------------------

function rickrollCommand(_args: string[], _ctx: CommandContext): CommandResult {
  return {
    lines: [
      {
        text: "Never gonna give you up, never gonna let you down...",
        color: "info",
      },
    ],
    openUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
  }
}

// ---------------------------------------------------------------------------
// matrix / cmatrix
// ---------------------------------------------------------------------------

function matrixCommand(_args: string[], _ctx: CommandContext): CommandResult {
  const LINE_COUNT = 25
  const LINE_WIDTH = 70

  const lines: OutputLine[] = []

  for (let i = 0; i < LINE_COUNT; i++) {
    let line = ""
    for (let j = 0; j < LINE_WIDTH; j++) {
      const roll = Math.random()
      if (roll < 0.4) {
        // Katakana U+30A0 - U+30FF
        const code = 0x30a0 + Math.floor(Math.random() * 96)
        line += String.fromCharCode(code)
      } else if (roll < 0.7) {
        // Latin letter
        const code = 65 + Math.floor(Math.random() * 26)
        line += String.fromCharCode(roll < 0.55 ? code : code + 32)
      } else {
        // Digit
        line += String(Math.floor(Math.random() * 10))
      }
    }
    lines.push({ text: line, color: "success" })
  }

  lines.push({ text: "Wake up...", color: "muted" })

  return { lines }
}

// ---------------------------------------------------------------------------
// snake
// ---------------------------------------------------------------------------

function snakeCommand(_args: string[], _ctx: CommandContext): CommandResult {
  return {
    lines: [{ text: "Starting snake game...", color: "success" }],
    startGame: "snake",
  }
}

// ---------------------------------------------------------------------------
// Registration
// ---------------------------------------------------------------------------

registerCommand("cowsay", cowsayCommand, "Generate ASCII cow with speech bubble", "cowsay <text>")
registerCommand("fortune", fortuneCommand, "Display a random dev quote", "fortune")
registerCommand("figlet", figletCommand, "Display text in large block letters", "figlet <text>")
registerCommand("sl", slCommand, "Steam Locomotive", "sl")
registerCommand("lolcat", lolcatCommand, "Rainbow text (needs input)", "lolcat <text>")
registerCommand("rickroll", rickrollCommand, "Never gonna give you up", "rickroll")
registerCommand("matrix", matrixCommand, "Matrix digital rain effect", "matrix")
registerCommand("cmatrix", matrixCommand, "Matrix digital rain effect", "cmatrix")
registerCommand("snake", snakeCommand, "Play the snake game", "snake")
