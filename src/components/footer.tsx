import { Github, Linkedin, Mail, FileText } from "lucide-react"

const socialLinks = [
  {
    label: "GitHub",
    href: "https://github.com/PPRAMANIK62",
    icon: Github,
    external: true,
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/purbayan-pramanik-30586124b/",
    icon: Linkedin,
    external: true,
  },
  {
    label: "Email",
    href: "mailto:purbayan.dev@gmail.com",
    icon: Mail,
    external: false,
  },
  {
    label: "Resume",
    href: "#",
    icon: FileText,
    external: true,
  },
] as const

export function Footer() {
  return (
    <footer className="border-t border-border/50 font-mono">
      <div className="max-w-3xl mx-auto py-16 px-6">
        <p className="font-bold text-lg text-foreground">
          Purbayan Pramanik
        </p>

        <nav className="mt-6 flex items-center gap-6">
          {socialLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors duration-150"
              {...(link.external && {
                target: "_blank",
                rel: "noopener noreferrer",
              })}
            >
              <link.icon className="size-4" />
              <span>{link.label}</span>
            </a>
          ))}
        </nav>

        <div className="mt-10 text-sm text-muted-foreground leading-relaxed">
          <p>Built with React, shadcn/ui, and too much coffee.</p>
          <p className="mt-1">
            Source on{" "}
            <a
              href="https://github.com/PPRAMANIK62/portfolio"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary transition-colors duration-150 underline underline-offset-4 decoration-border"
            >
              GitHub
            </a>
            .
          </p>
          <p className="mt-1 text-muted-foreground/30 hover:text-muted-foreground/60 transition-colors duration-300 text-xs select-none">
            // there's more to this site than meets the eye
          </p>
        </div>
      </div>
    </footer>
  )
}
