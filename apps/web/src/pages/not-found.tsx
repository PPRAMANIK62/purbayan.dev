import { Link } from "react-router-dom"
import { usePageMeta } from "@/hooks/use-page-meta"
import { Container } from "@/components/container"

export default function NotFoundPage() {
  usePageMeta({ title: "Not found", description: "That page doesn't exist." })

  return (
    <Container className="flex min-h-[70vh] flex-col justify-center pb-[clamp(72px,10vw,150px)] pt-[clamp(120px,16vh,180px)]">
      <p className="label-xs text-faint">404</p>

      <h1 className="mt-4 max-w-[16ch] font-display text-[clamp(2.2rem,6vw,4rem)] font-semibold leading-[1.04] tracking-[-0.03em] [font-variation-settings:'wdth'_94]">
        This page doesn&rsquo;t exist.
      </h1>

      <p className="mt-4 max-w-[52ch] text-[clamp(17px,1.4vw,19px)] text-dim">
        The link may be out of date, or I may have moved something. The work, projects and writing
        all live on the home page now.
      </p>

      <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3">
        {[
          { label: "Home", to: "/" },
          { label: "Projects", to: "/#projects" },
          { label: "Writing", to: "/blog" },
        ].map((link) => (
          <Link
            key={link.to}
            to={link.to}
            className="border-b border-line-2 pb-[5px] text-sm transition-colors duration-[380ms] hover:border-brand hover:text-brand"
          >
            {link.label}
          </Link>
        ))}
      </div>

      <p className="mt-14 text-[13px] text-faint">
        While you&rsquo;re here, press{" "}
        <kbd className="rounded border border-line px-1.5 py-0.5 font-mono text-[11px] text-dim">
          i
        </kbd>{" "}
        anywhere on the site.
      </p>
    </Container>
  )
}
