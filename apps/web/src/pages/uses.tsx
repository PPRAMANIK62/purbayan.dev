import { usesGroups } from "@/data/uses"
import { Container } from "@/components/container"
import { Reveal } from "@/components/reveal"
import { SectionHead } from "@/components/section-head"
import { usePageMeta } from "@/hooks/use-page-meta"

export default function UsesPage() {
  usePageMeta({
    title: "Uses",
    description: "The hardware, tools, and software Purbayan uses daily.",
  })

  return (
    <Container className="pb-[clamp(72px,10vw,150px)] pt-[clamp(120px,16vh,180px)]">
      <Reveal>
        <h1 className="font-display text-[clamp(2.2rem,5.4vw,3.6rem)] font-semibold leading-[1.04] tracking-[-0.03em] [font-variation-settings:'wdth'_94]">
          Uses
        </h1>
        <p className="mt-4 max-w-[54ch] text-[clamp(17px,1.4vw,19px)] text-dim">
          The hardware, tools, and software I reach for every day.
        </p>
      </Reveal>

      <div className="mt-[clamp(48px,7vw,88px)] space-y-[clamp(40px,5vw,64px)]">
        {usesGroups.map((group) => (
          <Reveal key={group.title}>
            <section>
              <SectionHead title={group.title} />
              <dl>
                {group.entries.map((entry) => (
                  <div
                    key={`${group.title}-${entry.category}`}
                    className="flex flex-wrap items-baseline gap-x-4 gap-y-1 border-b border-line py-3 last:border-b-0"
                  >
                    <dt className="w-32 shrink-0 text-sm text-faint">{entry.category}</dt>
                    <dd className="text-ink">
                      {entry.tool}
                      {entry.note && (
                        <span className="ml-2 text-sm text-dim max-sm:block max-sm:ml-0">
                          — {entry.note}
                        </span>
                      )}
                    </dd>
                  </div>
                ))}
              </dl>
            </section>
          </Reveal>
        ))}

        <Reveal>
          <section>
            <SectionHead title="Dotfiles" />
            <p className="max-w-[60ch] text-dim">
              All my configs live in a dotfiles repo. Same theme across 22 files.
            </p>
            <a
              href="https://github.com/PPRAMANIK62"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-block border-b border-line-2 pb-[5px] text-sm transition-colors duration-[380ms] hover:border-brand hover:text-brand"
            >
              GitHub
            </a>
          </section>
        </Reveal>
      </div>
    </Container>
  )
}
