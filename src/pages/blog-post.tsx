import { useParams, Link } from "react-router-dom"
import { blogPosts } from "@/data/blog"
import { FadeUp } from "@/components/fade-up"
import { Badge } from "@/components/ui/badge"
import { PageContainer } from "@/components/page-container"
import { usePageMeta } from "@/hooks/use-page-meta"
import { renderBlock } from "@/lib/blog-rendering"

export default function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>()
  const post = blogPosts.find((p) => p.slug === slug)

  usePageMeta({
    title: post?.title ?? "Not Found",
    description: post?.summary ?? "Post not found.",
  })

  if (!post) {
    return (
      <PageContainer className="text-center">
        <p className="text-muted-foreground font-mono">Post not found.</p>
        <Link to="/blog" className="text-primary font-mono hover:underline">
          → back to blog
        </Link>
      </PageContainer>
    )
  }

  return (
    <PageContainer>
      <div className="space-y-16">
        {/* Header */}
        <FadeUp>
          <div>
            <h1 className="text-4xl font-mono font-bold">{post.title}</h1>

            <div className="flex items-center gap-4 mt-3">
              <span className="text-muted-foreground font-mono text-sm">
                {post.date}
              </span>
              <span className="text-muted-foreground font-mono text-sm">
                {post.readingTime}
              </span>
            </div>

            <div className="flex flex-wrap gap-2 mt-4">
              {post.tags.map((tag) => (
                <Badge
                  key={tag}
                  variant="outline"
                  className="font-mono text-xs"
                >
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        </FadeUp>

        {/* Content */}
        <FadeUp delay={0.1}>
          <div className="space-y-6">
            {post.content.map((block, index) => renderBlock(block, index))}
          </div>
        </FadeUp>

        {/* Back Link */}
        <FadeUp delay={0.2}>
          <Link
            to="/blog"
            className="text-primary font-mono hover:underline"
          >
            ← back to blog
          </Link>
        </FadeUp>
      </div>
    </PageContainer>
  )
}
