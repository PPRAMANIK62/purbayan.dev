import { Link } from "react-router-dom"
import { FadeUp } from "@/components/fade-up"
import { UsesItem } from "@/components/uses-item"
import { PageHeading, SectionHeading } from "@/components/section-heading"
import { PageContainer } from "@/components/page-container"
import { usePageMeta } from "@/hooks/use-page-meta"

export default function UsesPage() {
  usePageMeta({
    title: "Uses",
    description: "Tools, hardware, and software Purbayan uses daily.",
  })

  return (
    <PageContainer className="space-y-16">
      {/* Page Heading */}
      <FadeUp>
        <PageHeading title="uses" />
        <p className="mt-4 font-mono text-base md:text-lg text-secondary-foreground leading-relaxed">
          Tools, hardware, and software I use daily.
        </p>
      </FadeUp>

      {/* Hardware */}
      <FadeUp delay={0.1}>
        <section>
          <SectionHeading title="hardware" />
          <div className="mt-6">
            <UsesItem
              category="laptop"
              tool="Acer Swift Go 14"
              note="daily driver, portable enough for everything"
            />
          </div>
        </section>
      </FadeUp>

      {/* Desktop Environment */}
      <FadeUp delay={0.15}>
        <section>
          <SectionHeading title="desktop" />
          <div className="mt-6 space-y-0.5">
            <UsesItem
              category="os"
              tool={
                <>
                  Fedora + Hyprland{" "}
                  <Link to="/projects/wayforged" className="text-primary hover:underline">
                    via wayforged
                  </Link>
                </>
              }
            />
            <UsesItem category="bar" tool="Waybar" />
            <UsesItem category="launcher" tool="Rofi" />
            <UsesItem category="notifications" tool="SwayNC" />
            <UsesItem category="wallpaper" tool="Hyprpaper" />
            <UsesItem category="lock" tool="Hyprlock" />
            <UsesItem category="theme" tool="Tokyo Night" note="everywhere" />
          </div>
        </section>
      </FadeUp>

      {/* Terminal & Shell */}
      <FadeUp delay={0.2}>
        <section>
          <SectionHeading title="terminal" />
          <div className="mt-6 space-y-0.5">
            <UsesItem category="terminal" tool="Ghostty" />
            <UsesItem category="shell" tool="Zsh + Oh My Zsh + plugins" />
            <UsesItem category="font" tool="Iosevka Mono" note="the only usable font" />
            <UsesItem category="multiplexer" tool="tmux" />
          </div>
        </section>
      </FadeUp>

      {/* Editors */}
      <FadeUp delay={0.25}>
        <section>
          <SectionHeading title="editors" />
          <div className="mt-6 space-y-0.5">
            <UsesItem category="primary" tool="Zed" />
            <UsesItem category="trying" tool="Neovim (someday)" />
          </div>
        </section>
      </FadeUp>

      {/* Browsers */}
      <FadeUp delay={0.3}>
        <section>
          <SectionHeading title="browsers" />
          <div className="mt-6 space-y-0.5">
            <UsesItem
              category="everything"
              tool="Zen Browser"
              note="the browser Firefox should have been"
            />
            <UsesItem category="dev" tool="Helium" note="chromium without the Google" />
          </div>
        </section>
      </FadeUp>

      {/* Apps */}
      <FadeUp delay={0.35}>
        <section>
          <SectionHeading title="apps" />
          <div className="mt-6 space-y-0.5">
            <UsesItem category="recording" tool="OBS Studio" note="streams and screen recordings" />
            <UsesItem category="notes" tool="Obsidian" note="second brain, markdown everything" />
          </div>
        </section>
      </FadeUp>

      {/* Dev Tools */}
      <FadeUp delay={0.4}>
        <section>
          <SectionHeading title="dev tools" />
          <div className="mt-6 space-y-0.5">
            <UsesItem category="runtime" tool="Bun, Node.js, pnpm" />
            <UsesItem category="languages" tool="TypeScript, Rust, Go, C" />
            <UsesItem category="frameworks" tool="Next.js, React" />
          </div>
        </section>
      </FadeUp>

      {/* CLI Tools */}
      <FadeUp delay={0.45}>
        <section>
          <SectionHeading title="cli" />
          <div className="mt-6 space-y-0.5">
            <UsesItem category="ls" tool="eza" note="ls but pretty" />
            <UsesItem category="cat" tool="bat" note="cat with wings" />
            <UsesItem category="search" tool="fzf" note="fuzzy find everything" />
            <UsesItem category="files" tool="yazi" note="terminal file manager" />
            <UsesItem category="cd" tool="zoxide" note="smarter cd" />
            <UsesItem category="fetch" tool="fastfetch" note="system info, fast" />
          </div>
        </section>
      </FadeUp>

      {/* Dotfiles */}
      <FadeUp delay={0.5}>
        <section>
          <SectionHeading title="dotfiles" />
          <p className="mt-6 font-mono text-base md:text-lg text-secondary-foreground leading-relaxed">
            All my configs live in{" "}
            <Link to="/projects/wayforged" className="text-primary hover:underline">
              wayforged
            </Link>{" "}
            — 22 config files, 14 installation phases, all Tokyo Night themed.
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-4">
            <Link
              to="/projects/wayforged"
              className="inline-flex items-center gap-2 font-mono text-primary hover:underline"
            >
              <span>&rarr;</span>
              <span>view wayforged</span>
            </Link>
            <a
              href="https://github.com/PPRAMANIK62/wayforged"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 font-mono text-muted-foreground hover:text-foreground transition-colors duration-150"
            >
              <span>&rarr;</span>
              <span>github repo</span>
            </a>
          </div>
        </section>
      </FadeUp>
    </PageContainer>
  )
}
