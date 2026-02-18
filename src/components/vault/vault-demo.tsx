import {
  useState,
  useEffect,
  useRef,
  useCallback,
  type DragEvent,
  type ComponentPropsWithoutRef,
} from "react"
import { useLocation, useNavigate } from "react-router-dom"
import Markdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { motion, AnimatePresence } from "motion/react"
import { Upload, FileText, ArrowLeft, Eye, EyeOff, Sparkles, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { computeFileStats, extractTextFromChildren } from "@/lib/vault-utils"
import { redactedMdComponents } from "./redacted-components"
import { CodeBlock } from "@/components/blog/code-block"

const easing = [0.25, 0.46, 0.45, 0.94] as const

const MAX_FILE_SIZE = 100 * 1024 // 100KB
const ACCEPTED_EXTENSIONS = [".md", ".txt"]

function validateFile(file: File): string | null {
  const ext = file.name.slice(file.name.lastIndexOf(".")).toLowerCase()
  if (!ACCEPTED_EXTENSIONS.includes(ext)) return "Only .md and .txt files are supported"
  if (file.size > MAX_FILE_SIZE) return "File too large (max 100KB)"
  return null
}

const revealedComponents: Record<string, React.ComponentType<ComponentPropsWithoutRef<any>>> = {
  h1: ({ children, ...props }: ComponentPropsWithoutRef<"h1">) => (
    <h1 className="text-4xl font-mono font-bold mt-10 mb-6 flex items-baseline" {...props}>
      <span className="text-primary mr-2">&gt;</span>
      {children}
    </h1>
  ),
  h2: ({ children, ...props }: ComponentPropsWithoutRef<"h2">) => (
    <h2
      className="text-2xl font-mono font-semibold mt-10 mb-4 text-tokyo-magenta flex items-baseline"
      {...props}
    >
      <span className="text-tokyo-magenta mr-2">&gt;</span>
      {children}
    </h2>
  ),
  h3: ({ children, ...props }: ComponentPropsWithoutRef<"h3">) => (
    <h3
      className="text-xl font-mono font-semibold mt-8 mb-3 text-tokyo-cyan flex items-baseline"
      {...props}
    >
      {children}
    </h3>
  ),
  h4: ({ children, ...props }: ComponentPropsWithoutRef<"h4">) => (
    <h4
      className="text-lg font-mono font-medium mt-6 mb-2 text-tokyo-yellow flex items-baseline"
      {...props}
    >
      {children}
    </h4>
  ),
  p: ({ children, ...props }: ComponentPropsWithoutRef<"p">) => (
    <p className="mb-4 font-mono text-base leading-relaxed text-secondary-foreground" {...props}>
      {children}
    </p>
  ),
  a: ({ children, ...props }: ComponentPropsWithoutRef<"a">) => (
    <a
      className="text-tokyo-cyan underline underline-offset-2 hover:text-primary transition-colors"
      {...props}
    >
      {children}
    </a>
  ),
  strong: ({ children, ...props }: ComponentPropsWithoutRef<"strong">) => (
    <strong className="font-semibold text-foreground" {...props}>
      {children}
    </strong>
  ),
  em: ({ children, ...props }: ComponentPropsWithoutRef<"em">) => (
    <em className="italic text-tokyo-yellow" {...props}>
      {children}
    </em>
  ),
  blockquote: ({ children, ...props }: ComponentPropsWithoutRef<"blockquote">) => (
    <blockquote
      className="border-l-2 border-tokyo-teal bg-muted/30 pl-4 py-3 my-6 rounded-r-lg"
      {...props}
    >
      {children}
    </blockquote>
  ),
  ul: ({ children, ...props }: ComponentPropsWithoutRef<"ul">) => (
    <ul className="space-y-2.5 mb-5" {...props}>
      {children}
    </ul>
  ),
  ol: ({ children, ...props }: ComponentPropsWithoutRef<"ol">) => (
    <ol className="space-y-2.5 mb-5 list-decimal list-inside" {...props}>
      {children}
    </ol>
  ),
  li: ({ children, ...props }: ComponentPropsWithoutRef<"li">) => (
    <li className="flex items-start mb-2 font-mono text-base text-secondary-foreground" {...props}>
      <span className="text-tokyo-green mr-2 mt-0.5 shrink-0">-</span>
      <span className="flex-1">{children}</span>
    </li>
  ),
  code: ({ className, children, ...props }: ComponentPropsWithoutRef<"code">) => {
    const match = /language-(\w+)/.exec(className || "")
    if (match) {
      const code = extractTextFromChildren(children)
      return <CodeBlock language={match[1]} code={code} />
    }
    return (
      <code
        className="bg-muted/80 px-1.5 py-0.5 rounded text-base font-mono text-tokyo-orange border border-border/40"
        {...props}
      >
        {children}
      </code>
    )
  },
  pre: ({ children }: ComponentPropsWithoutRef<"pre">) => <div className="my-6">{children}</div>,
  table: ({ children, ...props }: ComponentPropsWithoutRef<"table">) => (
    <div className="overflow-x-auto my-6 rounded-lg border border-border">
      <table className="w-full text-base font-mono" {...props}>
        {children}
      </table>
    </div>
  ),
  thead: ({ children, ...props }: ComponentPropsWithoutRef<"thead">) => (
    <thead className="bg-primary/10 border-b border-border" {...props}>
      {children}
    </thead>
  ),
  th: ({ children, ...props }: ComponentPropsWithoutRef<"th">) => (
    <th className="px-4 py-3 text-left text-primary font-semibold" {...props}>
      {children}
    </th>
  ),
  td: ({ children, ...props }: ComponentPropsWithoutRef<"td">) => (
    <td className="px-4 py-2.5 text-secondary-foreground border-t border-border/50" {...props}>
      {children}
    </td>
  ),
  tr: ({ children, ...props }: ComponentPropsWithoutRef<"tr">) => (
    <tr className="even:bg-muted/20" {...props}>
      {children}
    </tr>
  ),
  hr: (props: ComponentPropsWithoutRef<"hr">) => (
    <hr
      className="border-none h-px bg-gradient-to-r from-border via-primary/30 to-border my-10"
      {...props}
    />
  ),
}

export function VaultDemoPrompt() {
  const navigate = useNavigate()
  const [isDragging, setIsDragging] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const clearError = useCallback(() => {
    setError(null)
  }, [])

  const handleFile = useCallback(
    (file: File) => {
      const validationError = validateFile(file)
      if (validationError) {
        setError(validationError)
        return
      }
      clearError()
      const reader = new FileReader()
      reader.onload = (e) => {
        const text = e.target?.result
        if (typeof text === "string") {
          navigate("/vault/demo", { state: { content: text, fileName: file.name } })
        }
      }
      reader.readAsText(file)
    },
    [navigate, clearError],
  )

  const handleDrop = useCallback(
    (e: DragEvent<HTMLDivElement>) => {
      e.preventDefault()
      setIsDragging(false)
      const file = e.dataTransfer.files[0]
      if (file) handleFile(file)
    },
    [handleFile],
  )

  const handleDragOver = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (file) handleFile(file)
      // Reset input so the same file can be re-selected
      e.target.value = ""
    },
    [handleFile],
  )

  const loadDemoFile = useCallback(() => {
    navigate("/vault/demo")
  }, [navigate])

  return (
    <motion.div
      role="button"
      tabIndex={0}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: easing }}
      onClick={() => inputRef.current?.click()}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") inputRef.current?.click()
      }}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      className={cn(
        "rounded-lg border border-border/80 border-l-2 border-l-tokyo-cyan bg-muted/20 p-6 cursor-pointer transition-colors",
        isDragging && "border-primary/50 bg-primary/5",
      )}
    >
      <div className="flex items-center gap-2 mb-1">
        <Sparkles className="size-3.5 text-tokyo-cyan" />
        <h3 className="font-mono text-sm font-semibold text-foreground">Try it yourself</h3>
      </div>
      <p className="font-mono text-xs text-muted-foreground mb-5">
        Drop a markdown file to see the vault experience.
      </p>

      <div className="flex flex-col items-center gap-3 py-6">
        <Upload className="size-7 text-muted-foreground" />
        <span className="font-mono text-sm text-muted-foreground text-center">
          Drop .md / .txt here, or click to browse
        </span>
        <input
          ref={inputRef}
          type="file"
          accept=".md,.txt"
          onChange={handleInputChange}
          className="sr-only"
          tabIndex={-1}
        />
      </div>

      <div className="flex items-center justify-center gap-2 text-xs font-mono text-muted-foreground">
        <span className="h-px flex-1 bg-border/50" />
        <span>or</span>
        <span className="h-px flex-1 bg-border/50" />
      </div>

      <div className="flex justify-center mt-3">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            loadDemoFile()
          }}
          className="font-mono text-sm text-primary hover:underline transition-colors"
        >
          Use demo file →
        </button>
      </div>

      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="text-xs font-mono text-tokyo-red mt-2"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>

      <p className="text-xs text-muted-foreground font-mono mt-4 text-center">
        Your file stays in your browser. Nothing is uploaded.
      </p>
    </motion.div>
  )
}

