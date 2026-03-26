import type { Dispatch, RefObject, SetStateAction } from "react"
import { useNavigate } from "react-router-dom"
import { FileText, Home } from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar"
import { kebabToTitle, getSavedProgress, type VaultFile } from "@/lib/vault-utils"

interface VaultSidebarProps {
  active: string | null
  groupedFiles: Record<string, VaultFile[]>
  activeBarRef: RefObject<HTMLDivElement | null>
  showShortcutHelp: boolean
  setShowShortcutHelp: Dispatch<SetStateAction<boolean>>
}

export function VaultSidebar({
  active,
  groupedFiles,
  activeBarRef,
  setShowShortcutHelp,
}: VaultSidebarProps) {
  const navigate = useNavigate()

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                isActive={active === null}
                onClick={() => navigate("/vault")}
                className="font-mono"
              >
                <Home className="size-4" />
                <span>Overview</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
        {Object.entries(groupedFiles).map(([category, files]) => (
          <SidebarGroup key={category}>
            <SidebarGroupLabel className="font-mono uppercase tracking-wider">
              {kebabToTitle(category)}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {files.map((f) => {
                  const key = `${f.category}/${f.slug}`
                  return (
                    <SidebarMenuItem key={key}>
                      <SidebarMenuButton
                        isActive={active === key}
                        onClick={() => navigate(`/vault/${key}`)}
                        className="font-mono"
                      >
                        <FileText className="size-4" />
                        <span>{f.label}</span>
                      </SidebarMenuButton>
                      <div className="mx-2 mb-1 h-0.5 bg-muted rounded-full overflow-hidden">
                        <div
                          ref={active === key ? activeBarRef : undefined}
                          className="h-full bg-tokyo-green transition-[width] duration-300"
                          style={{
                            width: `${getSavedProgress(f.category, f.slug)}%`,
                          }}
                        />
                      </div>
                    </SidebarMenuItem>
                  )
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <div className="p-3 border-t border-border">
        <button
          onClick={() => setShowShortcutHelp((prev) => !prev)}
          className="text-xs font-mono text-muted-foreground/50 hover:text-muted-foreground transition-colors"
        >
          ? shortcuts
        </button>
      </div>
    </Sidebar>
  )
}
