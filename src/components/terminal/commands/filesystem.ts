import { registerCommand, type CommandContext, type CommandResult } from "./index"
import { ROOT } from "../filesystem/contents"
import {
  resolvePath,
  getNode,
  listChildren,
  isDirectory,
  isFile,
  type FSNode,
} from "../filesystem/index"
import type { OutputLine } from "../terminal-output"

// ---------------------------------------------------------------------------
// Module-level state for `cd -`
// ---------------------------------------------------------------------------

let previousDir: string | null = null

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function nodeColor(node: FSNode): OutputLine["color"] {
  if (isDirectory(node)) return "info"
  if (node.executable) return "success"
  if (node.hidden) return "muted"
  return "default"
}

function sortNodes(nodes: FSNode[]): FSNode[] {
  const dirs = nodes.filter(isDirectory).sort((a, b) => a.name.localeCompare(b.name))
  const files = nodes.filter(isFile).sort((a, b) => a.name.localeCompare(b.name))
  return [...dirs, ...files]
}

function resolveFileArg(cwd: string, arg: string): FSNode | null {
  const path = resolvePath(cwd, arg)
  return getNode(ROOT, path)
}

// ---------------------------------------------------------------------------
// ls
// ---------------------------------------------------------------------------

function lsCommand(args: string[], ctx: CommandContext): CommandResult {
  const lines: OutputLine[] = []

  let showHidden = false
  let longFormat = false
  let targetPath: string | undefined

  for (const arg of args) {
    if (arg === "-a") {
      showHidden = true
    } else if (arg === "-l") {
      longFormat = true
    } else if (arg === "-la" || arg === "-al") {
      showHidden = true
      longFormat = true
    } else if (!arg.startsWith("-")) {
      targetPath = arg
    }
  }

  const resolvedPath = targetPath ? resolvePath(ctx.cwd, targetPath) : ctx.cwd
  const dirNode = getNode(ROOT, resolvedPath)

  if (!dirNode) {
    return { lines: [{ text: `ls: cannot access '${targetPath ?? ctx.cwd}': No such file or directory`, color: "error" }] }
  }

  if (!isDirectory(dirNode)) {
    if (longFormat) {
      lines.push({ text: `${dirNode.permissions}  ${String(dirNode.size).padStart(6)}  ${dirNode.modified}  ${dirNode.name}`, color: nodeColor(dirNode) })
    } else {
      lines.push({ text: dirNode.name, color: nodeColor(dirNode) })
    }
    return { lines }
  }

  const children = sortNodes(listChildren(dirNode, showHidden))

  if (showHidden) {
    const dotEntries: { name: string; color: OutputLine["color"]; permissions: string; size: number; modified: string }[] = [
      { name: ".", color: "info", permissions: "drwxr-xr-x", size: 4096, modified: dirNode.modified },
      { name: "..", color: "info", permissions: "drwxr-xr-x", size: 4096, modified: dirNode.modified },
    ]

    if (longFormat) {
      const allEntries = [
        ...dotEntries.map((d) => ({ permissions: d.permissions, size: d.size, modified: d.modified, name: d.name, color: d.color })),
        ...children.map((c) => ({ permissions: c.permissions, size: c.size, modified: c.modified, name: c.name, color: nodeColor(c) })),
      ]

      const maxSizeLen = Math.max(...allEntries.map((e) => String(e.size).length))

      for (const entry of allEntries) {
        lines.push({
          text: `${entry.permissions}  ${String(entry.size).padStart(maxSizeLen)}  ${entry.modified}  ${entry.name}`,
          color: entry.color,
        })
      }
    } else {
      for (const d of dotEntries) {
        lines.push({ text: d.name, color: d.color })
      }
      for (const child of children) {
        lines.push({ text: child.name, color: nodeColor(child) })
      }
    }
  } else {
    if (longFormat) {
      const maxSizeLen = children.length > 0 ? Math.max(...children.map((c) => String(c.size).length)) : 1

      for (const child of children) {
        lines.push({
          text: `${child.permissions}  ${String(child.size).padStart(maxSizeLen)}  ${child.modified}  ${child.name}`,
          color: nodeColor(child),
        })
      }
    } else {
      for (const child of children) {
        lines.push({ text: child.name, color: nodeColor(child) })
      }
    }
  }

  return { lines }
}

// ---------------------------------------------------------------------------
// cd
// ---------------------------------------------------------------------------

