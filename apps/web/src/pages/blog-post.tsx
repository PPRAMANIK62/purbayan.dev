import { useParams, Link } from "react-router-dom"
import { ArrowLeft } from "lucide-react"
import { blogPosts } from "@/data/blog"
import { Container } from "@/components/container"
import { Reveal } from "@/components/reveal"
import { Chip } from "@/components/chip"
import { usePageMeta } from "@/hooks/use-page-meta"
import { renderBlock } from "@/lib/blog-rendering"

export default function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>()
  const post = blogPosts.find((p) => p.slug === slug)

  usePageMeta({
    title: post?.title ?? "Not found",
    description: post?.summary ?? "Post not found.",
  })

  if (!post) {
    return (
      <Container className="py-[clamp(120px,18vh,200px)] text-center">
        <p className="text-dim">That post doesn&rsquo;t exist.</p>
        <Link to="/blog" className="mt-4 inline-block text-brand hover:underline">
          Back to writing
        </Link>
      </Container>
    )
  }

  return (
    <Container className="pb-[clamp(72px,10vw,150px)] pt-[clamp(120px,16vh,180px)]">
      <Reveal>
        <p className="label-xs text-faint">
          {post.date} · {post.readingTime}
        </p>

        <h1 className="mt-4 max-w-[20ch] font-display text-[clamp(2.1rem,5vw,3.4rem)] font-semibold leading-[1.05] tracking-[-0.03em] [font-variation-settings:'wdth'_94]">
          {post.title}
        </h1>

        <p className="mt-4 max-w-[60ch] text-[clamp(17px,1.4vw,19px)] text-dim">{post.summary}</p>

        <div className="mt-5 flex flex-wrap gap-1.5">
          {post.tags.map((tag) => (
            <Chip key={tag}>{tag}</Chip>
          ))}
        </div>
      </Reveal>

      <Reveal>
        <div className="mt-[clamp(48px,7vw,88px)] space-y-6">
          {post.content.map((block, index) => renderBlock(block, index))}
        </div>
      </Reveal>

      <Reveal>
        <Link
          to="/blog"
          className="mt-[clamp(56px,7vw,92px)] inline-flex items-center gap-2 text-sm text-dim transition-colors duration-[380ms] hover:text-brand"
        >
          <ArrowLeft className="size-3.5" />
          All writing
        </Link>
      </Reveal>
    </Container>
  )
}
