import { useEffect, useCallback } from "react"
import { useNavigate } from "react-router-dom"
import {
  Code,
  FolderOpen,
  Github,
  Home,
  Linkedin,
  Mail,
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

interface CommandPaletteProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const pages = [
  { label: "Home", icon: Home, path: "/" },
  { label: "Projects", icon: FolderOpen, path: "/projects" },
  { label: "Uses", icon: Wrench, path: "/uses" },
  { label: "About", icon: User, path: "/about" },
] as const

const projects = [
  { label: "wayforged", path: "/projects/wayforged" },
  { label: "canvas-kit", path: "/projects/canvas-kit" },
  { label: "4at", path: "/projects/4at" },
  { label: "seroost", path: "/projects/seroost" },
  { label: "musializer", path: "/projects/musializer" },
] as const

const links = [
  {
    label: "GitHub",
    icon: Github,
    href: "https://github.com/PPRAMANIK62",
  },
  {
    label: "LinkedIn",
    icon: Linkedin,
    href: "https://www.linkedin.com/in/purbayan-pramanik-30586124b/",
  },
  {
    label: "Email",
    icon: Mail,
    href: "mailto:purbayan.dev@gmail.com",
  },
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
        <CommandEmpty className="font-mono text-muted-foreground">
          No results found.
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
