import {
  useState,
  useCallback,
  useEffect,
  useRef,
  type RefObject,
  type MutableRefObject,
  type Dispatch,
  type SetStateAction,
} from "react"
import type { Bookmark } from "@/lib/vault-utils"

export interface UseVaultBookmarksReturn {
  currentBookmarks: Bookmark[]
  toggleBookmark: (headingId: string, headingText: string) => void
  handleBookmarkNavigation: (fileKey: string, headingId: string) => void
  showContinuePill: boolean
  setShowContinuePill: Dispatch<SetStateAction<boolean>>
  lastBookmark: Bookmark | null
  pendingScrollTarget: MutableRefObject<string | null>
  toggledCheckboxes: number[]
  onToggleCheckbox: (index: number) => void
  checkboxIndexRef: MutableRefObject<number>
}

export function useVaultBookmarks(
  active: string | null,
  setActive: (key: string) => void,
  contentRef: RefObject<HTMLDivElement | null>,
): UseVaultBookmarksReturn {
  const [currentBookmarks, setCurrentBookmarks] = useState<Bookmark[]>([])
  const [showContinuePill, setShowContinuePill] = useState(false)
  const [toggledCheckboxes, setToggledCheckboxes] = useState<number[]>([])
  const checkboxIndexRef = useRef(0)
  const pendingScrollTarget = useRef<string | null>(null)

  const toggleBookmark = useCallback(
    (headingId: string, headingText: string) => {
      if (!active) return
      const key = `vault-bookmark-${active}`
      const exists = currentBookmarks.some((b) => b.headingId === headingId)
      let updated: Bookmark[]
      if (exists) {
        updated = currentBookmarks.filter((b) => b.headingId !== headingId)
      } else {
        const scrollY = contentRef.current?.scrollTop ?? 0
        updated = [...currentBookmarks, { headingId, headingText, scrollY }]
      }
      if (updated.length === 0) {
        localStorage.removeItem(key)
      } else {
        localStorage.setItem(key, JSON.stringify(updated))
      }
      setCurrentBookmarks(updated)
    },
    [active, currentBookmarks, contentRef],
  )

  const handleBookmarkNavigation = useCallback(
    (fileKey: string, headingId: string) => {
      pendingScrollTarget.current = headingId
      setActive(fileKey)
    },
    [setActive],
  )

  const onToggleCheckbox = useCallback(
    (index: number) => {
      setToggledCheckboxes((prev) => {
        const next = prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
        if (active) {
          localStorage.setItem(`vault-checkboxes-${active}`, JSON.stringify(next))
        }
        return next
      })
    },
    [active],
  )

  useEffect(() => {
    if (!active) {
      setCurrentBookmarks([])
      return
    }
    const saved = localStorage.getItem(`vault-bookmark-${active}`)
    if (!saved) {
      setCurrentBookmarks([])
      return
    }
    const parsed = JSON.parse(saved)
    setCurrentBookmarks(Array.isArray(parsed) ? parsed : [parsed])
  }, [active])

  useEffect(() => {
    if (!active) {
      setToggledCheckboxes([])
      return
    }
    const saved = localStorage.getItem(`vault-checkboxes-${active}`)
    setToggledCheckboxes(saved ? JSON.parse(saved) : [])
  }, [active])

  useEffect(() => {
    if (currentBookmarks.length > 0) {
      setShowContinuePill(true)
      const timer = setTimeout(() => setShowContinuePill(false), 5000)
      return () => clearTimeout(timer)
    }
    setShowContinuePill(false)
  }, [active, currentBookmarks])

  const lastBookmark =
    currentBookmarks.length > 0 ? currentBookmarks[currentBookmarks.length - 1] : null

  return {
    currentBookmarks,
    toggleBookmark,
    handleBookmarkNavigation,
    showContinuePill,
    setShowContinuePill,
    lastBookmark,
    pendingScrollTarget,
    toggledCheckboxes,
    onToggleCheckbox,
    checkboxIndexRef,
  }
}
