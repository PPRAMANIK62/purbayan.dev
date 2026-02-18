import { useCallback } from "react"
import type { OutputLine } from "@/components/terminal/terminal-output"
import { registry } from "@/components/terminal/commands/index"
import { ROOT } from "@/components/terminal/filesystem/contents"
import { resolvePath, getNode, listChildren } from "@/components/terminal/filesystem/index"
import { longestCommonPrefix } from "@/lib/terminal-ui"

interface UseTerminalTabCompletionOptions {
  currentDirectory: string
  setInputValue: (value: string) => void
  appendLines: (lines: OutputLine[]) => void
}

export interface UseTerminalTabCompletionReturn {
  handleTab: (partial: string) => void
}

export function useTerminalTabCompletion({
  currentDirectory,
  setInputValue,
  appendLines,
}: UseTerminalTabCompletionOptions): UseTerminalTabCompletionReturn {
  const handleTab = useCallback(
    (partial: string) => {
      if (!partial || partial.trim() === "") return

      const firstSpace = partial.indexOf(" ")

      if (firstSpace === -1) {
        const prefix = partial.toLowerCase()
        const matches = Array.from(registry.keys()).filter((name) =>
          name.startsWith(prefix),
        )

        if (matches.length === 0) return
        if (matches.length === 1) {
          setInputValue(matches[0] + " ")
        } else {
          const common = longestCommonPrefix(matches)
          setInputValue(common)
          appendLines([{ text: matches.join("  "), color: "info" }])
        }
      } else {
        const lastSpaceIndex = partial.lastIndexOf(" ")
        const commandPart = partial.slice(0, lastSpaceIndex + 1)
        const pathPart = partial.slice(lastSpaceIndex + 1)

        if (pathPart === "") return

        const showHidden =
          pathPart.startsWith(".") || pathPart.includes("/.")

        const lastSlashIndex = pathPart.lastIndexOf("/")
        let dirPath: string
        let prefix: string

        if (lastSlashIndex === -1) {
          dirPath = currentDirectory
          prefix = pathPart
        } else {
          const dirPart = pathPart.slice(0, lastSlashIndex + 1)
          prefix = pathPart.slice(lastSlashIndex + 1)
          dirPath = resolvePath(currentDirectory, dirPart)
        }

        const dirNode = getNode(ROOT, dirPath)
        if (!dirNode || dirNode.type !== "directory") return

        const children = listChildren(dirNode, showHidden)
        const matches = children.filter((child) =>
          child.name.startsWith(prefix),
        )

        if (matches.length === 0) return

        if (matches.length === 1) {
          const completedName = matches[0].name
          const suffix = matches[0].type === "directory" ? "/" : " "
          if (lastSlashIndex === -1) {
            setInputValue(commandPart + completedName + suffix)
          } else {
            setInputValue(
              commandPart +
                pathPart.slice(0, lastSlashIndex + 1) +
                completedName +
                suffix,
            )
          }
        } else {
          const matchNames = matches.map((m) => m.name)
          const common = longestCommonPrefix(matchNames)
          if (lastSlashIndex === -1) {
            setInputValue(commandPart + common)
          } else {
            setInputValue(
              commandPart + pathPart.slice(0, lastSlashIndex + 1) + common,
            )
          }
          appendLines([
            {
              text: matches
                .map((m) =>
                  m.type === "directory" ? m.name + "/" : m.name,
                )
                .join("  "),
              color: "info",
            },
          ])
        }
      }
    },
    [currentDirectory, setInputValue, appendLines],
  )

  return { handleTab }
}
