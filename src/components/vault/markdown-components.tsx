import { Children, isValidElement, type ComponentPropsWithoutRef } from "react"
import { Bookmark as BookmarkIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { slugify, extractTextFromChildren, type Bookmark } from "@/lib/vault-utils"

function BookmarkButton({
  headingId,
  headingText,
  currentBookmarks,
  toggleBookmark,
}: {
  headingId: string
  headingText: string
  currentBookmarks: Bookmark[]
  toggleBookmark: (id: string, text: string) => void
}) {
  const isBookmarked = currentBookmarks.some((b) => b.headingId === headingId)

  return (
    <button
      onClick={() => toggleBookmark(headingId, headingText)}
      className={cn(
        "ml-2 opacity-0 group-hover:opacity-100 transition-opacity",
        isBookmarked && "opacity-100 text-tokyo-yellow",
      )}
      aria-label={isBookmarked ? "Remove bookmark" : "Bookmark this section"}
    >
      <BookmarkIcon className="size-4" />
    </button>
  )
}

export function mdComponents(
  currentBookmarks: Bookmark[],
  toggleBookmark: (id: string, text: string) => void,
  toggledCheckboxes: number[],
  onToggleCheckbox: (index: number) => void,
  checkboxIndexRef: { current: number },
): Record<string, React.ComponentType<ComponentPropsWithoutRef<any>>> {
  return {
    h1: ({ children, ...props }: ComponentPropsWithoutRef<"h1">) => {
      const text = extractTextFromChildren(children)
      const id = slugify(text)
      return (
        <h1
          id={id}
          className={cn(
            "group text-4xl font-mono font-bold mt-10 mb-6 flex items-baseline scroll-mt-60",
            currentBookmarks.some((b) => b.headingId === id) &&
              "border-l-2 border-tokyo-yellow pl-2",
          )}
          {...props}
        >
          <span className="text-primary mr-2">&gt;</span>
          {children}
          <BookmarkButton
            headingId={id}
            headingText={text}
            currentBookmarks={currentBookmarks}
            toggleBookmark={toggleBookmark}
          />
        </h1>
      )
    },
    h2: ({ children, ...props }: ComponentPropsWithoutRef<"h2">) => {
      const text = extractTextFromChildren(children)
      const id = slugify(text)
      return (
        <h2
          id={id}
          className={cn(
            "group text-2xl font-mono font-semibold mt-10 mb-4 flex items-baseline text-tokyo-magenta scroll-mt-60",
            currentBookmarks.some((b) => b.headingId === id) &&
              "border-l-2 border-tokyo-yellow pl-2",
          )}
          {...props}
        >
          <span className="text-tokyo-magenta mr-2">&gt;</span>
          {children}
          <BookmarkButton
            headingId={id}
            headingText={text}
            currentBookmarks={currentBookmarks}
            toggleBookmark={toggleBookmark}
          />
        </h2>
      )
    },
    h3: ({ children, ...props }: ComponentPropsWithoutRef<"h3">) => {
      const text = extractTextFromChildren(children)
      const id = slugify(text)
      return (
        <h3
          id={id}
          className={cn(
            "group text-xl font-mono font-semibold mt-8 mb-3 text-tokyo-cyan flex items-baseline scroll-mt-60",
            currentBookmarks.some((b) => b.headingId === id) &&
              "border-l-2 border-tokyo-yellow pl-2",
          )}
          {...props}
        >
          {children}
          <BookmarkButton
            headingId={id}
            headingText={text}
            currentBookmarks={currentBookmarks}
            toggleBookmark={toggleBookmark}
          />
        </h3>
      )
    },
    h4: ({ children, ...props }: ComponentPropsWithoutRef<"h4">) => {
      const text = extractTextFromChildren(children)
      const id = slugify(text)
      return (
        <h4
          id={id}
          className={cn(
            "group text-lg font-mono font-medium mt-6 mb-2 text-tokyo-yellow flex items-baseline scroll-mt-60",
            currentBookmarks.some((b) => b.headingId === id) &&
              "border-l-2 border-tokyo-yellow pl-2",
          )}
          {...props}
        >
          {children}
          <BookmarkButton
            headingId={id}
            headingText={text}
            currentBookmarks={currentBookmarks}
            toggleBookmark={toggleBookmark}
          />
        </h4>
      )
    },
    p: ({ children, ...props }: ComponentPropsWithoutRef<"p">) => (
      <p className="text-base text-secondary-foreground leading-relaxed mb-4" {...props}>
        {children}
      </p>
    ),
    a: ({ children, ...props }: ComponentPropsWithoutRef<"a">) => (
      <a
        className="text-tokyo-cyan hover:underline underline-offset-4 transition-colors hover:text-primary"
        target="_blank"
        rel="noopener noreferrer"
        {...props}
      >
        {children}
      </a>
    ),
    strong: ({ children, ...props }: ComponentPropsWithoutRef<"strong">) => (
      <strong className="text-foreground font-semibold" {...props}>
        {children}
      </strong>
    ),
    em: ({ children, ...props }: ComponentPropsWithoutRef<"em">) => (
      <em className="text-tokyo-cyan italic" {...props}>
        {children}
      </em>
    ),
    blockquote: ({ children, ...props }: ComponentPropsWithoutRef<"blockquote">) => {
      const text = extractTextFromChildren(children)

      const calloutStyles: Record<string, { border: string; bg: string }> = {
        "\u{1F4A1}": { border: "border-l-tokyo-yellow", bg: "bg-tokyo-yellow/5" },
        "\u26A0\uFE0F": { border: "border-l-tokyo-red", bg: "bg-tokyo-red/5" },
        "\u{1F3AF}": { border: "border-l-tokyo-green", bg: "bg-tokyo-green/5" },
        "\u{1F4DD}": { border: "border-l-tokyo-cyan", bg: "bg-tokyo-cyan/5" },
      }

      const emoji = Object.keys(calloutStyles).find((e) => text.trimStart().startsWith(e))
      const style = emoji ? calloutStyles[emoji] : null

      return (
        <blockquote
          className={cn(
            "border-l-2 pl-4 py-3 my-6 rounded-r-lg",
            style ? `${style.border} ${style.bg}` : "border-tokyo-teal bg-muted/30",
          )}
          {...props}
        >
          {children}
        </blockquote>
      )
    },
    ul: ({ children, ...props }: ComponentPropsWithoutRef<"ul">) => (
      <ul className="space-y-2.5 mb-5" {...props}>
        {children}
      </ul>
    ),
    ol: ({ children, ...props }: ComponentPropsWithoutRef<"ol">) => (
      <ol className="space-y-2.5 mb-5 list-decimal list-inside" {...props}>
        {children}
      </ol>
    ),
    li: ({ children, ...props }: ComponentPropsWithoutRef<"li">) => {
      const childArray = Children.toArray(children)
      const hasCheckbox = childArray.some(
        (child) =>
          isValidElement(child) &&
          ((child.props as Record<string, unknown>)?.role === "checkbox" ||
            (child.props as Record<string, unknown>)?.type === "checkbox"),
      )

      if (hasCheckbox) {
        return (
          <li
            className="text-base text-secondary-foreground leading-relaxed flex items-start list-none"
            {...props}
          >
            {children}
          </li>
        )
      }

      return (
        <li
          className="text-base text-secondary-foreground leading-relaxed flex items-start"
          {...props}
        >
          <span className="text-tokyo-green mr-2 mt-0.5 shrink-0">-</span>
          <span className="flex-1">{children}</span>
        </li>
      )
    },
    code: ({ children, className, ...props }: ComponentPropsWithoutRef<"code">) => {
      const isBlock = /language-(\w+)/.test(className || "")
      if (isBlock) {
        return (
          <code className={cn("font-mono text-sm text-secondary-foreground", className)} {...props}>
            {children}
          </code>
        )
      }
      return (
        <code
          className="bg-muted/80 px-1.5 py-0.5 rounded text-sm font-mono text-tokyo-green border border-border/40"
          {...props}
        >
          {children}
        </code>
      )
    },
    pre: ({ children, ...props }: ComponentPropsWithoutRef<"pre">) => (
      <pre
        className="bg-muted/50 border border-border/50 border-l-2 border-l-primary rounded-lg p-4 overflow-x-auto my-6"
        {...props}
      >
        {children}
      </pre>
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
    th: ({ children, ...props }: ComponentPropsWithoutRef<"th">) => (
      <th className="px-4 py-3 text-left text-primary font-semibold" {...props}>
        {children}
      </th>
    ),
    td: ({ children, ...props }: ComponentPropsWithoutRef<"td">) => (
      <td className="px-4 py-2.5 text-secondary-foreground border-t border-border/50" {...props}>
        {children}
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
    input: ({ checked, ...props }: ComponentPropsWithoutRef<"input">) => {
      if (props.type === "checkbox") {
        const index = checkboxIndexRef.current++
        const isToggled = toggledCheckboxes.includes(index)
        const effectiveChecked = isToggled ? !checked : checked

        return (
          <button
            onClick={() => onToggleCheckbox(index)}
            className={cn(
              "inline-flex items-center justify-center size-4 rounded border mr-2 shrink-0 mt-0.5 cursor-pointer transition-colors",
              effectiveChecked
                ? "bg-tokyo-green border-tokyo-green text-background"
                : "border-border bg-transparent hover:border-tokyo-green/50",
            )}
            aria-checked={effectiveChecked}
            role="checkbox"
            type="button"
          >
            {effectiveChecked && (
              <svg className="size-3" viewBox="0 0 12 12" fill="none">
                <path
                  d="M2.5 6L5 8.5L9.5 3.5"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            )}
          </button>
        )
      }
      return <input {...props} />
    },
  }
}
