import type { ReactNode } from "react"
import type { ContentBlock } from "@/data/blog"
import { CodeBlock } from "@/components/blog/code-block"

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
        <strong key={match.index} className="font-medium text-ink">
          {match[2]}
        </strong>,
      )
    } else if (match[3]) {
      parts.push(
        <code
          key={match.index}
          className="rounded bg-sink px-1.5 py-0.5 font-mono text-[0.9em] text-brand"
        >
          {match[3]}
        </code>,
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
        <p key={index} className="max-w-[68ch] text-dim">
          {renderInlineText(block.text)}
        </p>
      )
    case "heading":
      return (
        <h2
          key={index}
          className="pt-6 font-display text-[clamp(1.3rem,2.4vw,1.75rem)] font-semibold tracking-[-0.022em] text-ink [font-variation-settings:'wdth'_95]"
        >
          {block.text}
        </h2>
      )
    case "code":
      return <CodeBlock key={index} language={block.language} code={block.code} />
    case "list":
      return (
        <ul key={index} className="max-w-[68ch]">
          {block.items.map((item, i) => (
            // eslint-disable-next-line react/no-array-index-key
            <li key={i} className="border-b border-line py-3 text-dim last:border-b-0">
              {renderInlineText(item)}
            </li>
          ))}
        </ul>
      )
  }
}
