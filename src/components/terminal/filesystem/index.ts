export interface FSNode {
  name: string
  type: "file" | "directory"
  permissions: string
  size: number
  modified: string
  hidden: boolean
  content?: string
  children?: FSNode[]
  executable?: boolean
  link?: string
}

const HOME = "/home/purbayan"

/**
 * Resolve a relative or absolute path against the current working directory.
 * Handles `.`, `..`, `~` → `/home/purbayan`, absolute `/`, trailing slashes.
 */
export function resolvePath(cwd: string, target: string): string {
  if (!target || target === ".") return cwd

  let path = target
  if (path === "~" || path === "~/") return HOME
  if (path.startsWith("~/")) {
    path = HOME + "/" + path.slice(2)
  }

  const parts = path.startsWith("/")
    ? path.split("/")
    : [...cwd.split("/"), ...path.split("/")]

  const resolved: string[] = []
  for (const part of parts) {
    if (part === "" || part === ".") continue
    if (part === "..") {
      resolved.pop()
    } else {
      resolved.push(part)
    }
  }

  return "/" + resolved.join("/")
}

/**
 * Traverse the filesystem tree and return the node at the given absolute path.
 * Returns null if the path doesn't exist.
 */
export function getNode(root: FSNode, absolutePath: string): FSNode | null {
  if (absolutePath === "/") return root

  const parts = absolutePath.split("/").filter(Boolean)
  let current: FSNode = root

  for (const part of parts) {
    if (current.type !== "directory" || !current.children) return null
    const child = current.children.find((c) => c.name === part)
    if (!child) return null
    current = child
  }

  return current
}

export function listChildren(node: FSNode, showHidden: boolean): FSNode[] {
  if (node.type !== "directory" || !node.children) return []
  if (showHidden) return node.children
  return node.children.filter((c) => !c.hidden)
}

export function isDirectory(node: FSNode): boolean {
  return node.type === "directory"
}

export function isFile(node: FSNode): boolean {
  return node.type === "file"
}
