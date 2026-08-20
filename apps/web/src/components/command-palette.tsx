import { useCallback, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import {
  ArrowUpRight,
  Briefcase,
  Check,
  Copy,
  FileDown,
  FileText,
  FolderOpen,
  Github,
  Home,
  Layers,
  Linkedin,
  Mail,
  PenLine,
  ScanSearch,
  SearchX,
  Terminal,
  Wrench,
} from "lucide-react"
import {
  CommandDialog,
  CommandEmpty,
  CommandFooter,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandKey,
  CommandList,
  CommandMeta,
} from "@/components/ui/command"
import { blogPosts } from "@/data/blog"
import { projects } from "@/data/projects"
import { SOCIAL } from "@/data/social-links"
import { toggleInspector } from "@/lib/inspector"
import { XIcon } from "@/components/x-icon"

interface CommandPaletteProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

/**
 * Keywords exist so search matches how people actually think — "cv" finds the
 * résumé, "rust" finds the systems projects.
 */
const pages = [
  { label: "Home", icon: Home, path: "/", keywords: ["start", "index", "top"] },
  {
    label: "Work",
    icon: Briefcase,
    path: "/#work",
    keywords: ["experience", "jobs", "roles", "career", "samurai", "fiddle"],
  },
  {
    label: "Projects",
    icon: FolderOpen,
    path: "/#projects",
    keywords: ["builds", "portfolio", "case study"],
  },
  {
    label: "Writing",
    icon: PenLine,
    path: "/blog",
    keywords: ["blog", "posts", "articles", "notes", "essays"],
  },
  {
    label: "Uses",
    icon: Wrench,
    path: "/uses",
    keywords: ["setup", "tools", "gear", "hardware", "software", "dotfiles"],
  },
  {
    label: "Résumé",
    icon: FileDown,
    path: "/resume",
    keywords: ["resume", "cv", "pdf", "download", "hire"],
  },
] as const

const links = [
  { label: "GitHub", icon: Github, href: SOCIAL.github.url, keywords: ["code", "source", "repos"] },
  {
    label: "LinkedIn",
    icon: Linkedin,
    href: SOCIAL.linkedin.url,
    keywords: ["profile", "network"],
  },
  {
    label: "X",
    icon: XIcon,
    href: SOCIAL.x.url,
    keywords: ["twitter", "posts", "social"],
  },
  { label: "Email", icon: Mail, href: SOCIAL.email.url, keywords: ["contact", "mail", "reach"] },
] as const

export function CommandPalette({ open, onOpenChange }: CommandPaletteProps) {
  const navigate = useNavigate()
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        onOpenChange(!open)
      }
    }
    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [open, onOpenChange])

  // Reset the copy confirmation whenever the palette reopens.
  useEffect(() => {
    if (!open) setCopied(false)
  }, [open])

  const run = useCallback(
    (action: () => void) => {
      onOpenChange(false)
      action()
    },
    [onOpenChange],
  )

  const copyEmail = useCallback(() => {
    navigator.clipboard
      ?.writeText(SOCIAL.email.display)
      .then(() => setCopied(true))
      .catch(() => setCopied(false))
  }, [])

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput placeholder="Search or jump to…" />

      <CommandList>
        <CommandEmpty>
          <div className="flex flex-col items-center gap-3">
            <SearchX className="size-5 text-faint" />
            <div className="flex flex-col items-center gap-1">
              <span className="text-dim">Nothing matches that</span>
              <span className="text-xs text-faint">Try a project name, a tag, or “resume”</span>
            </div>
          </div>
        </CommandEmpty>

        <CommandGroup heading="Go to">
          {pages.map((page) => (
            <CommandItem
              key={page.path}
              value={page.label}
              keywords={[...page.keywords]}
              onSelect={() => run(() => navigate(page.path))}
            >
              <page.icon />
              <span>{page.label}</span>
            </CommandItem>
          ))}
        </CommandGroup>

        <CommandGroup heading="Projects">
          {projects.map((project) => (
            <CommandItem
              key={project.slug}
              value={project.title}
              keywords={[...project.tags, project.language, project.description]}
              onSelect={() => run(() => navigate(`/projects/${project.slug}`))}
            >
              {project.kind === "product" ? <Layers /> : <Terminal />}
              <span>{project.title}</span>
              <CommandMeta>{project.language}</CommandMeta>
            </CommandItem>
          ))}
        </CommandGroup>

        <CommandGroup heading="Writing">
          {blogPosts.map((post) => (
            <CommandItem
              key={post.slug}
              value={post.title}
              keywords={[...post.tags, post.summary]}
              onSelect={() => run(() => navigate(`/blog/${post.slug}`))}
            >
              <FileText />
              <span className="truncate">{post.title}</span>
              <CommandMeta>{post.readingTime}</CommandMeta>
            </CommandItem>
          ))}
        </CommandGroup>

        <CommandGroup heading="Actions">
          <CommandItem
            value="Inspect elements"
            keywords={["inspector", "debug", "devtools", "layout", "boxes"]}
            onSelect={() => run(toggleInspector)}
          >
            <ScanSearch />
            <span>Inspect elements</span>
            <CommandMeta>
              <CommandKey>I</CommandKey>
            </CommandMeta>
          </CommandItem>

          <CommandItem
            value="Copy email address"
            keywords={["contact", "mail", "address", "clipboard"]}
            onSelect={copyEmail}
          >
            {copied ? <Check /> : <Copy />}
            <span>{copied ? "Copied to clipboard" : "Copy email address"}</span>
            <CommandMeta>{SOCIAL.email.display}</CommandMeta>
          </CommandItem>
        </CommandGroup>

        <CommandGroup heading="Elsewhere">
          {links.map((link) => (
            <CommandItem
              key={link.label}
              value={link.label}
              keywords={[...link.keywords]}
              onSelect={() => run(() => window.open(link.href, "_blank", "noopener,noreferrer"))}
            >
              <link.icon />
              <span>{link.label}</span>
              <CommandMeta>
                <ArrowUpRight className="size-3" />
              </CommandMeta>
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>

      <CommandFooter>
        <span className="flex items-center gap-1.5">
          <CommandKey>↑</CommandKey>
          <CommandKey>↓</CommandKey>
          navigate
        </span>
        <span className="flex items-center gap-1.5">
          <CommandKey>↵</CommandKey>
          open
        </span>
        <span className="flex items-center gap-1.5">
          <CommandKey className="px-1.5">esc</CommandKey>
          close
        </span>
      </CommandFooter>
    </CommandDialog>
  )
}
