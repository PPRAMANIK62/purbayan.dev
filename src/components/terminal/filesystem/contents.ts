import type { FSNode } from "./index"

const M = "Feb 13 2026"

const dir = (
  name: string,
  children: FSNode[],
  opts?: { hidden?: boolean; permissions?: string },
): FSNode => ({
  name,
  type: "directory",
  permissions: opts?.permissions ?? "drwxr-xr-x",
  size: 4096,
  modified: M,
  hidden: opts?.hidden ?? name.startsWith("."),
  children,
})

const file = (
  name: string,
  content: string,
  opts?: { hidden?: boolean; executable?: boolean; permissions?: string; link?: string },
): FSNode => ({
  name,
  type: "file",
  permissions: opts?.permissions ?? (opts?.executable ? "-rwxr-xr-x" : "-rw-r--r--"),
  size: new TextEncoder().encode(content).length,
  modified: M,
  hidden: opts?.hidden ?? name.startsWith("."),
  content,
  executable: opts?.executable,
  link: opts?.link,
})

// ---------------------------------------------------------------------------
// /home/purbayan dotfiles
// ---------------------------------------------------------------------------

const BASHRC = `#!/bin/bash
# ~/.bashrc — interactive shell configuration

# If not running interactively, don't do anything
[[ $- != *i* ]] && return

# History
HISTSIZE=10000
HISTFILESIZE=20000
HISTCONTROL=ignoreboth:erasedups
shopt -s histappend

# Prompt (overridden by starship, but kept as fallback)
PS1='\\[\\033[01;34m\\]\\w\\[\\033[00m\\] \\$ '

# Environment
export EDITOR="zed --wait"
export VISUAL="zed"
export BROWSER="firefox"
export PATH="$HOME/.cargo/bin:$HOME/.local/bin:$HOME/go/bin:$PATH"

# Aliases
alias ls='eza --icons --group-directories-first'
alias ll='eza -la --icons --group-directories-first'
alias lt='eza --tree --icons --level=2'
alias cat='bat --theme=tokyonight_night'
alias grep='rg'
alias cd='z'
alias vim='nvim'
alias g='git'
alias gc='git commit'
alias gp='git push'
alias gs='git status'
alias gd='git diff'
alias gl='git log --oneline --graph'
alias cls='clear'
alias ..='cd ..'
alias ...='cd ../..'

# Starship prompt
eval "$(starship init bash)"

# Zoxide
eval "$(zoxide init bash)"

# fnm (fast node manager)
eval "$(fnm env --use-on-cd)"

# That's all, folks.
# ...or is it?
#
# PURBAYAN{y0u_r3ad_th3_d0tf1l3s}
`

const PROFILE = `# ~/.profile — login shell configuration
# Sourced by login shells (not by .bashrc)

# Default programs
export EDITOR="zed --wait"
export TERMINAL="ghostty"
export BROWSER="firefox"

# XDG directories
export XDG_CONFIG_HOME="$HOME/.config"
export XDG_DATA_HOME="$HOME/.local/share"
export XDG_STATE_HOME="$HOME/.local/state"
export XDG_CACHE_HOME="$HOME/.cache"

# Wayland
export MOZ_ENABLE_WAYLAND=1
export QT_QPA_PLATFORM=wayland
export GDK_BACKEND=wayland,x11

# Source .bashrc if it exists
[ -f "$HOME/.bashrc" ] && . "$HOME/.bashrc"
`

const GITCONFIG = `[user]
    name = Purbayan Pramanik
    email = purbayan.dev@gmail.com

[init]
    defaultBranch = main

[core]
    editor = zed --wait
    pager = delta

[interactive]
    diffFilter = delta --color-only

[delta]
    navigate = true
    side-by-side = true
    line-numbers = true
    syntax-theme = tokyonight_night

[merge]
    conflictstyle = diff3

[diff]
    colorMoved = default

[alias]
    s = status
    co = checkout
    br = branch
    ci = commit
    lg = log --oneline --graph --all
    last = log -1 HEAD
    unstage = reset HEAD --
`

