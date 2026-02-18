import { useState, useEffect, useRef, useMemo } from "react"
import { motion, AnimatePresence } from "motion/react"
import { SidebarProvider } from "@/components/ui/sidebar"
import { PasswordGate, SESSION_KEY } from "@/components/vault/password-gate"
import { VaultSidebar } from "@/components/vault/vault-sidebar"
import { VaultContent } from "@/components/vault/vault-content"
import { mdComponents } from "@/components/vault/markdown-components"
import { useVaultBookmarks } from "@/hooks/use-vault-bookmarks"
import { useVaultProgress } from "@/hooks/use-vault-progress"
import { vaultFiles, groupedFiles, extractToc, computeFileStats } from "@/lib/vault-utils"

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

  useEffect(() => {
    const stored = sessionStorage.getItem(SESSION_KEY) === "true"
    if (stored !== unlocked) setUnlocked(stored)
  }, [unlocked])

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
        <motion.div key="gate" exit={{ opacity: 0, scale: 0.98 }} transition={{ duration: 0.3 }}>
          <PasswordGate onUnlock={() => setUnlocked(true)} />
        </motion.div>
      )}
    </AnimatePresence>
  )
}
