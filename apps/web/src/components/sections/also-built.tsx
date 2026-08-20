import { Link } from "react-router-dom"
import { projects } from "@/data/projects"
import { Container } from "@/components/container"
import { Reveal } from "@/components/reveal"
import { SectionHead } from "@/components/section-head"

/** Systems work, deliberately compact — it shows range without competing for attention. */
export function AlsoBuilt() {
  const systems = projects.filter((p) => p.kind === "systems")

  return (
    <section className="pb-[clamp(72px,10vw,150px)]">
      <Container>
        <Reveal>
          <SectionHead title="Also built" note="Systems, on the side" />
        </Reveal>

        <Reveal delay={0.06}>
          {systems.map((project) => (
            <Link
              key={project.slug}
              to={`/projects/${project.slug}`}
              className="group grid grid-cols-[minmax(0,auto)_minmax(0,1fr)_auto] items-baseline gap-y-2.5 gap-x-[clamp(14px,2.4vw,26px)] border-b border-line py-4 max-[640px]:grid-cols-[1fr_auto]"
            >
              <span className="font-display text-[16.5px] font-semibold tracking-[-0.015em] transition-colors duration-[380ms] group-hover:text-brand max-[640px]:col-start-1 max-[640px]:row-start-1">
                {project.title}
              </span>
              <span className="text-[15px] text-dim max-[640px]:col-span-2 max-[640px]:col-start-1 max-[640px]:row-start-2">
                {project.description}
              </span>
              <span className="whitespace-nowrap text-[11px] uppercase tracking-[0.17em] text-faint max-[640px]:col-start-2 max-[640px]:row-start-1 max-[640px]:justify-self-end">
                {project.language}
              </span>
            </Link>
          ))}

          <p className="mt-6 max-w-[56ch] text-[15px] text-faint">
            Small programs, kept small on purpose. I wrote each one instead of reaching for a
            library, and what I learned doing it goes back into the interface work.
          </p>
        </Reveal>
      </Container>
    </section>
  )
}
