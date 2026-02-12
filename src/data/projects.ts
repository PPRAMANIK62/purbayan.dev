export interface Project {
  slug: string
  title: string
  description: string
  tags: string[]
}

export const projects: Project[] = [
  {
    slug: "wayforged",
    title: "wayforged",
    description: "TUI installer for a complete Fedora Hyprland dev environment",
    tags: ["shell", "tui", "hyprland", "linux"],
  },
  {
    slug: "canvas-kit",
    title: "Canvas Kit",
    description: "Lightweight drawing app with layers, tools, and export",
    tags: ["next.js", "react", "typescript", "canvas"],
  },
  {
    slug: "4at",
    title: "4at",
    description: "Multi-user TCP chat server in Rust with rate limiting",
    tags: ["rust", "tcp", "concurrency"],
  },
  {
    slug: "seroost",
    title: "seroost",
    description: "Local search engine using TF-IDF algorithm in Rust",
    tags: ["rust", "search", "algorithms"],
  },
  {
    slug: "musializer",
    title: "musializer",
    description: "Real-time audio spectrum visualizer using FFT in C",
    tags: ["c", "fft", "audio", "raylib"],
  },
]
