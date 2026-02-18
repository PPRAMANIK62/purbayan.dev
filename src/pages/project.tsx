import { useParams, Link } from "react-router-dom"
import { Github, ExternalLink } from "lucide-react"
import { projects } from "@/data/projects"
import { FadeUp } from "@/components/fade-up"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { SectionHeading } from "@/components/section-heading"
import { PageContainer } from "@/components/page-container"
import { BulletList } from "@/components/bullet-list"
import { usePageMeta } from "@/hooks/use-page-meta"

export default function ProjectPage() {
  const { slug } = useParams<{ slug: string }>()
  const project = projects.find((p) => p.slug === slug)

  usePageMeta({
    title: project?.title ?? "Not Found",
    description: project?.tagline ?? "Project not found.",
  })

  if (!project) {
    return (
      <PageContainer className="text-center">
        <p className="text-muted-foreground font-mono">Project not found.</p>
        <Link to="/projects" className="text-primary font-mono hover:underline">
          → back to projects
        </Link>
      </PageContainer>
    )
  }

  return (
    <PageContainer>
      <div className="space-y-16">
        {/* Header */}
        <FadeUp>
          <div>
            <h1 className="text-4xl font-mono font-bold">{project.title}</h1>
            <p className="text-muted-foreground text-lg mt-2">
              {project.tagline}
            </p>

            <div className="flex flex-wrap gap-2 mt-4">
              {project.tags.map((tag) => (
                <Badge
                  key={tag}
                  variant="outline"
                  className="font-mono text-xs"
                >
                  {tag}
                </Badge>
              ))}
            </div>

            <div className="flex items-center gap-4 mt-6">
              <Button variant="outline" asChild>
                <a
                  href={project.github}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Github className="size-4" />
                  View on GitHub
                </a>
              </Button>
              {project.demo && (
                <Button variant="outline" asChild>
                  <a
                    href={project.demo}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ExternalLink className="size-4" />
                    Live Demo
                  </a>
                </Button>
              )}
            </div>
          </div>
        </FadeUp>

        {/* The Problem */}
        <FadeUp delay={0.1}>
          <div>
            <SectionHeading title="the problem" />
            <p className="text-secondary-foreground leading-relaxed mt-4">
              {project.problem}
            </p>
          </div>
        </FadeUp>

        {/* The Solution */}
        <FadeUp delay={0.2}>
          <div>
            <SectionHeading title="the solution" />
            <p className="text-secondary-foreground leading-relaxed mt-4">
              {project.solution}
            </p>
          </div>
        </FadeUp>

        {/* Technical Details */}
        <FadeUp delay={0.3}>
          <div>
            <SectionHeading title="technical details" />
            <BulletList items={project.technicalDetails} />
          </div>
        </FadeUp>

        {/* Challenges */}
        <FadeUp delay={0.4}>
          <div>
            <SectionHeading title="challenges" />
            <BulletList items={project.challenges} />
          </div>
        </FadeUp>

        {/* Demo Placeholder */}
        <FadeUp delay={0.5}>
          <div>
            <SectionHeading title="demo" />
            <div className="rounded-lg border border-border/50 bg-card p-12 mt-4 text-center">
              <p className="text-muted-foreground font-mono text-sm">
                Screenshots and demos coming soon.
              </p>
            </div>
          </div>
        </FadeUp>

        {/* Back Link */}
        <FadeUp delay={0.6}>
          <Link
            to="/projects"
            className="text-primary font-mono hover:underline"
          >
            ← back to projects
          </Link>
        </FadeUp>
      </div>
    </PageContainer>
  )
}
