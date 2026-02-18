import { lazy, Suspense } from "react"
import {
  createBrowserRouter,
  RouterProvider,
  isRouteErrorResponse,
  useRouteError,
  Link,
} from "react-router-dom"
import { TooltipProvider } from "@/components/ui/tooltip"
import { Layout } from "@/components/layout"

import HomePage from "@/pages/home"
import AboutPage from "@/pages/about"
import ProjectsPage from "@/pages/projects"
import ProjectPage from "@/pages/project"
import UsesPage from "@/pages/uses"
import ResumePage from "@/pages/resume"
import BlogPage from "@/pages/blog"
import BlogPostPage from "@/pages/blog-post"
import NotFoundPage from "@/pages/not-found"

const TerminalPage = lazy(() => import("@/pages/terminal"))
const VaultPage = lazy(() => import("@/pages/vault"))

function RouteError() {
  const error = useRouteError()
  const message = isRouteErrorResponse(error)
    ? `${error.status} — ${error.statusText}`
    : error instanceof Error
      ? error.message
      : "Unknown error"

  return (
    <div className="min-h-screen flex flex-col items-center justify-center font-mono text-sm px-6">
      <p className="text-muted-foreground">
        <span className="text-red-400">error:</span> {message}
      </p>
      <Link to="/" className="mt-4 text-primary hover:underline">
        → go home
      </Link>
    </div>
  )
}

const router = createBrowserRouter([
  {
    element: <Layout />,
    errorElement: <RouteError />,
    children: [
      { path: "/", element: <HomePage /> },
      { path: "/about", element: <AboutPage /> },
      { path: "/projects", element: <ProjectsPage /> },
      { path: "/projects/:slug", element: <ProjectPage /> },
      { path: "/uses", element: <UsesPage /> },
      { path: "/resume", element: <ResumePage /> },
      { path: "/blog", element: <BlogPage /> },
      { path: "/blog/:slug", element: <BlogPostPage /> },
      { path: "*", element: <NotFoundPage /> },
    ],
  },
  {
    path: "/terminal",
    errorElement: <RouteError />,
    element: (
      <Suspense fallback={null}>
        <TerminalPage />
      </Suspense>
    ),
  },
  {
    path: "/vault/*",
    errorElement: <RouteError />,
    element: (
      <Suspense fallback={null}>
        <VaultPage />
      </Suspense>
    ),
  },
])

export default function App() {
  return (
    <TooltipProvider>
      <RouterProvider router={router} />
    </TooltipProvider>
  )
}
