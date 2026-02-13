export type OutputLineColor =
  | "default"
  | "error"
  | "success"
  | "info"
  | "warning"
  | "muted"
  | "link"

export interface OutputLine {
  text: string
  color?: OutputLineColor
  href?: string
}

const COLOR_MAP: Record<OutputLineColor, string> = {
  default: "text-foreground",
  error: "text-tokyo-red",
  success: "text-tokyo-green",
  info: "text-tokyo-cyan",
  warning: "text-tokyo-yellow",
  muted: "text-muted-foreground",
  link: "text-tokyo-magenta underline cursor-pointer",
}

interface TerminalOutputProps {
  lines: OutputLine[]
}

export function TerminalOutput({ lines }: TerminalOutputProps) {
  return (
    <div className="whitespace-pre-wrap break-words">
      {lines.map((line, i) => {
        const color = line.color ?? "default"
        const className = COLOR_MAP[color]

        if (color === "link" && line.href) {
          return (
            <div key={i}>
              <a
                href={line.href}
                target="_blank"
                rel="noopener noreferrer"
                className={className}
              >
                {line.text}
              </a>
            </div>
          )
        }

        return (
          <div key={i} className={className}>
            {line.text}
          </div>
        )
      })}
    </div>
  )
}
