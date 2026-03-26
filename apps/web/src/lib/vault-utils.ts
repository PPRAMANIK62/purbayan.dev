import type { ReactNode, ReactElement } from "react"

export interface VaultFile {
  slug: string
  category: string
  label: string
  content: string
}

export interface Bookmark {
  headingId: string
  headingText: string
  scrollY: number
}

export interface VaultStats {
  totalDocs: number
  totalWords: number
  totalReadingTime: number
}

export interface TocEntry {
  level: number
  text: string
  id: string
}

export interface FileStats {
  lineCount: number
  wordCount: number
  readingTime: number
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .trim()
}

export function extractTextFromChildren(children: ReactNode): string {
  if (typeof children === "string") return children
  if (typeof children === "number") return String(children)
  if (Array.isArray(children)) return children.map(extractTextFromChildren).join("")
  if (children && typeof children === "object" && "props" in children) {
    return extractTextFromChildren(
      (children as ReactElement<{ children?: ReactNode }>).props.children,
    )
  }
  return ""
}

export function kebabToTitle(s: string): string {
  return s
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ")
}

export function getSavedProgress(category: string, slug: string): number {
  const val = localStorage.getItem(`vault-progress-${category}/${slug}`)
  return val ? parseInt(val, 10) : 0
}

export function extractToc(markdown: string): TocEntry[] {
  const headingRegex = /^(#{1,4})\s+(.+)$/gm
  const entries: TocEntry[] = []
  let match: RegExpExecArray | null
  while ((match = headingRegex.exec(markdown)) !== null) {
    entries.push({ level: match[1].length, text: match[2].trim(), id: slugify(match[2].trim()) })
  }
  return entries
}

export function computeFileStats(content: string): FileStats {
  const lines = content.split("\n").length
  const words = content.split(/\s+/).filter(Boolean).length
  return { lineCount: lines, wordCount: words, readingTime: Math.ceil(words / 200) }
}

export function findNearestHeadingAbove(
  contentEl: HTMLElement,
): { id: string; text: string } | null {
  const headings = contentEl.querySelectorAll("h1[id], h2[id], h3[id], h4[id]")
  const scrollTop = contentEl.scrollTop
  let nearest: HTMLElement | null = null

  for (const heading of headings) {
    const el = heading as HTMLElement
    if (el.offsetTop <= scrollTop + 50) {
      nearest = el
    } else {
      break
    }
  }

  if (!nearest) return null
  return {
    id: nearest.id,
    text: nearest.textContent?.trim() ?? "",
  }
}

export async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder()
  const data = encoder.encode(password)
  const buffer = await crypto.subtle.digest("SHA-256", data)
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("")
}

const vaultModules = import.meta.glob("/src/content/vault/**/*.md", {
  eager: true,
  query: "?raw",
  import: "default",
}) as Record<string, string>

export const vaultFiles: VaultFile[] = Object.entries(vaultModules)
  .map(([path, content]) => {
    const parts = path.replace("/src/content/vault/", "").split("/")
    const category = parts.length > 1 ? parts[0] : "uncategorized"
    const slug = parts[parts.length - 1].replace(/\.md$/, "")
    return {
      slug,
      category,
      label: kebabToTitle(slug),
      content: content as string,
    }
  })
  .sort((a, b) => a.label.localeCompare(b.label))

export const groupedFiles = vaultFiles.reduce<Record<string, VaultFile[]>>((acc, file) => {
  const group = file.category
  if (!acc[group]) acc[group] = []
  acc[group].push(file)
  return acc
}, {})
