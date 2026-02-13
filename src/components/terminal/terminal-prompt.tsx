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
      <span className="text-tokyo-green">purbayan</span>
      <span className="text-foreground">@</span>
      <span className="text-tokyo-green">portfolio</span>
      <span className="text-foreground">:</span>
      <span className="text-tokyo-cyan">{displayPath}</span>
      <span className="text-foreground">$ </span>
    </span>
  )
}
