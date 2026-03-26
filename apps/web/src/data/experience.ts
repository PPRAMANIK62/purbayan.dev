import type { LucideIcon } from "lucide-react"
import { Briefcase, GraduationCap } from "lucide-react"

export interface Experience {
  company: string
  role: string
  period: string
  type: "Contract" | "Internship"
  description: string
  highlights: string[]
  technologies: string[]
  url?: string
  icon: LucideIcon
}

export const experiences = [
  {
    company: "fiddle-factory",
    role: "Full Stack Developer",
    period: "Dec 2025 — Present",
    type: "Contract",
    url: "https://fiddle.is",
    description:
      "Building core product features across the full stack — from canvas rendering and real-time chat to authentication and CI/CD infrastructure.",
    highlights: [
      "Worked on the canvas rendering system — added theme/mode switching, auto-pan, visual component grid, and element inspector; helped fix canvas loading bugs for new users",
      "Added chat features including slash command menu, clear chat, Claude health checks, and helped improve message send performance and clipboard handling",
      "Helped set up Storybook across 4 repos (fiddle, shadcn-ui, eleven-labs-ui, design-engineer) — wrote stories for UI primitives and added MutationObserver-based content readiness detection",
      "Worked on build pipeline — integrated Storycap-based screenshot system, post-commit build triggers, and ripgrep-powered search",
      "Helped add access control with allowlist, user types, template restrictions, and PKCE auth flow for the dashboard",
      "Fixed 15+ bugs and DX issues — toast migration (react-toastify to sonner), eslint react-hooks cleanup, double-submission prevention, and loading state improvements",
    ],
    technologies: ["TypeScript", "React", "Next.js", "Storybook", "ESLint", "Storycap"],
    icon: Briefcase,
  },
  {
    company: "fiddle-factory",
    role: "Full Stack Developer",
    period: "May — Aug 2025",
    type: "Internship",
    url: "https://fiddle.is",
    description:
      "Worked on major platform migrations and built an AI-powered feature from scratch.",
    highlights: [
      "Migrated the canvas system from react-flow to tldraw — removed previous node implementation and added custom shapes, tools, preview components, and data conversion utilities",
      "Migrated the cloud sandbox from StackBlitz WebContainers to e2b — set up custom templates, API config, sandbox session management, and documented the environment",
      "Worked on the Figma-to-code plugin — helped set up the codegen pipeline, multi-frame export, and tweakpane UI integration",
      "Helped build the user onboarding flow with interactive checklist, task tooltips, and progress tracking",
      "Contributed to the 'make real' feature — added API route, response shapes, and integrated canvas drawings as chat attachments",
    ],
    technologies: ["TypeScript", "React", "tldraw", "e2b", "Figma API"],
    icon: GraduationCap,
  },
] as const
