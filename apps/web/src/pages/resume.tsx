import { Download } from "lucide-react"
import { FadeUp } from "@/components/fade-up"
import { Button } from "@/components/ui/button"
import { PageHeading } from "@/components/section-heading"
import { usePageMeta } from "@/hooks/use-page-meta"

export default function ResumePage() {
  usePageMeta({
    title: "Resume",
    description: "Resume — Purbayan Pramanik. Full-stack developer graduating 2026.",
  })

  return (
    <div className="max-w-3xl mx-auto px-6 pt-20 pb-4 h-screen flex flex-col overflow-hidden">
      {/* Header — takes natural size */}
      <FadeUp>
        <div className="flex items-center justify-between">
          <PageHeading title="resume" />
          <Button variant="outline" asChild className="hidden md:inline-flex">
            <a href="/resume/resume.pdf" download className="font-mono">
              <Download className="size-4" />
              Download PDF
            </a>
          </Button>
        </div>
        <p className="mt-2 font-mono text-sm md:text-base text-secondary-foreground leading-relaxed">
          My current resume — available as a PDF below.
        </p>
      </FadeUp>

      {/* Desktop: PDF fills all remaining space */}
      <div className="hidden md:flex flex-col flex-1 min-h-0 mt-4">
        <object
          data="/resume/resume.pdf"
          type="application/pdf"
          className="w-full h-full rounded-lg border border-border/50"
        >
          <iframe
            src="/resume/resume.pdf"
            className="w-full h-full rounded-lg border border-border/50"
            title="Resume PDF"
          >
            <p className="font-mono text-muted-foreground p-8">
              Your browser doesn't support embedded PDFs.{" "}
              <a href="/resume/resume.pdf" download className="text-primary hover:underline">
                Download the PDF
              </a>{" "}
              to view it.
            </p>
          </iframe>
        </object>
      </div>

      {/* Mobile: Download card centered in remaining space */}
      <div className="md:hidden flex-1 flex items-center justify-center">
        <div className="rounded-lg border border-border/50 p-8 text-center space-y-4">
          <p className="font-mono text-secondary-foreground">
            PDF viewer isn't great on mobile — download the PDF to view it.
          </p>
          <Button variant="outline" asChild>
            <a href="/resume/resume.pdf" download className="font-mono">
              <Download className="size-4" />
              Download PDF
            </a>
          </Button>
        </div>
      </div>
    </div>
  )
}
