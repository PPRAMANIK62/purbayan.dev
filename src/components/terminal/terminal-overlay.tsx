import { useState, useRef, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "motion/react"
import { useTerminalStore } from "@/stores/terminal-store"
import { TerminalOutput, type OutputLine } from "./terminal-output"
import { TerminalPrompt } from "./terminal-prompt"
import { TerminalInput, focusTerminalInput } from "./terminal-input"
import { dispatch, registry, type CommandContext } from "./commands/index"
import { getRandomHint } from "./commands/meta"
import { useTerminalSounds } from "@/hooks/use-terminal-sounds"
import { createSnakeGame, type SnakeGame } from "./games/snake"
import { ROOT } from "./filesystem/contents"
import { resolvePath, getNode, listChildren } from "./filesystem/index"
// Side-effect imports — trigger self-registration of all commands
import "./commands/filesystem"
import "./commands/system"
import "./commands/meta"
import "./commands/fun"
import "./commands/network"

const MAX_LINES = 500
const HOME = "/home/purbayan"
const EASING = [0.25, 0.46, 0.45, 0.94] as const

// ---------------------------------------------------------------------------
// CTF Flag Detection
// ---------------------------------------------------------------------------

const FLAG_MAP: Record<string, number> = {
  "PURBAYAN{y0u_r3ad_th3_d0tf1l3s}": 1,
  "PURBAYAN{h1dd3n_d1r_m4st3r}": 2,
  "PURBAYAN{f0ll0w_th3_wh1t3_r4bb1t}": 3,
  "PURBAYAN{h0w_ab0ut_a_n1c3_g4m3}": 4,
  "PURBAYAN{n30f3tch_h1dd3n_fl4g}": 5,
  // Flag 6 (snake game) handled separately via game.onFlag()
  "PURBAYAN{tmp_h4ck3r}": 7,
}

const FLAG_PATTERN = /PURBAYAN\{[^}]+\}/g

function detectFlags(
  lines: OutputLine[],
  alreadyFound: number[],
): { detectedFlags: number[]; celebrationLines: OutputLine[] } {
  const detectedFlags: number[] = []
  const celebrationLines: OutputLine[] = []

  for (const line of lines) {
    const matches = line.text.match(FLAG_PATTERN)
    if (!matches) continue
    for (const match of matches) {
      const flagNum = FLAG_MAP[match]
      if (flagNum === undefined) continue
      if (alreadyFound.includes(flagNum)) continue
      if (detectedFlags.includes(flagNum)) continue
      detectedFlags.push(flagNum)
    }
  }

  for (const flagNum of detectedFlags) {
    celebrationLines.push(
      { text: "", color: "default" },
      { text: `  PURBAYAN{...} — Flag ${flagNum} discovered!`, color: "warning" },
      { text: `  [✓] Flag ${flagNum}/7 captured!`, color: "success" },
    )
  }

  if (detectedFlags.length > 0) {
    // After celebrating, add a hint for a random OTHER uncaptured flag
    const allFound = [...alreadyFound, ...detectedFlags]
    const uncaptured = [1, 2, 3, 4, 5, 6, 7].filter((n) => !allFound.includes(n))
    if (uncaptured.length > 0) {
      const randomFlag = uncaptured[Math.floor(Math.random() * uncaptured.length)]
      celebrationLines.push(
        { text: `  Hint: ${getRandomHint(randomFlag)}`, color: "muted" },
      )
    }
    celebrationLines.push({ text: "", color: "default" })
  }

  return { detectedFlags, celebrationLines }
}

