import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
  isRouteErrorResponse,
  useRouteError,
  Link,
} from "react-router-dom"
import { Layout } from "@/components/layout"

import HomePage from "@/pages/home"
import ProjectPage from "@/pages/project"
import UsesPage from "@/pages/uses"
import ResumePage from "@/pages/resume"
import BlogPage from "@/pages/blog"
import BlogPostPage from "@/pages/blog-post"
import NotFoundPage from "@/pages/not-found"

function RouteError() {
  const error = useRouteError()
  const message = isRouteErrorResponse(error)
    ? `${error.status} — ${error.statusText}`
    : error instanceof Error
      ? error.message
      : "Unknown error"

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <p className="text-dim">
        <span className="text-[var(--c-destructive)]">Error:</span> {message}
      </p>
      <Link to="/" className="mt-4 text-brand hover:underline">
        Go home
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
      { path: "/projects/:slug", element: <ProjectPage /> },
      { path: "/blog", element: <BlogPage /> },
      { path: "/blog/:slug", element: <BlogPostPage /> },
      { path: "/uses", element: <UsesPage /> },
      { path: "/resume", element: <ResumePage /> },

      // Folded into the home page — keep old links working.
      { path: "/about", element: <Navigate to="/" replace /> },
      { path: "/experience", element: <Navigate to="/#work" replace /> },
      { path: "/projects", element: <Navigate to="/#projects" replace /> },

      { path: "*", element: <NotFoundPage /> },
    ],
  },
])

export default function App() {
  return <RouterProvider router={router} />
}
