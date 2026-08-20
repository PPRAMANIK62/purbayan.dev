import * as React from "react"
import { Command as CommandPrimitive } from "cmdk"
import { SearchIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog"

function Command({ className, ...props }: React.ComponentProps<typeof CommandPrimitive>) {
  return (
    <CommandPrimitive
      data-slot="command"
      className={cn("flex h-full w-full flex-col overflow-hidden text-ink", className)}
      {...props}
    />
  )
}

function CommandDialog({
  title = "Command palette",
  description = "Search pages, projects and writing",
  children,
  className,
  ...props
}: React.ComponentProps<typeof Dialog> & {
  title?: string
  description?: string
  className?: string
}) {
  return (
    <Dialog {...props}>
      <DialogContent
        showCloseButton={false}
        className={cn(
          // Sits above centre — a palette pinned to the middle feels heavy.
          "top-[14vh] max-w-[36rem] translate-y-0 gap-0 overflow-hidden rounded-xl border-line bg-raise p-0",
          "shadow-[0_1px_2px_rgba(0,0,0,0.16),0_24px_56px_-16px_rgba(0,0,0,0.55)]",
          "duration-200 ease-out",
          "data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 data-[state=open]:slide-in-from-top-2",
          "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=closed]:duration-150",
          className,
        )}
      >
        <DialogTitle className="sr-only">{title}</DialogTitle>
        <DialogDescription className="sr-only">{description}</DialogDescription>
        <Command>{children}</Command>
      </DialogContent>
    </Dialog>
  )
}

function CommandInput({
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.Input>) {
  return (
    <div
      data-slot="command-input-wrapper"
      className="flex h-[56px] shrink-0 items-center gap-3 border-b border-line px-4"
    >
      <SearchIcon className="size-[18px] shrink-0 text-faint" />
      <CommandPrimitive.Input
        data-slot="command-input"
        className={cn(
          "h-full w-full bg-transparent text-[15px] text-ink caret-brand outline-none",
          "placeholder:text-faint disabled:cursor-not-allowed disabled:opacity-50",
          className,
        )}
        {...props}
      />
    </div>
  )
}

function CommandList({ className, ...props }: React.ComponentProps<typeof CommandPrimitive.List>) {
  return (
    <CommandPrimitive.List
      data-slot="command-list"
      className={cn(
        "max-h-[min(58vh,400px)] scroll-py-2 overflow-y-auto overflow-x-hidden p-2",
        className,
      )}
      {...props}
    />
  )
}

function CommandEmpty({
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.Empty>) {
  return (
    <CommandPrimitive.Empty
      data-slot="command-empty"
      className={cn("py-12 text-center text-sm", className)}
      {...props}
    />
  )
}

function CommandGroup({
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.Group>) {
  return (
    <CommandPrimitive.Group
      data-slot="command-group"
      className={cn(
        "overflow-hidden text-ink",
        "[&_[cmdk-group-heading]]:label-xs [&_[cmdk-group-heading]]:px-3 [&_[cmdk-group-heading]]:pb-1.5 [&_[cmdk-group-heading]]:pt-4 [&_[cmdk-group-heading]]:text-faint",
        // The first group shouldn't push away from the input.
        "first:[&_[cmdk-group-heading]]:pt-1.5",
        className,
      )}
      {...props}
    />
  )
}

function CommandSeparator({
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.Separator>) {
  return (
    <CommandPrimitive.Separator
      data-slot="command-separator"
      className={cn("my-1 h-px bg-line", className)}
      {...props}
    />
  )
}

function CommandItem({ className, ...props }: React.ComponentProps<typeof CommandPrimitive.Item>) {
  return (
    <CommandPrimitive.Item
      data-slot="command-item"
      className={cn(
        "relative flex h-10 cursor-default select-none items-center gap-3 rounded-lg px-3 text-sm outline-none",
        "text-dim transition-colors duration-100",
        // Selected: a subtle surface plus an accent rail. Never a flooded accent.
        "data-[selected=true]:bg-sink data-[selected=true]:text-ink",
        "before:absolute before:left-0 before:top-1/2 before:h-4 before:w-[2px] before:-translate-y-1/2 before:rounded-full before:bg-brand before:opacity-0 before:transition-opacity before:duration-100",
        "data-[selected=true]:before:opacity-100",
        "data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50",
        "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        "[&_svg]:text-faint data-[selected=true]:[&_svg]:text-brand",
        className,
      )}
      {...props}
    />
  )
}

/** Right-aligned meta on an item — language, reading time, "External". */
function CommandMeta({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="command-meta"
      className={cn("ml-auto shrink-0 pl-3 text-[11.5px] tabular-nums text-faint", className)}
      {...props}
    />
  )
}

function CommandShortcut({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="command-shortcut"
      className={cn("ml-auto text-xs tracking-widest text-faint", className)}
      {...props}
    />
  )
}

/** Keyboard-hint bar pinned under the list. */
function CommandFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="command-footer"
      className={cn(
        "flex shrink-0 items-center gap-4 border-t border-line bg-sink/60 px-4 py-2.5 text-[11px] text-faint",
        className,
      )}
      {...props}
    />
  )
}

function CommandKey({ className, ...props }: React.ComponentProps<"kbd">) {
  return (
    <kbd
      className={cn(
        "inline-flex h-[18px] min-w-[18px] items-center justify-center rounded border border-line px-1 font-sans text-[10px] text-dim",
        className,
      )}
      {...props}
    />
  )
}

export {
  Command,
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandMeta,
  CommandShortcut,
  CommandSeparator,
  CommandFooter,
  CommandKey,
}