export function VaultDemoView() {
  const location = useLocation()
  const navigate = useNavigate()
  const [mode, setMode] = useState<"redacted" | "revealed">("revealed")
  const [content, setContent] = useState<string | null>(
    (location.state as { content?: string } | null)?.content ?? null,
  )
  const [fileName, setFileName] = useState<string>(
    (location.state as { fileName?: string } | null)?.fileName ?? "demo-vault.md",
  )
  const [loading, setLoading] = useState(content === null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (content !== null) return
    let cancelled = false
    setLoading(true)
    fetch("/demo-vault.md")
      .then((res) => res.text())
      .then((text) => {
        if (!cancelled) {
          setContent(text)
          setFileName("demo-vault.md")
        }
      })
      .catch(() => {
        if (!cancelled) setError("Failed to load demo file")
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [content])

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-3">
        <Loader2 className="size-5 text-muted-foreground animate-spin" />
        <span className="font-mono text-sm text-muted-foreground">Loading demo file...</span>
      </div>
    )
  }

  if (error || content === null) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-3">
        <span className="font-mono text-sm text-tokyo-red">
          {error ?? "Failed to load demo file"}
        </span>
        <button
          onClick={() => navigate("/vault")}
          className="flex items-center gap-1.5 font-mono text-sm text-muted-foreground hover:text-primary transition-colors"
        >
          <ArrowLeft className="size-3.5" />
          Back to vault
        </button>
      </div>
    )
  }

  const stats = computeFileStats(content)

  return (
    <div>
      <button
        onClick={() => navigate("/vault")}
        className="flex items-center gap-1.5 font-mono text-sm text-muted-foreground hover:text-primary transition-colors mb-6"
      >
        <ArrowLeft className="size-3.5" />
        Back to vault
      </button>

      <div className="bg-tokyo-teal/10 border border-tokyo-teal/20 rounded-md px-3 py-2 mb-4 font-mono text-xs text-tokyo-teal inline-flex items-center gap-2">
        <FileText className="size-3.5" />
        Viewing your file &mdash; <span className="text-foreground">{fileName}</span>
      </div>

      <div className="flex flex-wrap items-center gap-x-2 text-sm font-mono text-muted-foreground mb-6 pb-4 border-b border-border/50">
        <span className="flex items-center gap-1">
          <FileText className="size-3.5" />
          {fileName}
        </span>
        <span>&middot;</span>
        <span>{stats.lineCount.toLocaleString()} lines</span>
        <span>&middot;</span>
        <span>~{stats.wordCount.toLocaleString()} words</span>
        <span>&middot;</span>
        <span>{stats.readingTime} min read</span>
      </div>

      <div className="flex items-center justify-between mb-8">
        <div className="inline-flex rounded-lg border border-border bg-muted/30 p-1">
          <button
            type="button"
            onClick={() => setMode("redacted")}
            className={cn(
              "px-3 py-1.5 rounded-md font-mono text-xs transition-colors inline-flex items-center gap-1.5",
              mode === "redacted"
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            <EyeOff className="size-3.5" />
            <span className="hidden sm:inline">Redacted</span>
          </button>
          <button
            type="button"
            onClick={() => setMode("revealed")}
            className={cn(
              "px-3 py-1.5 rounded-md font-mono text-xs transition-colors inline-flex items-center gap-1.5",
              mode === "revealed"
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            <Eye className="size-3.5" />
            <span className="hidden sm:inline">Revealed</span>
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {mode === "redacted" ? (
          <motion.div
            key="redacted"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: easing }}
          >
            <Markdown remarkPlugins={[remarkGfm]} components={redactedMdComponents(false)}>
              {content}
            </Markdown>
          </motion.div>
        ) : (
          <motion.div
            key="revealed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: easing }}
          >
            <Markdown remarkPlugins={[remarkGfm]} components={revealedComponents}>
              {content}
            </Markdown>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
