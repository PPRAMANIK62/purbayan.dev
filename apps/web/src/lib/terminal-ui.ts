import type { OutputLine } from "@/components/terminal/terminal-output"

export const MAX_LINES = 500
export const HOME = "/home/purbayan"

export function longestCommonPrefix(strings: string[]): string {
  if (strings.length === 0) return ""
  let prefix = strings[0]
  for (let i = 1; i < strings.length; i++) {
    while (!strings[i].startsWith(prefix)) {
      prefix = prefix.slice(0, -1)
      if (prefix === "") return ""
    }
  }
  return prefix
}

export function formatPromptText(cwd: string, flagCount: number): string {
  const displayPath =
    cwd === HOME ? "~" : cwd.startsWith(HOME + "/") ? "~" + cwd.slice(HOME.length) : cwd
  const prefix = flagCount > 0 ? `[${flagCount}/7] ` : ""
  return `${prefix}purbayan@portfolio:${displayPath}$ `
}

export function buildWelcomeLines(): OutputLine[] {
  const now = new Date()
  const dateStr = now.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  })

  return [
    { text: "PurbayanOS v1.0.0 \u2014 Tokyo Night Edition", color: "info" },
    { text: "Type 'help' to get started.", color: "muted" },
    { text: "", color: "default" },
    { text: `Last login: ${dateStr} on tty1`, color: "muted" },
    { text: "", color: "default" },
  ]
}