// ---------------------------------------------------------------------------
// .config files
// ---------------------------------------------------------------------------

const HYPRLAND_CONF = `# Hyprland configuration — ~/.config/hypr/hyprland.conf

monitor = , preferred, auto, 1

input {
    kb_layout = us
    follow_mouse = 1
    sensitivity = 0
    touchpad {
        natural_scroll = true
    }
}

general {
    gaps_in = 4
    gaps_out = 8
    border_size = 2
    col.active_border = rgb(7aa2f7) rgb(bb9af7) 45deg
    col.inactive_border = rgb(414868)
    layout = dwindle
}

decoration {
    rounding = 8
    blur {
        enabled = true
        size = 6
        passes = 3
        new_optimizations = true
    }
    shadow {
        enabled = true
        range = 12
        render_power = 3
        color = rgba(0, 0, 0, 0.44)
    }
}

animations {
    enabled = true
    bezier = overshot, 0.05, 0.9, 0.1, 1.05
    animation = windows, 1, 6, overshot, slide
    animation = fade, 1, 4, default
    animation = workspaces, 1, 6, overshot, slidevert
}

dwindle {
    pseudotile = true
    preserve_split = true
}

# Keybinds
$mod = SUPER
bind = $mod, Return, exec, ghostty
bind = $mod, Q, killactive
bind = $mod, D, exec, rofi -show drun
bind = $mod, E, exec, thunar
bind = $mod, V, togglefloating
bind = $mod, F, fullscreen
bind = $mod, P, pseudo
bind = $mod, J, togglesplit
bind = $mod, L, exec, hyprlock

# Workspace navigation
bind = $mod, 1, workspace, 1
bind = $mod, 2, workspace, 2
bind = $mod, 3, workspace, 3
bind = $mod, 4, workspace, 4
bind = $mod, 5, workspace, 5

# Window rules
windowrulev2 = float, class:^(pavucontrol)$
windowrulev2 = float, class:^(blueman-manager)$
windowrulev2 = opacity 0.92, class:^(ghostty)$
`

const WAYBAR_CONFIG = `{
    "layer": "top",
    "position": "top",
    "height": 36,
    "modules-left": ["hyprland/workspaces", "hyprland/window"],
    "modules-center": ["clock"],
    "modules-right": ["pulseaudio", "network", "battery", "tray"],

    "hyprland/workspaces": {
        "format": "{icon}",
        "on-click": "activate",
        "format-icons": {
            "1": "一",
            "2": "二",
            "3": "三",
            "4": "四",
            "5": "五"
        }
    },

    "clock": {
        "format": "{:%a %b %d  %H:%M}",
        "tooltip-format": "{:%Y-%m-%d | %H:%M:%S}"
    },

    "battery": {
        "format": "{icon} {capacity}%",
        "format-icons": ["", "", "", "", ""]
    },

    "network": {
        "format-wifi": " {signalStrength}%",
        "format-ethernet": " wired",
        "format-disconnected": "睊 offline"
    },

    "pulseaudio": {
        "format": "{icon} {volume}%",
        "format-muted": " muted",
        "format-icons": { "default": ["", "", ""] }
    }
}
`

const GHOSTTY_CONFIG = `# Ghostty terminal configuration

font-family = Iosevka
font-size = 13
font-thicken = true

theme = tokyonight

cursor-style = block
cursor-style-blink = true
shell-integration-features = no-cursor

adjust-cell-height = 2

window-padding-x = 12
window-padding-y = 8
window-decoration = false

background-opacity = 0.92
unfocused-split-opacity = 0.9

confirm-close-surface = false
mouse-hide-while-typing = true

keybind = ctrl+shift+c=copy_to_clipboard
keybind = ctrl+shift+v=paste_from_clipboard
keybind = ctrl+shift+t=new_tab
keybind = ctrl+shift+n=new_window
`