function cdCommand(args: string[], ctx: CommandContext): CommandResult {
  const target = args[0]

  if (!target || target === "~") {
    const home = "/home/purbayan"
    previousDir = ctx.cwd
    ctx.setCwd(home)
    return { lines: [] }
  }

  if (target === "-") {
    if (!previousDir) {
      return { lines: [{ text: "cd: OLDPWD not set", color: "error" }] }
    }
    const dest = previousDir
    previousDir = ctx.cwd
    ctx.setCwd(dest)
    return { lines: [{ text: dest, color: "default" }] }
  }

  const resolvedPath = resolvePath(ctx.cwd, target)
  const node = getNode(ROOT, resolvedPath)

  if (!node) {
    return { lines: [{ text: `cd: ${target}: No such file or directory`, color: "error" }] }
  }

  if (!isDirectory(node)) {
    return { lines: [{ text: `cd: ${target}: Not a directory`, color: "error" }] }
  }

  previousDir = ctx.cwd
  ctx.setCwd(resolvedPath)
  return { lines: [] }
}

// ---------------------------------------------------------------------------
// cat
// ---------------------------------------------------------------------------

function catCommand(args: string[], ctx: CommandContext): CommandResult {
  if (args.length === 0) {
    return { lines: [{ text: "cat: missing operand", color: "error" }] }
  }

  const lines: OutputLine[] = []

  for (const arg of args) {
    const node = resolveFileArg(ctx.cwd, arg)

    if (!node) {
      lines.push({ text: `cat: ${arg}: No such file or directory`, color: "error" })
      continue
    }

    if (isDirectory(node)) {
      lines.push({ text: `cat: ${arg}: Is a directory`, color: "error" })
      continue
    }

    const content = node.content ?? ""
    const contentLines = content.split("\n")
    for (const contentLine of contentLines) {
      lines.push({ text: contentLine, color: "default" })
    }
  }

  return { lines }
}

// ---------------------------------------------------------------------------
// pwd
// ---------------------------------------------------------------------------

function pwdCommand(_args: string[], ctx: CommandContext): CommandResult {
  return { lines: [{ text: ctx.cwd, color: "default" }] }
}

// ---------------------------------------------------------------------------
// tree
// ---------------------------------------------------------------------------

function treeCommand(args: string[], ctx: CommandContext): CommandResult {
  const targetPath = args[0] ? resolvePath(ctx.cwd, args[0]) : ctx.cwd
  const rootNode = getNode(ROOT, targetPath)

  if (!rootNode) {
    return { lines: [{ text: `tree: '${args[0] ?? ctx.cwd}': No such file or directory`, color: "error" }] }
  }

  if (!isDirectory(rootNode)) {
    return { lines: [{ text: `tree: '${args[0] ?? ctx.cwd}': Not a directory`, color: "error" }] }
  }

  const lines: OutputLine[] = []
  let dirCount = 0
  let fileCount = 0

  lines.push({ text: targetPath, color: "info" })

  function buildTree(node: FSNode, prefix: string, depth: number): void {
    if (depth > 3) return

    const children = sortNodes(listChildren(node, false))

    for (let i = 0; i < children.length; i++) {
      const child = children[i]
      const isLast = i === children.length - 1
      const connector = isLast ? "└── " : "├── "

      if (isDirectory(child)) {
        dirCount++
      } else {
        fileCount++
      }

      lines.push({
        text: prefix + connector + child.name,
        color: nodeColor(child),
      })

      if (isDirectory(child) && depth < 3) {
        const childPrefix = prefix + (isLast ? "    " : "│   ")
        buildTree(child, childPrefix, depth + 1)
      }
    }
  }

  buildTree(rootNode, "", 1)

  lines.push({
    text: `\n${dirCount} director${dirCount === 1 ? "y" : "ies"}, ${fileCount} file${fileCount === 1 ? "" : "s"}`,
    color: "muted",
  })

  return { lines }
}

// ---------------------------------------------------------------------------
// grep
// ---------------------------------------------------------------------------

