import { Download } from "lucide-react"
import { Container } from "@/components/container"
import { Reveal } from "@/components/reveal"
import { usePageMeta } from "@/hooks/use-page-meta"

const PDF = "/resume/resume.pdf"

export default function ResumePage() {
  usePageMeta({
    title: "Résumé",
    description: "Résumé for Purbayan Pramanik, frontend-focused full-stack engineer.",
  })

  return (
    <Container className="flex h-screen flex-col overflow-hidden pb-4 pt-[100px]">
      <Reveal>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h1 className="font-display text-[clamp(1.6rem,3.2vw,2.2rem)] font-semibold tracking-[-0.028em] [font-variation-settings:'wdth'_94]">
            Résumé
          </h1>
          <a
            href={PDF}
            download
            className="inline-flex items-center gap-2 rounded-full border border-line px-3.5 py-1.5 text-sm text-dim transition-colors duration-[380ms] hover:border-brand hover:text-brand"
          >
            <Download className="size-4" />
            Download PDF
          </a>
        </div>
      </Reveal>

      {/* Desktop: the PDF fills the remaining height */}
      <div className="mt-5 hidden min-h-0 flex-1 flex-col md:flex">
        <object
          data={PDF}
          type="application/pdf"
          className="size-full rounded-lg border border-line"
        >
          <iframe src={PDF} className="size-full rounded-lg border border-line" title="Résumé PDF">
            <p className="p-8 text-dim">
              Your browser can&rsquo;t display embedded PDFs.{" "}
              <a href={PDF} download className="text-brand hover:underline">
                Download it instead
              </a>
              .
            </p>
          </iframe>
        </object>
      </div>

      {/* Mobile: embedded PDF viewers are poor, so offer the download */}
      <div className="flex flex-1 items-center justify-center md:hidden">
        <div className="rounded-lg border border-line p-8 text-center">
          <p className="text-dim">PDF viewers are rough on mobile. Grab the file instead.</p>
          <a
            href={PDF}
            download
            className="mt-5 inline-flex items-center gap-2 rounded-full border border-line px-3.5 py-1.5 text-sm text-dim transition-colors duration-[380ms] hover:border-brand hover:text-brand"
          >
            <Download className="size-4" />
            Download PDF
          </a>
        </div>
      </div>
    </Container>
  )
}
