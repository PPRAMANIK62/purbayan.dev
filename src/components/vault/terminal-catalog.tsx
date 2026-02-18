import { useState, useRef, useMemo } from "react"
import { motion } from "motion/react"
import {
  groupedFiles,
  computeFileStats,
  extractToc,
  kebabToTitle,
  type VaultFile,
  type TocEntry,
} from "@/lib/vault-utils"

interface TerminalCatalogProps {
  unlocked: boolean
  onRequestUnlock: () => void
  onReadFile: (fileKey: string) => void
}

interface TreeLine {
  key: string
  content: React.ReactNode
  indent: number
  type: "header" | "category" | "file" | "toc" | "redacted"
}

const VISIBLE_HEADINGS = 4
const EASE_CUBIC: [number, number, number, number] = [0.25, 0.46, 0.45, 0.94]

function buildTreeLines(
  groups: Record<string, VaultFile[]>,
  expandedFiles: Set<string>,
  unlocked: boolean,
  onReadFile: (fileKey: string) => void,
  onToggle: (fileKey: string) => void,
): TreeLine[] {
  const lines: TreeLine[] = []
  const categories = Object.entries(groups)

  lines.push({
    key: "root",
    content: <span className="text-tokyo-cyan font-semibold">vault/</span>,
    indent: 0,
    type: "header",
  })

  categories.forEach(([category, files], catIdx) => {
    const isLastCategory = catIdx === categories.length - 1
    const catBranch = isLastCategory ? "└── " : "├── "
    const catContinue = isLastCategory ? "    " : "│   "

    lines.push({
      key: `cat-${category}`,
      content: (
        <span>
          <span className="text-muted-foreground/50">{catBranch}</span>
          <span className="text-tokyo-cyan font-semibold">{kebabToTitle(category)}/</span>
        </span>
      ),
      indent: 0,
      type: "category",
    })

    files.forEach((file, fileIdx) => {
      const isLastFile = fileIdx === files.length - 1
      const fileBranch = isLastFile ? "└── " : "├── "
      const fileKey = `${file.category}/${file.slug}`
      const stats = computeFileStats(file.content)
      const isExpanded = expandedFiles.has(fileKey)
      const fileContinue = isLastFile ? "    " : "│   "

      const wordStr = `~${stats.wordCount.toLocaleString()} words`
      const timeStr = `${stats.readingTime} min read`

      lines.push({
        key: `file-${fileKey}`,
        content: (
          <button
            type="button"
            onClick={() => onToggle(fileKey)}
            className="w-full text-left hover:bg-muted/30 -mx-1 px-1 rounded transition-colors duration-150 group inline-flex items-baseline gap-0 cursor-pointer"
          >
            <span className="text-muted-foreground/50">
              {catContinue}
              {fileBranch}
            </span>
            <span className="text-foreground group-hover:text-tokyo-cyan transition-colors duration-150">
              {file.slug}.md
            </span>
            <span className="text-muted-foreground ml-3 tabular-nums">{wordStr.padStart(14)}</span>
            <span className="text-muted-foreground ml-3 tabular-nums">{timeStr.padStart(13)}</span>
            {unlocked ? (
              <span
                role="button"
                tabIndex={0}
                onClick={(e) => {
                  e.stopPropagation()
                  onReadFile(fileKey)
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.stopPropagation()
                    onReadFile(fileKey)
                  }
                }}
                className="ml-3 text-tokyo-green hover:text-tokyo-green/80 transition-colors duration-150"
              >
                Open →
              </span>
            ) : (
              <span className="ml-3 text-muted-foreground/30 select-none">████</span>
            )}
          </button>
        ),
        indent: 1,
        type: "file",
      })

      if (isExpanded) {
        const toc = extractToc(file.content)
        const h2Entries: TocEntry[] = toc.filter((e) => e.level === 2)
        const visibleHeadings = h2Entries.slice(0, VISIBLE_HEADINGS)
        const remainingCount = h2Entries.length - VISIBLE_HEADINGS

        visibleHeadings.forEach((heading, hIdx) => {
          const isLastHeading = hIdx === visibleHeadings.length - 1 && remainingCount <= 0
          const headingBranch = isLastHeading ? "└── " : "├── "

          lines.push({
            key: `toc-${fileKey}-${heading.id}`,
            content: (
              <span>
                <span className="text-muted-foreground/50">
                  {catContinue}
                  {fileContinue}
                  {headingBranch}
                </span>
                <span className="text-secondary-foreground">{heading.text}</span>
              </span>
            ),
            indent: 2,
            type: "toc",
          })
        })

        if (remainingCount > 0) {
          lines.push({
            key: `redacted-${fileKey}`,
            content: (
              <span>
                <span className="text-muted-foreground/50">
                  {catContinue}
                  {fileContinue}
                  {"└── "}
                </span>
                <span className="text-tokyo-red/60 italic">
                  [REDACTED]{" "}
                  <span className="text-muted-foreground/50">
                    ({remainingCount} more section{remainingCount !== 1 ? "s" : ""})
                  </span>
                </span>
              </span>
            ),
            indent: 2,
            type: "redacted",
          })
        }
      }
    })
  })

  return lines
}

