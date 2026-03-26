import { useState, useRef, useEffect, useCallback } from "react"
import type { OutputLine } from "@/components/terminal/terminal-output"
import { focusTerminalInput } from "@/components/terminal/terminal-input"
import { createSnakeGame, type SnakeGame } from "@/components/terminal/games/snake"
import { getRandomHint } from "@/components/terminal/commands/meta"
import { useTerminalStore } from "@/stores/terminal-store"
import type { TerminalSounds } from "@/hooks/use-terminal-sounds"

interface UseTerminalGameOptions {
  isOpen: boolean
  snakeHighScore: number
  updateSnakeHighScore: (score: number) => void
  captureFlag: (n: number) => void
  sounds: TerminalSounds
  appendLines: (lines: OutputLine[]) => void
  containerRef: React.RefObject<HTMLDivElement | null>
}

export interface UseTerminalGameReturn {
  gameMode: boolean
  gameLines: OutputLine[]
  startSnakeGame: () => void
}

export function useTerminalGame({
  isOpen,
  snakeHighScore,
  updateSnakeHighScore,
  captureFlag,
  sounds,
  appendLines,
  containerRef,
}: UseTerminalGameOptions): UseTerminalGameReturn {
  const [gameMode, setGameMode] = useState(false)
  const [gameLines, setGameLines] = useState<OutputLine[]>([])
  const gameRef = useRef<SnakeGame | null>(null)

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
  }, [isOpen, gameMode, snakeHighScore, updateSnakeHighScore, containerRef])

  useEffect(() => {
    if (!isOpen && gameRef.current) {
      gameRef.current.stop()
      gameRef.current = null
      setGameMode(false)
      setGameLines([])
    }
  }, [isOpen])

  const startSnakeGame = useCallback(() => {
    const game = createSnakeGame(snakeHighScore)
    gameRef.current = game

    game.onFrame((frame, _score, _highScore, isGameOver) => {
      const lines: OutputLine[] = frame.map((line, index) => {
        const isScoreLine = isGameOver ? index === frame.length - 3 : index === frame.length - 1
        const isGameOverLine = isGameOver && index === frame.length - 1

        if (isGameOverLine) {
          return { text: line, color: "error" as const }
        }
        if (isScoreLine) {
          return { text: line, color: "warning" as const }
        }
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

  return { gameMode, gameLines, startSnakeGame }
}
