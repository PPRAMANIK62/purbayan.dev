import {
  Globe,
  Cpu,
  Terminal,
  Github,
  Linkedin,
  Mail,
  FileText,
} from "lucide-react"
import { SOCIAL } from "@/data/social-links"

export const skillAreas = [
  {
    icon: Globe,
    title: "Web Development",
    points: [
      "TypeScript, React, Next.js",
      "Building interactive UIs, component architecture",
      "shadcn/ui ecosystem contributions (fiddle-factory PRs)",
    ],
  },
  {
    icon: Cpu,
    title: "Systems Programming",
    points: [
      "Rust, C, Go",
      "TCP networking, audio processing, search algorithms",
      '"Understanding how things work under the hood"',
    ],
  },
  {
    icon: Terminal,
    title: "Linux & Tooling",
    points: [
      "Fedora + Hyprland (via wayforged)",
      "Shell scripting, dotfiles, TUI tools",
      "Tokyo Night everywhere, Iosevka everything",
    ],
  },
] as const

export const contactLinks = [
  {
    label: "GitHub",
    href: SOCIAL.github.url,
    display: SOCIAL.github.display,
    icon: Github,
    external: true,
  },
  {
    label: "LinkedIn",
    href: SOCIAL.linkedin.url,
    display: SOCIAL.linkedin.display,
    icon: Linkedin,
    external: true,
  },
  {
    label: "Email",
    href: SOCIAL.email.url,
    display: SOCIAL.email.display,
    icon: Mail,
    external: false,
  },
  {
    label: "Resume",
    href: "/resume",
    display: "view resume",
    icon: FileText,
    external: false,
  },
] as const

export const beyondCode = [
  "Making my desktop look exactly right (and then changing it again)",
  "Minimalist setups \u2014 fewer things, better things",
  "Reading about how systems are designed (not just software)",
  "Zed over VS Code \u2014 why run two browsers on one machine?",
] as const
