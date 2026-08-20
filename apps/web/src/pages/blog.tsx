import { Link } from "react-router-dom"
import { blogPosts } from "@/data/blog"
import { Container } from "@/components/container"
import { Reveal } from "@/components/reveal"
import { usePageMeta } from "@/hooks/use-page-meta"

export default function BlogPage() {
  usePageMeta({
    title: "Writing",
    description: "Writing about interfaces, rendering, systems programming, and whatever else.",
  })

  return (
    <Container className="pb-[clamp(72px,10vw,150px)] pt-[clamp(120px,16vh,180px)]">
      <Reveal>
        <h1 className="font-display text-[clamp(2.2rem,5.4vw,3.6rem)] font-semibold leading-[1.04] tracking-[-0.03em] [font-variation-settings:'wdth'_94]">
          Writing
        </h1>
        <p className="mt-4 max-w-[56ch] text-[clamp(17px,1.4vw,19px)] text-dim">
          Notes on interfaces, rendering, and the layers underneath. Mostly written to find out
          whether I understood the thing.
        </p>
      </Reveal>

      <div className="mt-[clamp(48px,7vw,88px)]">
        {blogPosts.length > 0 ? (
          blogPosts.map((post, i) => (
            <Reveal key={post.slug} delay={i * 0.06}>
              <Link
                to={`/blog/${post.slug}`}
                className="group block border-b border-line py-[clamp(22px,2.8vw,32px)] transition-[padding-left] duration-500 ease-brand hover:pl-2.5"
              >
                <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
                  <h2 className="font-display text-[clamp(1.2rem,2.2vw,1.6rem)] font-semibold tracking-[-0.022em] transition-colors duration-[380ms] group-hover:text-brand">
                    {post.title}
                  </h2>
                  <span className="whitespace-nowrap text-[12.5px] tabular-nums text-faint">
                    {post.date} · {post.readingTime}
                  </span>
                </div>
                <p className="mt-2.5 max-w-[64ch] text-[15.5px] text-dim">{post.summary}</p>
              </Link>
            </Reveal>
          ))
        ) : (
          <p className="text-dim">Nothing published yet.</p>
        )}
      </div>
    </Container>
  )
}
