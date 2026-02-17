import { useState, useEffect, useCallback, useRef, useMemo, type ComponentPropsWithoutRef } from "react"
import Markdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { motion, AnimatePresence } from "motion/react"
import { Lock, FileText, Bookmark as BookmarkIcon, Home } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar"

const vaultModules = import.meta.glob("/src/content/vault/**/*.md", {
  eager: true,
  query: "?raw",
  import: "default",
}) as Record<string, string>

interface VaultFile {
  slug: string
  category: string
  label: string
  content: string
}

interface Bookmark {
  headingId: string
  headingText: string
  scrollY: number
}

interface VaultStats {
  totalDocs: number
  totalWords: number
  totalReadingTime: number
}

interface TocEntry {
  level: number
  text: string
  id: string
}

interface FileStats {
  lineCount: number
  wordCount: number
  readingTime: number
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .trim()
}

function extractTextFromChildren(children: React.ReactNode): string {
  if (typeof children === "string") return children
  if (typeof children === "number") return String(children)
  if (Array.isArray(children)) return children.map(extractTextFromChildren).join("")
  if (children && typeof children === "object" && "props" in children) {
    return extractTextFromChildren((children as React.ReactElement<{children?: React.ReactNode}>).props.children)
  }
  return ""
}

function kebabToTitle(s: string): string {
  return s
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ")
}

function getSavedProgress(category: string, slug: string): number {
  const val = localStorage.getItem(`vault-progress-${category}/${slug}`)
  return val ? parseInt(val, 10) : 0
}

function extractToc(markdown: string): TocEntry[] {
  const headingRegex = /^(#{1,4})\s+(.+)$/gm
  const entries: TocEntry[] = []
  let match: RegExpExecArray | null
  while ((match = headingRegex.exec(markdown)) !== null) {
    entries.push({ level: match[1].length, text: match[2].trim(), id: slugify(match[2].trim()) })
  }
  return entries
}

function computeFileStats(content: string): FileStats {
  const lines = content.split("\n").length
  const words = content.split(/\s+/).filter(Boolean).length
  return { lineCount: lines, wordCount: words, readingTime: Math.ceil(words / 200) }
}

const vaultFiles: VaultFile[] = Object.entries(vaultModules)
  .map(([path, content]) => {
    const parts = path.replace("/src/content/vault/", "").split("/")
    const category = parts.length > 1 ? parts[0] : "uncategorized"
    const slug = parts[parts.length - 1].replace(/\.md$/, "")
    return {
      slug,
      category,
      label: kebabToTitle(slug),
      content: content as string,
    }
  })
  .sort((a, b) => a.label.localeCompare(b.label))

const groupedFiles = vaultFiles.reduce<Record<string, VaultFile[]>>(
  (acc, file) => {
    const group = file.category
    if (!acc[group]) acc[group] = []
    acc[group].push(file)
    return acc
  },
  {}
)

const EXPECTED_HASH =
  "d714f4049edd6ea4291f2adf7ca5527ec025aaa588b34d4d87533e81f0295bd3"
const SESSION_KEY = "vault-unlocked"

async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder()
  const data = encoder.encode(password)
  const buffer = await crypto.subtle.digest("SHA-256", data)
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("")
}

