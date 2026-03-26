import {
  useEffect,
  useRef,
  type RefObject,
  type MutableRefObject,
  type Dispatch,
  type SetStateAction,
} from "react"

export interface UseVaultProgressReturn {
  progressRef: MutableRefObject<number>
  topBarRef: RefObject<HTMLDivElement | null>
  activeBarRef: RefObject<HTMLDivElement | null>
}

export function useVaultProgress(
  active: string | null,
  contentRef: RefObject<HTMLDivElement | null>,
  pendingScrollTarget: MutableRefObject<string | null>,
  setShowContinuePill: Dispatch<SetStateAction<boolean>>,
): UseVaultProgressReturn {
  const progressRef = useRef(0)
  const topBarRef = useRef<HTMLDivElement>(null)
  const activeBarRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = contentRef.current
    if (!el || !active) return

    let timer: ReturnType<typeof setTimeout>

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = el
      const maxScroll = scrollHeight - clientHeight
      if (maxScroll <= 0) return
      const pct = Math.round((scrollTop / maxScroll) * 100)
      progressRef.current = pct

      if (topBarRef.current) {
        topBarRef.current.style.width = `${pct}%`
      }
      if (activeBarRef.current) {
        activeBarRef.current.style.width = `${pct}%`
      }

      clearTimeout(timer)
      timer = setTimeout(() => {
        localStorage.setItem(`vault-progress-${active}`, String(pct))
      }, 200)
    }

    el.addEventListener("scroll", handleScroll, { passive: true })
    return () => {
      clearTimeout(timer)
      el.removeEventListener("scroll", handleScroll)
    }
  }, [active, contentRef])

  useEffect(() => {
    if (!active) {
      progressRef.current = 0
      if (topBarRef.current) topBarRef.current.style.width = "0%"
      return
    }
    const saved = localStorage.getItem(`vault-progress-${active}`)
    const pct = saved ? parseInt(saved, 10) : 0
    progressRef.current = pct

    if (topBarRef.current) topBarRef.current.style.width = `${pct}%`
    if (activeBarRef.current) activeBarRef.current.style.width = `${pct}%`

    const timer = setTimeout(() => {
      if (pendingScrollTarget.current) {
        const headingId = pendingScrollTarget.current
        pendingScrollTarget.current = null
        document.getElementById(headingId)?.scrollIntoView({ behavior: "smooth" })
        setShowContinuePill(false)
        return
      }
      const el = contentRef.current
      if (!el || pct === 0) return
      const maxScroll = el.scrollHeight - el.clientHeight
      el.scrollTop = (pct / 100) * maxScroll
    }, 350)

    return () => clearTimeout(timer)
  }, [active, contentRef, pendingScrollTarget, setShowContinuePill])

  return {
    progressRef,
    topBarRef,
    activeBarRef,
  }
}
