import { useState, useRef, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "motion/react"
import { useTerminalStore } from "@/stores/terminal-store"
import { useShallow } from "zustand/react/shallow"
import { TerminalOutput, type OutputLine } from "./terminal-output"
import { TerminalPrompt } from "./terminal-prompt"
import { TerminalInput, focusTerminalInput } from "./terminal-input"
import { dispatch, type CommandContext } from "./commands/index"
import { useTerminalSounds } from "@/hooks/use-terminal-sounds"
import { EASE_OUT } from "@/lib/animation"
import { MAX_LINES, formatPromptText, buildWelcomeLines } from "@/lib/terminal-ui"
import { detectFlags, buildVictoryScreen } from "@/lib/terminal-flags"
import { useTerminalGame } from "@/hooks/use-terminal-game"
import { useTerminalTabCompletion } from "@/hooks/use-terminal-tab-completion"
// Side-effect imports — trigger self-registration of all commands
import "./commands/filesystem"
import "./commands/system"
import "./commands/meta"
import "./commands/fun"
import "./commands/network"

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
  } = useTerminalStore(
    useShallow((s) => ({
      isOpen: s.isOpen,
      closeTerminal: s.closeTerminal,
      flagsFound: s.flagsFound,
      soundEnabled: s.soundEnabled,
      toggleSound: s.toggleSound,
      currentDirectory: s.currentDirectory,
      commandHistory: s.commandHistory,
      addToHistory: s.addToHistory,
      setDirectory: s.setDirectory,
      captureFlag: s.captureFlag,
      terminalTheme: s.terminalTheme,
      setTheme: s.setTheme,
      snakeHighScore: s.snakeHighScore,
      updateSnakeHighScore: s.updateSnakeHighScore,
    })),
  )

  const sounds = useTerminalSounds()

  const [outputLines, setOutputLines] = useState<OutputLine[]>([])
  const [inputValue, setInputValue] = useState("")
  const [historyIndex, setHistoryIndex] = useState(-1)
  const [hasBooted, setHasBooted] = useState(false)

  const scrollRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const appendLines = useCallback((newLines: OutputLine[]) => {
    setOutputLines((prev) => {
      const combined = [...prev, ...newLines]
      return combined.length > MAX_LINES ? combined.slice(combined.length - MAX_LINES) : combined
    })
  }, [])

  const { gameMode, gameLines, startSnakeGame } = useTerminalGame({
    isOpen,
    snakeHighScore,
    updateSnakeHighScore,
    captureFlag,
    sounds,
    appendLines,
    containerRef,
  })

  const { handleTab } = useTerminalTabCompletion({
    currentDirectory,
    setInputValue,
    appendLines,
  })

  useEffect(() => {
    if (isOpen && !hasBooted) {
      setOutputLines(buildWelcomeLines())
      setHasBooted(true)
      sounds.playBoot()
    }
  }, [isOpen, hasBooted, sounds])

  useEffect(() => {
    if (!isOpen) return
    const handle = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !gameMode) {
        e.preventDefault()
        closeTerminal()
      }
    }
    window.addEventListener("keydown", handle)
    return () => window.removeEventListener("keydown", handle)
  }, [isOpen, closeTerminal, gameMode])

  const scrollToBottom = useCallback(() => {
    requestAnimationFrame(() => {
      if (scrollRef.current) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight
      }
    })
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [outputLines, gameLines, scrollToBottom])

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

      sounds.playEnter()
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
        setTheme,
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

      if (result.lines.some((l) => l.color === "error")) {
        sounds.playError()
      }

      const { detectedFlags, celebrationLines } = detectFlags(
        result.lines,
        useTerminalStore.getState().flagsFound,
      )

      for (const flagNum of detectedFlags) {
        captureFlag(flagNum)
      }

      if (detectedFlags.length > 0) {
        sounds.playSuccess()
      }

      let victoryLines: OutputLine[] = []
      if (detectedFlags.length > 0 && useTerminalStore.getState().flagsFound.length === 7) {
        victoryLines = buildVictoryScreen()
      }

      appendLines([
        { text: `${prompt}${trimmed}`, color: "default" },
        ...result.lines,
        ...celebrationLines,
        ...victoryLines,
      ])

      if (result.exit) {
        closeTerminal()
      }

      if (result.openUrl) {
        window.open(result.openUrl, "_blank")
      }

      if (result.startGame === "snake") {
        startSnakeGame()
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
      startSnakeGame,
      sounds,
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
          historyIndex === -1 ? commandHistory.length - 1 : Math.max(0, historyIndex - 1)
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
          transition={{ duration: 0.2, ease: EASE_OUT }}
          data-terminal-theme={terminalTheme}
          className="fixed inset-0 z-[100] bg-background flex flex-col font-mono text-sm"
          onClick={handleContainerClick}
        >
          <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-card shrink-0 select-none">
            <span className="text-muted-foreground text-xs">
              PurbayanOS v1.0.0 — Tokyo Night Edition
            </span>
            <div className="flex items-center gap-3">
              <span className="text-tokyo-yellow text-xs">[{flagsFound.length}/7 flags]</span>
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

          {gameMode ? (
            <div className="flex-1 flex flex-col items-center justify-center select-none">
              <div className="text-center mb-4">
                <h2 className="text-tokyo-green text-2xl font-bold tracking-[0.5em] mb-1">SNAKE</h2>
                <p className="text-muted-foreground text-xs">
                  Eat ● to grow · Don't hit walls or yourself
                </p>
              </div>
              <div className="text-base leading-none whitespace-pre font-mono">
                {gameLines.map((line, i) => {
                  const color = line.color ?? "default"
                  const colorClass =
                    color === "success"
                      ? "text-tokyo-green"
                      : color === "warning"
                        ? "text-tokyo-yellow"
                        : color === "error"
                          ? "text-tokyo-red"
                          : color === "info"
                            ? "text-tokyo-cyan"
                            : color === "muted"
                              ? "text-muted-foreground"
                              : "text-foreground"
                  return (
                    <div key={i} className={colorClass}>
                      {line.text}
                    </div>
                  )
                })}
              </div>
            </div>
          ) : (
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 leading-relaxed">
              <TerminalOutput lines={outputLines} />

              <div className="flex items-start">
                <TerminalPrompt cwd={currentDirectory} flagCount={flagsFound.length} />
                <TerminalInput
                  value={inputValue}
                  onChange={setInputValue}
                  onSubmit={handleSubmit}
                  onClear={handleClear}
                  onHistoryNav={handleHistoryNav}
                  onTab={handleTab}
                  onKeystroke={sounds.playKeystroke}
                />
              </div>
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
