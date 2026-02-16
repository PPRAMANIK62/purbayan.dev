import { lazy, Suspense } from "react"
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import { TooltipProvider } from "@/components/ui/tooltip"
import { Layout } from "@/components/layout"

const HomePage = lazy(() => import("@/pages/home"))
const AboutPage = lazy(() => import("@/pages/about"))
const ProjectsPage = lazy(() => import("@/pages/projects"))
const ProjectPage = lazy(() => import("@/pages/project"))
const UsesPage = lazy(() => import("@/pages/uses"))
const ResumePage = lazy(() => import("@/pages/resume"))
const BlogPage = lazy(() => import("@/pages/blog"))
const BlogPostPage = lazy(() => import("@/pages/blog-post"))
const NotFoundPage = lazy(() => import("@/pages/not-found"))
const TerminalPage = lazy(() => import("@/pages/terminal"))

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      { path: "/", element: <Suspense fallback={null}><HomePage /></Suspense> },
      { path: "/about", element: <Suspense fallback={null}><AboutPage /></Suspense> },
      { path: "/projects", element: <Suspense fallback={null}><ProjectsPage /></Suspense> },
      { path: "/projects/:slug", element: <Suspense fallback={null}><ProjectPage /></Suspense> },
      { path: "/uses", element: <Suspense fallback={null}><UsesPage /></Suspense> },
      { path: "/resume", element: <Suspense fallback={null}><ResumePage /></Suspense> },
      { path: "/blog", element: <Suspense fallback={null}><BlogPage /></Suspense> },
      { path: "/blog/:slug", element: <Suspense fallback={null}><BlogPostPage /></Suspense> },
      { path: "*", element: <Suspense fallback={null}><NotFoundPage /></Suspense> },
    ],
  },
  {
    path: "/terminal",
    element: (
      <Suspense fallback={null}>
        <TerminalPage />
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
