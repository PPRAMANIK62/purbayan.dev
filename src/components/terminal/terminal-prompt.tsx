const HOME = "/home/purbayan"

interface TerminalPromptProps {
  cwd: string
  flagCount: number
}

export function TerminalPrompt({ cwd, flagCount }: TerminalPromptProps) {
  // Display cwd relative to home as ~
  const displayPath = cwd === HOME ? "~" : cwd.startsWith(HOME + "/") ? "~" + cwd.slice(HOME.length) : cwd

  return (
    <span className="select-none">
      {flagCount > 0 && (
        <span className="text-tokyo-yellow">[{flagCount}/7] </span>
      )}
      <span className="terminal-prompt">purbayan</span>
      <span className="text-foreground">@</span>
      <span className="terminal-prompt">portfolio</span>
      <span className="text-foreground">:</span>
      <span className="terminal-accent">{displayPath}</span>
      <span className="text-foreground">$ </span>
    </span>
  )
}
