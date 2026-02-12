import { createBrowserRouter, RouterProvider } from "react-router-dom"
import { TooltipProvider } from "@/components/ui/tooltip"
import { Layout } from "@/components/layout"

import HomePage from "@/pages/home"
import AboutPage from "@/pages/about"
import ProjectsPage from "@/pages/projects"
import ProjectPage from "@/pages/project"
import UsesPage from "@/pages/uses"
import BlogPage from "@/pages/blog"
import BlogPostPage from "@/pages/blog-post"
import NotFoundPage from "@/pages/not-found"

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      { path: "/", element: <HomePage /> },
      { path: "/about", element: <AboutPage /> },
      { path: "/projects", element: <ProjectsPage /> },
      { path: "/projects/:slug", element: <ProjectPage /> },
      { path: "/uses", element: <UsesPage /> },
      { path: "/blog", element: <BlogPage /> },
      { path: "/blog/:slug", element: <BlogPostPage /> },
      { path: "*", element: <NotFoundPage /> },
    ],
  },
])

export default function App() {
  return (
    <TooltipProvider>
      <RouterProvider router={router} />
    </TooltipProvider>
  )
}
