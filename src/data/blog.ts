export type ContentBlock =
  | { type: "paragraph"; text: string }
  | { type: "heading"; text: string }
  | { type: "code"; language: string; code: string }
  | { type: "list"; items: string[] }

export interface BlogPost {
  slug: string
  title: string
  date: string
  tags: string[]
  summary: string
  readingTime: string
  content: ContentBlock[]
}

export const blogPosts: BlogPost[] = [
  {
    slug: "layers-on-an-immediate-mode-canvas",
    title: "Layers on an Immediate-Mode Canvas",
    date: "2025-02-16",
    tags: ["canvas-api", "react", "typescript", "architecture"],
    summary:
      "The HTML5 Canvas API is immediate-mode \u2014 it forgets everything it draws. So how do you build layers, undo/redo, and compositing on top of it?",
    readingTime: "4 min read",
    content: [
      {
        type: "paragraph",
        text: "The HTML5 Canvas API is immediate-mode. You call `ctx.fillRect()`, pixels appear on a bitmap, and the API forgets it ever happened. There's no scene graph, no object you can select later, no `.setVisible(false)`. Once it's drawn, it's just pixels.",
      },
      {
        type: "paragraph",
        text: "So when I wanted layers \u2014 visibility toggles, reordering, per-layer erasure \u2014 I had to figure out how to build a retained-mode abstraction on top of an API that was never designed for one.",
      },
      {
        type: "paragraph",
        text: "This is a writeup of the approach I landed on in **Canvas Kit**, a drawing app built with Next.js 15 and React 19.",
      },
      {
        type: "heading",
        text: "The Problem",
      },
      {
        type: "paragraph",
        text: 'A single `<canvas>` element gives you one drawing surface. If you draw a red circle and then a blue square on top of it, hiding the square means redrawing the entire canvas without the square. The canvas doesn\'t know what a "square" is \u2014 it only knows pixels.',
      },
      {
        type: "paragraph",
        text: "Most browser drawing tools solve this one of two ways:",
      },
      {
        type: "list",
        items: [
          "**SVG-based** (Excalidraw, tldraw) \u2014 every shape is a DOM node. Layers are trivial because you just toggle `display: none`. But freehand drawing generates thousands of path nodes, and performance degrades fast.",
          "**One canvas per layer** (Photoshop-style) \u2014 stack multiple `<canvas>` elements with `position: absolute` and composite them visually via CSS. Each layer is independent. This is clean but creates a real DOM element per layer, complicates event handling, and makes export non-trivial since you have to manually flatten.",
        ],
      },
      {
        type: "paragraph",
        text: "I went with a third approach: **one canvas, multiple offscreen buffers**.",
      },
      {
        type: "heading",
        text: "The Architecture",
      },
      {
        type: "paragraph",
        text: "Each layer gets its own `OffscreenCanvas` (or a regular in-memory canvas created via `document.createElement('canvas')`). Drawing operations target the active layer's buffer, never the visible canvas directly.",
      },
      {
        type: "paragraph",
        text: "The visible canvas is just a compositor. On every frame:",
      },
      {
        type: "code",
        language: "javascript",
        code: "clear visible canvas\nfor each layer (bottom to top):\n  if layer.visible:\n    ctx.globalAlpha = layer.opacity\n    ctx.drawImage(layer.buffer, 0, 0)",
      },
      {
        type: "paragraph",
        text: "This gives you layer visibility, opacity, and reordering for free \u2014 it's just changing the iteration order or skipping a `drawImage` call.",
      },
      {
        type: "heading",
        text: "Why This Is Harder Than It Sounds",
      },
      {
        type: "paragraph",
        text: "**Erasing across layers.** With a single canvas, `globalCompositeOperation = 'destination-out'` erases pixels. But with offscreen buffers, you need to erase from the correct layer's buffer, then recomposite. If you erase on Layer 2, Layer 1's pixels underneath should show through \u2014 but they were never \"hidden,\" they just hadn't been composited yet. The eraser needs to operate on the active buffer with `destination-out`, then the compositor handles the rest.",
      },
      {
        type: "paragraph",
        text: "**Undo/redo with layers.** A naive undo stack stores canvas snapshots \u2014 `ctx.getImageData()` on every stroke. That's fine for a single canvas, but with N layers, you need to know which layer was modified. Each history entry stores: `{ layerId, imageData, before, after }`. Undo restores the `before` snapshot to that specific layer's buffer, then recomposites. This is essentially a per-layer command pattern \u2014 the commands are bitmap diffs, not shape descriptions.",
      },
      {
        type: "paragraph",
        text: "**Responsive sizing.** The canvas `width`/`height` attributes set the bitmap resolution. CSS `width`/`height` sets the display size. If these don't match, everything looks blurry or distorted. On resize, you need to: save all layer buffers, resize every offscreen canvas, restore the buffers, and recomposite. You can't just set `width: 100%` and walk away.",
      },
      {
        type: "heading",
        text: "Keyboard Shortcuts and Tool State",
      },
      {
        type: "paragraph",
        text: "Each tool (Brush, Eraser, Rectangle, Circle) is a strategy object that handles `pointerdown`, `pointermove`, and `pointerup` differently. Switching tools with `B`/`E`/`R`/`C` just swaps which strategy is active.",
      },
      {
        type: "paragraph",
        text: "The tricky part is preventing keyboard shortcuts from conflicting with browser defaults. `Ctrl+Z` for undo, for example, also triggers the browser's native undo on any focused input. The fix: the canvas container captures keyboard events, and `e.preventDefault()` is called selectively \u2014 only for shortcuts we actually handle.",
      },
      {
        type: "heading",
        text: "Export",
      },
      {
        type: "paragraph",
        text: 'Since the visible canvas is already a flattened composite, export is almost trivial: `canvas.toDataURL(\'image/png\')` gives you a data URI, and you create an anchor element with `download` attribute. The one subtlety: you need to composite one final time with all layers visible (regardless of toggle state) if you want a "visible layers only" export vs. "all layers" export. Canvas Kit exports what you see.',
      },
      {
        type: "heading",
        text: "What I'd Do Differently",
      },
      {
        type: "paragraph",
        text: "The entire app lives in a single `page.tsx` \u2014 state, drawing logic, UI, compositing. It works, but the drawing engine (buffers, compositing, history) should be a standalone module with no React dependency. You should be able to `new CanvasEngine(el)` and have it work in vanilla JS. The React layer should only handle UI state: which tool is selected, panel open/closed, color picker value.",
      },
      {
        type: "paragraph",
        text: "I also skipped pressure sensitivity entirely. The Pointer Events API exposes `pressure` on supported devices, and mapping that to brush width would make freehand drawing feel significantly better. It's maybe 20 lines of code.",
      },
      {
        type: "heading",
        text: "Stack",
      },
      {
        type: "list",
        items: [
          "**Next.js 15 / React 19** \u2014 App Router, single page",
          "**TypeScript** \u2014 entire codebase, ~94.5%",
          "**Tailwind CSS 4** \u2014 layout and UI",
          "**Framer Motion** \u2014 panel animations",
          "**Canvas API** \u2014 all drawing, compositing, export",
        ],
      },
      {
        type: "paragraph",
        text: "The repo is at github.com/PPRAMANIK62/canvas-kit, and there's a live demo at canvas-kit.vercel.app.",
      },
    ],
  },
]
