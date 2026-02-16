import { useState, type ReactNode } from "react"
import { useParams, Link } from "react-router-dom"
import { Copy, Check } from "lucide-react"
import { blogPosts, type ContentBlock } from "@/data/blog"
import { FadeUp } from "@/components/fade-up"
import { Badge } from "@/components/ui/badge"

function CodeBlock({ language, code }: { language: string; code: string }) {
  const [copied, setCopied] = useState(false)

  function handleCopy() {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="group relative bg-muted/50 border border-border/50 rounded-lg">
      <div className="absolute top-2 right-2 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
        <span className="font-mono text-xs text-muted-foreground bg-muted/80 px-2 py-0.5 rounded">
          {language}
        </span>
        <button
          type="button"
          onClick={handleCopy}
          className="text-muted-foreground hover:text-foreground bg-muted/80 p-1 rounded transition-colors duration-150"
          aria-label="Copy code"
        >
          {copied ? <Check className="size-3.5 text-green-400" /> : <Copy className="size-3.5" />}
        </button>
      </div>
      <pre className="p-4 overflow-x-auto">
        <code className="font-mono text-sm text-secondary-foreground">
          {code}
        </code>
      </pre>
    </div>
  )
}

function renderInlineText(text: string): ReactNode[] {
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

function renderBlock(block: ContentBlock, index: number): ReactNode {
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
        <h3
          key={index}
          className="text-2xl font-mono font-semibold flex items-baseline pt-4"
        >
          <span className="text-muted-foreground mr-2">&gt;</span>
          {block.text}
        </h3>
      )
    case "code":
      return <CodeBlock key={index} language={block.language} code={block.code} />
    case "list":
      return (
        <ul key={index} className="space-y-3">
          {block.items.map((item, i) => (
            <li
              key={i}
              className="text-secondary-foreground leading-relaxed flex items-start"
            >
              <span className="text-primary mr-2 mt-1">-</span>
              <span>{renderInlineText(item)}</span>
            </li>
          ))}
        </ul>
      )
  }
}

export default function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>()
  const post = blogPosts.find((p) => p.slug === slug)

  if (!post) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-24 text-center">
        <p className="text-muted-foreground font-mono">Post not found.</p>
        <Link to="/blog" className="text-primary font-mono hover:underline">
          → back to blog
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-24">
      <div className="space-y-16">
        {/* Header */}
        <FadeUp>
          <div>
            <h1 className="text-4xl font-mono font-bold">{post.title}</h1>

            <div className="flex items-center gap-4 mt-3">
              <span className="text-muted-foreground font-mono text-sm">
                {post.date}
              </span>
              <span className="text-muted-foreground font-mono text-sm">
                {post.readingTime}
              </span>
            </div>

            <div className="flex flex-wrap gap-2 mt-4">
              {post.tags.map((tag) => (
                <Badge
                  key={tag}
                  variant="outline"
                  className="font-mono text-xs"
                >
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        </FadeUp>

        {/* Content */}
        <FadeUp delay={0.1}>
          <div className="space-y-6">
            {post.content.map((block, index) => renderBlock(block, index))}
          </div>
        </FadeUp>

        {/* Back Link */}
        <FadeUp delay={0.2}>
          <Link
            to="/blog"
            className="text-primary font-mono hover:underline"
          >
            ← back to blog
          </Link>
        </FadeUp>
      </div>
    </div>
  )
}