function grepCommand(args: string[], ctx: CommandContext): CommandResult {
  if (args.length < 2) {
    return { lines: [{ text: "grep: missing operand", color: "error" }] }
  }

  const lines: OutputLine[] = []
  let recursive = false
  const filteredArgs: string[] = []

  for (const arg of args) {
    if (arg === "-r" || arg === "-R") {
      recursive = true
    } else {
      filteredArgs.push(arg)
    }
  }

  if (filteredArgs.length < 2) {
    return { lines: [{ text: "grep: missing operand", color: "error" }] }
  }

  const pattern = filteredArgs[0].toLowerCase()
  const target = filteredArgs[1]

  const resolvedPath = resolvePath(ctx.cwd, target)
  const node = getNode(ROOT, resolvedPath)

  if (!node) {
    return { lines: [{ text: `grep: ${target}: No such file or directory`, color: "error" }] }
  }

  if (recursive && isDirectory(node)) {
    function searchDir(dirNode: FSNode, dirPath: string): void {
      const children = listChildren(dirNode, false)
      for (const child of children) {
        const childPath = dirPath === "/" ? `/${child.name}` : `${dirPath}/${child.name}`
        if (isFile(child) && child.content) {
          const contentLines = child.content.split("\n")
          for (const line of contentLines) {
            if (line.toLowerCase().includes(pattern)) {
              lines.push({ text: `${childPath}:${line}`, color: "default" })
            }
          }
        } else if (isDirectory(child)) {
          searchDir(child, childPath)
        }
      }
    }

    searchDir(node, resolvedPath)
  } else if (isFile(node)) {
    const content = node.content ?? ""
    const contentLines = content.split("\n")
    for (const line of contentLines) {
      if (line.toLowerCase().includes(pattern)) {
        lines.push({ text: line, color: "default" })
      }
    }
  } else if (isDirectory(node)) {
    return { lines: [{ text: `grep: ${target}: Is a directory`, color: "error" }] }
  }

  if (lines.length === 0) {
    return { lines: [] }
  }

  return { lines }
}

// ---------------------------------------------------------------------------
// find
// ---------------------------------------------------------------------------

function findCommand(args: string[], ctx: CommandContext): CommandResult {
  if (args.length < 3 || args[1] !== "-name") {
    return { lines: [{ text: "Usage: find <dir> -name <pattern>", color: "error" }] }
  }

  const targetDir = args[0]
  const pattern = args[2]

  const resolvedPath = resolvePath(ctx.cwd, targetDir)
  const dirNode = getNode(ROOT, resolvedPath)

  if (!dirNode) {
    return { lines: [{ text: `find: '${targetDir}': No such file or directory`, color: "error" }] }
  }

  if (!isDirectory(dirNode)) {
    return { lines: [{ text: `find: '${targetDir}': Not a directory`, color: "error" }] }
  }

  // Convert glob pattern (with *) to regex
  const regexStr = "^" + pattern.replace(/\./g, "\\.").replace(/\*/g, ".*") + "$"
  const regex = new RegExp(regexStr, "i")

  const lines: OutputLine[] = []

  function search(node: FSNode, currentPath: string): void {
    const children = listChildren(node, true)
    for (const child of children) {
      const childPath = currentPath === "/" ? `/${child.name}` : `${currentPath}/${child.name}`
      if (regex.test(child.name)) {
        lines.push({ text: childPath, color: isDirectory(child) ? "info" : "default" })
      }
      if (isDirectory(child)) {
        search(child, childPath)
      }
    }
  }

  search(dirNode, resolvedPath)
  return { lines }
}

// ---------------------------------------------------------------------------
// head / tail shared helper
// ---------------------------------------------------------------------------

function sliceFileCommand(
  name: "head" | "tail",
  args: string[],
  ctx: CommandContext,
): CommandResult {
  let numLines = 10
  let filePath: string | undefined

  for (let i = 0; i < args.length; i++) {
    if (args[i] === "-n" && i + 1 < args.length) {
      numLines = parseInt(args[i + 1], 10)
      if (isNaN(numLines) || numLines < 0) numLines = 10
      i++
    } else if (!args[i].startsWith("-")) {
      filePath = args[i]
    }
  }

  if (!filePath) {
    return { lines: [{ text: `${name}: missing operand`, color: "error" }] }
  }

  const node = resolveFileArg(ctx.cwd, filePath)

  if (!node) {
    return { lines: [{ text: `${name}: ${filePath}: No such file or directory`, color: "error" }] }
  }

  if (isDirectory(node)) {
    return { lines: [{ text: `${name}: ${filePath}: Is a directory`, color: "error" }] }
  }

  const content = node.content ?? ""
  const contentLines = content.split("\n")
  const sliced = name === "head" ? contentLines.slice(0, numLines) : contentLines.slice(-numLines)

  return { lines: sliced.map((l: string) => ({ text: l, color: "default" as const })) }
}