const STARSHIP_TOML = `# Starship prompt configuration

format = """
$directory\
$git_branch\
$git_status\
$rust\
$golang\
$nodejs\
$lua\
$character"""

[directory]
style = "bold #7aa2f7"
truncation_length = 3
truncate_to_repo = true

[git_branch]
format = "[$symbol$branch]($style) "
style = "#bb9af7"
symbol = " "

[git_status]
format = '([$all_status$ahead_behind]($style) )'
style = "#e0af68"

[character]
success_symbol = "[❯](bold #9ece6a)"
error_symbol = "[❯](bold #f7768e)"

[rust]
format = "[$symbol($version)]($style) "
symbol = " "
style = "#e0af68"

[golang]
format = "[$symbol($version)]($style) "
symbol = " "
style = "#7dcfff"

[nodejs]
format = "[$symbol($version)]($style) "
symbol = " "
style = "#9ece6a"
`

// ---------------------------------------------------------------------------
// Project READMEs and code files
// ---------------------------------------------------------------------------

const WAYFORGED_README = `# wayforged

> TUI installer for a complete Fedora Hyprland dev environment

A TUI-based installer powered by charmbracelet/gum that recreates a
complete Fedora Hyprland development environment. 14 installation phases,
22 config files, three install modes, and Tokyo Night theming everywhere.

## Tech
- **Language:** Shell 95.6%, CSS 4.4%
- **License:** MIT
- **Only dependency:** charmbracelet/gum (auto-installed)

## Architecture
\`install.sh\` entry point delegates to \`lib/\` (presentation, logging,
errors, utils) and \`phases/\` (14 scripts covering everything from
Hyprland to Zsh plugins).

## 14 Installation Phases
Repositories > Hyprland & Wayland > Tokyo Night Theme > Nerd Fonts >
Ghostty Terminal > Zsh & Oh My Zsh > CLI Tools > Node.js > Editors >
Git Configuration > Applications > Languages > System Services > Finalize

## Key Features
- Three modes: full, minimal, custom
- Error recovery with retry/skip/log viewing on any phase failure
- Idempotent design — run it twice and nothing breaks

https://github.com/PPRAMANIK62/wayforged
`

const WAYFORGED_INSTALL = `#!/bin/bash
# wayforged installer — simulated output

echo "╔══════════════════════════════════════╗"
echo "║         wayforged installer          ║"
echo "║    Fedora Hyprland Dev Environment   ║"
echo "╚══════════════════════════════════════╝"
echo ""
echo "Select install mode:"
echo "  [1] Full     — everything, kitchen sink included"
echo "  [2] Minimal  — essentials only"
echo "  [3] Custom   — pick your phases"
echo ""
echo "▸ Running Phase  1/14: Repositories........... ✓"
echo "▸ Running Phase  2/14: Hyprland & Wayland..... ✓"
echo "▸ Running Phase  3/14: Tokyo Night Theme...... ✓"
echo "▸ Running Phase  4/14: Nerd Fonts............. ✓"
echo "▸ Running Phase  5/14: Ghostty Terminal....... ✓"
echo "▸ Running Phase  6/14: Zsh & Oh My Zsh....... ✓"
echo "▸ Running Phase  7/14: CLI Tools.............. ✓"
echo "▸ Running Phase  8/14: Node.js Ecosystem...... ✓"
echo "▸ Running Phase  9/14: Editors................ ✓"
echo "▸ Running Phase 10/14: Git Configuration...... ✓"
echo "▸ Running Phase 11/14: Applications........... ✓"
echo "▸ Running Phase 12/14: Languages.............. ✓"
echo "▸ Running Phase 13/14: System Services........ ✓"
echo "▸ Running Phase 14/14: Finalize............... ✓"
echo ""
echo "✨ Installation complete. Reboot to enter Hyprland."
`

