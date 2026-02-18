import { Link } from "react-router-dom"
import { blogPosts } from "@/data/blog"
import { FadeUp } from "@/components/fade-up"
import { Badge } from "@/components/ui/badge"
import { PageHeading } from "@/components/section-heading"
import { PageContainer } from "@/components/page-container"
import { usePageMeta } from "@/hooks/use-page-meta"

export default function BlogPage() {
  usePageMeta({
    title: "Blog",
    description: "Blog — writing about TypeScript, Rust, systems programming, and whatever else.",
  })

  return (
    <PageContainer className="space-y-16">
      {/* Page Heading */}
      <FadeUp>
        <PageHeading title="blog" />
        <p className="mt-4 font-mono text-base md:text-lg text-secondary-foreground leading-relaxed">
          Writing about TypeScript, Rust, systems programming, and whatever else I'm thinking about.
        </p>
      </FadeUp>

      {/* Blog Posts */}
      {blogPosts.length > 0 ? (
        <div className="space-y-6">
          {blogPosts.map((post, index) => (
            <FadeUp key={post.slug} delay={0.1 + index * 0.1}>
              <div className="group relative border border-border/50 rounded-lg p-6 transition-all duration-200 hover:border-primary/50 hover:shadow-[0_0_20px_rgba(122,162,247,0.1)]">
                <Link
                  to={`/blog/${post.slug}`}
                  className="absolute inset-0 z-10"
                  aria-label={`Read ${post.title}`}
                />

                <div className="flex items-center justify-between">
                  <h2 className="font-mono font-bold text-xl text-foreground">{post.title}</h2>
                  <span className="text-muted-foreground font-mono text-xs shrink-0 ml-4">
                    {post.readingTime}
                  </span>
                </div>

                <p className="text-muted-foreground font-mono text-sm mt-1">{post.date}</p>

                <p className="text-secondary-foreground text-sm leading-relaxed mt-3">
                  {post.summary}
                </p>

                <div className="flex flex-wrap gap-2 mt-4">
                  {post.tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="font-mono text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>

                <div className="flex items-center justify-end mt-4">
                  <span className="text-sm text-primary font-mono transition-transform duration-200 group-hover:translate-x-1">
                    → read post
                  </span>
                </div>
              </div>
            </FadeUp>
          ))}
        </div>
      ) : (
        <FadeUp delay={0.1}>
          <section>
            <div>
              <p className="text-muted-foreground font-mono">No posts yet. Check back soon.</p>
            </div>
          </section>
        </FadeUp>
      )}
    </PageContainer>
  )
}
