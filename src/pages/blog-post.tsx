import { useParams } from "react-router-dom"

export default function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>()

  return (
    <div className="flex min-h-svh flex-col items-center justify-center">
      <h1 className="text-4xl font-mono font-bold text-primary">
        Blog Post: {slug}
      </h1>
    </div>
  )
}
