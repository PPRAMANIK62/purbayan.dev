import { useEffect, useState } from "react"

interface CrtGlitchProps {
  trigger: boolean
  onComplete: () => void
}

export function CrtGlitch({ trigger, onComplete }: CrtGlitchProps) {
  const [active, setActive] = useState(false)

  useEffect(() => {
    if (!trigger) return
    setActive(true)
    const timer = setTimeout(() => {
      setActive(false)
      onComplete()
    }, 300)
    return () => clearTimeout(timer)
  }, [trigger, onComplete])

  if (!active) return null

  return (
    <div className="fixed inset-0 z-[200] pointer-events-none crt-glitch" aria-hidden="true">
      <div className="absolute inset-0 crt-scanlines" />
    </div>
  )
}
