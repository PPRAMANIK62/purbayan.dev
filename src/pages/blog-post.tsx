import { Link } from "react-router-dom"
import { FadeUp } from "@/components/fade-up"

export default function BlogPostPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-24">
      <div className="space-y-16">
        {/* Header */}
        <FadeUp>
          <h1 className="text-3xl font-mono font-bold flex items-baseline">
            <span className="text-muted-foreground mr-2">&gt;</span>
            blog post
          </h1>
        </FadeUp>

        {/* Placeholder Content */}
        <FadeUp delay={0.1}>
          <div>
            <p className="font-mono text-base md:text-lg text-secondary-foreground leading-relaxed">
              This page will display individual blog posts.
            </p>
            <p className="font-mono text-base md:text-lg text-secondary-foreground leading-relaxed mt-4">
              Content coming soon.
            </p>
          </div>
        </FadeUp>

        {/* Back Link */}
        <FadeUp delay={0.2}>
          <Link
            to="/blog"
            className="text-primary font-mono hover:underline"
          >
            → back to blog
          </Link>
        </FadeUp>
      </div>
    </div>
  )
}
