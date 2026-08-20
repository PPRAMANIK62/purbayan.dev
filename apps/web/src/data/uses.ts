export interface UsesEntry {
  category: string
  tool: string
  note?: string
}

export interface UsesGroup {
  title: string
  entries: UsesEntry[]
}

export const usesGroups: readonly UsesGroup[] = [
  {
    title: "Hardware",
    entries: [
      {
        category: "laptop",
        tool: "Acer Swift Go 14",
        note: "daily driver, portable enough for everything",
      },
    ],
  },
  {
    title: "Desktop",
    entries: [
      { category: "os", tool: "Fedora + Hyprland" },
      { category: "bar", tool: "Waybar" },
      { category: "launcher", tool: "Rofi" },
      { category: "notifications", tool: "SwayNC" },
      { category: "wallpaper", tool: "Hyprpaper" },
      { category: "lock", tool: "Hyprlock" },
      { category: "theme", tool: "Tokyo Night", note: "everywhere but this site" },
    ],
  },
  {
    title: "Terminal",
    entries: [
      { category: "terminal", tool: "Ghostty" },
      { category: "shell", tool: "Zsh + Oh My Zsh + plugins" },
      { category: "font", tool: "Iosevka Mono", note: "the only usable font" },
      { category: "multiplexer", tool: "tmux" },
    ],
  },
  {
    title: "Editors",
    entries: [
      { category: "primary", tool: "Zed" },
      { category: "trying", tool: "Neovim (someday)" },
    ],
  },
  {
    title: "Browsers",
    entries: [
      {
        category: "everything",
        tool: "Zen Browser",
        note: "the browser Firefox should have been",
      },
      { category: "dev", tool: "Helium", note: "chromium without the Google" },
    ],
  },
  {
    title: "Apps",
    entries: [
      { category: "recording", tool: "OBS Studio", note: "streams and screen recordings" },
      { category: "notes", tool: "Obsidian", note: "second brain, markdown everything" },
    ],
  },
  {
    title: "Dev tools",
    entries: [
      { category: "runtime", tool: "Bun, Node.js, pnpm" },
      { category: "languages", tool: "TypeScript, Rust, Go, C" },
      { category: "frameworks", tool: "Next.js, React" },
    ],
  },
  {
    title: "CLI",
    entries: [
      { category: "ls", tool: "eza", note: "ls but pretty" },
      { category: "cat", tool: "bat", note: "cat with wings" },
      { category: "search", tool: "fzf", note: "fuzzy find everything" },
      { category: "files", tool: "yazi", note: "terminal file manager" },
      { category: "cd", tool: "zoxide", note: "smarter cd" },
      { category: "fetch", tool: "fastfetch", note: "system info, fast" },
    ],
  },
]
