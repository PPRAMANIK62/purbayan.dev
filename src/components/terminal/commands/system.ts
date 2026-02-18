import { registerCommand, registry, type CommandContext, type CommandResult } from "./index"
import type { OutputLine } from "../terminal-output"

// ---------------------------------------------------------------------------
// Environment variables (shared between echo and env)
// ---------------------------------------------------------------------------

const ENV_VARS: Record<string, string> = {
  USER: "purbayan",
  HOME: "/home/purbayan",
  SHELL: "/bin/zsh",
  EDITOR: "zed --wait",
  VISUAL: "zed",
  BROWSER: "firefox",
  TERM: "xterm-256color",
  LANG: "en_US.UTF-8",
  PATH: "/home/purbayan/.cargo/bin:/home/purbayan/.local/bin:/usr/local/bin:/usr/bin:/bin",
  XDG_CONFIG_HOME: "/home/purbayan/.config",
  XDG_DATA_HOME: "/home/purbayan/.local/share",
  WAYLAND_DISPLAY: "wayland-1",
  XDG_SESSION_TYPE: "wayland",
  HOSTNAME: "portfolio",
}

// ---------------------------------------------------------------------------
// whoami
// ---------------------------------------------------------------------------

function whoamiCommand(_args: string[], _ctx: CommandContext): CommandResult {
  return { lines: [{ text: "purbayan" }] }
}

// ---------------------------------------------------------------------------
// hostname
// ---------------------------------------------------------------------------

function hostnameCommand(_args: string[], _ctx: CommandContext): CommandResult {
  return { lines: [{ text: "portfolio" }] }
}

// ---------------------------------------------------------------------------
// uname
// ---------------------------------------------------------------------------

function unameCommand(args: string[], _ctx: CommandContext): CommandResult {
  if (args.includes("-a")) {
    return {
      lines: [{ text: "PurbayanOS 1.0.0 x86_64 Tokyo-Night-Kernel" }],
    }
  }
  return { lines: [{ text: "PurbayanOS" }] }
}

// ---------------------------------------------------------------------------
// date
// ---------------------------------------------------------------------------

function dateCommand(_args: string[], _ctx: CommandContext): CommandResult {
  const now = new Date()
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ]

  const day = days[now.getDay()]
  const month = months[now.getMonth()]
  const date = String(now.getDate()).padStart(2, "0")
  const hours = String(now.getHours()).padStart(2, "0")
  const minutes = String(now.getMinutes()).padStart(2, "0")
  const seconds = String(now.getSeconds()).padStart(2, "0")
  const year = now.getFullYear()

  return {
    lines: [{ text: `${day} ${month} ${date} ${hours}:${minutes}:${seconds} IST ${year}` }],
  }
}

// ---------------------------------------------------------------------------
// uptime
// ---------------------------------------------------------------------------

function uptimeCommand(_args: string[], _ctx: CommandContext): CommandResult {
  return {
    lines: [{ text: "up since 2026, load average: 0.42, 0.69, 1.00" }],
  }
}

// ---------------------------------------------------------------------------
// clear
// ---------------------------------------------------------------------------

function clearCommand(_args: string[], _ctx: CommandContext): CommandResult {
  return { lines: [], clearScreen: true }
}

// ---------------------------------------------------------------------------
// echo
// ---------------------------------------------------------------------------

function echoCommand(args: string[], ctx: CommandContext): CommandResult {
  const varMap: Record<string, string> = {
    $USER: "purbayan",
    $HOME: "/home/purbayan",
    $SHELL: "/bin/zsh",
    $EDITOR: "zed",
    $TERM: "xterm-256color",
    $PWD: ctx.cwd,
  }

  const expanded = args.map((arg) => {
    let result = arg
    for (const [key, value] of Object.entries(varMap)) {
      if (result.includes(key)) {
        result = result.replaceAll(key, value)
      }
    }
    return result
  })

  return { lines: [{ text: expanded.join(" ") }] }
}

// ---------------------------------------------------------------------------
// env
// ---------------------------------------------------------------------------

function envCommand(_args: string[], _ctx: CommandContext): CommandResult {
  const lines: OutputLine[] = Object.entries(ENV_VARS).map(([key, value]) => ({
    text: `${key}=${value}`,
  }))
  return { lines }
}

