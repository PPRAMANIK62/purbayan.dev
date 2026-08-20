import { useEffect, useRef, type RefObject } from "react"

interface Frame {
  x: number
  y: number
  w: number
  h: number
  name: string
}

/**
 * The scene, in world coordinates (origin = canvas centre). Positioned in the
 * right-hand negative space so the frames never sit behind the headline.
 * Named after the surfaces Purbayan actually builds.
 */
const INITIAL_SCENE: Frame[] = [
  { x: 150, y: -196, w: 190, h: 128, name: "Brief" },
  { x: 398, y: -54, w: 150, h: 104, name: "Storyboard" },
  { x: 186, y: 96, w: 210, h: 140, name: "Canvas" },
  { x: 452, y: 132, w: 128, h: 86, name: "Registry" },
]

/** Below this width the headline goes full-bleed and frames would collide with it. */
const FRAME_MIN_WIDTH = 900

interface HeroCanvasProps {
  /** The hero <section>. Pointer events are bound here so the whole area is draggable. */
  surfaceRef: RefObject<HTMLElement | null>
}

export function HeroCanvas({ surfaceRef }: HeroCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const hintRef = useRef<HTMLSpanElement>(null)
  const hintBoxRef = useRef<HTMLDivElement>(null)
  const hudBoxRef = useRef<HTMLDivElement>(null)
  const redrawsRef = useRef<HTMLSpanElement>(null)
  const frameMsRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const surface = surfaceRef.current
    if (!canvas || !surface) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const root = document.documentElement
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches
    const fine = matchMedia("(pointer: fine)").matches

    const scene: Frame[] = INITIAL_SCENE.map((f) => ({ ...f }))
    const cam = { x: 0, y: 0 }
    let parallax = 0
    let W = 0
    let H = 0

    let hover: Frame | null = null
    let selection: Frame[] = []
    let mode: "idle" | "move" | "marquee" | "pan" = "idle"
    let lastPoint = { x: 0, y: 0 }
    let band: { ax: number; ay: number; bx: number; by: number } | null = null
    let didMove = false

    let redraws = 0

    const css = (name: string) => getComputedStyle(root).getPropertyValue(name).trim()
    const sx = (x: number) => x + cam.x + W / 2
    const sy = (y: number) => y + cam.y + parallax + H / 2

    const hasRoundRect = typeof ctx.roundRect === "function"

    function roundRect(x: number, y: number, w: number, h: number, r: number) {
      ctx!.beginPath()
      if (hasRoundRect) ctx!.roundRect(x, y, w, h, r)
      else ctx!.rect(x, y, w, h)
    }

    function draw() {
      if (!W || !H) return
      const t0 = performance.now()
      const dot = css("--c-canvas-dot")
      const ink = css("--c-canvas-ink")
      const accent = css("--c-brand")
      const accentInk = css("--c-brand-ink")
      const dim = css("--c-dim")

      ctx!.clearRect(0, 0, W, H)

      // dot grid, anchored to the camera
      const step = 34
      const gx = ((((cam.x + W / 2) % step) + step) % step) - step
      const gy = ((((cam.y + parallax + H / 2) % step) + step) % step) - step
      ctx!.fillStyle = dot
      for (let x = gx; x < W + step; x += step) {
        for (let y = gy; y < H + step; y += step) {
          ctx!.fillRect(x, y, 1.4, 1.4)
        }
      }

      if (W < FRAME_MIN_WIDTH) {
        redraws += 1
        report(performance.now() - t0)
        return
      }

      ctx!.font = '500 11px "Instrument Sans Variable", system-ui, sans-serif'
      ctx!.textBaseline = "alphabetic"

      for (const frame of scene) {
        const X = sx(frame.x)
        const Y = sy(frame.y)
        const isSelected = selection.includes(frame)
        const lit = isSelected || frame === hover
        ctx!.lineWidth = isSelected ? 1.5 : 1
        ctx!.strokeStyle = lit ? accent : ink
        roundRect(X, Y, frame.w, frame.h, 6)
        ctx!.stroke()
        ctx!.fillStyle = lit ? accent : dim
        ctx!.fillText(frame.name, X, Y - 9)
      }

      // selection handles
      ctx!.fillStyle = accent
      for (const frame of selection) {
        const X = sx(frame.x)
        const Y = sy(frame.y)
        const corners = [
          [X, Y],
          [X + frame.w, Y],
          [X, Y + frame.h],
          [X + frame.w, Y + frame.h],
        ]
        for (const [cx, cy] of corners) ctx!.fillRect(cx - 3, cy - 3, 6, 6)
      }

      // dimension badge — the element inspector, in miniature
      const badge =
        selection.length === 1 ? selection[0] : selection.length === 0 && hover ? hover : null
      if (badge) {
        const bx = sx(badge.x) + badge.w / 2
        const by = sy(badge.y) + badge.h + 8
        const text = `${Math.round(badge.w)} × ${Math.round(badge.h)}`
        const tw = ctx!.measureText(text).width
        ctx!.fillStyle = accent
        roundRect(bx - tw / 2 - 6, by, tw + 12, 17, 3)
        ctx!.fill()
        ctx!.fillStyle = accentInk
        ctx!.fillText(text, bx - tw / 2, by + 12)
      }

      if (band) {
        const x0 = Math.min(band.ax, band.bx)
        const y0 = Math.min(band.ay, band.by)
        const bw = Math.abs(band.bx - band.ax)
        const bh = Math.abs(band.by - band.ay)
        ctx!.fillStyle = css("--c-brand-wash")
        ctx!.fillRect(x0, y0, bw, bh)
        ctx!.strokeStyle = accent
        ctx!.lineWidth = 1
        ctx!.strokeRect(x0 + 0.5, y0 + 0.5, bw, bh)
      }

      redraws += 1
      report(performance.now() - t0)
    }

    function report(ms: number) {
      if (redrawsRef.current) redrawsRef.current.textContent = redraws.toLocaleString()
      if (frameMsRef.current) frameMsRef.current.textContent = `${ms.toFixed(2)} ms`
    }

    function resize() {
      const dpr = Math.min(devicePixelRatio || 1, 2)
      W = canvas!.clientWidth
      H = canvas!.clientHeight
      canvas!.width = Math.floor(W * dpr)
      canvas!.height = Math.floor(H * dpr)
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0)
      draw()
    }

    function hitTest(px: number, py: number): Frame | null {
      for (let i = scene.length - 1; i >= 0; i -= 1) {
        const f = scene[i]
        const X = sx(f.x)
        const Y = sy(f.y)
        if (px >= X && px <= X + f.w && py >= Y && py <= Y + f.h) return f
      }
      return null
    }

    function toLocal(e: PointerEvent) {
      const r = canvas!.getBoundingClientRect()
      return { x: e.clientX - r.left, y: e.clientY - r.top }
    }

    function say(text: string) {
      if (hintRef.current) hintRef.current.textContent = text
    }

    resize()
    window.addEventListener("resize", resize)

    let onPointerDown: ((e: PointerEvent) => void) | null = null
    let onPointerMove: ((e: PointerEvent) => void) | null = null
    let onPointerUp: (() => void) | null = null
    let onScroll: (() => void) | null = null
    let hintTimer: number | undefined

    // Interaction is desktop-only: on touch this would fight page scrolling.
    if (fine && !reduce) {
      hintTimer = window.setTimeout(() => {
        hintBoxRef.current?.classList.remove("opacity-0")
        hudBoxRef.current?.classList.remove("opacity-0")
      }, 1500)

      onPointerDown = (e: PointerEvent) => {
        const target = e.target as HTMLElement | null
        if (target?.closest("a, button")) return
        const p = toLocal(e)
        lastPoint = p
        didMove = false

        if (e.altKey || e.button === 1) {
          mode = "pan"
          surface!.style.cursor = "grabbing"
        } else {
          const frame = hitTest(p.x, p.y)
          if (frame) {
            if (!selection.includes(frame)) {
              selection = e.shiftKey ? [...selection, frame] : [frame]
            }
            mode = "move"
            surface!.style.cursor = "grabbing"
          } else {
            selection = []
            band = { ax: p.x, ay: p.y, bx: p.x, by: p.y }
            mode = "marquee"
          }
        }
        document.body.style.userSelect = "none"
        draw()
      }

      onPointerMove = (e: PointerEvent) => {
        const p = toLocal(e)

        if (mode === "idle") {
          const next = hitTest(p.x, p.y)
          if (next !== hover) {
            hover = next
            surface!.style.cursor = next ? "grab" : "default"
            draw()
          }
          return
        }

        const dx = p.x - lastPoint.x
        const dy = p.y - lastPoint.y
        lastPoint = p
        if (Math.abs(dx) + Math.abs(dy) > 2) didMove = true

        if (mode === "pan") {
          cam.x += dx
          cam.y += dy
        } else if (mode === "move") {
          for (const frame of selection) {
            frame.x += dx
            frame.y += dy
          }
        } else if (mode === "marquee" && band) {
          band.bx = p.x
          band.by = p.y
          const x0 = Math.min(band.ax, band.bx)
          const x1 = Math.max(band.ax, band.bx)
          const y0 = Math.min(band.ay, band.by)
          const y1 = Math.max(band.ay, band.by)
          selection = scene.filter((f) => {
            const X = sx(f.x)
            const Y = sy(f.y)
            return X < x1 && X + f.w > x0 && Y < y1 && Y + f.h > y0
          })
        }
        draw()
      }

      onPointerUp = () => {
        if (mode === "idle") return
        if (mode === "marquee" && selection.length) {
          say(`${selection.length} selected · drag to move`)
        } else if (mode === "move" && didMove) {
          say("Alt-drag to pan · press I for inspector")
        }
        band = null
        mode = "idle"
        surface!.style.cursor = hover ? "grab" : "default"
        document.body.style.userSelect = ""
        draw()
      }

      onScroll = () => {
        if (window.scrollY < window.innerHeight) {
          parallax = -window.scrollY * 0.12
          draw()
        }
      }

      surface.addEventListener("pointerdown", onPointerDown)
      window.addEventListener("pointermove", onPointerMove)
      window.addEventListener("pointerup", onPointerUp)
      window.addEventListener("scroll", onScroll, { passive: true })
    }

    return () => {
      window.removeEventListener("resize", resize)
      if (hintTimer) clearTimeout(hintTimer)
      if (onPointerDown) surface.removeEventListener("pointerdown", onPointerDown)
      if (onPointerMove) window.removeEventListener("pointermove", onPointerMove)
      if (onPointerUp) window.removeEventListener("pointerup", onPointerUp)
      if (onScroll) window.removeEventListener("scroll", onScroll)
      document.body.style.userSelect = ""
      surface.style.cursor = ""
    }
  }, [surfaceRef])

  return (
    <>
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className="absolute inset-0 z-0 h-full w-full [mask-image:radial-gradient(125%_100%_at_50%_42%,#000_34%,transparent_78%)] [-webkit-mask-image:radial-gradient(125%_100%_at_50%_42%,#000_34%,transparent_78%)]"
      />

      <div
        ref={hintBoxRef}
        className="pointer-events-none absolute bottom-6 left-[clamp(20px,5vw,72px)] z-[2] hidden items-center gap-[9px] opacity-0 transition-opacity duration-500 [@media(pointer:fine)]:flex"
      >
        <span aria-hidden="true" className="size-[5px] rounded-full bg-brand" />
        <span ref={hintRef} className="label-xs text-dim">
          Drag a frame to move it
        </span>
      </div>

      <div
        ref={hudBoxRef}
        aria-hidden="true"
        className="pointer-events-none absolute bottom-6 right-[clamp(20px,5vw,72px)] z-[2] hidden flex-col items-end gap-[2px] text-[10.5px] uppercase tracking-[0.13em] text-faint opacity-0 transition-opacity duration-700 min-[900px]:[@media(pointer:fine)]:flex"
      >
        <div className="flex items-baseline gap-2">
          <span className="text-dim">redraws</span>
          <span ref={redrawsRef} className="tabular-nums tracking-[0.06em] text-brand">
            0
          </span>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-dim">frame</span>
          <span ref={frameMsRef} className="tabular-nums tracking-[0.06em] text-brand">
            0.00 ms
          </span>
        </div>
        <div>immediate mode · full repaint</div>
      </div>
    </>
  )
}
