import {
  registerCommand,
  registry,
  type CommandContext,
  type CommandResult,
} from "./index"
import type { OutputLine } from "../terminal-output"
import { resolvePath, getNode, isFile } from "../filesystem/index"
import { ROOT } from "../filesystem/contents"
import { useTerminalStore } from "@/stores/terminal-store"

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

const VALID_THEMES = ["default", "amber", "green", "cyan"]

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

  const name = args[0]
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

const FLAG_HINTS: Record<number, string> = {
  1: "Hidden in the dotfiles...",
  2: "Check the temp directory...",
  3: "Follow the white rabbit...",
  4: "Shall we play a game?",
  5: "Look closer at the system info...",
  6: "Sssssnake your way to victory...",
  7: "The source code knows all...",
}

function flagsCommand(_args: string[], ctx: CommandContext): CommandResult {
  const lines: OutputLine[] = [
    { text: "Flag Status:", color: "info" },
    { text: "" },
  ]

  for (let i = 1; i <= 7; i++) {
    if (ctx.flags.includes(i)) {
      lines.push({ text: `  Flag ${i}: FOUND \u2713`, color: "success" })
    } else {
      const hint = FLAG_HINTS[i] ?? ""
      lines.push({ text: `  Flag ${i}: ???  ${hint}`, color: "muted" })
    }
  }

  lines.push({ text: "" })
  lines.push({ text: `[${ctx.flags.length}/7 flags found]`, color: "muted" })

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
