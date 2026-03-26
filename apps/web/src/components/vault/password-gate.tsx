import { useState, useCallback } from "react"
import { motion, AnimatePresence } from "motion/react"
import { Lock } from "lucide-react"
import { cn } from "@/lib/utils"
import { hashPassword } from "@/lib/vault-utils"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"

const EXPECTED_HASH = "d714f4049edd6ea4291f2adf7ca5527ec025aaa588b34d4d87533e81f0295bd3"
export const SESSION_KEY = "vault-unlocked"

interface PasswordGateProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onUnlock: () => void
}

export function PasswordGate({ open, onOpenChange, onUnlock }: PasswordGateProps) {
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
        onOpenChange(false)
      } else {
        setError(true)
        setPassword("")
        setTimeout(() => setError(false), 1500)
      }
      setChecking(false)
    },
    [password, checking, onUnlock, onOpenChange],
  )

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent showCloseButton={false} className="max-w-sm">
        <DialogTitle className="sr-only">Unlock Vault</DialogTitle>
        <form onSubmit={handleSubmit} className="flex flex-col items-center gap-6">
          <motion.div
            animate={error ? { x: [0, -8, 8, -6, 6, -3, 3, 0] } : {}}
            transition={{ duration: 0.4 }}
          >
            <Lock
              className={cn(
                "size-8 transition-colors duration-300",
                error ? "text-destructive" : "text-muted-foreground",
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
                error ? "border-destructive ring-1 ring-destructive/30" : "border-border",
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
      </DialogContent>
    </Dialog>
  )
}