export function TerminalCatalog({ unlocked, onRequestUnlock, onReadFile }: TerminalCatalogProps) {
  const [expandedFiles, setExpandedFiles] = useState<Set<string>>(new Set())
  const hasAnimated = useRef(false)

  const handleToggle = (fileKey: string) => {
    setExpandedFiles((prev) => {
      const next = new Set(prev)
      if (next.has(fileKey)) {
        next.delete(fileKey)
      } else {
        next.add(fileKey)
      }
      return next
    })
  }

  const lines = useMemo(
    () => buildTreeLines(groupedFiles, expandedFiles, unlocked, onReadFile, handleToggle),
    [expandedFiles, unlocked, onReadFile],
  )

  const shouldAnimate = !hasAnimated.current
  if (lines.length > 0 && shouldAnimate) {
    hasAnimated.current = true
  }

  return (
    <div className="bg-muted/20 border border-border rounded-lg overflow-hidden">
      <div className="flex items-center gap-2 px-4 py-2.5 border-b border-border/60 bg-muted/30">
        <div className="flex gap-1.5">
          <span className="size-2.5 rounded-full bg-tokyo-red/60" />
          <span className="size-2.5 rounded-full bg-tokyo-yellow/60" />
          <span className="size-2.5 rounded-full bg-tokyo-green/60" />
        </div>
        <span className="text-xs text-muted-foreground/60 ml-2 font-mono">vault-catalog</span>
      </div>

      <div className="p-4 md:p-6 font-mono text-xs md:text-sm leading-relaxed overflow-x-auto">
        <motion.div
          initial={shouldAnimate ? { opacity: 0 } : false}
          animate={{ opacity: 1 }}
          transition={{
            delay: 0,
            duration: 0.3,
            ease: EASE_CUBIC,
          }}
          className="mb-4 flex items-center gap-2"
        >
          <span className="text-tokyo-green">$</span>
          <span className="text-foreground">tree vault/ --metadata</span>
          <span className="cursor" />
        </motion.div>

        <div className="space-y-0">
          {lines.map((line, index) => (
            <motion.div
              key={line.key}
              initial={shouldAnimate ? { opacity: 0 } : false}
              animate={{ opacity: 1 }}
              transition={{
                delay: shouldAnimate ? (index + 1) * 0.03 : 0,
                duration: 0.25,
                ease: EASE_CUBIC,
              }}
              className="leading-7"
            >
              {line.content}
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={shouldAnimate ? { opacity: 0 } : false}
          animate={{ opacity: 1 }}
          transition={{
            delay: shouldAnimate ? (lines.length + 1) * 0.03 : 0,
            duration: 0.3,
            ease: EASE_CUBIC,
          }}
          className="mt-4 pt-3 border-t border-border/40"
        >
          <span className="text-muted-foreground text-xs">
            {Object.keys(groupedFiles).length} directories,{" "}
            {Object.values(groupedFiles).flat().length} files
          </span>
          {!unlocked && (
            <span className="text-muted-foreground/50 text-xs">
              {" "}
              &middot;{" "}
              <button
                type="button"
                onClick={onRequestUnlock}
                className="text-tokyo-cyan hover:text-tokyo-cyan/80 underline underline-offset-2 transition-colors duration-150 cursor-pointer"
              >
                unlock to read
              </button>
            </span>
          )}
        </motion.div>
      </div>
    </div>
  )
}
