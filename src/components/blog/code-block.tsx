import { useState } from "react"
import { Copy, Check } from "lucide-react"

export function CodeBlock({ language, code }: { language: string; code: string }) {
  const [copied, setCopied] = useState(false)

  function handleCopy() {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="group relative bg-muted/50 border border-border/50 rounded-lg">
      <div className="absolute top-2 right-2 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
        <span className="font-mono text-xs text-muted-foreground bg-muted/80 px-2 py-0.5 rounded">
          {language}
        </span>
        <button
          type="button"
          onClick={handleCopy}
          className="text-muted-foreground hover:text-foreground bg-muted/80 p-1 rounded transition-colors duration-150"
          aria-label="Copy code"
        >
          {copied ? <Check className="size-3.5 text-green-400" /> : <Copy className="size-3.5" />}
        </button>
      </div>
      <pre className="p-4 overflow-x-auto">
        <code className="font-mono text-sm text-secondary-foreground">
          {code}
        </code>
      </pre>
    </div>
  )
}