// ---------------------------------------------------------------------------
// head
// ---------------------------------------------------------------------------

function headCommand(args: string[], ctx: CommandContext): CommandResult {
  return sliceFileCommand("head", args, ctx)
}

// ---------------------------------------------------------------------------
// tail
// ---------------------------------------------------------------------------

function tailCommand(args: string[], ctx: CommandContext): CommandResult {
  return sliceFileCommand("tail", args, ctx)
}

// ---------------------------------------------------------------------------
// wc
// ---------------------------------------------------------------------------

function wcCommand(args: string[], ctx: CommandContext): CommandResult {
  if (args.length === 0) {
    return { lines: [{ text: "wc: missing operand", color: "error" }] }
  }

  const lines: OutputLine[] = []

  for (const arg of args) {
    const node = resolveFileArg(ctx.cwd, arg)

    if (!node) {
      lines.push({ text: `wc: ${arg}: No such file or directory`, color: "error" })
      continue
    }

    if (isDirectory(node)) {
      lines.push({ text: `wc: ${arg}: Is a directory`, color: "error" })
      continue
    }

    const content = node.content ?? ""
    const lineCount = content.split("\n").length
    const wordCount = content.split(/\s+/).filter((w: string) => w.length > 0).length
    const charCount = content.length

    lines.push({
      text: `  ${String(lineCount).padStart(6)}  ${String(wordCount).padStart(6)}  ${String(charCount).padStart(6)}  ${arg}`,
      color: "default",
    })
  }

  return { lines }
}

// ---------------------------------------------------------------------------
// file
// ---------------------------------------------------------------------------

function fileCommand(args: string[], ctx: CommandContext): CommandResult {
  if (args.length === 0) {
    return { lines: [{ text: "file: missing operand", color: "error" }] }
  }

  const lines: OutputLine[] = []

  for (const arg of args) {
    const node = resolveFileArg(ctx.cwd, arg)

    if (!node) {
      lines.push({ text: `file: ${arg}: No such file or directory`, color: "error" })
      continue
    }

    if (isDirectory(node)) {
      lines.push({ text: `${arg}: directory`, color: "default" })
      continue
    }

    if (node.executable) {
      lines.push({ text: `${arg}: executable script`, color: "default" })
      continue
    }

    const ext = node.name.includes(".") ? node.name.slice(node.name.lastIndexOf(".")) : ""
    let fileType: string

    switch (ext) {
      case ".rs":
        fileType = "Rust source"
        break
      case ".ts":
      case ".tsx":
        fileType = "TypeScript source"
        break
      case ".js":
      case ".jsx":
        fileType = "JavaScript source"
        break
      case ".md":
        fileType = "Markdown document"
        break
      case ".json":
      case ".jsonc":
        fileType = "JSON data"
        break
      case ".toml":
        fileType = "TOML configuration"
        break
      case ".conf":
        fileType = "configuration file"
        break
      case ".txt":
        fileType = "ASCII text"
        break
      case ".h":
        fileType = "C header"
        break
      case ".sh":
        fileType = "shell script"
        break
      case ".env":
        fileType = "environment file"
        break
      default:
        fileType = "data"
        break
    }

    lines.push({ text: `${arg}: ${fileType}`, color: "default" })
  }

  return { lines }
}

// ---------------------------------------------------------------------------
// Registration
// ---------------------------------------------------------------------------

registerCommand("ls", lsCommand, "List directory contents", "ls [-a] [-l] [directory]")
registerCommand("cd", cdCommand, "Change directory", "cd [directory]")
registerCommand("cat", catCommand, "Display file contents", "cat <file> [file2...]")
registerCommand("pwd", pwdCommand, "Print working directory", "pwd")
registerCommand("tree", treeCommand, "Display directory tree", "tree [directory]")
registerCommand("grep", grepCommand, "Search file contents", "grep [-r] <pattern> <file|dir>")
registerCommand("find", findCommand, "Find files by name", "find <dir> -name <pattern>")
registerCommand("head", headCommand, "Display first lines of file", "head [-n count] <file>")
registerCommand("tail", tailCommand, "Display last lines of file", "tail [-n count] <file>")
registerCommand("wc", wcCommand, "Word, line, and character count", "wc <file>")
registerCommand("file", fileCommand, "Determine file type", "file <file>")