function buildVictoryScreen(): OutputLine[] {
  return [
    { text: "", color: "default" },
    { text: "╔══════════════════════════════════════════════════╗", color: "warning" },
    { text: "║                                                  ║", color: "warning" },
    { text: "║   ALL FLAGS CAPTURED                             ║", color: "success" },
    { text: "║                                                  ║", color: "warning" },
    { text: "║   You found all 7 hidden flags in PurbayanOS.    ║", color: "warning" },
    { text: "║                                                  ║", color: "warning" },
    { text: "║   You're exactly the kind of person I'd love     ║", color: "warning" },
    { text: "║   to work with. Let's talk:                      ║", color: "warning" },
    { text: "║                                                  ║", color: "warning" },
    { text: "║   > purbayan.dev@gmail.com                       ║", color: "warning" },
    { text: "║   > github.com/PPRAMANIK62                       ║", color: "warning" },
    { text: "║                                                  ║", color: "warning" },
    { text: "║   Thanks for exploring. This was fun to build.   ║", color: "warning" },
    { text: "║                                                  ║", color: "warning" },
    { text: "╚══════════════════════════════════════════════════╝", color: "warning" },
    { text: "", color: "default" },
  ]
}

function longestCommonPrefix(strings: string[]): string {
  if (strings.length === 0) return ""
  let prefix = strings[0]
  for (let i = 1; i < strings.length; i++) {
    while (!strings[i].startsWith(prefix)) {
      prefix = prefix.slice(0, -1)
      if (prefix === "") return ""
    }
  }
  return prefix
}

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

  const sounds = useTerminalSounds()

  const [outputLines, setOutputLines] = useState<OutputLine[]>([])
  const [inputValue, setInputValue] = useState("")
  const [historyIndex, setHistoryIndex] = useState(-1)
  const [hasBooted, setHasBooted] = useState(false)
  const [gameMode, setGameMode] = useState(false)
  const [gameLines, setGameLines] = useState<OutputLine[]>([])

  const scrollRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const gameRef = useRef<SnakeGame | null>(null)

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

  useEffect(() => {
    if (!isOpen || !gameMode) return

    const handler = (e: KeyboardEvent) => {
      e.preventDefault()

      if (gameRef.current) {
        gameRef.current.handleKey(e.key)
      }

      if (e.key === "q" || e.key === "Q" || e.key === "Escape") {
        const finalScore = gameRef.current?.getScore() ?? 0
        if (finalScore > snakeHighScore) {
          updateSnakeHighScore(finalScore)
        }
        gameRef.current = null
        setGameMode(false)
        setGameLines([])
        requestAnimationFrame(() => focusTerminalInput(containerRef.current))
      }
    }

    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  }, [isOpen, gameMode, snakeHighScore, updateSnakeHighScore])

  useEffect(() => {
    if (!isOpen && gameRef.current) {
      gameRef.current.stop()
      gameRef.current = null
      setGameMode(false)
      setGameLines([])
    }
  }, [isOpen])

  const appendLines = useCallback((newLines: OutputLine[]) => {
    setOutputLines((prev) => {
      const combined = [...prev, ...newLines]
      return combined.length > MAX_LINES
        ? combined.slice(combined.length - MAX_LINES)
        : combined
    })
  }, [])

  const startSnakeGame = useCallback(() => {
    const game = createSnakeGame(snakeHighScore)
    gameRef.current = game

    game.onFrame((frame, _score, _highScore, isGameOver) => {
      const lines: OutputLine[] = frame.map((line, index) => {
        // Score line (second to last when game over, last otherwise)
        const isScoreLine = isGameOver ? index === frame.length - 3 : index === frame.length - 1
        // Game over line (last line when game over)
        const isGameOverLine = isGameOver && index === frame.length - 1

        if (isGameOverLine) {
          return { text: line, color: "error" as const }
        }
        if (isScoreLine) {
          return { text: line, color: "warning" as const }
        }
        // Border and content lines
        return { text: line, color: "success" as const }
      })
      setGameLines(lines)
    })

    game.onEat(() => sounds.playGameFood())
    game.onGameOver(() => sounds.playGameOver())

    game.onFlag(() => {
      captureFlag(6)
      const uncaptured = [1, 2, 3, 4, 5, 7].filter(
        (n) => !useTerminalStore.getState().flagsFound.includes(n),
      )
      const hintLines: OutputLine[] =
        uncaptured.length > 0
          ? [
              {
                text: `  Hint: ${getRandomHint(uncaptured[Math.floor(Math.random() * uncaptured.length)])}`,
                color: "muted" as const,
              },
            ]
          : []
      appendLines([
        { text: "", color: "default" },
        { text: "  FLAG{PURBAYAN{sn4k3_m4st3r_10}}", color: "warning" },
        { text: "  [✓] Flag 6/7 captured!", color: "success" },
        ...hintLines,
        { text: "", color: "default" },
      ])
    })

    setGameMode(true)
    game.start()
  }, [snakeHighScore, captureFlag, appendLines, sounds])

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

  const handleTab = useCallback(
    (partial: string) => {
      if (!partial || partial.trim() === "") return

      const firstSpace = partial.indexOf(" ")

      if (firstSpace === -1) {
        // Case A: Command completion
        const prefix = partial.toLowerCase()
        const matches = Array.from(registry.keys()).filter((name) =>
          name.startsWith(prefix),
        )

        if (matches.length === 0) return
        if (matches.length === 1) {
          setInputValue(matches[0] + " ")
        } else {
          const common = longestCommonPrefix(matches)
          setInputValue(common)
          appendLines([{ text: matches.join("  "), color: "info" }])
        }
      } else {
        // Case B: Path completion
        const lastSpaceIndex = partial.lastIndexOf(" ")
        const commandPart = partial.slice(0, lastSpaceIndex + 1)
        const pathPart = partial.slice(lastSpaceIndex + 1)

        if (pathPart === "") return

        const showHidden =
          pathPart.startsWith(".") || pathPart.includes("/.")

        const lastSlashIndex = pathPart.lastIndexOf("/")
        let dirPath: string
        let prefix: string

        if (lastSlashIndex === -1) {
          dirPath = currentDirectory
          prefix = pathPart
        } else {
          const dirPart = pathPart.slice(0, lastSlashIndex + 1)
          prefix = pathPart.slice(lastSlashIndex + 1)
          dirPath = resolvePath(currentDirectory, dirPart)
        }

        const dirNode = getNode(ROOT, dirPath)
        if (!dirNode || dirNode.type !== "directory") return

        const children = listChildren(dirNode, showHidden)
        const matches = children.filter((child) =>
          child.name.startsWith(prefix),
        )

        if (matches.length === 0) return

        if (matches.length === 1) {
          const completedName = matches[0].name
          const suffix = matches[0].type === "directory" ? "/" : " "
          if (lastSlashIndex === -1) {
            setInputValue(commandPart + completedName + suffix)
          } else {
            setInputValue(
              commandPart +
                pathPart.slice(0, lastSlashIndex + 1) +
                completedName +
                suffix,
            )
          }
        } else {
          const matchNames = matches.map((m) => m.name)
          const common = longestCommonPrefix(matchNames)
          if (lastSlashIndex === -1) {
            setInputValue(commandPart + common)
          } else {
            setInputValue(
              commandPart + pathPart.slice(0, lastSlashIndex + 1) + common,
            )
          }
          appendLines([
            {
              text: matches
                .map((m) =>
                  m.type === "directory" ? m.name + "/" : m.name,
                )
                .join("  "),
              color: "info",
            },
          ])
        }
      }
    },
    [currentDirectory, appendLines],
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
          transition={{ duration: 0.2, ease: EASING }}
          data-terminal-theme={terminalTheme}
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

          {gameMode ? (
            <div className="flex-1 flex flex-col items-center justify-center select-none">
              <div className="text-center mb-4">
                <h2 className="text-tokyo-green text-2xl font-bold tracking-[0.5em] mb-1">
                  SNAKE
                </h2>
                <p className="text-muted-foreground text-xs">
                  Eat ● to grow · Don't hit walls or yourself
                </p>
              </div>
              <div className="text-base leading-none whitespace-pre font-mono">
                {gameLines.map((line, i) => {
                  const color = line.color ?? "default"
                  const colorClass =
                    color === "success" ? "text-tokyo-green" :
                    color === "warning" ? "text-tokyo-yellow" :
                    color === "error" ? "text-tokyo-red" :
                    color === "info" ? "text-tokyo-cyan" :
                    color === "muted" ? "text-muted-foreground" :
                    "text-foreground"
                  return (
                    <div key={i} className={colorClass}>
                      {line.text}
                    </div>
                  )
                })}
              </div>
            </div>
          ) : (
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
