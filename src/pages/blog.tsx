import { FadeUp } from "@/components/fade-up"

export default function BlogPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-24 space-y-16">
      {/* Page Heading */}
      <FadeUp>
        <h1 className="text-3xl font-mono font-bold flex items-baseline">
          <span className="text-muted-foreground mr-2">&gt;</span>
          blog
        </h1>
        <p className="mt-4 font-mono text-base md:text-lg text-secondary-foreground leading-relaxed">
          Writing about TypeScript, Rust, systems programming,
          and whatever else I'm thinking about.
        </p>
      </FadeUp>

      {/* Blog Posts */}
      <FadeUp delay={0.1}>
        <section>
          {/* Future blog post list goes here */}
          <div>
            <p className="text-muted-foreground font-mono">
              No posts yet. Check back soon.
            </p>
          </div>
        </section>
      </FadeUp>
    </div>
  )
}
