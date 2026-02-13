import { useRef, useEffect, type KeyboardEvent } from "react"

interface TerminalInputProps {
  value: string
  onChange: (value: string) => void
  onSubmit: (text: string) => void
  onClear: () => void
  onHistoryNav: (direction: "up" | "down") => void
  onTab: (partial: string) => void
  disabled?: boolean
}

export function TerminalInput({
  value,
  onChange,
  onSubmit,
  onClear,
  onHistoryNav,
  onTab,
  disabled = false,
}: TerminalInputProps) {
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      e.preventDefault()
      onSubmit(value)
      return
    }

    if (e.key === "c" && e.ctrlKey) {
      e.preventDefault()
      onSubmit("^C")
      return
    }

    if (e.key === "l" && e.ctrlKey) {
      e.preventDefault()
      onClear()
      return
    }

    if (e.key === "ArrowUp") {
      e.preventDefault()
      onHistoryNav("up")
      return
    }

    if (e.key === "ArrowDown") {
      e.preventDefault()
      onHistoryNav("down")
      return
    }

    if (e.key === "Tab") {
      e.preventDefault()
      onTab(value)
      return
    }
  }

  return (
    <div className="relative inline">
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        className="absolute opacity-0 w-0 h-0 pointer-events-none"
        aria-label="Terminal input"
        autoCapitalize="off"
        autoCorrect="off"
        autoComplete="off"
        spellCheck={false}
      />
      <span className="text-foreground">{value}</span>
      <span className="cursor" />
    </div>
  )
}

export function focusTerminalInput(container: HTMLElement | null) {
  if (!container) return
  const input = container.querySelector<HTMLInputElement>(
    'input[aria-label="Terminal input"]',
  )
  input?.focus()
}
