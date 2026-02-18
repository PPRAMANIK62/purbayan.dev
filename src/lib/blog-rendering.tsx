import type { ReactNode } from "react"
import type { ContentBlock } from "@/data/blog"
import { CodeBlock } from "@/components/blog/code-block"
import { SectionHeading } from "@/components/section-heading"
import { BulletList } from "@/components/bullet-list"

export function renderInlineText(text: string): ReactNode[] {
  const parts: ReactNode[] = []
  const regex = /(\*\*(.+?)\*\*|`([^`]+)`)/g
  let lastIndex = 0
  let match: RegExpExecArray | null

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index))
    }

    if (match[2]) {
      parts.push(
        <strong key={match.index} className="text-foreground font-medium">
          {match[2]}
        </strong>
      )
    } else if (match[3]) {
      parts.push(
        <code
          key={match.index}
          className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono text-primary"
        >
          {match[3]}
        </code>
      )
    }

    lastIndex = match.index + match[0].length
  }

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex))
  }

  return parts
}

export function renderBlock(block: ContentBlock, index: number): ReactNode {
  switch (block.type) {
    case "paragraph":
      return (
        <p
          key={index}
          className="text-secondary-foreground leading-relaxed"
        >
          {renderInlineText(block.text)}
        </p>
      )
    case "heading":
      return (
        <SectionHeading key={index} title={block.text} className="pt-4" />
      )
    case "code":
      return <CodeBlock key={index} language={block.language} code={block.code} />
    case "list":
      return (
        <BulletList
          key={index}
          items={block.items.map((item, i) => (
            <span key={i}>{renderInlineText(item)}</span>
          ))}
          bullet="-"
          className="space-y-3"
        />
      )
  }
}
