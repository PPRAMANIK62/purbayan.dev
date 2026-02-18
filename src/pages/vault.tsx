import { useState, useEffect, useRef, useMemo } from "react"
import { motion, AnimatePresence } from "motion/react"
import { Lock, LockOpen } from "lucide-react"
import { SidebarProvider } from "@/components/ui/sidebar"
import { PasswordGate, SESSION_KEY } from "@/components/vault/password-gate"
import { VaultSidebar } from "@/components/vault/vault-sidebar"
import { VaultContent } from "@/components/vault/vault-content"
import { VaultModeSwitcher } from "@/components/vault/vault-mode-switcher"
import { mdComponents } from "@/components/vault/markdown-components"
import { RedactedView } from "@/components/vault/redacted-view"
import { TerminalCatalog } from "@/components/vault/terminal-catalog"
import { useVaultBookmarks } from "@/hooks/use-vault-bookmarks"
import { useVaultProgress } from "@/hooks/use-vault-progress"
import { vaultFiles, groupedFiles, extractToc, computeFileStats } from "@/lib/vault-utils"

export type ViewMode = "redacted" | "terminal"

function VaultViewer() {
  const [active, setActive] = useState<string | null>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const [showShortcutHelp, setShowShortcutHelp] = useState(false)

  const activeFile = active
    ? (vaultFiles.find((f) => `${f.category}/${f.slug}` === active) ?? null)
    : null
  const fileKeys = useMemo(() => vaultFiles.map((f) => `${f.category}/${f.slug}`), [])
  const vaultStats = useMemo(() => {
    let totalWords = 0
    for (const f of vaultFiles) totalWords += f.content.split(/\s+/).filter(Boolean).length
    return {
      totalDocs: vaultFiles.length,
      totalWords,
      totalReadingTime: Math.ceil(totalWords / 200),
    }
  }, [])
  const toc = useMemo(() => (activeFile ? extractToc(activeFile.content) : []), [activeFile])
  const fileStats = useMemo(
    () => (activeFile ? computeFileStats(activeFile.content) : null),
    [activeFile],
  )

  const bookmarks = useVaultBookmarks(active, setActive, contentRef)
  const progress = useVaultProgress(
    active,
    contentRef,
    bookmarks.pendingScrollTarget,
    bookmarks.setShowContinuePill,
  )

  bookmarks.checkboxIndexRef.current = 0
  const components = mdComponents(
    bookmarks.currentBookmarks,
    bookmarks.toggleBookmark,
    bookmarks.toggledCheckboxes,
    bookmarks.onToggleCheckbox,
    bookmarks.checkboxIndexRef,
  )

  return (
    <SidebarProvider className="h-dvh">
      <VaultSidebar
        active={active}
        setActive={setActive}
        groupedFiles={groupedFiles}
        activeBarRef={progress.activeBarRef}
        showShortcutHelp={showShortcutHelp}
        setShowShortcutHelp={setShowShortcutHelp}
      />
      <VaultContent
        active={active}
        setActive={setActive}
        activeFile={activeFile}
        contentRef={contentRef}
        topBarRef={progress.topBarRef}
        vaultStats={vaultStats}
        groupedFiles={groupedFiles}
        toc={toc}
        fileStats={fileStats}
        components={components}
        bookmarks={bookmarks}
        fileKeys={fileKeys}
        showShortcutHelp={showShortcutHelp}
        setShowShortcutHelp={setShowShortcutHelp}
      />
    </SidebarProvider>
  )
}

export default function VaultPage() {
  const [unlocked, setUnlocked] = useState(() => sessionStorage.getItem(SESSION_KEY) === "true")
  const [viewMode, setViewMode] = useState<ViewMode>("redacted")
  const [reading, setReading] = useState<string | null>(null)
  const [showUnlockModal, setShowUnlockModal] = useState(false)

  useEffect(() => {
    const stored = sessionStorage.getItem(SESSION_KEY) === "true"
    if (stored !== unlocked) setUnlocked(stored)
  }, [unlocked])

  const onRequestUnlock = () => {
    if (!unlocked) setShowUnlockModal(true)
  }

  const vaultStats = useMemo(() => {
    let totalWords = 0
    for (const f of vaultFiles) totalWords += f.content.split(/\s+/).filter(Boolean).length
    return {
      totalDocs: vaultFiles.length,
      totalWords,
      totalReadingTime: Math.ceil(totalWords / 200),
    }
  }, [])

  return (
    <AnimatePresence mode="wait">
      {unlocked && reading !== null ? (
        <motion.div
          key="viewer"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <VaultViewer />
        </motion.div>
      ) : (
        <motion.div
          key="explorer"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="min-h-dvh"
        >
          <div className="max-w-4xl mx-auto px-6 md:px-10 py-10 md:py-14">
            <div className="mb-6">
              <h1 className="text-4xl font-mono font-bold mb-2">
                <span className="text-primary">&gt;</span> Vault
              </h1>
              <p className="text-muted-foreground font-mono text-sm">
                Personal knowledge base. Roadmaps, interview prep, project notes.
              </p>
            </div>

            <div className="flex gap-6 mb-8 font-mono text-sm">
              <div>
                <span className="text-tokyo-cyan">{vaultStats.totalDocs}</span>
                <span className="text-muted-foreground ml-1">documents</span>
              </div>
              <div>
                <span className="text-tokyo-green">{vaultStats.totalWords.toLocaleString()}</span>
                <span className="text-muted-foreground ml-1">words</span>
              </div>
              <div>
                <span className="text-tokyo-magenta">{vaultStats.totalReadingTime}</span>
                <span className="text-muted-foreground ml-1">min total</span>
              </div>
            </div>

            <div className="flex items-center justify-between mb-10">
              <VaultModeSwitcher mode={viewMode} onModeChange={setViewMode} />
              <button
                type="button"
                onClick={onRequestUnlock}
                className={`inline-flex items-center gap-1.5 font-mono text-xs border rounded-lg px-3 py-1.5 transition-colors ${
                  unlocked
                    ? "text-tokyo-green border-tokyo-green/30"
                    : "text-muted-foreground hover:text-foreground border-border"
                }`}
              >
                {unlocked ? <LockOpen className="size-3.5" /> : <Lock className="size-3.5" />}
                <span>{unlocked ? "unlocked" : "unlock"}</span>
              </button>
            </div>

            <AnimatePresence mode="wait">
              {viewMode === "redacted" && (
                <motion.div
                  key="redacted"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
                >
                  <RedactedView
                    unlocked={unlocked}
                    onRequestUnlock={onRequestUnlock}
                    onReadFile={(fileKey) => setReading(fileKey)}
                  />
                </motion.div>
              )}
              {viewMode === "terminal" && (
                <motion.div
                  key="terminal"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
                >
                  <TerminalCatalog
                    unlocked={unlocked}
                    onRequestUnlock={onRequestUnlock}
                    onReadFile={(fileKey) => setReading(fileKey)}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <PasswordGate
            open={showUnlockModal}
            onOpenChange={setShowUnlockModal}
            onUnlock={() => setUnlocked(true)}
          />
        </motion.div>
      )}
    </AnimatePresence>
  )
}
