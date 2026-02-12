import { Link } from "react-router-dom"

export default function NotFoundPage() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-4">
      <h1 className="text-6xl font-mono font-bold text-tokyo-red">404</h1>
      <p className="text-muted-foreground">Page not found</p>
      <Link
        to="/"
        className="text-primary underline underline-offset-4 hover:text-tokyo-cyan transition-colors"
      >
        Go home
      </Link>
    </div>
  )
}
