import { useState, useEffect, useCallback, type ComponentPropsWithoutRef } from "react"
import Markdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { motion, AnimatePresence } from "motion/react"
import { Lock, FileText } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar"

const vaultModules = import.meta.glob("/src/content/vault/*.md", {
  eager: true,
  query: "?raw",
  import: "default",
}) as Record<string, string>

interface VaultFile {
  slug: string
  label: string
  content: string
}

function kebabToTitle(s: string): string {
  return s
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ")
}

const vaultFiles: VaultFile[] = Object.entries(vaultModules)
  .map(([path, content]) => {
    const slug = path.split("/").pop()!.replace(/\.md$/, "")
    return { slug, label: kebabToTitle(slug), content: content as string }
  })
  .sort((a, b) => a.label.localeCompare(b.label))

const EXPECTED_HASH =
  "d714f4049edd6ea4291f2adf7ca5527ec025aaa588b34d4d87533e81f0295bd3"
const SESSION_KEY = "vault-unlocked"

async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder()
  const data = encoder.encode(password)
  const buffer = await crypto.subtle.digest("SHA-256", data)
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("")
}

function mdComponents(): Record<string, React.ComponentType<ComponentPropsWithoutRef<any>>> {
  return {
    h1: ({ children, ...props }: ComponentPropsWithoutRef<"h1">) => (
      <h1
        className="text-4xl font-mono font-bold mt-10 mb-6 flex items-baseline"
        {...props}
      >
        <span className="text-primary mr-2">&gt;</span>
        {children}
      </h1>
    ),
    h2: ({ children, ...props }: ComponentPropsWithoutRef<"h2">) => (
      <h2
        className="text-2xl font-mono font-semibold mt-10 mb-4 flex items-baseline text-tokyo-magenta"
        {...props}
      >
        <span className="text-tokyo-magenta mr-2">&gt;</span>
        {children}
      </h2>
    ),
    h3: ({ children, ...props }: ComponentPropsWithoutRef<"h3">) => (
      <h3
        className="text-xl font-mono font-semibold mt-8 mb-3 text-tokyo-cyan"
        {...props}
      >
        {children}
      </h3>
    ),
    h4: ({ children, ...props }: ComponentPropsWithoutRef<"h4">) => (
      <h4
        className="text-lg font-mono font-medium mt-6 mb-2 text-tokyo-yellow"
        {...props}
      >
        {children}
      </h4>
    ),
    p: ({ children, ...props }: ComponentPropsWithoutRef<"p">) => (
      <p
        className="text-base text-secondary-foreground leading-relaxed mb-4"
        {...props}
      >
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
    blockquote: ({ children, ...props }: ComponentPropsWithoutRef<"blockquote">) => (
      <blockquote
        className="border-l-2 border-tokyo-teal bg-muted/30 pl-4 py-3 my-6 rounded-r-lg"
        {...props}
      >
        {children}
      </blockquote>
    ),
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
    li: ({ children, ...props }: ComponentPropsWithoutRef<"li">) => (
      <li
        className="text-base text-secondary-foreground leading-relaxed flex items-start"
        {...props}
      >
        <span className="text-tokyo-green mr-2 mt-0.5 shrink-0">-</span>
        <span className="flex-1">{children}</span>
      </li>
    ),
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
      <th
        className="px-4 py-3 text-left text-primary font-semibold"
        {...props}
      >
        {children}
      </th>
    ),
    td: ({ children, ...props }: ComponentPropsWithoutRef<"td">) => (
      <td
        className="px-4 py-2.5 text-secondary-foreground border-t border-border/50"
        {...props}
      >
        {children}
      </td>
    ),
    tr: ({ children, ...props }: ComponentPropsWithoutRef<"tr">) => (
      <tr className="even:bg-muted/20" {...props}>
        {children}
      </tr>
    ),
    hr: ({ ...props }: ComponentPropsWithoutRef<"hr">) => (
      <hr className="border-none h-px bg-gradient-to-r from-border via-primary/30 to-border my-10" {...props} />
    ),
    input: ({ ...props }: ComponentPropsWithoutRef<"input">) => (
      <input
        className="mr-2 accent-primary"
        disabled
        {...props}
      />
    ),
  }
}

