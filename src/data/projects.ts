export interface Project {
  slug: string
  title: string
  description: string
  longDescription: string
  tags: string[]
  github: string
  demo?: string
  language: string
  tagline: string
  problem: string
  solution: string
  technicalDetails: string[]
  challenges: string[]
}

export const projects: Project[] = [
  {
    slug: "wayforged",
    title: "wayforged",
    description: "TUI installer for a complete Fedora Hyprland dev environment",
    longDescription:
      "A TUI-based installer powered by charmbracelet/gum that recreates a complete Fedora Hyprland development environment. 14 installation phases, 22 config files, three install modes, and Tokyo Night theming across everything.",
    tags: ["shell", "tui", "hyprland", "wayland", "linux"],
    github: "https://github.com/PPRAMANIK62/wayforged",
    language: "Shell",
    tagline: "TUI installer for a complete Fedora Hyprland dev environment",
    problem:
      "Setting up a Fedora Hyprland development environment from scratch means installing dozens of packages, configuring 22 different dotfiles, and remembering the exact order things need to happen. One wrong step and you're debugging for hours. I wanted a single command that recreates my entire setup \u2014 reliably, every time.",
    solution:
      "wayforged is a TUI-based installer powered by charmbracelet/gum that walks through 14 installation phases. It handles everything from Hyprland and Waybar to Ghostty terminal, Zsh plugins, and Tokyo Night theming across all 22 config files. Three install modes (full, minimal, custom) with error recovery and idempotent design \u2014 run it twice and nothing breaks.",
    technicalDetails: [
      "Languages: Shell 95.6%, CSS 4.4% | License: MIT",
      "Architecture: install.sh entry point delegates to lib/ (presentation.sh, logging.sh, errors.sh, utils.sh) and phases/ (14 scripts)",
      "Config coverage: 22 dotfiles \u2014 hypr/, waybar/, rofi/, ghostty/, gtk-3.0/, gtk-4.0/, zed/, zshrc, gitconfig, and more",
      "14 Phases: Repositories, Hyprland and Wayland, Tokyo Night Theme, Nerd Fonts, Ghostty Terminal, Zsh and Oh My Zsh, CLI Tools, Node.js Ecosystem, Editors, Git Configuration, Applications, Languages, System Services, Finalize",
      "Error recovery: retry/skip/log viewing on any phase failure",
      "Only external dependency: charmbracelet/gum (auto-installed)",
    ],
    challenges: [
      "Making shell scripts idempotent \u2014 detecting already-installed packages without breaking re-runs",
      "Error recovery mid-installation without corrupting partial state",
      "Ordering 14 phases correctly \u2014 dependencies between packages mean order matters",
      "Styling TUI menus consistently with gum across different terminal sizes",
    ],
  },
  {
    slug: "canvas-kit",
    title: "Canvas Kit",
    description: "Lightweight drawing app with layers, tools, and export",
    longDescription:
      "A lightweight drawing application built with Next.js and React featuring multiple drawing tools, a layer system with reordering and visibility toggles, keyboard shortcuts, and PNG export. Clean Canvas API usage with a modern component architecture.",
    tags: ["next.js", "react", "typescript", "canvas"],
    github: "https://github.com/PPRAMANIK62/canvas-kit",
    demo: "https://canvas-kit.vercel.app",
    language: "TypeScript",
    tagline: "Lightweight drawing app with layers, tools, and export",
    problem:
      "Most web-based drawing tools are either too complex (Figma-level) or too basic (MS Paint in a browser). I wanted something in between \u2014 a clean drawing tool with proper layer management, keyboard shortcuts, and export, built with modern web technologies.",
    solution:
      "Canvas Kit uses the HTML5 Canvas API with a React component architecture. Features include multiple drawing tools (brush, eraser, shapes), a layer system with reordering and visibility toggles, keyboard shortcuts for common actions, and PNG export. Built with Next.js 15 and React 19.",
    technicalDetails: [
      "Live Demo: canvas-kit.vercel.app",
      "Languages: TypeScript 94.5%, JavaScript 5.2%, CSS 0.3%",
      "Stack: Next.js 15.2.3, React 19.0.0, TypeScript 5.8.2, Tailwind CSS 4.0.15, Framer Motion 12.9.7",
      "Tools with keyboard shortcuts: Brush (B), Eraser (E), Rectangle (R), Circle (C)",
      "Features: Layer management with visibility toggles, color palette + custom picker, adjustable brush/eraser size, opacity controls, background customization, export as image",
      "Built with Create T3 App template, using Bun as package manager",
    ],
    challenges: [
      "Managing canvas state across multiple layers without lag",
      "Implementing undo/redo with a command pattern",
      "Making the canvas responsive while maintaining aspect ratio",
      "Keyboard shortcut conflicts with browser defaults",
    ],
  },
  {
    slug: "4at",
    title: "4at",
    description: "Multi-user TCP chat server in Rust with rate limiting",
    longDescription:
      "A TCP chat server written in both Rust and Go, comparing OS threads vs green threads for concurrent connection handling. Features token-based authentication, rate limiting, ban system, and broadcast messaging \u2014 all built from raw TCP sockets with no frameworks.",
    tags: ["rust", "tcp", "concurrency", "networking"],
    github: "https://github.com/PPRAMANIK62/4at",
    language: "Rust",
    tagline: "Multi-user TCP chat server in Rust with rate limiting",
    problem:
      "I wanted to understand networking from the socket level up. No frameworks, no abstractions \u2014 just raw TCP, threading, and state management. How do you handle multiple concurrent connections? How do you prevent abuse? How do OS threads compare to green threads?",
    solution:
      "4at is a TCP chat server written in both Rust and Go, comparing OS threads vs green threads for concurrent connection handling. Features include user authentication, rate limiting, ban system, and broadcast messaging. The README includes a detailed writeup comparing threading models.",
    technicalDetails: [
      "Languages: Rust 54.0%, Go 46.0% | Rust Edition: 2024",
      "Dependencies (Rust): getrandom v0.3.4 \u2014 nearly zero-dependency",
      "Network: TCP on port 6979, telnet-compatible client interface",
      "Auth: Server generates auth token on startup; clients authenticate via telnet",
      "Features: Token-based authentication, rate limiting, ban system, broadcast messaging, text filter",
      "Structure: src/main.rs (Rust server), archive/main.go (Go implementation kept for comparison)",
    ],
    challenges: [
      "Safely sharing mutable state across threads \u2014 Rust's ownership model makes this explicit",
      "Implementing rate limiting without a separate data store",
      "Graceful connection handling \u2014 detecting disconnects and cleaning up resources",
      "Writing the same server in two languages to compare approaches",
    ],
  },
  {
    slug: "seroost",
    title: "seroost",
    description: "Local search engine using TF-IDF algorithm in Rust",
    longDescription:
      "A local search engine that indexes documents using TF-IDF (Term Frequency-Inverse Document Frequency), ranks them by relevance, and serves results over HTTP. No search library \u2014 just the math and Rust. Full-stack: Rust backend with a JavaScript/HTML web frontend.",
    tags: ["rust", "search", "algorithms", "tf-idf"],
    github: "https://github.com/PPRAMANIK62/seroost",
    language: "Rust",
    tagline: "Local search engine using TF-IDF algorithm in Rust",
    problem:
      "How does search actually work? Not the Google-scale infrastructure, but the core algorithm. Given a collection of documents and a query, how do you rank results by relevance? I built seroost to find out.",
    solution:
      "seroost indexes local documents using TF-IDF (Term Frequency-Inverse Document Frequency), ranks them by relevance to a query, and serves results over HTTP. No search library \u2014 just the math and Rust. It tokenizes documents, builds an inverted index, computes TF-IDF scores, and returns ranked results.",
    technicalDetails: [
      "Languages: Rust 92.7%, JavaScript 5.6%, HTML 1.7% \u2014 full-stack project",
      "Rust Edition: 2024 | Dependencies: serde_json, tiny_http, xml-rs (only 3 external crates)",
      "Structure: src/main.rs (entry), src/model.rs (TF-IDF model), src/server.rs (HTTP server)",
      "Frontend: index.html + index.js \u2014 web UI for querying and displaying results",
      "Document parsing: Uses XML parsing (xml-rs) for document indexing",
      "TF-IDF implementation: tokenization, inverted index, term frequency, inverse document frequency scoring",
    ],
    challenges: [
      "Implementing efficient tokenization and stemming from scratch",
      "Building an inverted index that scales with document count",
      "Computing TF-IDF scores efficiently for large corpora",
      "Serving results with minimal latency over HTTP",
    ],
  },
  {
    slug: "musializer",
    title: "musializer",
    description: "Real-time audio spectrum visualizer using FFT in C",
    longDescription:
      "A real-time audio frequency spectrum visualizer that takes audio input, applies FFT through a custom header-only C library, and renders the frequency spectrum using raylib. ~670 lines of C, one external dependency, and a README that explains the theory behind audio processing and DSP.",
    tags: ["c", "fft", "audio", "dsp", "raylib"],
    github: "https://github.com/PPRAMANIK62/musializer",
    language: "C",
    tagline: "Real-time audio spectrum visualizer using FFT in C",
    problem:
      "What does sound look like? Audio is just waveforms \u2014 pressure over time. But our ears hear frequencies, not waveforms. The Fast Fourier Transform bridges that gap, decomposing audio into its frequency components. I wanted to see it happen in real time.",
    solution:
      "musializer takes audio input, applies FFT (implemented as a header-only C library), and renders the frequency spectrum in real time using raylib. The FFT library is written from scratch \u2014 no external DSP dependencies. The README explains the theory behind audio processing and DSP.",
    technicalDetails: [
      "Languages: C 99.1%, Shell 0.9% | ~670 lines of C code",
      "Dependencies: raylib (graphics + audio) \u2014 only external dependency",
      "Structure: src/musializer.c (main app), src/fft.h (header-only FFT/DFT library), build.sh",
      "FFT specs: 256 frequency bins, O(N log N) complexity",
      "Audio specs: 44,100 Hz sample rate, 32-bit sample size, stereo support",
      "Controls: Space = play/pause, ESC = exit | Custom FFT implementation (not FFTW)",
    ],
    challenges: [
      "Implementing FFT correctly \u2014 butterfly operations, bit-reversal permutation",
      "Achieving real-time performance in C without dropping frames",
      "Mapping frequency bins to meaningful visual representations",
      "Handling audio buffering and synchronization with the render loop",
    ],
  },
]