function mdComponents(
  currentBookmark: Bookmark | null,
  toggleBookmark: (id: string, text: string) => void
): Record<string, React.ComponentType<ComponentPropsWithoutRef<any>>> {
  return {
    h1: ({ children, ...props }: ComponentPropsWithoutRef<"h1">) => {
      const text = extractTextFromChildren(children)
      const id = slugify(text)
      return (
        <h1
          id={id}
          className={cn(
            "group text-4xl font-mono font-bold mt-10 mb-6 flex items-baseline scroll-mt-60",
            currentBookmark?.headingId === id && "border-l-2 border-tokyo-yellow pl-2"
          )}
          {...props}
        >
          <span className="text-primary mr-2">&gt;</span>
          {children}
          <BookmarkButton headingId={id} headingText={text} currentBookmark={currentBookmark} toggleBookmark={toggleBookmark} />
        </h1>
      )
    },
    h2: ({ children, ...props }: ComponentPropsWithoutRef<"h2">) => {
      const text = extractTextFromChildren(children)
      const id = slugify(text)
      return (
        <h2
          id={id}
          className={cn(
            "group text-2xl font-mono font-semibold mt-10 mb-4 flex items-baseline text-tokyo-magenta scroll-mt-60",
            currentBookmark?.headingId === id && "border-l-2 border-tokyo-yellow pl-2"
          )}
          {...props}
        >
          <span className="text-tokyo-magenta mr-2">&gt;</span>
          {children}
          <BookmarkButton headingId={id} headingText={text} currentBookmark={currentBookmark} toggleBookmark={toggleBookmark} />
        </h2>
      )
    },
    h3: ({ children, ...props }: ComponentPropsWithoutRef<"h3">) => {
      const text = extractTextFromChildren(children)
      const id = slugify(text)
      return (
        <h3
          id={id}
          className={cn(
            "group text-xl font-mono font-semibold mt-8 mb-3 text-tokyo-cyan flex items-baseline scroll-mt-60",
            currentBookmark?.headingId === id && "border-l-2 border-tokyo-yellow pl-2"
          )}
          {...props}
        >
          {children}
          <BookmarkButton headingId={id} headingText={text} currentBookmark={currentBookmark} toggleBookmark={toggleBookmark} />
        </h3>
      )
    },
    h4: ({ children, ...props }: ComponentPropsWithoutRef<"h4">) => {
      const text = extractTextFromChildren(children)
      const id = slugify(text)
      return (
        <h4
          id={id}
          className={cn(
            "group text-lg font-mono font-medium mt-6 mb-2 text-tokyo-yellow flex items-baseline scroll-mt-60",
            currentBookmark?.headingId === id && "border-l-2 border-tokyo-yellow pl-2"
          )}
          {...props}
        >
          {children}
          <BookmarkButton headingId={id} headingText={text} currentBookmark={currentBookmark} toggleBookmark={toggleBookmark} />
        </h4>
      )
    },
    p: ({ children, ...props }: ComponentPropsWithoutRef<"p">) => (
      <p
        className="text-base text-secondary-foreground leading-relaxed mb-4"
        {...props}
      >
        {children}
      </p>
    ),
    a: ({ children, ...props }: ComponentPropsWithoutRef<"a">) => (
      <a
        className="text-tokyo-cyan hover:underline underline-offset-4 transition-colors hover:text-primary"
        target="_blank"
        rel="noopener noreferrer"
        {...props}
      >
        {children}
      </a>
    ),
    strong: ({ children, ...props }: ComponentPropsWithoutRef<"strong">) => (
      <strong className="text-foreground font-semibold" {...props}>
        {children}
      </strong>
    ),
    em: ({ children, ...props }: ComponentPropsWithoutRef<"em">) => (
      <em className="text-tokyo-cyan italic" {...props}>
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
      <li
        className="text-base text-secondary-foreground leading-relaxed flex items-start"
        {...props}
      >
        <span className="text-tokyo-green mr-2 mt-0.5 shrink-0">-</span>
        <span className="flex-1">{children}</span>
      </li>
    ),
    code: ({ children, className, ...props }: ComponentPropsWithoutRef<"code">) => {
      const isBlock = /language-(\w+)/.test(className || "")
      if (isBlock) {
        return (
          <code className={cn("font-mono text-sm text-secondary-foreground", className)} {...props}>
            {children}
          </code>
        )
      }
      return (
        <code
          className="bg-muted/80 px-1.5 py-0.5 rounded text-sm font-mono text-tokyo-green border border-border/40"
          {...props}
        >
          {children}
        </code>
      )
    },
    pre: ({ children, ...props }: ComponentPropsWithoutRef<"pre">) => (
      <pre
        className="bg-muted/50 border border-border/50 border-l-2 border-l-primary rounded-lg p-4 overflow-x-auto my-6"
        {...props}
      >
        {children}
      </pre>
    ),
    table: ({ children, ...props }: ComponentPropsWithoutRef<"table">) => (
      <div className="overflow-x-auto my-6 rounded-lg border border-border">
        <table className="w-full text-sm font-mono" {...props}>
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
      <th
        className="px-4 py-3 text-left text-primary font-semibold"
        {...props}
      >
        {children}
      </th>
    ),
    td: ({ children, ...props }: ComponentPropsWithoutRef<"td">) => (
      <td
        className="px-4 py-2.5 text-secondary-foreground border-t border-border/50"
        {...props}
      >
        {children}
      </td>
    ),
    tr: ({ children, ...props }: ComponentPropsWithoutRef<"tr">) => (
      <tr className="even:bg-muted/20" {...props}>
        {children}
      </tr>
    ),
    hr: ({ ...props }: ComponentPropsWithoutRef<"hr">) => (
      <hr className="border-none h-px bg-gradient-to-r from-border via-primary/30 to-border my-10" {...props} />
    ),
    input: ({ ...props }: ComponentPropsWithoutRef<"input">) => (
      <input
        className="mr-2 accent-primary"
        disabled
        {...props}
      />
    ),
  }
}

