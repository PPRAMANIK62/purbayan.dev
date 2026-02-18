import {
  registerCommand,
  registry,
  type CommandContext,
  type CommandResult,
} from "./index"
import type { OutputLine } from "../terminal-output"
import { resolvePath, getNode, isFile } from "../filesystem/index"
import { ROOT } from "../filesystem/contents"
import { useTerminalStore, type TerminalState } from "@/stores/terminal-store"

// ---------------------------------------------------------------------------
// Category mapping for help command
// ---------------------------------------------------------------------------

const COMMAND_CATEGORIES: Record<string, string[]> = {
  Filesystem: ["ls", "cd", "cat", "pwd", "tree", "grep", "find", "head", "tail", "wc", "file"],
  System: ["whoami", "hostname", "uname", "date", "uptime", "clear", "echo", "env", "which", "type", "export", "neofetch"],
  Network: ["ssh", "ping", "curl", "wget", "telnet"],
  Fun: ["cowsay", "fortune", "figlet", "sl", "lolcat", "rickroll", "matrix", "cmatrix"],
  Meta: ["help", "history", "man", "exit", "open", "xdg-open", "sudo", "rm", "vim", "nano", "theme", "flags", "sound", "credits"],
}

// ---------------------------------------------------------------------------
// help
// ---------------------------------------------------------------------------

function helpCommand(_args: string[], ctx: CommandContext): CommandResult {
  const lines: OutputLine[] = []

  lines.push({ text: "Available commands:", color: "info" })
  lines.push({ text: "" })

  for (const [category, commands] of Object.entries(COMMAND_CATEGORIES)) {
    lines.push({ text: `  ${category}`, color: "info" })

    for (const cmd of commands) {
      const entry = registry.get(cmd)
      const desc = entry ? entry.description : ""
      lines.push({ text: `    ${cmd.padEnd(14)} ${desc}` })
    }

    lines.push({ text: "" })
  }

  const found = ctx.flags.length
  lines.push({ text: `[${found}/7 flags found]`, color: "muted" })

  return { lines }
}

// ---------------------------------------------------------------------------
// history
// ---------------------------------------------------------------------------

function historyCommand(_args: string[], _ctx: CommandContext): CommandResult {
  const history = useTerminalStore.getState().commandHistory
  const lines: OutputLine[] = history.map((cmd, i) => ({
    text: `  ${String(i + 1).padStart(4)}  ${cmd}`,
  }))
  return { lines }
}

// ---------------------------------------------------------------------------
// man
// ---------------------------------------------------------------------------

function manCommand(args: string[], _ctx: CommandContext): CommandResult {
  if (args.length === 0) {
    return { lines: [{ text: "What manual page do you want?", color: "warning" }] }
  }

  const topic = args[0]

  // Check for man page files in the virtual filesystem
  if (topic === "purbayan" || topic === "purbayanOS") {
    const filename = `${topic}.1`
    const manPath = resolvePath("/", `/usr/share/man/${filename}`)
    const node = getNode(ROOT, manPath)

    if (node && isFile(node) && node.content) {
      const lines: OutputLine[] = node.content
        .split("\n")
        .map((line) => ({ text: line }))
      return { lines }
    }
  }

  // Check if the topic is a registered command
  const entry = registry.get(topic)
  if (entry) {
    const lines: OutputLine[] = [
      { text: `${topic.toUpperCase()}(1)`, color: "info" },
      { text: "" },
      { text: `NAME`, color: "info" },
      { text: `    ${topic} - ${entry.description}` },
      { text: "" },
      { text: `USAGE`, color: "info" },
      { text: `    ${entry.usage}` },
    ]
    return { lines }
  }

  return { lines: [{ text: `No manual entry for ${topic}`, color: "error" }] }
}

// ---------------------------------------------------------------------------
// exit
// ---------------------------------------------------------------------------

function exitCommand(_args: string[], _ctx: CommandContext): CommandResult {
  return { lines: [{ text: "logout", color: "muted" }], exit: true }
}

// ---------------------------------------------------------------------------
// open / xdg-open
// ---------------------------------------------------------------------------

function openCommand(args: string[], _ctx: CommandContext): CommandResult {
  if (args.length === 0) {
    return { lines: [{ text: "open: missing URL", color: "error" }] }
  }

  const url = args[0]
  return {
    lines: [{ text: `Opening ${url}...`, color: "muted" }],
    openUrl: url,
  }
}

// ---------------------------------------------------------------------------
// sudo
// ---------------------------------------------------------------------------

