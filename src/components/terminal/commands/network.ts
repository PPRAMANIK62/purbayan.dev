import { registerCommand, type CommandContext, type CommandResult } from "./index"
import type { OutputLine } from "../terminal-output"

// ---------------------------------------------------------------------------
// ssh
// ---------------------------------------------------------------------------

function sshCommand(args: string[], ctx: CommandContext): CommandResult {
  if (args.length === 0) {
    return { lines: [{ text: "usage: ssh [user@]hostname", color: "muted" }] }
  }

  const target = args[0]

  // --- neo@matrix (Flag 3) ---
  if (target === "neo@matrix") {
    ctx.captureFlag(3)
    const lines: OutputLine[] = [
      { text: "Connecting to matrix.metacortex.com...", color: "muted" },
      { text: " " },
      { text: "Wake up, Neo...", color: "success" },
      { text: "The Matrix has you...", color: "success" },
      { text: "Follow the white rabbit.", color: "success" },
      { text: "" },
      { text: "PURBAYAN{f0ll0w_th3_wh1t3_r4bb1t}", color: "warning" },
      { text: "" },
      { text: "Knock, knock, Neo.", color: "success" },
      { text: "Connection closed.", color: "muted" },
    ]
    return { lines }
  }

  // --- joshua@wopr (Flag 4) ---
  if (target === "joshua@wopr") {
    ctx.captureFlag(4)
    const lines: OutputLine[] = [
      { text: "Connecting to wopr.norad.gov...", color: "muted" },
      { text: "" },
      { text: "GREETINGS PROFESSOR FALKEN.", color: "info" },
      { text: "" },
      { text: "SHALL WE PLAY A GAME?", color: "info" },
      { text: "" },
      { text: "HOW ABOUT A NICE GAME OF CHESS?", color: "info" },
      { text: "" },
      { text: "PURBAYAN{h0w_ab0ut_a_n1c3_g4m3}", color: "warning" },
      { text: "" },
      { text: "CONNECTION TERMINATED.", color: "muted" },
    ]
    return { lines }
  }

  // --- elliot@fsociety ---
  if (target === "elliot@fsociety") {
    const lines: OutputLine[] = [
      { text: "Connecting to fsociety.org...", color: "muted" },
      { text: "" },
      { text: "  ███████╗███████╗ ██████╗  ██████╗██╗███████╗████████╗██╗   ██╗", color: "error" },
      { text: "  ██╔════╝██╔════╝██╔═══██╗██╔════╝██║██╔════╝╚══██╔══╝╚██╗ ██╔╝", color: "error" },
      { text: "  █████╗  ███████╗██║   ██║██║     ██║█████╗     ██║    ╚████╔╝", color: "error" },
      { text: "  ██╔══╝  ╚════██║██║   ██║██║     ██║██╔══╝     ██║     ╚██╔╝", color: "error" },
      { text: "  ██║     ███████║╚██████╔╝╚██████╗██║███████╗   ██║      ██║", color: "error" },
      { text: "  ╚═╝     ╚══════╝ ╚═════╝  ╚═════╝╚═╝╚══════╝   ╚═╝      ╚═╝", color: "error" },
      { text: "" },
      { text: "We are fsociety. We are finally free. We are finally awake.", color: "error" },
      { text: "Connection closed.", color: "muted" },
    ]
    return { lines }
  }

  // --- root@localhost ---
  if (target === "root@localhost") {
    return {
      lines: [
        {
          text: "Permission denied (publickey). Did you really think that would work?",
          color: "error",
        },
      ],
    }
  }

  // --- anything else ---
  return {
    lines: [
      {
        text: `ssh: Could not resolve hostname ${target}: Name or service not known`,
        color: "error",
      },
    ],
  }
}

// ---------------------------------------------------------------------------
// ping
// ---------------------------------------------------------------------------

function pingCommand(args: string[], _ctx: CommandContext): CommandResult {
  if (args.length === 0) {
    return { lines: [{ text: "ping: missing host operand", color: "error" }] }
  }

  const host = args[0]
  const ip = "142.250.80.46"

  // Generate 3 random times between 8-15ms
  const times: number[] = []
  for (let i = 0; i < 3; i++) {
    times.push(Math.round((8 + Math.random() * 7) * 10) / 10)
  }

  const min = Math.min(...times)
  const max = Math.max(...times)
  const avg = Math.round(((times[0] + times[1] + times[2]) / 3) * 10) / 10

  const lines: OutputLine[] = [
    { text: `PING ${host} (${ip}): 56 data bytes` },
    { text: `64 bytes from ${ip}: icmp_seq=0 ttl=118 time=${times[0]} ms` },
    { text: `64 bytes from ${ip}: icmp_seq=1 ttl=118 time=${times[1]} ms` },
    { text: `64 bytes from ${ip}: icmp_seq=2 ttl=118 time=${times[2]} ms` },
    { text: `--- ${host} ping statistics ---` },
    { text: "3 packets transmitted, 3 packets received, 0% packet loss" },
    { text: `round-trip min/avg/max = ${min}/${avg}/${max} ms` },
  ]

  return { lines }
}

// ---------------------------------------------------------------------------
// curl
// ---------------------------------------------------------------------------

function curlCommand(args: string[], _ctx: CommandContext): CommandResult {
  if (args.length === 0) {
    return { lines: [{ text: "curl: try 'curl purbayan.dev'", color: "muted" }] }
  }

  const url = args[0]

  if (url.includes("purbayan")) {
    const lines: OutputLine[] = [
      { text: "<!DOCTYPE html>" },
      { text: "<html>" },
      { text: "  <head><title>Purbayan Pramanik</title></head>" },
      { text: "  <body>" },
      { text: "    ╔═══════════════════════════════════╗" },
      { text: "    ║   purbayan.dev                    ║" },
      { text: "    ║   Developer from Kolkata, India   ║" },
      { text: "    ║   Rust · TypeScript · C · Go      ║" },
      { text: "    ╚═══════════════════════════════════╝" },
      { text: "  </body>" },
      { text: "</html>" },
    ]
    return { lines }
  }

  return {
    lines: [{ text: `curl: (6) Could not resolve host: ${url}`, color: "error" }],
  }
}

// ---------------------------------------------------------------------------
// wget
// ---------------------------------------------------------------------------

function wgetCommand(_args: string[], _ctx: CommandContext): CommandResult {
  return {
    lines: [
      {
        text: "This is a browser, not a server. Try 'open <url>' instead.",
        color: "warning",
      },
    ],
  }
}

// ---------------------------------------------------------------------------
// telnet
// ---------------------------------------------------------------------------

function telnetCommand(_args: string[], _ctx: CommandContext): CommandResult {
  return {
    lines: [
      {
        text: "telnet is deprecated. Try 'ssh neo@matrix' for something fun.",
        color: "warning",
      },
    ],
  }
}

// ---------------------------------------------------------------------------
// Registration
// ---------------------------------------------------------------------------

registerCommand("ssh", sshCommand, "Secure shell connection", "ssh [user@]hostname")
registerCommand("ping", pingCommand, "Send ICMP echo request", "ping <host>")
registerCommand("curl", curlCommand, "Transfer data from URL", "curl <url>")
registerCommand("wget", wgetCommand, "Download files (disabled)", "wget <url>")
registerCommand("telnet", telnetCommand, "Telnet connection (deprecated)", "telnet [host]")
