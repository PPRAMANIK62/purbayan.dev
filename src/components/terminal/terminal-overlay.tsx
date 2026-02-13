import { useState, useRef, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "motion/react"
import { useTerminalStore } from "@/stores/terminal-store"
import { TerminalOutput, type OutputLine } from "./terminal-output"
import { TerminalPrompt } from "./terminal-prompt"
import { TerminalInput, focusTerminalInput } from "./terminal-input"
import { dispatch, type CommandContext } from "./commands/index"
// Side-effect imports — trigger self-registration of all commands
import "./commands/filesystem"
import "./commands/system"
import "./commands/meta"
import "./commands/fun"
import "./commands/network"

const MAX_LINES = 500
const HOME = "/home/purbayan"
const EASING = [0.25, 0.46, 0.45, 0.94] as const

function formatPromptText(cwd: string, flagCount: number): string {
  const displayPath =
    cwd === HOME ? "~" : cwd.startsWith(HOME + "/") ? "~" + cwd.slice(HOME.length) : cwd
  const prefix = flagCount > 0 ? `[${flagCount}/7] ` : ""
  return `${prefix}purbayan@portfolio:${displayPath}$ `
}

function buildWelcomeLines(): OutputLine[] {
  const now = new Date()
  const dateStr = now.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  })

  return [
    { text: "PurbayanOS v1.0.0 \u2014 Tokyo Night Edition", color: "info" },
    { text: "Type 'help' to get started.", color: "muted" },
    { text: "", color: "default" },
    { text: `Last login: ${dateStr} on tty1`, color: "muted" },
    { text: "", color: "default" },
  ]
}

export function TerminalOverlay() {
  const {
    isOpen,
    closeTerminal,
    flagsFound,
    soundEnabled,
    toggleSound,
    currentDirectory,
    commandHistory,
    addToHistory,
    setDirectory,
    captureFlag,
    terminalTheme,
    setTheme,
    snakeHighScore,
    updateSnakeHighScore,
  } = useTerminalStore()

  const [outputLines, setOutputLines] = useState<OutputLine[]>([])
  const [inputValue, setInputValue] = useState("")
  const [historyIndex, setHistoryIndex] = useState(-1)
  const [hasBooted, setHasBooted] = useState(false)

  const scrollRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isOpen && !hasBooted) {
      setOutputLines(buildWelcomeLines())
      setHasBooted(true)
    }
  }, [isOpen, hasBooted])

  useEffect(() => {
    if (!isOpen) return
    const handle = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault()
        closeTerminal()
      }
    }
    window.addEventListener("keydown", handle)
    return () => window.removeEventListener("keydown", handle)
  }, [isOpen, closeTerminal])

  const scrollToBottom = useCallback(() => {
    requestAnimationFrame(() => {
      if (scrollRef.current) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight
      }
    })
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [outputLines, scrollToBottom])

  const appendLines = useCallback((newLines: OutputLine[]) => {
    setOutputLines((prev) => {
      const combined = [...prev, ...newLines]
      return combined.length > MAX_LINES
        ? combined.slice(combined.length - MAX_LINES)
        : combined
    })
  }, [])

  const handleSubmit = useCallback(
    (text: string) => {
      if (text === "^C") {
        appendLines([{ text: "^C", color: "muted" }])
        setInputValue("")
        setHistoryIndex(-1)
        return
      }

      const trimmed = text.trim()
      const prompt = formatPromptText(currentDirectory, flagsFound.length)

      if (trimmed === "") {
        appendLines([{ text: prompt, color: "muted" }])
        setInputValue("")
        setHistoryIndex(-1)
        return
      }

      addToHistory(trimmed)

      const ctx: CommandContext = {
        cwd: currentDirectory,
        setCwd: setDirectory,
        flags: flagsFound,
        captureFlag,
        addToHistory,
        soundEnabled,
        toggleSound,
        terminalTheme,
        setTheme: setTheme as (theme: string) => void,
        snakeHighScore,
        updateSnakeHighScore,
      }

      const result = dispatch(trimmed, ctx)

      if (result.clearScreen) {
        setOutputLines([])
        setInputValue("")
        setHistoryIndex(-1)
        return
      }

      appendLines([{ text: `${prompt}${trimmed}`, color: "default" }, ...result.lines])

      if (result.exit) {
        closeTerminal()
      }

      if (result.openUrl) {
        window.open(result.openUrl, "_blank")
      }

      setInputValue("")
      setHistoryIndex(-1)
    },
    [
      addToHistory,
      appendLines,
      currentDirectory,
      flagsFound,
      captureFlag,
      soundEnabled,
      toggleSound,
      terminalTheme,
      setTheme,
      snakeHighScore,
      updateSnakeHighScore,
      setDirectory,
      closeTerminal,
    ],
  )

  const handleClear = useCallback(() => {
    setOutputLines([])
  }, [])

  const handleHistoryNav = useCallback(
    (direction: "up" | "down") => {
      if (commandHistory.length === 0) return

      if (direction === "up") {
        const nextIndex =
          historyIndex === -1
            ? commandHistory.length - 1
            : Math.max(0, historyIndex - 1)
        setHistoryIndex(nextIndex)
        setInputValue(commandHistory[nextIndex] ?? "")
      } else {
        if (historyIndex === -1) return
        const nextIndex = historyIndex + 1
        if (nextIndex >= commandHistory.length) {
          setHistoryIndex(-1)
          setInputValue("")
        } else {
          setHistoryIndex(nextIndex)
          setInputValue(commandHistory[nextIndex] ?? "")
        }
      }
    },
    [commandHistory, historyIndex],
  )

  const handleTab = useCallback((_partial: string) => {
    // Tab completion placeholder — Phase 4
  }, [])

  const handleContainerClick = useCallback(() => {
    focusTerminalInput(containerRef.current)
  }, [])

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={containerRef}
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 0.2, ease: EASING }}
          className="fixed inset-0 z-[100] bg-background flex flex-col font-mono text-sm"
          onClick={handleContainerClick}
        >
          <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-card shrink-0 select-none">
            <span className="text-muted-foreground text-xs">
              PurbayanOS v1.0.0 — Tokyo Night Edition
            </span>
            <div className="flex items-center gap-3">
              <span className="text-tokyo-yellow text-xs">
                [{flagsFound.length}/7 flags]
              </span>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  toggleSound()
                }}
                className="text-muted-foreground hover:text-foreground transition-colors text-sm cursor-pointer"
                aria-label={soundEnabled ? "Mute sounds" : "Unmute sounds"}
              >
                {soundEnabled ? "\uD83D\uDD0A" : "\uD83D\uDD07"}
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  closeTerminal()
                }}
                className="text-muted-foreground hover:text-tokyo-red transition-colors text-sm cursor-pointer"
                aria-label="Close terminal"
              >
                ✕
              </button>
            </div>
          </div>

          <div
            ref={scrollRef}
            className="flex-1 overflow-y-auto p-4 leading-relaxed"
          >
            <TerminalOutput lines={outputLines} />

            <div className="flex items-start">
              <TerminalPrompt
                cwd={currentDirectory}
                flagCount={flagsFound.length}
              />
              <TerminalInput
                value={inputValue}
                onChange={setInputValue}
                onSubmit={handleSubmit}
                onClear={handleClear}
                onHistoryNav={handleHistoryNav}
                onTab={handleTab}
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
