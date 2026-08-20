import { Link } from "react-router-dom"
import { ArrowUpRight } from "lucide-react"
import { projects } from "@/data/projects"
import { Container } from "@/components/container"
import { Reveal } from "@/components/reveal"
import { SectionHead } from "@/components/section-head"
import { Chip } from "@/components/chip"
import { LayersStage, ShotStage } from "@/components/sections/project-stages"

/** Projects without a real screenshot fall back to a drawn stage. */
const STAGES = {
  "canvas-kit": LayersStage,
} as const

export function Projects() {
  const featured = projects.filter((p) => p.kind === "product")

  return (
    <section id="projects" className="scroll-mt-[70px] pb-[clamp(72px,10vw,150px)]">
      <Container>
        <Reveal>
          <SectionHead title="Selected projects" />
        </Reveal>

        {featured.map((project, i) => {
          const StageComponent = STAGES[project.slug as keyof typeof STAGES]

          return (
            <Reveal key={project.slug}>
              <article
                className={`grid items-center gap-[clamp(24px,4vw,64px)] py-[clamp(38px,5vw,62px)] min-[861px]:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] ${
                  i > 0 ? "border-t border-line" : ""
                }`}
              >
                <div className="max-[860px]:order-2">
                  <p className="text-xs uppercase tracking-[0.16em] text-faint">
                    Project {String(i + 1).padStart(2, "0")}
                  </p>

                  <h3 className="mt-3 font-display text-[clamp(1.9rem,3.7vw,2.7rem)] font-semibold leading-[1.04] tracking-[-0.03em] [font-variation-settings:'wdth'_94]">
                    <Link
                      to={`/projects/${project.slug}`}
                      className="hover:text-brand transition-colors duration-[380ms]"
                    >
                      {project.title}
                    </Link>
                  </h3>

                  <p className="mt-4 max-w-[44ch] text-[16.5px] text-dim">
                    {project.longDescription}
                  </p>

                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {project.tags.slice(0, 5).map((tag) => (
                      <Chip key={tag}>{tag}</Chip>
                    ))}
                  </div>

                  <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3">
                    <Link
                      to={`/projects/${project.slug}`}
                      className="border-b border-line-2 pb-[5px] text-sm transition-colors duration-[380ms] hover:border-brand hover:text-brand"
                    >
                      Read the case study
                    </Link>

                    {project.demo && (
                      <a
                        href={project.demo}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group/link inline-flex items-center gap-2 border-b border-line-2 pb-[5px] text-sm transition-colors duration-[380ms] hover:border-brand hover:text-brand"
                      >
                        {project.demo.replace(/^https?:\/\//, "")}
                        <ArrowUpRight className="size-3 transition-transform duration-500 ease-brand group-hover/link:-translate-y-0.5 group-hover/link:translate-x-0.5" />
                      </a>
                    )}
                  </div>
                </div>

                <div className="max-[860px]:order-1">
                  {project.image ? (
                    <ShotStage
                      src={project.image}
                      alt={project.imageAlt ?? `${project.title} screenshot`}
                      label={project.demo?.replace(/^https?:\/\//, "") ?? project.title}
                    />
                  ) : StageComponent ? (
                    <StageComponent />
                  ) : null}
                </div>
              </article>
            </Reveal>
          )
        })}
      </Container>
    </section>
  )
}
