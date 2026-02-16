import { Component } from "react"
import { Link } from "react-router-dom"
import type { ErrorInfo, ReactNode } from "react"

interface ErrorBoundaryProps {
  children: ReactNode
  resetKey?: string
}

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error("[ErrorBoundary]", error, errorInfo)
  }

  componentDidUpdate(prevProps: ErrorBoundaryProps): void {
    if (
      this.state.hasError &&
      prevProps.resetKey !== this.props.resetKey
    ) {
      this.setState({ hasError: false, error: null })
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[calc(100vh-4rem)] flex flex-col items-start justify-center max-w-3xl mx-auto px-6">
          <div className="font-mono text-sm leading-relaxed">
            <span className="text-tokyo-green">$ </span>
            <span className="text-foreground">./render --page</span>
          </div>

          <div className="font-mono text-sm leading-relaxed mt-1">
            <span className="text-tokyo-red">
              Segmentation fault (core dumped)
            </span>
          </div>

          {this.state.error?.message && (
            <div className="font-mono text-sm leading-relaxed mt-3">
              <span className="text-muted-foreground">
                {">"} {this.state.error.message}
              </span>
            </div>
          )}

          <div className="font-mono text-sm leading-relaxed mt-6">
            <span className="text-tokyo-green">$ </span>
            <span className="text-muted-foreground">
              something broke. you can retry or bail out.
            </span>
          </div>

          <div className="mt-8 flex items-center gap-6">
            <button
              type="button"
              onClick={() => this.setState({ hasError: false, error: null })}
              className="font-mono text-sm text-primary hover:underline cursor-pointer"
            >
              ↻ retry
            </button>
            <Link
              to="/"
              className="font-mono text-sm text-primary hover:underline"
            >
              → go home
            </Link>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
