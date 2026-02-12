import { Link } from "react-router-dom"
import type { Project } from "@/data/projects"
import { Badge } from "@/components/ui/badge"

interface ProjectCardProps {
  project: Project
}

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <Link
      to={`/projects/${project.slug}`}
      className="group block border border-border/50 rounded-lg p-6 transition-all duration-200 hover:border-primary/50 hover:shadow-[0_0_20px_rgba(122,162,247,0.1)]"
    >
      <h3 className="font-mono font-semibold text-lg text-foreground">
        {project.title}
      </h3>

      <p className="text-sm text-muted-foreground mt-2">
        {project.description}
      </p>

      <div className="flex flex-wrap gap-2 mt-4">
        {project.tags.map((tag) => (
          <Badge key={tag} variant="outline" className="font-mono text-xs">
            {tag}
          </Badge>
        ))}
      </div>

      <span className="inline-block mt-4 text-sm text-primary font-mono transition-transform duration-200 group-hover:translate-x-1">
        → view project
      </span>
    </Link>
  )
}
