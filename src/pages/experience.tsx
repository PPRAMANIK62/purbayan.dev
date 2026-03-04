import { FadeUp } from "@/components/fade-up"
import { PageHeading } from "@/components/section-heading"
import { PageContainer } from "@/components/page-container"
import { usePageMeta } from "@/hooks/use-page-meta"
import { Badge } from "@/components/ui/badge"
import { experiences } from "@/data/experience"

export default function ExperiencePage() {
  usePageMeta({
    title: "Experience",
    description:
      "Work experience of Purbayan Pramanik — full stack development, platform migrations, and open source contributions.",
  })

  return (
    <PageContainer className="space-y-16">
      {/* Page Heading */}
      <FadeUp>
        <PageHeading title="experience" />
        <p className="mt-4 font-mono text-base md:text-lg text-secondary-foreground leading-relaxed">
          Where I've worked and what I've built.
        </p>
      </FadeUp>

      {/* Experience Entries */}
      <div className="space-y-6">
        {experiences.map((exp, index) => (
          <FadeUp key={`${exp.company}-${exp.type}`} delay={0.1 * (index + 1)}>
            <div className="group border border-border/50 rounded-lg p-6 transition-all duration-150 hover:border-primary/50 hover:shadow-[0_0_20px_rgba(122,162,247,0.1)]">
              {/* Header: Role + Type Badge */}
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex items-start gap-3">
                  <exp.icon className="size-5 text-primary shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-mono font-semibold text-foreground text-lg">{exp.role}</h3>
                    <div className="flex items-center gap-2 mt-1 font-mono text-sm">
                      {exp.url ? (
                        <a
                          href={exp.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline"
                        >
                          @{exp.company}
                        </a>
                      ) : (
                        <span className="text-primary">@{exp.company}</span>
                      )}
                      <span className="text-muted-foreground">— {exp.period}</span>
                    </div>
                  </div>
                </div>
                <Badge variant="outline" className="font-mono text-xs shrink-0 w-fit">
                  {exp.type}
                </Badge>
              </div>

              {/* Description */}
              <p className="mt-4 font-mono text-sm text-muted-foreground leading-relaxed">
                {exp.description}
              </p>

              {/* Highlights */}
              <ul className="mt-4 space-y-2">
                {exp.highlights.map((highlight) => (
                  <li
                    key={highlight}
                    className="flex items-baseline gap-3 font-mono text-sm text-secondary-foreground leading-relaxed"
                  >
                    <span className="text-primary shrink-0">-</span>
                    {highlight}
                  </li>
                ))}
              </ul>

              {/* Technologies */}
              <div className="mt-4 flex flex-wrap gap-2">
                {exp.technologies.map((tech) => (
                  <Badge key={tech} variant="secondary" className="font-mono text-xs">
                    {tech}
                  </Badge>
                ))}
              </div>
            </div>
          </FadeUp>
        ))}
      </div>
    </PageContainer>
  )
}
