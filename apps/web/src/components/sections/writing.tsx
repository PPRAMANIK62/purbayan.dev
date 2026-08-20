import { Link } from "react-router-dom"
import { blogPosts } from "@/data/blog"
import { Container } from "@/components/container"
import { Reveal } from "@/components/reveal"
import { SectionHead } from "@/components/section-head"

export function Writing() {
  return (
    <section id="writing" className="scroll-mt-[70px] pb-[clamp(72px,10vw,150px)]">
      <Container>
        <Reveal>
          <SectionHead title="Writing" note="Occasional" />
        </Reveal>

        <Reveal delay={0.06}>
          {blogPosts.map((post) => (
            <Link
              key={post.slug}
              to={`/blog/${post.slug}`}
              className="group grid grid-cols-[minmax(0,1fr)_auto] items-baseline gap-y-2 gap-x-6 border-b border-line py-[clamp(18px,2.2vw,26px)] transition-[padding-left] duration-500 ease-brand hover:pl-2.5 max-[640px]:grid-cols-1"
            >
              <span className="font-display text-[clamp(1.05rem,1.9vw,1.35rem)] font-semibold tracking-[-0.02em] transition-colors duration-[380ms] group-hover:text-brand">
                {post.title}
              </span>
              <span className="whitespace-nowrap text-[12.5px] tabular-nums text-faint max-[640px]:text-[12px]">
                {post.date} · {post.readingTime}
              </span>
            </Link>
          ))}
        </Reveal>
      </Container>
    </section>
  )
}
