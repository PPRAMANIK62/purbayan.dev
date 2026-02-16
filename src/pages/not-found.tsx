import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { motion } from "motion/react"
import { usePageMeta } from "@/hooks/use-page-meta"

const COMMAND = "$ cat /page/that-doesnt-exist"
const ERROR = "cat: /page/that-doesnt-exist: No such file or directory"
const HINT = "$ hint: there's more where this came from... try \u2191\u2191\u2193\u2193\u2190\u2192\u2190\u2192BA"
const CHAR_DELAY = 30
const HINT_CHAR_DELAY = 60
const PAUSE_AFTER_COMMAND = 300
const PAUSE_AFTER_ERROR = 500
const HINT_DELAY = 3000

export default function NotFoundPage() {
  usePageMeta({ title: "404", description: "Page not found." })

  const [commandText, setCommandText] = useState("")
  const [errorText, setErrorText] = useState("")
  const [hintText, setHintText] = useState("")
  const [phase, setPhase] = useState<
    "typing-command" | "pause-1" | "typing-error" | "pause-2" | "done" | "typing-hint"
  >("typing-command")

  useEffect(() => {
    if (phase === "typing-command") {
      if (commandText.length < COMMAND.length) {
        const timeout = setTimeout(() => {
          setCommandText(COMMAND.slice(0, commandText.length + 1))
        }, CHAR_DELAY)
        return () => clearTimeout(timeout)
      }
      setPhase("pause-1")
    }

    if (phase === "pause-1") {
      const timeout = setTimeout(
        () => setPhase("typing-error"),
        PAUSE_AFTER_COMMAND,
      )
      return () => clearTimeout(timeout)
    }

    if (phase === "typing-error") {
      if (errorText.length < ERROR.length) {
        const timeout = setTimeout(() => {
          setErrorText(ERROR.slice(0, errorText.length + 1))
        }, CHAR_DELAY)
        return () => clearTimeout(timeout)
      }
      setPhase("pause-2")
    }

    if (phase === "pause-2") {
      const timeout = setTimeout(() => setPhase("done"), PAUSE_AFTER_ERROR)
      return () => clearTimeout(timeout)
    }

    if (phase === "done") {
      const timeout = setTimeout(() => setPhase("typing-hint"), HINT_DELAY)
      return () => clearTimeout(timeout)
    }

    if (phase === "typing-hint") {
      if (hintText.length < HINT.length) {
        const timeout = setTimeout(() => {
          setHintText(HINT.slice(0, hintText.length + 1))
        }, HINT_CHAR_DELAY)
        return () => clearTimeout(timeout)
      }
    }
  }, [phase, commandText, errorText, hintText])

  const showCursorOnCommand =
    phase === "typing-command" || phase === "pause-1"
  const showCursorOnError = phase === "typing-error"
  const isDone = phase === "done" || phase === "typing-hint"
  const showDoneCursor = phase === "done"
  const isTypingHint = phase === "typing-hint"
  const showHintCursor = isTypingHint && hintText.length < HINT.length

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col items-start justify-center max-w-3xl mx-auto px-6">
      <div className="font-mono text-sm leading-relaxed">
        <span className="text-tokyo-green">$ </span>
        <span className="text-foreground">{commandText.slice(2)}</span>
        {showCursorOnCommand && <span className="cursor" />}
      </div>

      {(phase === "typing-error" ||
        phase === "pause-2" ||
        phase === "done" ||
        phase === "typing-hint") && (
        <div className="font-mono text-sm leading-relaxed mt-1">
          <span className="text-tokyo-red">{errorText}</span>
          {showCursorOnError && <span className="cursor" />}
        </div>
      )}

      {isDone && (
        <div className="font-mono text-sm leading-relaxed mt-1">
          <span className="text-tokyo-green">$ </span>
          {showDoneCursor && <span className="cursor" />}
        </div>
      )}

      {(isTypingHint || hintText.length > 0) && (
        <div className="font-mono text-sm leading-relaxed mt-1">
          <span className="text-muted-foreground/40">{hintText}</span>
          {showHintCursor && <span className="cursor" />}
        </div>
      )}

      {isDone && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mt-8 flex flex-col gap-3"
        >
          <p className="font-mono text-sm text-muted-foreground">
            Looks like this page doesn't exist. Try navigating with{" "}
            <button
              type="button"
              onClick={() => {
                document.dispatchEvent(
                  new KeyboardEvent("keydown", {
                    key: "k",
                    metaKey: true,
                    bubbles: true,
                  }),
                )
              }}
              className="border border-border/50 text-muted-foreground text-xs font-mono px-2 py-1 rounded-md hover:text-primary hover:border-primary/50 transition-colors duration-150 cursor-pointer"
            >
              ⌘K
            </button>{" "}
            or head back home.
          </p>
          <Link
            to="/"
            className="text-primary font-mono text-sm hover:underline"
          >
            → go home
          </Link>
        </motion.div>
      )}
    </div>
  )
}
