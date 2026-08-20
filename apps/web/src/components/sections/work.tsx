import { useState } from "react"
import { ChevronDown } from "lucide-react"
import { experiences } from "@/data/experience"
import { cn } from "@/lib/utils"
import { Container } from "@/components/container"
import { Reveal } from "@/components/reveal"
import { SectionHead } from "@/components/section-head"
import { Chip } from "@/components/chip"

/**
 * At rest each row shows its stack; the write-up expands underneath using
 * grid-template-rows 0fr -> 1fr. Above 860px that is driven by hover and
 * focus-within. Below it there is no hover, so a toggle button drives the same
 * transition from state — the hover and focus variants are scoped to desktop so
 * they cannot fight the button (focus-within would otherwise pin a row open
 * after the tap that closed it). The button and the state class share the
 * max-[860px] breakpoint so neither can appear without the other.
 */
export function Work() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <section id="work" className="scroll-mt-[70px] py-[clamp(72px,10vw,150px)]">
      <Container>
        <Reveal>
          <SectionHead title="Work" />
        </Reveal>

        {experiences.map((role, i) => {
          const open = openIndex === i

          return (
            <Reveal key={`${role.company}-${role.period}`} delay={i * 0.07}>
              <article className="group relative border-b border-line py-[clamp(20px,2.4vw,28px)]">
                <span
                  aria-hidden="true"
                  className="absolute inset-x-0 -bottom-px h-px origin-left scale-x-0 bg-brand transition-transform duration-[620ms] ease-brand group-hover:scale-x-100 group-focus-within:scale-x-100"
                />

                <div className="grid grid-cols-1 items-baseline gap-x-7 gap-y-3 min-[861px]:grid-cols-[minmax(0,1fr)_auto]">
                  <h3 className="font-display text-[clamp(1.25rem,2.3vw,1.7rem)] font-semibold tracking-[-0.022em] [font-variation-settings:'wdth'_96] transition-colors duration-[380ms] group-hover:text-brand">
                    {role.role},{" "}
                    {role.url ? (
                      <a
                        href={role.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-normal text-dim transition-colors duration-[380ms] hover:text-ink"
                      >
                        {role.company}
                      </a>
                    ) : (
                      <span className="font-normal text-dim">{role.company}</span>
                    )}
                  </h3>
                  <p className="whitespace-nowrap text-[13.5px] tabular-nums text-faint max-[860px]:whitespace-normal">
                    {role.period} · {role.type}
                  </p>
                </div>

                <div className="mt-3.5 flex flex-wrap gap-1.5">
                  {role.technologies.map((tech) => (
                    <Chip key={tech}>{tech}</Chip>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => setOpenIndex(open ? null : i)}
                  aria-expanded={open}
                  aria-controls={`work-detail-${i}`}
                  className="mt-4 hidden items-center gap-1.5 text-[13px] tracking-[0.02em] text-faint transition-colors duration-[380ms] active:text-ink max-[860px]:inline-flex"
                >
                  {open ? "Hide details" : "What I did"}
                  <ChevronDown
                    aria-hidden="true"
                    className={cn(
                      "size-3.5 transition-transform duration-[420ms] ease-brand",
                      open && "rotate-180",
                    )}
                  />
                </button>

                <div
                  id={`work-detail-${i}`}
                  className={cn(
                    "grid grid-rows-[0fr] transition-[grid-template-rows] duration-[640ms] ease-brand min-[861px]:group-hover:grid-rows-[1fr] min-[861px]:group-focus-within:grid-rows-[1fr]",
                    open && "max-[860px]:grid-rows-[1fr]",
                  )}
                >
                  <div className="min-h-0 overflow-hidden">
                    <div
                      className={cn(
                        "pt-4 opacity-0 transition-opacity duration-[520ms] delay-[90ms] ease-brand min-[861px]:group-hover:opacity-100 min-[861px]:group-focus-within:opacity-100",
                        open && "max-[860px]:opacity-100",
                      )}
                    >
                      <p className="max-w-[62ch] text-base text-dim">{role.description}</p>

                      <ul className="mt-3.5 max-w-[68ch] space-y-2">
                        {role.highlights.map((highlight) => (
                          <li
                            key={highlight}
                            className="relative pl-4 text-[13.5px] leading-relaxed text-faint before:absolute before:left-0 before:top-[0.62em] before:h-px before:w-2 before:bg-line"
                          >
                            {highlight}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </article>
            </Reveal>
          )
        })}
      </Container>
    </section>
  )
}
