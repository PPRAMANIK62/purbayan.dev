# New Project Ideas — What to Build to Fill the Gaps

## ⏳ The Problem

Your GitHub has strong projects, but there are narrative gaps. The portfolio
tells the story of a full-stack + systems developer, but some categories
are weak or missing. These project ideas fill those gaps while being
genuinely interesting to build.

**Priority: Build ONE of these well, rather than three of them poorly.**

---

## 🔮 Idea 1: `dotbrowser` — A Terminal-Rendered Dotfile Viewer ★★★★★

**Category gap filled:** Developer tooling + Open source potential

**What it is:**
A web app where you paste a GitHub username and it renders their dotfiles
beautifully — syntax highlighted, grouped by category (shell, editor, WM),
with a visual "setup score" or "ricing grade."

**Why build it:**

- Directly related to your interests (dotfiles, Linux, ricing)
- Could get stars — the Linux community loves this stuff
- Demonstrates GitHub API, syntax highlighting, and design skills
- Perfect project to showcase ON the portfolio (meta-recursive)

**Tech:** Next.js, TypeScript, shadcn/ui, Shiki, GitHub API

**Effort:** 2-3 weeks

---

## 🔮 Idea 2: `typecheck` — A TypeScript Playground with Constraint Puzzles ★★★★☆

**Category gap filled:** TypeScript expertise showcase + Educational content

**What it is:**
An interactive playground where developers solve TypeScript type puzzles.
Given a set of test cases and a type signature, write the correct type.
Like type-challenges but with a beautiful UI, hints, and a progression
system.

**Why build it:**

- You say you love TypeScript. This PROVES it at a deep level.
- Educational tools get shared widely (good for stars/visibility)
- Demonstrates advanced TS knowledge (generics, conditional types, mapped types)
- Interactive web app shows frontend skill

**Tech:** Next.js, TypeScript, Monaco Editor, shadcn/ui

**Effort:** 3-4 weeks

---

## 🔮 Idea 3: `patchwork` — A TUI Git Diff Viewer in Rust ★★★★☆

**Category gap filled:** Rust CLI tool that people might actually use

**What it is:**
A terminal application (TUI, using ratatui) that shows git diffs
beautifully — side-by-side, syntax highlighted, with keyboard navigation.
Like `delta` but more visual, maybe with inline comments.

**Why build it:**

- Rust TUI app — extends your 4at and seroost narrative
- Developer tools get stars if they solve a real pain point
- Demonstrates Rust, TUI development, and git internals
- You already know charmbracelet/gum from wayforged

**Tech:** Rust, ratatui, tree-sitter (for syntax highlighting), git2-rs

**Effort:** 4-6 weeks

---

## 🔮 Idea 4: `bento` — A Personal Dashboard / New Tab Page ★★★☆☆

**Category gap filled:** Design-forward web app + Daily utility

**What it is:**
A customizable browser new-tab page with widgets: GitHub activity,
weather, bookmarks, quick links, Spotify now-playing, system status.
Tokyo Night themed. Exports/imports config as JSON.

**Why build it:**

- Visual, design-heavy project that showcases UI skills
- Daily-use tool (you'd actually use it)
- Widget architecture demonstrates component composition
- Can integrate with APIs you already know (Spotify, GitHub)

**Tech:** Next.js or plain React, TypeScript, shadcn/ui, browser extension API

**Effort:** 2-3 weeks

---

## 🔮 Idea 5: `shellshare` — Share Terminal Sessions via Web ★★★★★

**Category gap filled:** Full-stack + Real-time + Systems (the trifecta)

**What it is:**
Record your terminal session (like asciinema) and share it via a URL.
Others can watch the replay in the browser with full formatting. Maybe
even live-stream terminal sessions.

**Why build it:**

- Combines your web + systems duality perfectly
- Terminal recording is niche but useful (conference talks, tutorials)
- Real-time streaming shows WebSocket/infrastructure skills
- Could actually get traction as an indie tool

**Tech:**

- Backend: Rust (recording daemon) or Go
- Frontend: Next.js, xterm.js, WebSocket
- Storage: S3/R2 for recordings

**Effort:** 4-6 weeks

---

## 🔮 Idea 6: `keybind` — Interactive Keyboard Shortcut Trainer ★★★☆☆

**Category gap filled:** Fun/creative web project

**What it is:**
An interactive web app that teaches keyboard shortcuts for different
tools (Vim, VS Code, Hyprland, tmux). Users see a prompt, press the
correct keys, and get scored. Leaderboard optional.

**Why build it:**

- Fun, shareable, and viral potential
- Related to your CLI/keyboard-driven workflow aesthetic
- Quick to build and polish
- Good for blog content ("I built a keyboard shortcut trainer")

**Tech:** Next.js, TypeScript, shadcn/ui, Motion

**Effort:** 1-2 weeks

---

## ✅ My Recommendation

**Build ONE of these before launching the portfolio:**

### If you want stars and visibility → Idea 1 (`dotbrowser`)

It's the most shareable, most related to your identity, and most
likely to resonate with the Linux/ricing community.

### If you want to flex TypeScript depth → Idea 2 (`typecheck`)

Proves you understand TypeScript at a level beyond "I use it for React."

### If you want the most impressive single project → Idea 5 (`shellshare`)

Full-stack + systems + real-time. This would be a Tier 1 hero project
immediately. But it's also the most work.

### If you want something fast → Idea 6 (`keybind`)

Build it in a weekend. Ship it. Write a blog post. Move on.

---

## ✅ What NOT to Build

| Avoid                | Why                                         |
| -------------------- | ------------------------------------------- |
| Another todo app     | Please.                                     |
| Another chat app     | You already have 4at.                       |
| Another dashboard    | You already have ad-my-brand-insights.      |
| A social media clone | Twitter/Instagram clones say nothing new.   |
| An AI wrapper        | "I called the OpenAI API" is not a project. |
| A portfolio template | The portfolio itself is the project.        |

---

## ⏳ Before Building Anything New

**Fix your existing projects first.** The ROI on adding a README,
deploying to Vercel, and recording a demo GIF is much higher than
starting a new project. Specifically:

1. Deploy ad-my-brand-insights to Vercel (30 min)
2. Record a GIF of wayforged's TUI in action (20 min)
3. Record a demo video of musializer (10 min)
4. Add screenshots to snippetbox README (15 min)

These four tasks will improve your portfolio more than a new project.
