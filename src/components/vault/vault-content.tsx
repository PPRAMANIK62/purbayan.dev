import { useState, useEffect, type ComponentPropsWithoutRef, type RefObject } from "react"
import Markdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { motion, AnimatePresence } from "motion/react"
import { FileText, Bookmark as BookmarkIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import {
  kebabToTitle,
  getSavedProgress,
  findNearestHeadingAbove,
  vaultFiles,
  type VaultFile,
  type VaultStats,
  type TocEntry,
  type FileStats,
  type Bookmark,
} from "@/lib/vault-utils"
import type { UseVaultBookmarksReturn } from "@/hooks/use-vault-bookmarks"

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
                <span className="text-xs font-mono text-tokyo-green">{progress}%</span>
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
  const bookmarks = files.flatMap((f) => {
    const key = `${f.category}/${f.slug}`
    const raw = localStorage.getItem(`vault-bookmark-${key}`)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    const bms: Bookmark[] = Array.isArray(parsed) ? parsed : [parsed]
    return bms.map((bm) => ({ file: f, key, bookmark: bm }))
  })

  if (bookmarks.length === 0) return null

  return (
    <div>
      <h2 className="font-mono font-semibold text-sm uppercase tracking-wider text-tokyo-yellow mb-3">
        Bookmarks
      </h2>
      <div className="space-y-2">
        {bookmarks.map(({ file, key, bookmark }) => (
          <button
            key={`${key}/${bookmark.headingId}`}
            onClick={() => onSelectBookmark(key, bookmark.headingId)}
            className="flex items-center gap-2 text-left group"
          >
            <BookmarkIcon className="size-3.5 text-tokyo-yellow" />
            <span className="font-mono text-sm text-secondary-foreground">{file.label}</span>
            <span className="text-xs text-muted-foreground font-mono">{bookmark.headingText}</span>
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
          <span className="text-tokyo-green">{stats.totalWords.toLocaleString()}</span>
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

      <BookmarksSection vaultFiles={vaultFiles} onSelectBookmark={onSelectBookmark} />
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
          <li key={entry.id} style={{ paddingLeft: `${(entry.level - 1) * 12}px` }}>
            <button
              onClick={() => onClickEntry(entry.id)}
              className={cn(
                "text-xs font-mono text-left w-full truncate transition-colors py-0.5",
                activeId === entry.id
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground",
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
  bookmarks,
}: {
  file: VaultFile
  stats: FileStats
  bookmarks: Bookmark[]
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
      {bookmarks.length > 0 && (
        <>
          <span>·</span>
          <span className="text-tokyo-yellow flex items-center gap-1">
            <BookmarkIcon className="size-3" />
            {bookmarks.length} {bookmarks.length === 1 ? "bookmark" : "bookmarks"}
          </span>
        </>
      )}
    </div>
  )
}

interface VaultContentProps {
  active: string | null
  setActive: (key: string | null) => void
  activeFile: VaultFile | null
  contentRef: RefObject<HTMLDivElement | null>
  topBarRef: RefObject<HTMLDivElement | null>
  vaultStats: VaultStats
  groupedFiles: Record<string, VaultFile[]>
  toc: TocEntry[]
  fileStats: FileStats | null
  components: Record<string, React.ComponentType<ComponentPropsWithoutRef<any>>>
  bookmarks: UseVaultBookmarksReturn
  fileKeys: string[]
  showShortcutHelp: boolean
  setShowShortcutHelp: React.Dispatch<React.SetStateAction<boolean>>
}

export function VaultContent({
  active,
  setActive,
  activeFile,
  contentRef,
  topBarRef,
  vaultStats,
  groupedFiles,
  toc,
  fileStats,
  components,
  bookmarks,
  fileKeys,
  showShortcutHelp,
  setShowShortcutHelp,
}: VaultContentProps) {
  const [activeTocId, setActiveTocId] = useState<string | null>(null)
  const [showToc, setShowToc] = useState(true)

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
      { rootMargin: "-10% 0px -80% 0px", threshold: 0 },
    )

    headingEls.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [activeFile, toc])

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      const tag = (e.target as HTMLElement).tagName
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return

      const el = contentRef.current

      switch (e.key) {
        case "j":
          el?.scrollBy({ top: 100, behavior: "smooth" })
          break

        case "k":
          el?.scrollBy({ top: -100, behavior: "smooth" })
          break

        case "n": {
          if (!active) break
          const idx = fileKeys.indexOf(active)
          if (idx < fileKeys.length - 1) setActive(fileKeys[idx + 1])
          break
        }

        case "p": {
          if (!active) break
          const idx = fileKeys.indexOf(active)
          if (idx > 0) setActive(fileKeys[idx - 1])
          break
        }

        case "b": {
          if (!active || !el) break
          const heading = findNearestHeadingAbove(el)
          if (heading) bookmarks.toggleBookmark(heading.id, heading.text)
          break
        }

        case "t":
          setShowToc((prev) => !prev)
          break

        case "Escape":
          setActive(null)
          break

        case "/":
          e.preventDefault()
          break
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [active, fileKeys, bookmarks.toggleBookmark, contentRef, setActive])

  function scrollToHeading(id: string) {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <>
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
            {bookmarks.showContinuePill && bookmarks.lastBookmark && active !== null && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="sticky top-0 z-10 flex items-center gap-2 bg-muted/90 backdrop-blur border border-border rounded-lg px-4 py-2 mb-4 mx-6 md:mx-10 mt-4 font-mono text-sm"
              >
                <span className="text-muted-foreground">Continue from</span>
                <span className="text-tokyo-yellow">{bookmarks.lastBookmark.headingText}</span>
                <button
                  onClick={() => {
                    document
                      .getElementById(bookmarks.lastBookmark!.headingId)
                      ?.scrollIntoView({ behavior: "smooth" })
                    bookmarks.setShowContinuePill(false)
                  }}
                  className="ml-auto text-primary hover:underline"
                >
                  Go
                </button>
                <button
                  onClick={() => bookmarks.setShowContinuePill(false)}
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
                  onSelectBookmark={bookmarks.handleBookmarkNavigation}
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
                    bookmarks={bookmarks.currentBookmarks}
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
          <TableOfContents entries={toc} activeId={activeTocId} onClickEntry={scrollToHeading} />
        )}
      </SidebarInset>
      <AnimatePresence>
        {showShortcutHelp && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm"
            onClick={() => setShowShortcutHelp(false)}
          >
            <div
              className="bg-muted border border-border rounded-lg p-6 max-w-sm font-mono text-sm"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-primary font-semibold mb-4">Keyboard Shortcuts</h3>
              <div className="space-y-2">
                {[
                  ["j / k", "Scroll down / up"],
                  ["n / p", "Next / previous file"],
                  ["b", "Bookmark nearest heading"],
                  ["t", "Toggle table of contents"],
                  ["Esc", "Back to dashboard"],
                ].map(([key, desc]) => (
                  <div key={key} className="flex justify-between gap-4">
                    <kbd className="px-1.5 py-0.5 bg-background border border-border rounded text-xs">
                      {key}
                    </kbd>
                    <span className="text-muted-foreground">{desc}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