function sudoCommand(args: string[], _ctx: CommandContext): CommandResult {
  const joined = args.join(" ")

  if (joined.includes("rm -rf /")) {
    return {
      lines: [{ text: "Nice try. This incident has DEFINITELY been reported.", color: "error" }],
    }
  }

  return {
    lines: [{ text: "purbayan is not in the sudoers file. This incident will be reported.", color: "error" }],
  }
}

// ---------------------------------------------------------------------------
// rm
// ---------------------------------------------------------------------------

function rmCommand(args: string[], _ctx: CommandContext): CommandResult {
  if (args.includes("-rf") && args.includes("/")) {
    return {
      lines: [{ text: "Denied. But I admire the audacity.", color: "warning" }],
    }
  }

  return {
    lines: [{ text: "rm: read-only filesystem. Nothing to remove.", color: "error" }],
  }
}

// ---------------------------------------------------------------------------
// vim
// ---------------------------------------------------------------------------

function vimCommand(_args: string[], _ctx: CommandContext): CommandResult {
  return {
    lines: [{ text: "Why would you do this to yourself? Try 'cat' instead.", color: "warning" }],
  }
}

// ---------------------------------------------------------------------------
// nano
// ---------------------------------------------------------------------------

function nanoCommand(_args: string[], _ctx: CommandContext): CommandResult {
  return {
    lines: [{ text: "A sensible choice. But there are no files to edit here.", color: "warning" }],
  }
}

// ---------------------------------------------------------------------------
// theme
// ---------------------------------------------------------------------------

const VALID_THEMES: readonly TerminalState["terminalTheme"][] = ["default", "amber", "green", "cyan"]

function themeCommand(args: string[], ctx: CommandContext): CommandResult {
  if (args.length === 0) {
    return {
      lines: [{ text: `Current theme: ${ctx.terminalTheme}` }],
    }
  }

  if (args[0] === "list") {
    const lines: OutputLine[] = [
      { text: "Available themes:", color: "info" },
      { text: "  default" },
      { text: "  amber" },
      { text: "  green" },
      { text: "  cyan" },
    ]
    return { lines }
  }

  const name = args[0] as TerminalState["terminalTheme"]
  if (VALID_THEMES.includes(name)) {
    ctx.setTheme(name)
    return {
      lines: [{ text: `Theme set to: ${name}`, color: "success" }],
    }
  }

  return {
    lines: [{ text: `Unknown theme: ${name}. Try 'theme list'`, color: "error" }],
  }
}

// ---------------------------------------------------------------------------
// flags
// ---------------------------------------------------------------------------

const FLAG_HINT_BANK: Record<number, string[]> = {
  1: [
    "Read the dotfiles...",
    "Secrets hide in your home dir...",
    "What does .bashrc contain?",
    "Hidden configs hold secrets...",
  ],
  2: [
    "Hidden directories hold secrets...",
    "Some paths hide in plain sight...",
    "Not everything visible is all...",
    "Look deeper in the filesystem...",
  ],
  3: [
    "Follow the white rabbit...",
    "SSH knows more than you think...",
    "Remote connections reveal truth...",
    "Try connecting somewhere new...",
  ],
  4: [
    "Shall we play a game?",
    "Games aren't just for fun...",
    "Some games reward patience...",
    "Enter the matrix... or else?",
  ],
  5: [
    "Look closer at system info...",
    "neofetch shows more than specs...",
    "System tools hide Easter eggs...",
    "What does the system know?",
  ],
  6: [
    "Score high in the game...",
    "The snake rewards dedication...",
    "10 points unlock something...",
    "Keep eating, keep growing...",
  ],
  7: [
    "Check /tmp...",
    "Temp files aren't temporary...",
    "Hackers leave odd traces...",
    "The temp dir hides surprises...",
  ],
}

export function getRandomHint(flagNum: number): string {
  const hints = FLAG_HINT_BANK[flagNum]
  if (!hints || hints.length === 0) return "???"
  return hints[Math.floor(Math.random() * hints.length)]
}

const BOX_W = 58