const WAYFORGED_ENV = `# .env — wayforged configuration
#
# nice try. secrets aren't stored in .env files.
# ...or are they?
#
# DATABASE_URL=postgresql://localhost:5432/nope
# AWS_SECRET_KEY=lol-you-wish
# GITHUB_TOKEN=ghp_not_a_real_token_nice_try_though
#
# Hint: some things are hidden better than others.
# Try looking where nobody looks.
`

const CANVAS_KIT_README = `# Canvas Kit

> Lightweight drawing app with layers, tools, and export

A lightweight drawing application built with Next.js and React featuring
multiple drawing tools, a layer system with reordering and visibility
toggles, keyboard shortcuts, and PNG export.

## Tech
- **Stack:** Next.js 15, React 19, TypeScript, Tailwind CSS, Framer Motion
- **Languages:** TypeScript 94.5%, JavaScript 5.2%, CSS 0.3%
- **Live:** canvas-kit.vercel.app

## Features
- Drawing tools with shortcuts: Brush (B), Eraser (E), Rectangle (R), Circle (C)
- Layer management with visibility toggles and reordering
- Color palette + custom picker, adjustable brush/eraser size
- Opacity controls, background customization
- Export as PNG image

## Challenges
- Managing canvas state across multiple layers without lag
- Implementing undo/redo with a command pattern
- Making the canvas responsive while maintaining aspect ratio

https://github.com/PPRAMANIK62/canvas-kit
`

const CANVAS_KIT_PACKAGE = `{
  "name": "canvas-kit",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev --turbopack",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  },
  "dependencies": {
    "next": "15.2.3",
    "react": "19.0.0",
    "react-dom": "19.0.0",
    "framer-motion": "12.9.7",
    "tailwindcss": "4.0.15"
  },
  "packageManager": "bun@1.2.4"
}
`

const FOURAT_README = `# 4at

> Multi-user TCP chat server in Rust with rate limiting

A TCP chat server written in both Rust and Go, comparing OS threads vs
green threads for concurrent connection handling. Token-based auth,
rate limiting, ban system, and broadcast messaging — all from raw TCP
sockets with no frameworks.

## Tech
- **Languages:** Rust 54.0%, Go 46.0%
- **Rust Edition:** 2024
- **Dependencies:** getrandom — nearly zero-dependency
- **Port:** TCP 6979 (telnet-compatible)

## Features
- Token-based authentication (generated on server startup)
- Rate limiting and ban system
- Broadcast messaging with text filter
- Dual implementation for threading model comparison

## The Question
How do OS threads (Rust's std::thread) compare to green threads (Go's
goroutines) for handling concurrent TCP connections? This project
answers that with identical servers in both languages.

https://github.com/PPRAMANIK62/4at
`

const FOURAT_MAIN_RS = `use std::collections::HashMap;
use std::io::{BufRead, BufReader, Write};
use std::net::{TcpListener, TcpStream};
use std::sync::{Arc, Mutex};
use std::thread;

type Clients = Arc<Mutex<HashMap<String, TcpStream>>>;

fn handle_client(stream: TcpStream, clients: Clients, token: &str) {
    let mut reader = BufReader::new(stream.try_clone().unwrap());
    let mut line = String::new();

    // Authentication
    let _ = write!(stream.try_clone().unwrap(), "token: ");
    reader.read_line(&mut line).unwrap();
    if line.trim() != token {
        let _ = write!(stream.try_clone().unwrap(), "invalid token\\n");
        return;
    }

    line.clear();
    let _ = write!(stream.try_clone().unwrap(), "nick: ");
    reader.read_line(&mut line).unwrap();
    let nick = line.trim().to_string();

    clients.lock().unwrap().insert(nick.clone(), stream);

    loop {
        line.clear();
        if reader.read_line(&mut line).unwrap() == 0 { break; }
        let msg = format!("[{}] {}", nick, line);
        let guard = clients.lock().unwrap();
        for (name, mut client) in guard.iter() {
            if *name != nick {
                let _ = write!(client, "{}", msg);
            }
        }
    }
}

fn main() {
    let listener = TcpListener::bind("0.0.0.0:6979").unwrap();
    let clients: Clients = Arc::new(Mutex::new(HashMap::new()));
    let token = "4at-secret-token";

    println!("4at listening on :6979 | token: {}", token);
    for stream in listener.incoming().flatten() {
        let clients = Arc::clone(&clients);
        thread::spawn(move || handle_client(stream, clients, token));
    }
}
`