function PasswordGate({ onUnlock }: { onUnlock: () => void }) {
  const [password, setPassword] = useState("")
  const [error, setError] = useState(false)
  const [checking, setChecking] = useState(false)

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault()
      if (checking || !password.trim()) return
      setChecking(true)
      setError(false)

      const hashed = await hashPassword(password)
      if (hashed === EXPECTED_HASH) {
        sessionStorage.setItem(SESSION_KEY, "true")
        onUnlock()
      } else {
        setError(true)
        setPassword("")
        setTimeout(() => setError(false), 1500)
      }
      setChecking(false)
    },
    [password, checking, onUnlock]
  )

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="w-full max-w-sm"
      >
        <form onSubmit={handleSubmit} className="flex flex-col items-center gap-6">
          <motion.div
            animate={error ? { x: [0, -8, 8, -6, 6, -3, 3, 0] } : {}}
            transition={{ duration: 0.4 }}
          >
            <Lock
              className={cn(
                "size-8 transition-colors duration-300",
                error ? "text-destructive" : "text-muted-foreground"
              )}
            />
          </motion.div>

          <div className="w-full relative">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="password"
              autoFocus
              className={cn(
                "w-full bg-muted/50 border rounded-lg px-4 py-3",
                "font-mono text-sm text-foreground placeholder:text-muted-foreground",
                "outline-none transition-all duration-300",
                "focus:border-primary focus:ring-1 focus:ring-primary/30",
                error
                  ? "border-destructive ring-1 ring-destructive/30"
                  : "border-border"
              )}
            />
            <AnimatePresence>
              {error && (
                <motion.p
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="absolute -bottom-6 left-0 text-xs font-mono text-destructive"
                >
                  wrong password
                </motion.p>
              )}
            </AnimatePresence>
          </div>

          <p className="text-xs font-mono text-muted-foreground/60 select-none">
            this is a private space
          </p>
        </form>
      </motion.div>
    </div>
  )
}

function BookmarkButton({
  headingId,
  headingText,
  currentBookmark,
  toggleBookmark,
}: {
  headingId: string
  headingText: string
  currentBookmark: Bookmark | null
  toggleBookmark: (id: string, text: string) => void
}) {
  const isBookmarked = currentBookmark?.headingId === headingId

  return (
    <button
      onClick={() => toggleBookmark(headingId, headingText)}
      className={cn(
        "ml-2 opacity-0 group-hover:opacity-100 transition-opacity",
        isBookmarked && "opacity-100 text-tokyo-yellow"
      )}
      aria-label={isBookmarked ? "Remove bookmark" : "Bookmark this section"}
    >
      <BookmarkIcon className="size-4" />
    </button>
  )
}

