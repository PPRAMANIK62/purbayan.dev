export type ContentBlock =
  | { type: "paragraph"; text: string }
  | { type: "heading"; text: string }
  | { type: "code"; language: string; code: string }
  | { type: "list"; items: string[] }

export interface BlogPost {
  slug: string
  title: string
  date: string
  tags: string[]
  summary: string
  readingTime: string
  content: ContentBlock[]
}

interface BlogFrontmatter {
  title: string
  date: string
  tags: string[]
  summary: string
  readingTime: string
}

const rawPosts = import.meta.glob<string>("../content/blog/*.md", {
  query: "?raw",
  import: "default",
  eager: true,
})

function getSlug(path: string): string {
  const filename = path.split("/").pop()
  if (!filename) {
    throw new Error(`Invalid blog path: ${path}`)
  }
  return filename.replace(/\.md$/, "")
}

function parseScalar(value: string): string {
  const trimmed = value.trim()
  if (trimmed.startsWith('"') && trimmed.endsWith('"')) {
    return JSON.parse(trimmed) as string
  }
  return trimmed
}

function parseFrontmatterValue(value: string): string | string[] {
  const trimmed = value.trim()
  if (trimmed.startsWith("[") && trimmed.endsWith("]")) {
    return JSON.parse(trimmed) as string[]
  }
  return parseScalar(trimmed)
}

function parseFrontmatter(source: string): { metadata: BlogFrontmatter; body: string } {
  if (!source.startsWith("---\n")) {
    throw new Error("Blog post is missing frontmatter")
  }

  const end = source.indexOf("\n---", 4)
  if (end === -1) {
    throw new Error("Blog post has unterminated frontmatter")
  }

  const frontmatter = source.slice(4, end).trim()
  const body = source.slice(end + "\n---".length).trim()
  const values: Record<string, string | string[]> = {}

  for (const line of frontmatter.split("\n")) {
    const separator = line.indexOf(":")
    if (separator === -1) continue

    const key = line.slice(0, separator).trim()
    const value = line.slice(separator + 1)
    values[key] = parseFrontmatterValue(value)
  }

  const metadata = {
    title: requireString(values, "title"),
    date: requireString(values, "date"),
    tags: requireStringArray(values, "tags"),
    summary: requireString(values, "summary"),
    readingTime: requireString(values, "readingTime"),
  }

  return { metadata, body }
}

function requireString(values: Record<string, string | string[]>, key: string): string {
  const value = values[key]
  if (typeof value !== "string" || value.length === 0) {
    throw new Error(`Blog post frontmatter requires string "${key}"`)
  }
  return value
}

function requireStringArray(values: Record<string, string | string[]>, key: string): string[] {
  const value = values[key]
  if (!Array.isArray(value) || value.some((item) => typeof item !== "string")) {
    throw new Error(`Blog post frontmatter requires string array "${key}"`)
  }
  return value
}

function parseMarkdownBody(body: string): ContentBlock[] {
  const blocks: ContentBlock[] = []
  const lines = body.split("\n")
  let index = 0

  while (index < lines.length) {
    const line = lines[index]
    const trimmed = line.trim()

    if (trimmed === "") {
      index++
      continue
    }

    if (trimmed.startsWith("```")) {
      const language = trimmed.slice(3).trim() || "text"
      const codeLines: string[] = []
      index++

      while (index < lines.length && !lines[index].trim().startsWith("```")) {
        codeLines.push(lines[index])
        index++
      }

      if (index >= lines.length) {
        throw new Error("Blog post has unterminated code fence")
      }

      blocks.push({ type: "code", language, code: codeLines.join("\n") })
      index++
      continue
    }

    if (trimmed.startsWith("## ")) {
      blocks.push({ type: "heading", text: trimmed.slice(3).trim() })
      index++
      continue
    }

    if (trimmed.startsWith("- ")) {
      const items: string[] = []

      while (index < lines.length && lines[index].trim().startsWith("- ")) {
        items.push(lines[index].trim().slice(2).trim())
        index++
      }

      blocks.push({ type: "list", items })
      continue
    }

    const paragraphLines = [trimmed]
    index++

    while (index < lines.length) {
      const next = lines[index].trim()
      if (
        next === "" ||
        next.startsWith("## ") ||
        next.startsWith("```") ||
        next.startsWith("- ")
      ) {
        break
      }
      paragraphLines.push(next)
      index++
    }

    blocks.push({ type: "paragraph", text: paragraphLines.join(" ") })
  }

  return blocks
}

export const blogPosts: BlogPost[] = Object.entries(rawPosts)
  .map(([path, rawPost]) => {
    try {
      const { metadata, body } = parseFrontmatter(rawPost)
      return {
        slug: getSlug(path),
        ...metadata,
        content: parseMarkdownBody(body),
      }
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`${path}: ${error.message}`)
      }
      throw error
    }
  })
  .sort((a, b) => b.date.localeCompare(a.date))