const SEROOST_README = `# seroost

> Local search engine using TF-IDF algorithm in Rust

A local search engine that indexes documents using TF-IDF (Term
Frequency-Inverse Document Frequency), ranks them by relevance, and
serves results over HTTP. No search library — just the math and Rust.

## Tech
- **Languages:** Rust 92.7%, JavaScript 5.6%, HTML 1.7%
- **Rust Edition:** 2024
- **Dependencies:** serde_json, tiny_http, xml-rs (only 3 crates)
- **Structure:** model.rs (TF-IDF), server.rs (HTTP), index.html (UI)

## How It Works
1. Tokenize documents into terms
2. Build an inverted index mapping terms → documents
3. Compute TF-IDF scores for query terms
4. Return documents ranked by relevance score

## The Question
How does search actually work? Not Google-scale infrastructure, but the
core algorithm. Given documents and a query, how do you rank results
by relevance? seroost answers that from first principles.

https://github.com/PPRAMANIK62/seroost
`

const SEROOST_MODEL_RS = `use std::collections::HashMap;

pub struct Model {
    term_freq: HashMap<String, HashMap<String, f64>>,
    doc_freq: HashMap<String, usize>,
    doc_count: usize,
}

impl Model {
    pub fn new() -> Self {
        Self {
            term_freq: HashMap::new(),
            doc_freq: HashMap::new(),
            doc_count: 0,
        }
    }

    pub fn add_document(&mut self, id: &str, tokens: &[String]) {
        self.doc_count += 1;
        let mut tf: HashMap<String, f64> = HashMap::new();
        let len = tokens.len() as f64;
        for token in tokens {
            *tf.entry(token.clone()).or_default() += 1.0 / len;
        }
        for key in tf.keys() {
            *self.doc_freq.entry(key.clone()).or_default() += 1;
        }
        self.term_freq.insert(id.to_string(), tf);
    }

    pub fn search(&self, query: &[String]) -> Vec<(String, f64)> {
        let mut scores: HashMap<String, f64> = HashMap::new();
        for term in query {
            let idf = (self.doc_count as f64
                / self.doc_freq.get(term).copied().unwrap_or(1) as f64)
                .ln();
            for (doc_id, tf_map) in &self.term_freq {
                let tf = tf_map.get(term).copied().unwrap_or(0.0);
                *scores.entry(doc_id.clone()).or_default() += tf * idf;
            }
        }
        let mut ranked: Vec<_> = scores.into_iter().collect();
        ranked.sort_by(|a, b| b.1.partial_cmp(&a.1).unwrap());
        ranked
    }
}
`

const MUSIALIZER_README = `# musializer

> Real-time audio spectrum visualizer using FFT in C

A real-time audio frequency spectrum visualizer that takes audio input,
applies FFT through a custom header-only C library, and renders the
frequency spectrum using raylib. ~670 lines of C, one dependency.

## Tech
- **Language:** C 99.1%, Shell 0.9%
- **~670 lines** of C code
- **Only dependency:** raylib (graphics + audio)
- **Custom FFT:** header-only library, not FFTW

## Specs
- 256 frequency bins, O(N log N) complexity
- 44,100 Hz sample rate, 32-bit sample size, stereo
- Controls: Space = play/pause, ESC = exit

## The Question
What does sound look like? Audio is waveforms — pressure over time. But
ears hear frequencies. The FFT bridges that gap, decomposing audio into
frequency components. This project makes that visible in real time.

https://github.com/PPRAMANIK62/musializer
`

