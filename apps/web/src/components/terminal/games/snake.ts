// ---------------------------------------------------------------------------
// Snake Game Engine — pure TypeScript, zero React dependencies
// ---------------------------------------------------------------------------

export interface SnakeGame {
  start(): void
  stop(): void
  handleKey(key: string): void
  onFrame(
    callback: (frame: string[], score: number, highScore: number, gameOver: boolean) => void,
  ): void
  onFlag(callback: () => void): void
  onEat(callback: () => void): void
  onGameOver(callback: () => void): void
  getScore(): number
}

export function createSnakeGame(initialHighScore: number): SnakeGame {
  // Board dimensions
  const WIDTH = 50
  const HEIGHT = 18
  const TICK_MS = 150
  const FLAG_SCORE = 10

  // Direction vectors
  type Direction = "up" | "down" | "left" | "right"
  type Point = { x: number; y: number }

  const DIRECTION_VECTORS: Record<Direction, Point> = {
    up: { x: 0, y: -1 },
    down: { x: 0, y: 1 },
    left: { x: -1, y: 0 },
    right: { x: 1, y: 0 },
  }

  const OPPOSITES: Record<Direction, Direction> = {
    up: "down",
    down: "up",
    left: "right",
    right: "left",
  }

  const HEAD_CHARS: Record<Direction, string> = {
    right: "►",
    down: "▼",
    left: "◄",
    up: "▲",
  }

  const FOOD_CHAR = "●"
  const BODY_CHAR = "█"

  // State
  let snake: Point[] = []
  let direction: Direction = "right"
  let food: Point = { x: 0, y: 0 }
  let score = 0
  let highScore = initialHighScore
  let gameOver = false
  let intervalId: ReturnType<typeof setInterval> | null = null
  let flagFired = false

  // Callbacks
  let frameCallback:
    | ((frame: string[], score: number, highScore: number, gameOver: boolean) => void)
    | null = null
  let flagCallback: (() => void) | null = null
  let eatCallback: (() => void) | null = null
  let gameOverCallback: (() => void) | null = null

  // -------------------------------------------------------------------------
  // Helpers
  // -------------------------------------------------------------------------

  function pointsEqual(a: Point, b: Point): boolean {
    return a.x === b.x && a.y === b.y
  }

  function isOccupiedBySnake(p: Point): boolean {
    return snake.some((seg) => pointsEqual(seg, p))
  }

  function spawnFood(): void {
    const free: Point[] = []
    for (let y = 0; y < HEIGHT; y++) {
      for (let x = 0; x < WIDTH; x++) {
        const p = { x, y }
        if (!isOccupiedBySnake(p)) {
          free.push(p)
        }
      }
    }
    if (free.length === 0) return
    food = free[Math.floor(Math.random() * free.length)]
  }

  function resetState(): void {
    const startX = Math.floor(WIDTH / 2)
    const startY = Math.floor(HEIGHT / 2)
    snake = [
      { x: startX, y: startY },
      { x: startX - 1, y: startY },
      { x: startX - 2, y: startY },
    ]
    direction = "right"
    score = 0
    gameOver = false
    flagFired = false
    spawnFood()
  }

  // -------------------------------------------------------------------------
  // Rendering
  // -------------------------------------------------------------------------

  function renderFrame(): string[] {
    // Build a 2D grid
    const grid: string[][] = []
    for (let y = 0; y < HEIGHT; y++) {
      const row: string[] = []
      for (let x = 0; x < WIDTH; x++) {
        row.push(" ")
      }
      grid.push(row)
    }

    // Place food
    if (food.x >= 0 && food.x < WIDTH && food.y >= 0 && food.y < HEIGHT) {
      grid[food.y][food.x] = FOOD_CHAR
    }

    // Place snake body (skip head at index 0)
    for (let i = 1; i < snake.length; i++) {
      const seg = snake[i]
      if (seg.x >= 0 && seg.x < WIDTH && seg.y >= 0 && seg.y < HEIGHT) {
        grid[seg.y][seg.x] = BODY_CHAR
      }
    }

    // Place snake head
    if (snake.length > 0) {
      const head = snake[0]
      if (head.x >= 0 && head.x < WIDTH && head.y >= 0 && head.y < HEIGHT) {
        grid[head.y][head.x] = HEAD_CHARS[direction]
      }
    }

    // Build frame lines
    const lines: string[] = []

    // Top border
    lines.push("┌" + "─".repeat(WIDTH) + "┐")

    // Content rows
    for (let y = 0; y < HEIGHT; y++) {
      lines.push("│" + grid[y].join("") + "│")
    }

    // Bottom border
    lines.push("└" + "─".repeat(WIDTH) + "┘")

    // Blank separator after board
    lines.push("")

    // Score line with proper column alignment
    const scoreCol = `Score: ${score}`.padEnd(16)
    const highCol = `High: ${highScore}`.padEnd(16)
    lines.push(`  ${scoreCol}${highCol}[WASD/Arrows · Q to quit]`)

    if (gameOver) {
      lines.push("")
      lines.push("  GAME OVER! Press R to restart, Q to quit")
    }

    return lines
  }

  function emitFrame(): void {
    if (frameCallback) {
      const frame = renderFrame()
      frameCallback(frame, score, highScore, gameOver)
    }
  }

  // -------------------------------------------------------------------------
  // Game tick
  // -------------------------------------------------------------------------

  function tick(): void {
    if (gameOver) return

    const head = snake[0]
    const delta = DIRECTION_VECTORS[direction]
    const newHead: Point = { x: head.x + delta.x, y: head.y + delta.y }

    if (newHead.x < 0 || newHead.x >= WIDTH || newHead.y < 0 || newHead.y >= HEIGHT) {
      gameOver = true
      if (score > highScore) highScore = score
      clearTickInterval()
      gameOverCallback?.()
      emitFrame()
      return
    }

    const willEat = pointsEqual(newHead, food)
    const bodyToCheck = willEat ? snake : snake.slice(0, -1)
    if (bodyToCheck.some((seg) => pointsEqual(seg, newHead))) {
      gameOver = true
      if (score > highScore) highScore = score
      clearTickInterval()
      gameOverCallback?.()
      emitFrame()
      return
    }

    // Move snake
    snake.unshift(newHead)

    if (willEat) {
      score += 1
      if (score > highScore) highScore = score
      eatCallback?.()

      if (score >= FLAG_SCORE && !flagFired) {
        flagFired = true
        flagCallback?.()
      }

      spawnFood()
    } else {
      // Normal move: remove tail
      snake.pop()
    }

    emitFrame()
  }

  // -------------------------------------------------------------------------
  // Interval management
  // -------------------------------------------------------------------------

  function clearTickInterval(): void {
    if (intervalId !== null) {
      clearInterval(intervalId)
      intervalId = null
    }
  }

  function startTickInterval(): void {
    clearTickInterval()
    intervalId = setInterval(tick, TICK_MS)
  }

  // -------------------------------------------------------------------------
  // Key handling
  // -------------------------------------------------------------------------

  const KEY_MAP: Record<string, Direction> = {
    ArrowUp: "up",
    ArrowDown: "down",
    ArrowLeft: "left",
    ArrowRight: "right",
    w: "up",
    W: "up",
    a: "left",
    A: "left",
    s: "down",
    S: "down",
    d: "right",
    D: "right",
  }

  function handleKey(key: string): void {
    // Quit
    if (key === "q" || key === "Q" || key === "Escape") {
      stop()
      return
    }

    // Restart
    if (key === "r" || key === "R") {
      if (gameOver) {
        start()
      }
      return
    }

    // Direction change
    const newDir = KEY_MAP[key]
    if (newDir !== undefined && newDir !== OPPOSITES[direction]) {
      direction = newDir
    }
  }

  // -------------------------------------------------------------------------
  // Public API
  // -------------------------------------------------------------------------

  function start(): void {
    resetState()
    startTickInterval()
    emitFrame()
  }

  function stop(): void {
    clearTickInterval()
  }

  function onFrame(
    callback: (frame: string[], score: number, highScore: number, gameOver: boolean) => void,
  ): void {
    frameCallback = callback
  }

  function onFlag(callback: () => void): void {
    flagCallback = callback
  }

  function onEat(callback: () => void): void {
    eatCallback = callback
  }

  function onGameOver(callback: () => void): void {
    gameOverCallback = callback
  }

  function getScore(): number {
    return score
  }

  return {
    start,
    stop,
    handleKey,
    onFrame,
    onFlag,
    onEat,
    onGameOver,
    getScore,
  }
}