// ---------------------------------------------------------------------------
// which
// ---------------------------------------------------------------------------

function whichCommand(args: string[], _ctx: CommandContext): CommandResult {
  if (args.length === 0) {
    return { lines: [{ text: "which: missing argument", color: "error" }] }
  }

  const cmd = args[0]
  if (registry.has(cmd)) {
    return { lines: [{ text: `/usr/bin/${cmd}` }] }
  }
  return { lines: [{ text: `${cmd} not found`, color: "error" }] }
}

// ---------------------------------------------------------------------------
// type
// ---------------------------------------------------------------------------

function typeCommand(args: string[], _ctx: CommandContext): CommandResult {
  if (args.length === 0) {
    return { lines: [{ text: "type: missing argument", color: "error" }] }
  }

  const cmd = args[0]
  if (registry.has(cmd)) {
    return { lines: [{ text: `${cmd} is /usr/bin/${cmd}` }] }
  }
  return { lines: [{ text: `type: ${cmd}: not found`, color: "error" }] }
}

// ---------------------------------------------------------------------------
// export
// ---------------------------------------------------------------------------

function exportCommand(_args: string[], _ctx: CommandContext): CommandResult {
  return {
    lines: [{ text: "Nice try, but this is a read-only system.", color: "warning" }],
  }
}

// ---------------------------------------------------------------------------
// neofetch
// ---------------------------------------------------------------------------

function neofetchCommand(_args: string[], _ctx: CommandContext): CommandResult {
  const logo = [
    "        ██████████████        ",
    "      ██              ██      ",
    "    ██   ██████████     ██    ",
    "    ██   ██      ██     ██    ",
    "    ██   ██████████     ██    ",
    "    ██   ██             ██    ",
    "    ██   ██             ██    ",
    "      ██              ██      ",
    "        ██████████████        ",
  ]

  const specs = [
    "purbayan@portfolio",
    "──────────────────",
    "OS: PurbayanOS 1.0 (Tokyo Night)",
    "Host: portfolio.purbayan.dev",
    "Kernel: React 19.2.0",
    "Uptime: since 2026",
    "Shell: TypeScript 5.9",
    "DE: Tailwind 4.1",
    "WM: Vite 7.3",
    "Terminal: Iosevka Mono",
    "CPU: Motion 12.34 @ ∞ fps",
    "GPU: Radix UI (hardware-accelerated)",
    "Memory: 5 projects / ∞ ideas",
    "Packages: 27 (bun)",
    "Theme: Tokyo Night [Dark]",
  ]

  const logoWidth = 34
  const maxLines = Math.max(logo.length, specs.length)
  const lines: OutputLine[] = []

  for (let i = 0; i < maxLines; i++) {
    const logoPart = i < logo.length ? logo[i].padEnd(logoWidth) : " ".repeat(logoWidth)
    const specPart = i < specs.length ? specs[i] : ""
    lines.push({
      text: `${logoPart}${specPart}`,
      color: "info",
    })
  }

  // Hidden flag — dim and discoverable
  lines.push({
    text: `${" ".repeat(logoWidth)}# PURBAYAN{n30f3tch_h1dd3n_fl4g}`,
    color: "muted",
  })

  return { lines }
}

// ---------------------------------------------------------------------------
// Registration
// ---------------------------------------------------------------------------

registerCommand("whoami", whoamiCommand, "Print current username", "whoami")
registerCommand("hostname", hostnameCommand, "Print system hostname", "hostname")
registerCommand("uname", unameCommand, "Print system information", "uname [-a]")
registerCommand("date", dateCommand, "Print current date and time", "date")
registerCommand("uptime", uptimeCommand, "Print system uptime", "uptime")
registerCommand("clear", clearCommand, "Clear the terminal screen", "clear")
registerCommand("echo", echoCommand, "Print text to terminal", "echo <text>")
registerCommand("env", envCommand, "Print environment variables", "env")
registerCommand("which", whichCommand, "Locate a command", "which <command>")
registerCommand("type", typeCommand, "Describe a command", "type <command>")
registerCommand(
  "export",
  exportCommand,
  "Set environment variable (denied)",
  "export <VAR>=<value>",
)
registerCommand("neofetch", neofetchCommand, "Display system information", "neofetch")