const MUSIALIZER_FFT_H = `#ifndef FFT_H_
#define FFT_H_

#include <math.h>
#include <complex.h>

#ifndef M_PI
#define M_PI 3.14159265358979323846
#endif

typedef float complex cfloat;

static void fft(cfloat *buf, cfloat *scratch, size_t n) {
    if (n < 2) return;

    size_t half = n / 2;
    for (size_t i = 0; i < half; i++) {
        scratch[i]        = buf[2 * i];
        scratch[i + half] = buf[2 * i + 1];
    }

    fft(scratch,        buf, half);
    fft(scratch + half, buf, half);

    for (size_t k = 0; k < half; k++) {
        float t = -2.0f * M_PI * k / n;
        cfloat twiddle = cexpf(t * I);
        buf[k]        = scratch[k] + twiddle * scratch[k + half];
        buf[k + half] = scratch[k] - twiddle * scratch[k + half];
    }
}

static void fft_analyze(float *samples, size_t n, float *output) {
    cfloat buf[n], scratch[n];
    for (size_t i = 0; i < n; i++) {
        buf[i] = samples[i];
    }
    fft(buf, scratch, n);
    for (size_t i = 0; i < n / 2; i++) {
        output[i] = cabsf(buf[i]) / n;
    }
}

#endif
`

// ---------------------------------------------------------------------------
// Documents
// ---------------------------------------------------------------------------

const RESUME_TXT = `═══════════════════════════════════════════════
           PURBAYAN PRAMANIK
═══════════════════════════════════════════════
  Kolkata, India | Graduating 2026
  purbayan.dev@gmail.com
  github.com/PPRAMANIK62
  linkedin.com/in/purbayan-pramanik-30586124b
───────────────────────────────────────────────

SKILLS
  Languages    Rust, C, Go, TypeScript, Shell
  Web          React, Next.js, Tailwind CSS
  Systems      TCP networking, FFT/DSP, search
  Tools        Linux, Hyprland, Git, Docker
  Editors      Zed, Neovim

PROJECTS
  wayforged    Shell TUI installer for Fedora
               Hyprland dev environments
  Canvas Kit   Drawing app — Next.js, layers,
               keyboard shortcuts, PNG export
  4at          TCP chat server in Rust & Go,
               rate limiting, auth, ban system
  seroost      TF-IDF search engine in Rust,
               HTTP server with web frontend
  musializer   Real-time FFT audio visualizer
               in C with raylib (~670 LOC)

OPEN SOURCE
  Apache ECharts (65k+ stars) — contributor
  shadcn ecosystem (fiddle-factory) — PRs

EDUCATION
  B.Tech — graduating 2026

───────────────────────────────────────────────
  "I pick projects mostly based on what I'd
   learn from them."
═══════════════════════════════════════════════
`

const ABOUT_TXT = `I'm Purbayan — a developer from Kolkata, India, graduating in 2026.

I like building things that work well and look clean, whether that's a
web app, a TCP server, or my Linux desktop.

I got into programming through curiosity about how things work under
the hood, and that hasn't really changed. I still pick projects mostly
based on what I'd learn from them.

What I Do
─────────
  Web Development
    TypeScript, React, Next.js
    Building interactive UIs, component architecture
    shadcn/ui ecosystem contributions (fiddle-factory PRs)

  Systems Programming
    Rust, C, Go
    TCP networking, audio processing, search algorithms
    "Understanding how things work under the hood"

  Linux & Tooling
    Fedora + Hyprland (via wayforged)
    Shell scripting, dotfiles, TUI tools
    Tokyo Night everywhere, Iosevka everything

Beyond Code
───────────
  Making my desktop look exactly right (and then changing it again)
  Minimalist setups — fewer things, better things
  Reading about how systems are designed (not just software)
  Zed over VS Code — why run two browsers on one machine?

Open Source
───────────
  Apache ECharts (65k+ stars) and the shadcn ecosystem
  through fiddle-factory.

Contact: purbayan.dev@gmail.com
GitHub:  github.com/PPRAMANIK62
`