function CategoryCard({
  category,
  files,
  onSelectFile,
}: {
  category: string
  files: VaultFile[]
  onSelectFile: (key: string) => void
}) {
  return (
    <div className="border border-border rounded-lg p-4 bg-muted/20">
      <h3 className="font-mono font-semibold text-sm uppercase tracking-wider text-primary mb-3">
        {kebabToTitle(category)}
      </h3>
      <p className="text-xs text-muted-foreground font-mono mb-3">
        {files.length} {files.length === 1 ? "file" : "files"}
      </p>
      <div className="space-y-2">
        {files.map((f) => {
          const key = `${f.category}/${f.slug}`
          const progress = getSavedProgress(f.category, f.slug)
          return (
            <button
              key={key}
              onClick={() => onSelectFile(key)}
              className="w-full flex items-center gap-2 text-left group"
            >
              <FileText className="size-3.5 text-muted-foreground" />
              <span className="font-mono text-sm text-secondary-foreground group-hover:text-primary transition-colors flex-1">
                {f.label}
              </span>
              {progress > 0 && (
                <span className="text-xs font-mono text-tokyo-green">
                  {progress}%
                </span>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}

function BookmarksSection({
  vaultFiles: files,
  onSelectBookmark,
}: {
  vaultFiles: VaultFile[]
  onSelectBookmark: (fileKey: string, headingId: string) => void
}) {
  const bookmarks = files
    .map((f) => {
      const key = `${f.category}/${f.slug}`
      const raw = localStorage.getItem(`vault-bookmark-${key}`)
      if (!raw) return null
      const bm: Bookmark = JSON.parse(raw)
      return { file: f, key, bookmark: bm }
    })
    .filter(Boolean) as Array<{ file: VaultFile; key: string; bookmark: Bookmark }>

  if (bookmarks.length === 0) return null

  return (
    <div>
      <h2 className="font-mono font-semibold text-sm uppercase tracking-wider text-tokyo-yellow mb-3">
        Bookmarks
      </h2>
      <div className="space-y-2">
        {bookmarks.map(({ file, key, bookmark }) => (
          <button
            key={key}
            onClick={() => onSelectBookmark(key, bookmark.headingId)}
            className="flex items-center gap-2 text-left group"
          >
            <BookmarkIcon className="size-3.5 text-tokyo-yellow" />
            <span className="font-mono text-sm text-secondary-foreground">
              {file.label}
            </span>
            <span className="text-xs text-muted-foreground font-mono">
              {bookmark.headingText}
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}

function VaultDashboard({
  groupedFiles,
  stats,
  onSelectFile,
  onSelectBookmark,
}: {
  groupedFiles: Record<string, VaultFile[]>
  stats: VaultStats
  onSelectFile: (key: string) => void
  onSelectBookmark: (fileKey: string, headingId: string) => void
}) {
  return (
    <div className="max-w-4xl mx-auto px-6 md:px-10 py-10 md:py-14">
      <div className="mb-10">
        <h1 className="text-4xl font-mono font-bold mb-2">
          <span className="text-primary">&gt;</span> Vault
        </h1>
        <p className="text-muted-foreground font-mono text-sm">
          Personal knowledge base. Roadmaps, interview prep, project notes.
        </p>
      </div>

      <div className="flex gap-6 mb-10 font-mono text-sm">
        <div>
          <span className="text-tokyo-cyan">{stats.totalDocs}</span>
          <span className="text-muted-foreground ml-1">documents</span>
        </div>
        <div>
          <span className="text-tokyo-green">
            {stats.totalWords.toLocaleString()}
          </span>
          <span className="text-muted-foreground ml-1">words</span>
        </div>
        <div>
          <span className="text-tokyo-magenta">{stats.totalReadingTime}</span>
          <span className="text-muted-foreground ml-1">min total</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
        {Object.entries(groupedFiles).map(([category, files]) => (
          <CategoryCard
            key={category}
            category={category}
            files={files}
            onSelectFile={onSelectFile}
          />
        ))}
      </div>

      <BookmarksSection
        vaultFiles={vaultFiles}
        onSelectBookmark={onSelectBookmark}
      />
    </div>
  )
}

function TableOfContents({
  entries,
  activeId,
  onClickEntry,
}: {
  entries: TocEntry[]
  activeId: string | null
  onClickEntry: (id: string) => void
}) {
  if (entries.length < 4) return null

  return (
    <nav className="hidden xl:block fixed right-4 top-1/4 max-w-[200px] max-h-[60vh] overflow-y-auto">
      <p className="font-mono text-xs uppercase tracking-wider text-muted-foreground mb-2">
        On this page
      </p>
      <ul className="space-y-1">
        {entries.map((entry) => (
          <li
            key={entry.id}
            style={{ paddingLeft: `${(entry.level - 1) * 12}px` }}
          >
            <button
              onClick={() => onClickEntry(entry.id)}
              className={cn(
                "text-xs font-mono text-left w-full truncate transition-colors py-0.5",
                activeId === entry.id
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {entry.text}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  )
}

function MetadataBar({
  file,
  stats,
  bookmark,
}: {
  file: VaultFile
  stats: FileStats
  bookmark: Bookmark | null
}) {
  return (
    <div className="flex flex-wrap items-center gap-x-2 text-sm font-mono text-muted-foreground mb-6 pb-4 border-b border-border/50">
      <span className="flex items-center gap-1">
        <FileText className="size-3.5" />
        {file.label}
      </span>
      <span>·</span>
      <span>{stats.lineCount.toLocaleString()} lines</span>
      <span>·</span>
      <span>~{stats.wordCount.toLocaleString()} words</span>
      <span>·</span>
      <span>{stats.readingTime} min read</span>
      {bookmark && (
        <>
          <span>·</span>
          <span className="text-tokyo-yellow flex items-center gap-1">
            <BookmarkIcon className="size-3" />
            {bookmark.headingText}
          </span>
        </>
      )}
    </div>
  )
}

function VaultViewer() {
  const [active, setActive] = useState<string | null>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const pendingScrollTarget = useRef<string | null>(null)
  const progressRef = useRef(0)
  const topBarRef = useRef<HTMLDivElement>(null)
  const activeBarRef = useRef<HTMLDivElement>(null)
  const [currentBookmark, setCurrentBookmark] = useState<Bookmark | null>(null)
  const [showContinuePill, setShowContinuePill] = useState(false)
  const activeFile = active ? vaultFiles.find((f) => `${f.category}/${f.slug}` === active) ?? null : null

  const vaultStats: VaultStats = useMemo(() => {
    let totalWords = 0
    for (const f of vaultFiles) {
      totalWords += f.content.split(/\s+/).filter(Boolean).length
    }
    return {
      totalDocs: vaultFiles.length,
      totalWords,
      totalReadingTime: Math.ceil(totalWords / 200),
    }
  }, [])

  const toc = useMemo(() => (activeFile ? extractToc(activeFile.content) : []), [activeFile])
  const [activeTocId, setActiveTocId] = useState<string | null>(null)
  const [showToc, _setShowToc] = useState(true)

  const fileStats = useMemo(() => (activeFile ? computeFileStats(activeFile.content) : null), [activeFile])

  const toggleBookmark = useCallback((headingId: string, headingText: string) => {
    if (!active) return
    const key = `vault-bookmark-${active}`
    if (currentBookmark?.headingId === headingId) {
      localStorage.removeItem(key)
      setCurrentBookmark(null)
    } else {
      const scrollY = contentRef.current?.scrollTop ?? 0
      const bm: Bookmark = { headingId, headingText, scrollY }
      localStorage.setItem(key, JSON.stringify(bm))
      setCurrentBookmark(bm)
    }
  }, [active, currentBookmark])

  const handleBookmarkNavigation = useCallback((fileKey: string, headingId: string) => {
    pendingScrollTarget.current = headingId
    setActive(fileKey)
  }, [])

  const components = mdComponents(currentBookmark, toggleBookmark)

  useEffect(() => {
    const el = contentRef.current
    if (!el || !active) return

    let timer: ReturnType<typeof setTimeout>

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = el
      const maxScroll = scrollHeight - clientHeight
      if (maxScroll <= 0) return
      const pct = Math.round((scrollTop / maxScroll) * 100)
      progressRef.current = pct

      // Direct DOM updates — no React re-render
      if (topBarRef.current) {
        topBarRef.current.style.width = `${pct}%`
      }
      if (activeBarRef.current) {
        activeBarRef.current.style.width = `${pct}%`
      }

      // Debounce localStorage write
      clearTimeout(timer)
      timer = setTimeout(() => {
        localStorage.setItem(`vault-progress-${active}`, String(pct))
      }, 200)
    }

    el.addEventListener("scroll", handleScroll, { passive: true })
    return () => {
      clearTimeout(timer)
      el.removeEventListener("scroll", handleScroll)
    }
  }, [active])

  useEffect(() => {
    if (!active) {
      progressRef.current = 0
      if (topBarRef.current) topBarRef.current.style.width = "0%"
      return
    }
    const saved = localStorage.getItem(`vault-progress-${active}`)
    const pct = saved ? parseInt(saved, 10) : 0
    progressRef.current = pct

    if (topBarRef.current) topBarRef.current.style.width = `${pct}%`
    if (activeBarRef.current) activeBarRef.current.style.width = `${pct}%`

    const timer = setTimeout(() => {
      if (pendingScrollTarget.current) {
        const headingId = pendingScrollTarget.current
        pendingScrollTarget.current = null
        document.getElementById(headingId)?.scrollIntoView({ behavior: "smooth" })
        setShowContinuePill(false)
        return
      }
      const el = contentRef.current
      if (!el || pct === 0) return
      const maxScroll = el.scrollHeight - el.clientHeight
      el.scrollTop = (pct / 100) * maxScroll
    }, 350)

    return () => clearTimeout(timer)
  }, [active])

  useEffect(() => {
    if (!active) {
      setCurrentBookmark(null)
      return
    }
    const saved = localStorage.getItem(`vault-bookmark-${active}`)
    setCurrentBookmark(saved ? JSON.parse(saved) : null)
  }, [active])

  useEffect(() => {
    if (currentBookmark) {
      setShowContinuePill(true)
      const timer = setTimeout(() => setShowContinuePill(false), 5000)
      return () => clearTimeout(timer)
    }
    setShowContinuePill(false)
  }, [active, currentBookmark])

  useEffect(() => {
    if (!activeFile || toc.length < 4) return

    const headingEls = toc
      .map((entry) => document.getElementById(entry.id))
      .filter(Boolean) as HTMLElement[]

    if (headingEls.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveTocId(entry.target.id)
            break
          }
        }
      },
      { rootMargin: "-10% 0px -80% 0px", threshold: 0 }
    )

    headingEls.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [activeFile, toc])

  function scrollToHeading(id: string) {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <SidebarProvider className="h-dvh">
      <Sidebar>
        <SidebarContent>
          <SidebarGroup>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={active === null}
                  onClick={() => setActive(null)}
                  className="font-mono"
                >
                  <Home className="size-4" />
                  <span>Overview</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroup>
          {Object.entries(groupedFiles).map(([category, files]) => (
            <SidebarGroup key={category}>
              <SidebarGroupLabel className="font-mono uppercase tracking-wider">
                {kebabToTitle(category)}
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {files.map((f) => (
                    <SidebarMenuItem key={`${f.category}/${f.slug}`}>
                      <SidebarMenuButton
                        isActive={active === `${f.category}/${f.slug}`}
                        onClick={() => setActive(`${f.category}/${f.slug}`)}
                        className="font-mono"
                      >
                        <FileText className="size-4" />
                        <span>{f.label}</span>
                      </SidebarMenuButton>
                      <div className="mx-2 mb-1 h-0.5 bg-muted rounded-full overflow-hidden">
                        <div
                          ref={active === `${f.category}/${f.slug}` ? activeBarRef : undefined}
                          className="h-full bg-tokyo-green transition-[width] duration-300"
                          style={{
                            width: `${getSavedProgress(f.category, f.slug)}%`,
                          }}
                        />
                      </div>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          ))}
        </SidebarContent>
      </Sidebar>
      <SidebarInset className="min-h-0 overflow-hidden">
        {active !== null && (
          <div
            ref={topBarRef}
            className="h-0.5 bg-primary transition-[width] duration-150 ease-out"
            style={{ width: "0%" }}
          />
        )}
        <header className="md:hidden flex items-center gap-2 p-4 border-b border-border">
          <SidebarTrigger />
          <span className="font-mono text-sm text-muted-foreground">
            {active === null ? "Overview" : activeFile?.label}
          </span>
        </header>
        <div ref={contentRef} className="flex-1 overflow-y-auto min-h-0">
          <AnimatePresence>
            {showContinuePill && currentBookmark && active !== null && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="sticky top-0 z-10 flex items-center gap-2 bg-muted/90 backdrop-blur border border-border rounded-lg px-4 py-2 mb-4 mx-6 md:mx-10 mt-4 font-mono text-sm"
              >
                <span className="text-muted-foreground">Continue from</span>
                <span className="text-tokyo-yellow">{currentBookmark.headingText}</span>
                <button
                  onClick={() => {
                    document.getElementById(currentBookmark.headingId)?.scrollIntoView({ behavior: "smooth" })
                    setShowContinuePill(false)
                  }}
                  className="ml-auto text-primary hover:underline"
                >
                  Go
                </button>
                <button
                  onClick={() => setShowContinuePill(false)}
                  className="text-muted-foreground hover:text-foreground"
                >
                  Dismiss
                </button>
              </motion.div>
            )}
          </AnimatePresence>
          <AnimatePresence mode="wait">
            {active === null ? (
              <motion.div
                key="dashboard"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
              >
                <VaultDashboard
                  groupedFiles={groupedFiles}
                  stats={vaultStats}
                  onSelectFile={setActive}
                  onSelectBookmark={handleBookmarkNavigation}
                />
              </motion.div>
            ) : (
              <motion.div
                key={active}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
                className="max-w-6xl mx-auto px-6 md:px-10 py-10 md:py-14"
              >
                {activeFile && fileStats && (
                  <MetadataBar
                    file={activeFile}
                    stats={fileStats}
                    bookmark={currentBookmark}
                  />
                )}
                {activeFile ? (
                  <Markdown remarkPlugins={[remarkGfm]} components={components}>
                    {activeFile.content}
                  </Markdown>
                ) : (
                  <p className="text-muted-foreground font-mono">No files found.</p>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        {showToc && active !== null && toc.length >= 4 && (
          <TableOfContents
            entries={toc}
            activeId={activeTocId}
            onClickEntry={scrollToHeading}
          />
        )}
      </SidebarInset>
    </SidebarProvider>
  )
}

export default function VaultPage() {
  const [unlocked, setUnlocked] = useState(
    () => sessionStorage.getItem(SESSION_KEY) === "true"
  )

  useEffect(() => {
    const stored = sessionStorage.getItem(SESSION_KEY) === "true"
    if (stored !== unlocked) setUnlocked(stored)
  }, [])

  return (
    <AnimatePresence mode="wait">
      {unlocked ? (
        <motion.div
          key="viewer"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
        >
          <VaultViewer />
        </motion.div>
      ) : (
        <motion.div
          key="gate"
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 0.3 }}
        >
          <PasswordGate onUnlock={() => setUnlocked(true)} />
        </motion.div>
      )}
    </AnimatePresence>
  )
}
