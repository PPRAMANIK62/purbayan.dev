import type { OutputLine } from "../terminal-output"
import type { TerminalState } from "@/stores/terminal-store"

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface CommandContext {
  cwd: string
  setCwd: (path: string) => void
  flags: number[]
  captureFlag: (n: number) => void
  addToHistory: (cmd: string) => void
  soundEnabled: boolean
  toggleSound: () => void
  terminalTheme: TerminalState["terminalTheme"]
  setTheme: (theme: TerminalState["terminalTheme"]) => void
  snakeHighScore: number
  updateSnakeHighScore: (score: number) => void
}

export interface CommandResult {
  lines: OutputLine[]
  clearScreen?: boolean
  startGame?: "snake"
  openUrl?: string
  exit?: boolean
}

export type CommandHandler = (args: string[], ctx: CommandContext) => CommandResult

// ---------------------------------------------------------------------------
// Registry
// ---------------------------------------------------------------------------

interface CommandEntry {
  handler: CommandHandler
  description: string
  usage: string
}

export const registry = new Map<string, CommandEntry>()

export function registerCommand(
  name: string,
  handler: CommandHandler,
  description: string,
  usage: string,
): void {
  registry.set(name, { handler, description, usage })
}

// ---------------------------------------------------------------------------
// Input tokenizer — splits on spaces, respects "double" and 'single' quotes
// ---------------------------------------------------------------------------

function tokenize(input: string): string[] {
  const tokens: string[] = []
  let current = ""
  let quoteChar: string | null = null
  let i = 0

  while (i < input.length) {
    const ch = input[i]

    if (quoteChar !== null) {
      // Inside a quoted segment
      if (ch === quoteChar) {
        // Close quote — do NOT push yet, there may be more adjacent chars
        quoteChar = null
      } else {
        current += ch
      }
    } else if (ch === '"' || ch === "'") {
      // Open quote
      quoteChar = ch
    } else if (ch === " " || ch === "\t") {
      // Whitespace delimiter
      if (current.length > 0) {
        tokens.push(current)
        current = ""
      }
    } else {
      current += ch
    }

    i++
  }

  // Push last token (handles unclosed quotes gracefully)
  if (current.length > 0) {
    tokens.push(current)
  }

  return tokens
}

// ---------------------------------------------------------------------------
// Dispatcher
// ---------------------------------------------------------------------------

export function dispatch(input: string, ctx: CommandContext): CommandResult {
  const trimmed = input.trim()

  if (trimmed.length === 0) {
    return { lines: [] }
  }

  const tokens = tokenize(trimmed)
  const commandName = tokens[0]

  // Safety check — tokenize on non-empty trimmed string always yields >=1 token
  if (commandName === undefined) {
    return { lines: [] }
  }

  const args = tokens.slice(1)
  const entry = registry.get(commandName)

  if (entry === undefined) {
    return {
      lines: [{ text: `${commandName}: command not found`, color: "error" }],
    }
  }

  return entry.handler(args, ctx)
}