// ---------------------------------------------------------------------------
// Secrets
// ---------------------------------------------------------------------------

const FLAG_TXT = `PURBAYAN{h1dd3n_d1r_m4st3r}
`

const SECRETS_NOTES = `The matrix has you...

Some things to try:
  - Check the temp
  - neofetch hides things
  - Have you tried ssh?
  - There's a game somewhere...
  - Not everything is a file

"Follow the white rabbit."
`

// ---------------------------------------------------------------------------
// /etc
// ---------------------------------------------------------------------------

const HOSTNAME = `portfolio
`

const OS_RELEASE = `NAME="PurbayanOS"
VERSION="2026.02 (Tokyo Night)"
ID=purbayanOS
ID_LIKE=fedora
VERSION_ID=2026.02
PRETTY_NAME="PurbayanOS 2026.02 (Tokyo Night)"
HOME_URL="https://purbayan.dev"
BUG_REPORT_URL="https://github.com/PPRAMANIK62"
VARIANT="Hyprland Desktop"
VARIANT_ID=hyprland
`

const MOTD = `
  ╔═══════════════════════════════════════════════╗
  ║                                               ║
  ║   Welcome to PurbayanOS 2026.02               ║
  ║   "Tokyo Night Edition"                       ║
  ║                                               ║
  ║   Kernel: 6.12.7-200.fc41.x86_64             ║
  ║   Shell:  zsh 5.9                             ║
  ║   WM:     Hyprland 0.45.0                     ║
  ║                                               ║
  ║   Type 'help' to see available commands.       ║
  ║   Type 'projects' to see my work.             ║
  ║   There might be some secrets hidden here...  ║
  ║                                               ║
  ╚═══════════════════════════════════════════════╝
`

// ---------------------------------------------------------------------------
// /usr/share/man
// ---------------------------------------------------------------------------

const MAN_PURBAYAN = `PURBAYAN(1)                  Developer Manual                  PURBAYAN(1)

NAME
    purbayan - a developer from Kolkata, India

SYNOPSIS
    purbayan [--web] [--systems] [--linux] [--open-source]

DESCRIPTION
    Developer graduating in 2026 who builds things that work well and
    look clean. Writes web apps in TypeScript/React, systems software
    in Rust and C, and shell scripts that configure entire Linux desktops.

    Driven by curiosity about how things work under the hood. Picks
    projects based on what he'd learn from them.

OPTIONS
    --web
        TypeScript, React, Next.js. Component architecture. shadcn
        ecosystem contributions through fiddle-factory.

    --systems
        Rust, C, Go. TCP networking (4at), audio DSP (musializer),
        search algorithms (seroost). Nearly zero dependencies.

    --linux
        Fedora + Hyprland. Created wayforged — a TUI installer that
        configures 22 dotfiles across 14 phases. Tokyo Night everywhere.

    --open-source
        Contributor to Apache ECharts (65k+ stars) and the shadcn
        ecosystem through fiddle-factory.

ENVIRONMENT
    EDITOR=zed
    TERMINAL=ghostty
    WM=hyprland
    THEME=tokyo-night
    FONT=iosevka

SEE ALSO
    github.com/PPRAMANIK62, purbayanOS(1)

AUTHORS
    Purbayan Pramanik <purbayan.dev@gmail.com>
`