function flagsCommand(_args: string[], ctx: CommandContext): CommandResult {
  const found = ctx.flags.length
  const lines: OutputLine[] = []

  const pad = (s: string, w: number) => s + " ".repeat(Math.max(0, w - s.length))
  const border = "═".repeat(BOX_W)

  lines.push({ text: `╔${border}╗`, color: "info" })
  lines.push({ text: `║  ${pad(`PurbayanOS — Capture The Flag  [${found}/7]`, BOX_W - 2)}║`, color: "info" })
  lines.push({ text: `╠${border}╣`, color: "info" })
  lines.push({ text: `║${" ".repeat(BOX_W)}║`, color: "info" })

  for (let i = 1; i <= 7; i++) {
    if (ctx.flags.includes(i)) {
      const inner = `  [✓] Flag ${i} — Found`
      lines.push({ text: `║${pad(inner, BOX_W)}║`, color: "success" })
    } else {
      const hint = getRandomHint(i)
      const inner = `  [ ] Flag ${i} — Hint: "${hint}"`
      lines.push({ text: `║${pad(inner, BOX_W)}║`, color: "muted" })
    }
  }

  lines.push({ text: `║${" ".repeat(BOX_W)}║`, color: "info" })
  lines.push({ text: `╚${border}╝`, color: "info" })

  if (found === 7) {
    lines.push({ text: "", color: "default" })
    lines.push({ text: "╔══════════════════════════════════════════════════╗", color: "warning" })
    lines.push({ text: "║                                                  ║", color: "warning" })
    lines.push({ text: "║   ALL FLAGS CAPTURED                             ║", color: "success" })
    lines.push({ text: "║                                                  ║", color: "warning" })
    lines.push({ text: "║   You found all 7 hidden flags in PurbayanOS.    ║", color: "warning" })
    lines.push({ text: "║                                                  ║", color: "warning" })
    lines.push({ text: "║   You're exactly the kind of person I'd love     ║", color: "warning" })
    lines.push({ text: "║   to work with. Let's talk:                      ║", color: "warning" })
    lines.push({ text: "║                                                  ║", color: "warning" })
    lines.push({ text: "║   > purbayan.dev@gmail.com                       ║", color: "warning" })
    lines.push({ text: "║   > github.com/PPRAMANIK62                       ║", color: "warning" })
    lines.push({ text: "║                                                  ║", color: "warning" })
    lines.push({ text: "║   Thanks for exploring. This was fun to build.   ║", color: "warning" })
    lines.push({ text: "║                                                  ║", color: "warning" })
    lines.push({ text: "╚══════════════════════════════════════════════════╝", color: "warning" })
  }

  return { lines }
}

// ---------------------------------------------------------------------------
// sound
// ---------------------------------------------------------------------------

function soundCommand(args: string[], ctx: CommandContext): CommandResult {
  if (args.length === 0) {
    return {
      lines: [{ text: `Sound effects: ${ctx.soundEnabled ? "ON" : "OFF"}` }],
    }
  }

  if (args[0] === "on") {
    if (!ctx.soundEnabled) {
      ctx.toggleSound()
    }
    return {
      lines: [{ text: "Sound effects: ON", color: "success" }],
    }
  }

  if (args[0] === "off") {
    if (ctx.soundEnabled) {
      ctx.toggleSound()
    }
    return {
      lines: [{ text: "Sound effects: OFF", color: "muted" }],
    }
  }

  return {
    lines: [{ text: `Sound effects: ${ctx.soundEnabled ? "ON" : "OFF"}` }],
  }
}

// ---------------------------------------------------------------------------
// credits
// ---------------------------------------------------------------------------

function creditsCommand(_args: string[], _ctx: CommandContext): CommandResult {
  return {
    lines: [
      {
        text: "PurbayanOS was built by Purbayan Pramanik using React, TypeScript, and questionable life choices.",
        color: "info",
      },
    ],
  }
}

// ---------------------------------------------------------------------------
// Registration
// ---------------------------------------------------------------------------

registerCommand("help", helpCommand, "List all available commands", "help")
registerCommand("history", historyCommand, "Show command history", "history")
registerCommand("man", manCommand, "Display manual page", "man <topic>")
registerCommand("exit", exitCommand, "Close the terminal", "exit")
registerCommand("open", openCommand, "Open a URL in browser", "open <url>")
registerCommand("xdg-open", openCommand, "Open a URL in browser", "xdg-open <url>")
registerCommand("sudo", sudoCommand, "Execute as superuser (denied)", "sudo <command>")
registerCommand("rm", rmCommand, "Remove files (denied)", "rm <file>")
registerCommand("vim", vimCommand, "Open vim editor (not recommended)", "vim [file]")
registerCommand("nano", nanoCommand, "Open nano editor", "nano [file]")
registerCommand("theme", themeCommand, "Change terminal theme", "theme [list|<name>]")
registerCommand("flags", flagsCommand, "Show CTF flag status", "flags")
registerCommand("sound", soundCommand, "Toggle sound effects", "sound [on|off]")
registerCommand("credits", creditsCommand, "Show credits", "credits")
