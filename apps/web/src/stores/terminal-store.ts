import { create } from "zustand"
import { persist } from "zustand/middleware"

const MAX_HISTORY = 100
const DEFAULT_DIRECTORY = "/home/purbayan"

export interface TerminalState {
  // Discovery
  konamiUnlocked: boolean
  terminalDiscovered: boolean

  // Terminal
  isOpen: boolean
  commandHistory: string[]
  currentDirectory: string

  // Flags
  flagsFound: number[]
  totalFlags: 7

  // Settings
  soundEnabled: boolean
  terminalTheme: "default" | "amber" | "green" | "cyan"

  // Snake
  snakeHighScore: number

  // Actions
  openTerminal: () => void
  closeTerminal: () => void
  unlockKonami: () => void
  discoverTerminal: () => void
  captureFlag: (flagNumber: number) => void
  addToHistory: (command: string) => void
  setDirectory: (path: string) => void
  toggleSound: () => void
  setTheme: (theme: TerminalState["terminalTheme"]) => void
  updateSnakeHighScore: (score: number) => void
  reset: () => void
}

const initialState = {
  konamiUnlocked: false,
  terminalDiscovered: false,
  isOpen: false,
  commandHistory: [] as string[],
  currentDirectory: DEFAULT_DIRECTORY,
  flagsFound: [] as number[],
  totalFlags: 7 as const,
  soundEnabled: true,
  terminalTheme: "default" as const,
  snakeHighScore: 0,
}

export const useTerminalStore = create<TerminalState>()(
  persist(
    (set, get) => ({
      ...initialState,

      openTerminal: () => set({ isOpen: true }),

      closeTerminal: () => set({ isOpen: false }),

      unlockKonami: () => set({ konamiUnlocked: true }),

      discoverTerminal: () => set({ terminalDiscovered: true }),

      captureFlag: (flagNumber: number) => {
        const { flagsFound } = get()
        if (flagsFound.includes(flagNumber)) return
        set({ flagsFound: [...flagsFound, flagNumber] })
      },

      addToHistory: (command: string) => {
        const { commandHistory } = get()
        const updated = [...commandHistory, command]
        set({
          commandHistory:
            updated.length > MAX_HISTORY ? updated.slice(updated.length - MAX_HISTORY) : updated,
        })
      },

      setDirectory: (path: string) => set({ currentDirectory: path }),

      toggleSound: () => set((state) => ({ soundEnabled: !state.soundEnabled })),

      setTheme: (theme: TerminalState["terminalTheme"]) => set({ terminalTheme: theme }),

      updateSnakeHighScore: (score: number) => {
        if (score > get().snakeHighScore) {
          set({ snakeHighScore: score })
        }
      },

      reset: () => set(initialState),
    }),
    {
      name: "purbayan-os-state",
      partialize: (state) => ({
        konamiUnlocked: state.konamiUnlocked,
        terminalDiscovered: state.terminalDiscovered,
        commandHistory: state.commandHistory,
        currentDirectory: state.currentDirectory,
        flagsFound: state.flagsFound,
        soundEnabled: state.soundEnabled,
        terminalTheme: state.terminalTheme,
        snakeHighScore: state.snakeHighScore,
      }),
    },
  ),
)