function PasswordGate({ onUnlock }: { onUnlock: () => void }) {
  const [password, setPassword] = useState("")
  const [error, setError] = useState(false)
  const [checking, setChecking] = useState(false)

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault()
      if (checking || !password.trim()) return
      setChecking(true)
      setError(false)

      const hashed = await hashPassword(password)
      if (hashed === EXPECTED_HASH) {
        sessionStorage.setItem(SESSION_KEY, "true")
        onUnlock()
      } else {
        setError(true)
        setPassword("")
        setTimeout(() => setError(false), 1500)
      }
      setChecking(false)
    },
    [password, checking, onUnlock]
  )

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="w-full max-w-sm"
      >
        <form onSubmit={handleSubmit} className="flex flex-col items-center gap-6">
          <motion.div
            animate={error ? { x: [0, -8, 8, -6, 6, -3, 3, 0] } : {}}
            transition={{ duration: 0.4 }}
          >
            <Lock
              className={cn(
                "size-8 transition-colors duration-300",
                error ? "text-destructive" : "text-muted-foreground"
              )}
            />
          </motion.div>

          <div className="w-full relative">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="password"
              autoFocus
              className={cn(
                "w-full bg-muted/50 border rounded-lg px-4 py-3",
                "font-mono text-sm text-foreground placeholder:text-muted-foreground",
                "outline-none transition-all duration-300",
                "focus:border-primary focus:ring-1 focus:ring-primary/30",
                error
                  ? "border-destructive ring-1 ring-destructive/30"
                  : "border-border"
              )}
            />
            <AnimatePresence>
              {error && (
                <motion.p
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="absolute -bottom-6 left-0 text-xs font-mono text-destructive"
                >
                  wrong password
                </motion.p>
              )}
            </AnimatePresence>
          </div>

          <p className="text-xs font-mono text-muted-foreground/60 select-none">
            this is a private space
          </p>
        </form>
      </motion.div>
    </div>
  )
}



function VaultViewer() {
  const [active, setActive] = useState(() => vaultFiles[0]?.slug ?? "")
  const activeFile = vaultFiles.find((f) => f.slug === active)
  const components = mdComponents()

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel className="font-mono uppercase tracking-wider">
              Roadmaps
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {vaultFiles.map((f) => (
                  <SidebarMenuItem key={f.slug}>
                    <SidebarMenuButton
                      isActive={active === f.slug}
                      onClick={() => setActive(f.slug)}
                      className="font-mono"
                    >
                      <FileText className="size-4" />
                      <span>{f.label}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
      <SidebarInset>
        <header className="md:hidden flex items-center gap-2 p-4 border-b border-border">
          <SidebarTrigger />
          <span className="font-mono text-sm text-muted-foreground">
            {activeFile?.label}
          </span>
        </header>
        <div className="flex-1 overflow-y-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="max-w-6xl mx-auto px-6 md:px-10 py-10 md:py-14"
            >
              {activeFile ? (
                <Markdown remarkPlugins={[remarkGfm]} components={components}>
                  {activeFile.content}
                </Markdown>
              ) : (
                <p className="text-muted-foreground font-mono">No files found.</p>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}

export default function VaultPage() {
  const [unlocked, setUnlocked] = useState(
    () => sessionStorage.getItem(SESSION_KEY) === "true"
  )

  useEffect(() => {
    const stored = sessionStorage.getItem(SESSION_KEY) === "true"
    if (stored !== unlocked) setUnlocked(stored)
  }, [])

  return (
    <AnimatePresence mode="wait">
      {unlocked ? (
        <motion.div
          key="viewer"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
        >
          <VaultViewer />
        </motion.div>
      ) : (
        <motion.div
          key="gate"
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 0.3 }}
        >
          <PasswordGate onUnlock={() => setUnlocked(true)} />
        </motion.div>
      )}
    </AnimatePresence>
  )
}
