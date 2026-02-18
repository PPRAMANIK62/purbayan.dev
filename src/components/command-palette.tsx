import { useEffect, useCallback } from "react"
import { useNavigate } from "react-router-dom"
import {
  Code,
  FileText,
  FolderOpen,
  Github,
  Home,
  Linkedin,
  Mail,
  SearchX,
  User,
  Wrench,
} from "lucide-react"
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command"
import { blogPosts } from "@/data/blog"
import { projects as projectsData } from "@/data/projects"
import { SOCIAL } from "@/data/social-links"

interface CommandPaletteProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const pages = [
  { label: "Home", icon: Home, path: "/" },
  { label: "Projects", icon: FolderOpen, path: "/projects" },
  { label: "Uses", icon: Wrench, path: "/uses" },
  { label: "About", icon: User, path: "/about" },
  { label: "Resume", icon: FileText, path: "/resume" },
] as const

const projects = projectsData.map((p) => ({
  label: p.title,
  path: `/projects/${p.slug}`,
}))

const links = [
  { label: SOCIAL.github.label, icon: Github, href: SOCIAL.github.url },
  { label: SOCIAL.linkedin.label, icon: Linkedin, href: SOCIAL.linkedin.url },
  { label: SOCIAL.email.label, icon: Mail, href: SOCIAL.email.url },
] as const

export function CommandPalette({ open, onOpenChange }: CommandPaletteProps) {
  const navigate = useNavigate()

  // Cmd+K / Ctrl+K keyboard shortcut
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

  const runCommand = useCallback(
    (command: () => void) => {
      onOpenChange(false)
      command()
    },
    [onOpenChange],
  )

  return (
    <CommandDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Command Palette"
      description="Search for pages, projects, and links"
      showCloseButton={false}
    >
      <CommandInput
        placeholder="Type a command or search..."
        className="font-mono"
      />
      <CommandList>
        <CommandEmpty className="py-12 font-mono">
          <div className="flex flex-col items-center gap-3">
            <SearchX className="size-6 text-muted-foreground/50" />
            <div className="flex flex-col items-center gap-1">
              <span className="text-muted-foreground">No matches found</span>
              <span className="text-xs text-muted-foreground/50">Try a different search term</span>
            </div>
          </div>
        </CommandEmpty>

        <CommandGroup heading="Pages">
          {pages.map((page) => (
            <CommandItem
              key={page.path}
              value={page.label}
              onSelect={() => runCommand(() => navigate(page.path))}
              className="font-mono"
            >
              <page.icon className="size-4" />
              <span>{page.label}</span>
            </CommandItem>
          ))}
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Projects">
          {projects.map((project) => (
            <CommandItem
              key={project.path}
              value={project.label}
              onSelect={() => runCommand(() => navigate(project.path))}
              className="font-mono"
            >
              <Code className="size-4" />
              <span>{project.label}</span>
            </CommandItem>
          ))}
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Blog">
          {blogPosts.map((post) => (
            <CommandItem
              key={post.slug}
              value={post.title}
              onSelect={() => runCommand(() => navigate(`/blog/${post.slug}`))}
              className="font-mono"
            >
              <FileText className="size-4" />
              <span>{post.title}</span>
            </CommandItem>
          ))}
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Links">
          {links.map((link) => (
            <CommandItem
              key={link.label}
              value={link.label}
              onSelect={() =>
                runCommand(() => window.open(link.href, "_blank"))
              }
              className="font-mono"
            >
              <link.icon className="size-4" />
              <span>{link.label}</span>
            </CommandItem>
          ))}
        </CommandGroup>


      </CommandList>
    </CommandDialog>
  )
}
