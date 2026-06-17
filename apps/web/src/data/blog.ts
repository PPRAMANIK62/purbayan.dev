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
    slug: "before-mmap-and-elf-learning-c-memory",
    title: "Before mmap and ELF: Learning C Memory by Building Tiny Utilities",
    date: "2026-06-17",
    tags: ["c", "memory", "systems", "learning"],
    summary:
      "Before jumping into mmap, ELF files, and operating system internals, I wanted to understand how my own C data structures own and grow memory.",
    readingTime: "6 min read",
    content: [
      {
        type: "paragraph",
        text: "Low-level programming has a way of pulling you toward the dramatic stuff.",
      },
      {
        type: "paragraph",
        text: "ELF files. Assembly. `mmap`. File descriptors. System calls. Debuggers. Memory sanitizers.",
      },
      {
        type: "paragraph",
        text: "All of that is exciting, but I have been trying to slow down and ask a smaller question first:",
      },
      {
        type: "paragraph",
        text: "**Do I actually understand how my own C data structures own memory?**",
      },
      {
        type: "paragraph",
        text: "So I started building a small personal C utility library. Nothing fancy. No arena allocator yet. No hash map. No logger. Just small tools that force me to touch the basics directly.",
      },
      {
        type: "paragraph",
        text: "The first two modules I built were a dynamic array and a string builder. They are common enough to look boring, but implementing them made C memory feel much less abstract.",
      },
      {
        type: "heading",
        text: "The Heap Is Where Growable Storage Lives",
      },
      {
        type: "paragraph",
        text: "A normal local variable has a fixed size.",
      },
      {
        type: "code",
        language: "c",
        code: "int x;",
      },
      {
        type: "paragraph",
        text: "A struct also has a fixed size.",
      },
      {
        type: "code",
        language: "c",
        code: "typedef struct {\n    char *data;\n    size_t length;\n    size_t capacity;\n} StringBuilder;",
      },
      {
        type: "paragraph",
        text: "That struct will never grow. It is just a small control object. The growable part is the memory pointed to by `data`.",
      },
      {
        type: "code",
        language: "text",
        code: "StringBuilder\n  data --------> heap buffer",
      },
      {
        type: "paragraph",
        text: "That was an important shift for me. A dynamic array is not magic. A string builder is not magic. They are small structs that track heap memory.",
      },
      {
        type: "paragraph",
        text: "When more space is needed, the internal buffer is resized.",
      },
      {
        type: "code",
        language: "c",
        code: "char *new_data = realloc(sb->data, new_capacity);",
      },
      {
        type: "paragraph",
        text: "The struct stays the same size. The buffer it points to changes. That is the core pattern.",
      },
      {
        type: "heading",
        text: "realloc Is Useful, But It Has Teeth",
      },
      {
        type: "paragraph",
        text: "At first, it is tempting to write this:",
      },
      {
        type: "code",
        language: "c",
        code: "sb->data = realloc(sb->data, new_capacity);",
      },
      {
        type: "paragraph",
        text: "It looks clean, but it has a problem.",
      },
      {
        type: "paragraph",
        text: "If `realloc` fails, it returns `NULL`. If I assign that directly into `sb->data`, I lose the original pointer. Now I cannot free the old memory anymore.",
      },
      {
        type: "paragraph",
        text: "So the safer pattern is:",
      },
      {
        type: "code",
        language: "c",
        code: "char *new_data = realloc(sb->data, new_capacity);\n\nif (new_data == NULL)\n    return 0;\n\nsb->data = new_data;",
      },
      {
        type: "paragraph",
        text: "This looks like a small detail, but it changed how I think about C.",
      },
      {
        type: "paragraph",
        text: "In C, memory operations are not just operations. They are ownership transitions.",
      },
      {
        type: "paragraph",
        text: "You have to ask: if this fails, do I still own the old memory? Can I still free it? Did I lose the only pointer?",
      },
      {
        type: "paragraph",
        text: "That one temporary variable carries a lot of responsibility.",
      },
      {
        type: "heading",
        text: "A String Builder Has One Sacred Rule",
      },
      {
        type: "paragraph",
        text: "A dynamic array can store arbitrary bytes. A string builder has an extra responsibility: it must always remain a valid C string.",
      },
      {
        type: "paragraph",
        text: "That means after every append, this must be true:",
      },
      {
        type: "code",
        language: "c",
        code: "sb->data[sb->length] = '\\0';",
      },
      {
        type: "paragraph",
        text: "The null terminator is not decoration. It is how C string functions know where the string ends.",
      },
      {
        type: "paragraph",
        text: "If I forget it, the buffer may still contain my characters, but it is no longer safe to treat it like a string.",
      },
      {
        type: "paragraph",
        text: "That made me appreciate something simple: **in C, a string is not just characters. It is characters plus a stopping rule.**",
      },
      {
        type: "paragraph",
        text: "A string builder is really a growable buffer that preserves that stopping rule after every change.",
      },
      {
        type: "heading",
        text: "APIs Tell You Who Owns What",
      },
      {
        type: "paragraph",
        text: "My dynamic array uses this kind of API:",
      },
      {
        type: "code",
        language: "c",
        code: "DynArray *da_create(size_t item_size);\nvoid da_free(DynArray *array);",
      },
      {
        type: "paragraph",
        text: "`da_create` allocates the `DynArray` struct itself. The caller receives a pointer and later gives it back to `da_free`.",
      },
      {
        type: "paragraph",
        text: "The string builder API is different:",
      },
      {
        type: "code",
        language: "c",
        code: "StringBuilder sb_create(void);\nvoid sb_free(StringBuilder *sb);",
      },
      {
        type: "paragraph",
        text: "Here, the struct is returned by value.",
      },
      {
        type: "code",
        language: "c",
        code: 'StringBuilder sb = sb_create();\n\nsb_append(&sb, "hello");\nsb_free(&sb);',
      },
      {
        type: "paragraph",
        text: "The `StringBuilder` struct can live on the stack, while its internal `char *data` still points to heap memory.",
      },
      {
        type: "paragraph",
        text: "That difference helped me understand that API design is not just naming functions. The API decides the ownership model.",
      },
      {
        type: "paragraph",
        text: "When a function returns a pointer, I ask: who allocated this, and who frees it?",
      },
      {
        type: "paragraph",
        text: "When a function accepts a pointer, I ask: is it borrowing this, will it modify it, or will it take ownership?",
      },
      {
        type: "paragraph",
        text: "C does not answer those questions for you. Your API has to make them clear.",
      },
      {
        type: "heading",
        text: "Tests Are Memory Questions Written Down",
      },
      {
        type: "paragraph",
        text: "The tests I wrote were simple. Append a string. Append a character. Clear the builder. Reuse it. Append enough text to force growth.",
      },
      {
        type: "paragraph",
        text: "But those tests were really checking deeper rules:",
      },
      {
        type: "list",
        items: [
          "Does appending preserve the string?",
          "Does clearing keep the builder reusable?",
          "Does growth preserve old data?",
          "Does invalid input fail safely?",
        ],
      },
      {
        type: "paragraph",
        text: "That is another small mindset shift.",
      },
      {
        type: "paragraph",
        text: "Tests are not only about expected output. For C code, they are also about checking memory invariants.",
      },
      {
        type: "paragraph",
        text: "I am not trying to prove the code is perfect. I am trying to catch the obvious ways I might break ownership, growth, or null termination.",
      },
      {
        type: "heading",
        text: "What I Understand Better Now",
      },
      {
        type: "paragraph",
        text: "This project is small, but it taught me useful things.",
      },
      {
        type: "paragraph",
        text: "I understand why growable data lives behind pointers. I understand why `realloc` should be handled carefully. I understand why a C string must always preserve its null terminator. I understand that an API quietly defines ownership.",
      },
      {
        type: "paragraph",
        text: "And most importantly, I understand that these simple utilities are not separate from lower-level programming. They are preparation for it.",
      },
      {
        type: "paragraph",
        text: "Before I can really understand `mmap`, file descriptors, binary formats, or memory debuggers, I need to be comfortable with the smaller memory decisions inside my own code.",
      },
      {
        type: "paragraph",
        text: "So this is where I am starting. Not with a kernel. Not with an allocator. Just a dynamic array, a string builder, and a lot more respect for `malloc`.",
      },
    ],
  },
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
