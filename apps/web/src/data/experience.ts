export interface Experience {
  company: string
  role: string
  period: string
  type: "Full-time" | "Contract" | "Internship" | "Open source"
  description: string
  highlights: string[]
  technologies: string[]
  url?: string
}

export const experiences: readonly Experience[] = [
  {
    company: "StashBase",
    role: "Open Source Contributor",
    period: "Jul 2026 — Present",
    type: "Open source",
    url: "https://stashbase.ai",
    description:
      "A local-first Electron knowledge base that turns your files into searchable context for AI agents. My work sits in the Markdown editor, the agent panel, and the app shell around them.",
    highlights: [
      "Built the live Markdown editor on Milkdown Crepe: editing and preview in the same surface, with source semantics preserved through links, code fences, lists, blockquotes, clipboard, and Find",
      "Hardened Markdown rendering with sanitized HTML, package-native footnotes and heading anchors, alert blocks, and hidden frontmatter",
      "Wrote the Shared Agent Contract and the Claude and Codex adapters behind it, plus the parity tests that keep the two backends honest",
      "Added Quick Open, a command palette, editor history, theme and reading presets, and image paste into agent chats",
      "Gave the renderer a layer model the build enforces, and split library operations so MCP transports share one path",
      "Set up the Playwright E2E suite that guards UI regressions, and stabilized the cross-platform CI gates behind it",
    ],
    technologies: ["TypeScript", "React", "Electron", "Milkdown", "MCP", "Playwright"],
  },
  {
    company: "SamurAI Studios",
    role: "Software Engineer",
    period: "Apr 2026 — Jul 2026",
    type: "Full-time",
    url: "https://samur-ai.in",
    description:
      "Full-stack work on tooling for AI-assisted film and advertising. A creative brief goes in as a deck; storyboards, generated media, and the console the production team runs come out.",
    highlights: [
      "Built the creative-brief pipeline that reads a presentation deck and returns a structured story: media extraction, visual captioning, and a typed schema the rest of the product depends on. Golden evaluations catch the regressions, and an authenticated console lets the team run it by hand",
      "Built multi-scene storyboard workspaces end to end: REST APIs, persistence, version history, separated frontend routes, and regression tests, kept backward compatible with storyboards saved by the old schema",
      "Wired image and video generation across several model providers. Continuity prompts carry style between shots, runs and usage are logged, and workspace state syncs live between collaborators",
      "Moved the product UI onto a shared component system and Tailwind CSS v4 design tokens. Media galleries got responsive layouts, real loading states, and optimistic updates",
      "Made media delivery cheaper: WebP previews, role-based image URLs, and rendering that knows when the preview is all it needs. Tightened authentication on the generation providers while I was in there",
    ],
    technologies: [
      "TypeScript",
      "React",
      "Node.js",
      "PostgreSQL",
      "OpenAI",
      "Playwright",
      "Vitest",
      "GitHub Actions",
    ],
  },
  {
    company: "fiddle-factory",
    role: "Software Engineer",
    period: "Dec 2025 — Apr 2026",
    type: "Contract",
    url: "https://fiddle.is",
    description:
      "Core product work across the stack of an AI component design tool: canvas rendering, real-time chat, authentication, and the CI/CD around them.",
    highlights: [
      "Worked on the canvas rendering system: theme and mode switching, auto-pan, a visual component grid, and an element inspector",
      "Fixed a canvas hydration race that broke the first load for new users",
      "Added chat features including a slash command menu, clear chat, and Claude health checks, and made message updates non-blocking",
      "Integrated Storybook across 4 repos (fiddle, shadcn-ui, eleven-labs-ui, design-engineer), wrote stories for the UI primitives, and added MutationObserver-based content readiness detection",
      "Worked on the build pipeline: a Storycap screenshot system, post-commit build triggers, and ripgrep-powered search",
      "Added access control with an allowlist, user types, template restrictions, and a PKCE auth flow for the dashboard",
      "Cleared a long tail of bugs and DX issues: the react-toastify to sonner migration, an eslint react-hooks cleanup, double-submission guards, and loading states",
    ],
    technologies: ["TypeScript", "React", "Next.js", "Storybook", "ESLint", "Storycap"],
  },
  {
    company: "fiddle-factory",
    role: "Software Engineer",
    period: "May — Aug 2025",
    type: "Internship",
    url: "https://fiddle.is",
    description: "Two platform migrations, plus the 'make real' feature built from scratch.",
    highlights: [
      "Migrated the canvas system from react-flow to tldraw across 84 files: tore out the old node implementation and added custom shapes, tools, preview components, and data conversion utilities",
      "Migrated the cloud sandbox from StackBlitz WebContainers to e2b, including custom templates, API config, session management, and docs for the environment",
      "Built the 'make real' flow that turns a canvas drawing into a generated component: API route, response shapes, and drawings wired in as chat attachments",
      "Worked on the Figma-to-code plugin: codegen pipeline, multi-frame export, and tweakpane UI integration",
      "Helped build the user onboarding flow with an interactive checklist, task tooltips, and progress tracking",
    ],
    technologies: ["TypeScript", "React", "tldraw", "e2b", "Figma API"],
  },
]
