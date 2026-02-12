import { Link } from "react-router-dom"
import { Github } from "lucide-react"
import { projects } from "@/data/projects"
import { FadeUp } from "@/components/fade-up"
import { Badge } from "@/components/ui/badge"

export default function ProjectsPage() {
  return (
    <div className="max-w-6xl mx-auto px-6 py-24">
      <FadeUp>
        <h1 className="font-mono font-bold text-3xl flex items-baseline">
          <span className="text-muted-foreground mr-2">&gt;</span>
          projects
        </h1>
      </FadeUp>

      <FadeUp delay={0.1}>
        <p className="text-muted-foreground mt-2">
          Five projects. Five languages. Five domains.
        </p>
      </FadeUp>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        {projects.map((project, index) => (
          <FadeUp key={project.slug} delay={index * 0.1}>
            <div className="group relative border border-border/50 rounded-lg p-6 transition-all duration-200 hover:border-primary/50 hover:shadow-[0_0_20px_rgba(122,162,247,0.1)]">
              <Link
                to={`/projects/${project.slug}`}
                className="absolute inset-0 z-10"
                aria-label={`Read case study for ${project.title}`}
              />

              <div className="flex items-center justify-between">
                <h2 className="font-mono font-bold text-xl text-foreground">
                  {project.title}
                </h2>
                <Badge variant="outline" className="font-mono text-xs">
                  {project.language}
                </Badge>
              </div>

              <p className="text-muted-foreground text-sm leading-relaxed mt-2">
                {project.longDescription}
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

              <div className="flex items-center justify-between mt-4">
                <a
                  href={project.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="relative z-20 text-muted-foreground hover:text-primary transition-colors duration-150"
                  onClick={(e) => e.stopPropagation()}
                  aria-label={`GitHub repository for ${project.title}`}
                >
                  <Github className="size-4" />
                </a>

                <span className="text-sm text-primary font-mono transition-transform duration-200 group-hover:translate-x-1">
                  → read case study
                </span>
              </div>
            </div>
          </FadeUp>
        ))}
      </div>
    </div>
  )
}
