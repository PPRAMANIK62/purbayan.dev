import { useState, useRef, useEffect, useCallback } from "react"
import Markdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { motion, AnimatePresence } from "motion/react"
import { FileText, ArrowLeft, Lock } from "lucide-react"
import { kebabToTitle, groupedFiles, computeFileStats, type VaultFile } from "@/lib/vault-utils"
import { redactedMdComponents } from "./redacted-components"

interface RedactedViewProps {
  unlocked: boolean
  onRequestUnlock: () => void
  onReadFile: (fileKey: string) => void
}

const easing = [0.25, 0.46, 0.45, 0.94] as const

function RedactedCategoryCard({
  category,
  files,
  onSelectFile,
}: {
  category: string
  files: VaultFile[]
  onSelectFile: (key: string) => void
}) {
  return (
    <div className="border border-border rounded-lg p-5 bg-muted/20">
      <h3 className="font-mono font-semibold text-base uppercase tracking-wider text-primary mb-3">
        {kebabToTitle(category)}
      </h3>
      <p className="text-sm text-muted-foreground font-mono mb-3">
        {files.length} {files.length === 1 ? "file" : "files"}
      </p>
      <div className="space-y-2">
        {files.map((f) => {
          const key = `${f.category}/${f.slug}`
          return (
            <button
              key={key}
              onClick={() => onSelectFile(key)}
              className="w-full flex items-center gap-2 text-left group"
            >
              <FileText className="size-4 text-muted-foreground" />
              <span className="font-mono text-base text-secondary-foreground group-hover:text-primary transition-colors flex-1">
                {f.label}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

function RedactedMetadataBar({ file }: { file: VaultFile }) {
  const stats = computeFileStats(file.content)
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
    </div>
  )
}

function FileListView({ onSelectFile }: { onSelectFile: (key: string) => void }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {Object.entries(groupedFiles).map(([category, files]) => (
        <RedactedCategoryCard
          key={category}
          category={category}
          files={files}
          onSelectFile={onSelectFile}
        />
      ))}
    </div>
  )
}

function RedactedDocumentView({
  fileKey,
  file,
  unlocked,
  onBack,
  onRequestUnlock,
  onReadFile,
}: {
  fileKey: string
  file: VaultFile
  unlocked: boolean
  onBack: () => void
  onRequestUnlock: () => void
  onReadFile: (fileKey: string) => void
}) {
  return (
    <div>
      <button
        onClick={onBack}
        className="flex items-center gap-1.5 font-mono text-sm text-muted-foreground hover:text-primary transition-colors mb-6"
      >
        <ArrowLeft className="size-3.5" />
        Back to files
      </button>

      <RedactedMetadataBar file={file} />

      <div className="bg-muted/50 border border-border rounded-lg px-4 py-3 mb-8 font-mono text-sm flex items-center justify-between">
        <span className="flex items-center gap-2">
          <Lock className="size-3.5 text-muted-foreground" />
          This document is redacted.
        </span>
        <AnimatePresence mode="wait">
          {unlocked ? (
            <motion.button
              key="read"
              onClick={() => onReadFile(fileKey)}
              className="text-primary hover:underline"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.25, ease: easing }}
            >
              Read full document →
            </motion.button>
          ) : (
            <motion.button
              key="unlock"
              onClick={onRequestUnlock}
              className="text-tokyo-yellow hover:underline"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.25, ease: easing }}
            >
              Unlock to read
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      <Markdown remarkPlugins={[remarkGfm]} components={redactedMdComponents(unlocked)}>
        {file.content}
      </Markdown>
    </div>
  )
}

export function RedactedView({ unlocked, onRequestUnlock, onReadFile }: RedactedViewProps) {
  const [selectedFile, setSelectedFile] = useState<string | null>(null)
  const prevUnlocked = useRef(unlocked)

  // Auto-transition to reader when unlocked while viewing a file
  useEffect(() => {
    if (unlocked && !prevUnlocked.current && selectedFile) {
      onReadFile(selectedFile)
    }
    prevUnlocked.current = unlocked
  }, [unlocked, selectedFile, onReadFile])

  const handleSelectFile = useCallback(
    (key: string) => {
      if (unlocked) {
        onReadFile(key)
      } else {
        setSelectedFile(key)
      }
    },
    [unlocked, onReadFile],
  )

  const activeFile = selectedFile
    ? (Object.values(groupedFiles)
        .flat()
        .find((f) => `${f.category}/${f.slug}` === selectedFile) ?? null)
    : null

  return (
    <AnimatePresence mode="wait">
      {selectedFile === null || activeFile === null ? (
        <motion.div
          key="file-list"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, ease: easing }}
        >
          <FileListView onSelectFile={handleSelectFile} />
        </motion.div>
      ) : (
        <motion.div
          key={selectedFile}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, ease: easing }}
        >
          <RedactedDocumentView
            fileKey={selectedFile}
            file={activeFile}
            unlocked={unlocked}
            onBack={() => setSelectedFile(null)}
            onRequestUnlock={onRequestUnlock}
            onReadFile={onReadFile}
          />
        </motion.div>
      )}
    </AnimatePresence>
  )
}
