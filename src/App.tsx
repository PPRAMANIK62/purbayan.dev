import { createBrowserRouter, RouterProvider } from "react-router-dom"
import { TooltipProvider } from "@/components/ui/tooltip"

import HomePage from "@/pages/home"
import AboutPage from "@/pages/about"
import ProjectsPage from "@/pages/projects"
import ProjectPage from "@/pages/project"
import UsesPage from "@/pages/uses"
import BlogPage from "@/pages/blog"
import BlogPostPage from "@/pages/blog-post"
import NotFoundPage from "@/pages/not-found"

const router = createBrowserRouter([
  { path: "/", Component: HomePage },
  { path: "/about", Component: AboutPage },
  { path: "/projects", Component: ProjectsPage },
  { path: "/projects/:slug", Component: ProjectPage },
  { path: "/uses", Component: UsesPage },
  { path: "/blog", Component: BlogPage },
  { path: "/blog/:slug", Component: BlogPostPage },
  { path: "*", Component: NotFoundPage },
])

export default function App() {
  return (
    <TooltipProvider>
      <RouterProvider router={router} />
    </TooltipProvider>
  )
}