const MAN_PURBAYANOS = `PURBAYANSOS(1)               System Manual                  PURBAYANSOS(1)

NAME
    PurbayanOS - a developer portfolio disguised as a Linux terminal

SYNOPSIS
    purbayanOS [--explore] [--hack] [--discover]

DESCRIPTION
    PurbayanOS is a virtual operating system running inside a web
    browser. It simulates a Linux environment complete with a filesystem,
    shell commands, and hidden secrets.

    This is Purbayan Pramanik's portfolio website. The terminal is a
    fully interactive experience — navigate the filesystem, read project
    READMEs, explore config files, and find hidden CTF flags.

COMMANDS
    help        Show available commands
    ls          List directory contents
    cd          Change directory
    cat         Display file contents
    tree        Show directory tree
    neofetch    System information (with style)
    projects    Browse projects interactively
    open        Open links in browser
    clear       Clear terminal screen

SECRETS
    There are 7 flags hidden throughout the system. They follow the
    format PURBAYAN{...}. Some are in files. Some are triggered by
    commands. One requires skill with a snake.

    Happy hacking.

BUGS
    This is a feature, not a bug.

SEE ALSO
    purbayan(1)
`

// ---------------------------------------------------------------------------
// /tmp
// ---------------------------------------------------------------------------

const TMP_FLAG = `You found me! Not many people check /tmp.

PURBAYAN{tmp_h4ck3r}

Most CTF players forget about temp directories. You didn't.
`

// ---------------------------------------------------------------------------
// Games
// ---------------------------------------------------------------------------

const SNAKE_FILE = `Run this file to play Snake! Use the 'snake' command.

Controls:
  Arrow keys or WASD to move
  Don't hit the walls or yourself
  Eat 10 apples to win

There might be a reward for winning...
`

// ---------------------------------------------------------------------------
// Assemble the tree
// ---------------------------------------------------------------------------

export const ROOT: FSNode = dir("/", [
  dir("home", [
    dir("purbayan", [
      file(".bashrc", BASHRC),
      file(".profile", PROFILE),
      file(".gitconfig", GITCONFIG),
      dir(".config", [
        dir("hyprland", [file("hyprland.conf", HYPRLAND_CONF)]),
        dir("waybar", [file("config.jsonc", WAYBAR_CONFIG)]),
        dir("ghostty", [file("config", GHOSTTY_CONFIG)]),
        dir("starship", [file("starship.toml", STARSHIP_TOML)]),
      ]),
      dir("projects", [
        dir("wayforged", [
          file("README.md", WAYFORGED_README),
          file("install.sh", WAYFORGED_INSTALL, { executable: true }),
          file(".env", WAYFORGED_ENV),
        ]),
        dir("canvas-kit", [
          file("README.md", CANVAS_KIT_README),
          file("package.json", CANVAS_KIT_PACKAGE),
        ]),
        dir("4at", [
          file("README.md", FOURAT_README),
          file("main.rs", FOURAT_MAIN_RS),
        ]),
        dir("seroost", [
          file("README.md", SEROOST_README),
          file("model.rs", SEROOST_MODEL_RS),
        ]),
        dir("musializer", [
          file("README.md", MUSIALIZER_README),
          file("fft.h", MUSIALIZER_FFT_H),
        ]),
      ]),
      dir("documents", [
        file("resume.txt", RESUME_TXT),
        file("about.txt", ABOUT_TXT),
      ]),
      dir(".secrets", [
        file(".flag.txt", FLAG_TXT),
        file("notes.txt", SECRETS_NOTES),
      ]),
      dir("games", [
        file("snake", SNAKE_FILE, { executable: true }),
      ]),
    ]),
  ]),
  dir("etc", [
    file("hostname", HOSTNAME),
    file("os-release", OS_RELEASE),
    file("motd", MOTD),
  ]),
  dir("usr", [
    dir("share", [
      dir("man", [
        file("purbayan.1", MAN_PURBAYAN),
        file("purbayanOS.1", MAN_PURBAYANOS),
      ]),
    ]),
  ]),
  dir("tmp", [
    file(".you-found-me.txt", TMP_FLAG),
  ]),
])
