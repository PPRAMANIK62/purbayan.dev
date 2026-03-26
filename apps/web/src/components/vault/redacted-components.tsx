import { useMemo, type ComponentPropsWithoutRef } from "react"
import { motion } from "motion/react"
import { cn } from "@/lib/utils"
import { slugify, extractTextFromChildren } from "@/lib/vault-utils"

const dissolveEasing = [0.25, 0.46, 0.45, 0.94] as const

function RedactionBar({
  lines = 2,
  className,
  unlocked = false,
}: {
  lines?: number
  className?: string
  unlocked?: boolean
}) {
  const widths = [85, 72, 60, 90, 45, 78, 55, 88, 65, 70]
  // Stable random delays per bar — seeded from line count + index
  const delays = useMemo(
    () => Array.from({ length: lines }, (_, i) => ((i * 7 + lines * 3) % 10) / 33),
    [lines],
  )
  return (
    <div className={cn("space-y-1.5", className)}>
      {Array.from({ length: lines }, (_, i) => (
        <motion.div
          key={i}
          className="h-3 bg-muted-foreground/15 rounded-sm origin-left"
          style={{ width: `${widths[i % widths.length]}%` }}
          initial={false}
          animate={
            unlocked
              ? { opacity: 0, scaleY: 0, height: 0, marginBottom: 0 }
              : { opacity: 1, scaleY: 1 }
          }
          transition={
            unlocked
              ? {
                  duration: 0.5,
                  delay: delays[i],
                  ease: dissolveEasing,
                }
              : { duration: 0 }
          }
        />
      ))}
    </div>
  )
}

export function redactedMdComponents(
  unlocked = false,
): Record<string, React.ComponentType<ComponentPropsWithoutRef<any>>> {
  return {
    h1: ({ children, ...props }: ComponentPropsWithoutRef<"h1">) => {
      const text = extractTextFromChildren(children)
      const id = slugify(text)
      return (
        <h1
          id={id}
          className="text-4xl font-mono font-bold mt-10 mb-6 flex items-baseline scroll-mt-60"
          {...props}
        >
          <span className="text-primary mr-2">&gt;</span>
          {children}
        </h1>
      )
    },
    h2: ({ children, ...props }: ComponentPropsWithoutRef<"h2">) => {
      const text = extractTextFromChildren(children)
      const id = slugify(text)
      return (
        <h2
          id={id}
          className="text-2xl font-mono font-semibold mt-10 mb-4 text-tokyo-magenta flex items-baseline scroll-mt-60"
          {...props}
        >
          <span className="text-tokyo-magenta mr-2">&gt;</span>
          {children}
        </h2>
      )
    },
    h3: ({ children, ...props }: ComponentPropsWithoutRef<"h3">) => {
      const text = extractTextFromChildren(children)
      const id = slugify(text)
      return (
        <h3
          id={id}
          className="text-xl font-mono font-semibold mt-8 mb-3 text-tokyo-cyan flex items-baseline scroll-mt-60"
          {...props}
        >
          {children}
        </h3>
      )
    },
    h4: ({ children, ...props }: ComponentPropsWithoutRef<"h4">) => {
      const text = extractTextFromChildren(children)
      const id = slugify(text)
      return (
        <h4
          id={id}
          className="text-lg font-mono font-medium mt-6 mb-2 text-tokyo-yellow flex items-baseline scroll-mt-60"
          {...props}
        >
          {children}
        </h4>
      )
    },
    p: () => (
      <div className="mb-4">
        <RedactionBar lines={2} unlocked={unlocked} />
      </div>
    ),
    a: () => <></>,
    strong: () => <></>,
    em: () => <></>,
    blockquote: ({ ...props }: ComponentPropsWithoutRef<"blockquote">) => (
      <blockquote
        className="border-l-2 border-tokyo-teal bg-muted/30 pl-4 py-3 my-6 rounded-r-lg"
        {...props}
      >
        <RedactionBar lines={2} unlocked={unlocked} />
      </blockquote>
    ),
    ul: ({ children }: ComponentPropsWithoutRef<"ul">) => (
      <div className="space-y-2.5 mb-5">{children}</div>
    ),
    ol: ({ children }: ComponentPropsWithoutRef<"ol">) => (
      <div className="space-y-2.5 mb-5">{children}</div>
    ),
    li: ({ ...props }: ComponentPropsWithoutRef<"li">) => (
      <li className="flex items-start mb-2" {...props}>
        <span className="text-tokyo-green mr-2 mt-0.5 shrink-0">-</span>
        <RedactionBar lines={1} className="flex-1" unlocked={unlocked} />
      </li>
    ),
    code: ({ className, ...props }: ComponentPropsWithoutRef<"code">) => {
      const isBlock = /language-(\w+)/.test(className || "")
      if (isBlock) {
        return (
          <code className={cn("font-mono text-sm", className)} {...props}>
            <RedactionBar lines={4} unlocked={unlocked} />
          </code>
        )
      }
      return (
        <span className="bg-muted/80 px-1.5 py-0.5 rounded text-sm font-mono text-muted-foreground/40 border border-border/40">
          ███
        </span>
      )
    },
    pre: () => (
      <div className="bg-muted/50 border border-border/50 border-l-2 border-l-primary rounded-lg p-4 my-6">
        <RedactionBar lines={4} unlocked={unlocked} />
      </div>
    ),
    table: ({ children, ...props }: ComponentPropsWithoutRef<"table">) => (
      <div className="overflow-x-auto my-6 rounded-lg border border-border">
        <table className="w-full text-sm font-mono" {...props}>
          {children}
        </table>
      </div>
    ),
    thead: ({ children, ...props }: ComponentPropsWithoutRef<"thead">) => (
      <thead className="bg-primary/10 border-b border-border" {...props}>
        {children}
      </thead>
    ),
    th: ({ ...props }: ComponentPropsWithoutRef<"th">) => (
      <th className="px-4 py-3 text-left text-primary font-semibold" {...props}>
        ███
      </th>
    ),
    td: ({ ...props }: ComponentPropsWithoutRef<"td">) => (
      <td className="px-4 py-2.5 text-secondary-foreground border-t border-border/50" {...props}>
        <span className="text-muted-foreground/30">███</span>
      </td>
    ),
    tr: ({ children, ...props }: ComponentPropsWithoutRef<"tr">) => (
      <tr className="even:bg-muted/20" {...props}>
        {children}
      </tr>
    ),
    hr: ({ ...props }: ComponentPropsWithoutRef<"hr">) => (
      <hr
        className="border-none h-px bg-gradient-to-r from-border via-primary/30 to-border my-10"
        {...props}
      />
    ),
    input: ({ ...props }: ComponentPropsWithoutRef<"input">) => {
      if (props.type === "checkbox") {
        return (
          <span className="inline-flex items-center justify-center size-4 rounded border border-border bg-transparent mr-2 shrink-0 mt-0.5 opacity-50" />
        )
      }
      return <input {...props} />
    },
  }
}
