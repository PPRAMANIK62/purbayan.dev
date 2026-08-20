import { useParams, Link } from "react-router-dom"
import { Github, ArrowUpRight, ArrowLeft } from "lucide-react"
import { projects } from "@/data/projects"
import { Container } from "@/components/container"
import { Reveal } from "@/components/reveal"
import { SectionHead } from "@/components/section-head"
import { Chip } from "@/components/chip"
import { usePageMeta } from "@/hooks/use-page-meta"

function RuledList({ items }: { items: string[] }) {
  return (
    <ul>
      {items.map((item) => (
        <li key={item} className="border-b border-line py-3.5 text-dim last:border-b-0">
          {item}
        </li>
      ))}
    </ul>
  )
}

export default function ProjectPage() {
  const { slug } = useParams<{ slug: string }>()
  const project = projects.find((p) => p.slug === slug)

  usePageMeta({
    title: project?.title ?? "Not found",
    description: project?.tagline ?? "Project not found.",
  })

  if (!project) {
    return (
      <Container className="py-[clamp(120px,18vh,200px)] text-center">
        <p className="text-dim">That project doesn&rsquo;t exist.</p>
        <Link to="/#projects" className="mt-4 inline-block text-brand hover:underline">
          Back to projects
        </Link>
      </Container>
    )
  }

  return (
    <Container className="pb-[clamp(72px,10vw,150px)] pt-[clamp(120px,16vh,180px)]">
      <Reveal>
        <p className="label-xs text-faint">
          {project.kind === "product" ? "Selected project" : "Also built"} · {project.language}
        </p>

        <h1 className="mt-4 font-display text-[clamp(2.2rem,5.4vw,3.6rem)] font-semibold leading-[1.04] tracking-[-0.03em] [font-variation-settings:'wdth'_94]">
          {project.title}
        </h1>

        <p className="mt-4 max-w-[56ch] text-[clamp(17px,1.4vw,19px)] text-dim">
          {project.tagline}
        </p>

        <div className="mt-5 flex flex-wrap gap-1.5">
          {project.tags.map((tag) => (
            <Chip key={tag}>{tag}</Chip>
          ))}
        </div>

        <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-3">
          <a
            href={project.github}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 border-b border-line-2 pb-[5px] text-sm transition-colors duration-[380ms] hover:border-brand hover:text-brand"
          >
            <Github className="size-4" />
            View source
          </a>
          {project.demo && (
            <a
              href={project.demo}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-2 border-b border-line-2 pb-[5px] text-sm transition-colors duration-[380ms] hover:border-brand hover:text-brand"
            >
              {project.demo.replace(/^https?:\/\//, "")}
              <ArrowUpRight className="size-3 transition-transform duration-500 ease-brand group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </a>
          )}
        </div>
      </Reveal>

      <div className="mt-[clamp(56px,8vw,110px)] space-y-[clamp(48px,6vw,88px)]">
        <Reveal>
          <SectionHead title="The problem" />
          <p className="max-w-[68ch] text-dim">{project.problem}</p>
        </Reveal>

        <Reveal>
          <SectionHead title="The solution" />
          <p className="max-w-[68ch] text-dim">{project.solution}</p>
        </Reveal>

        <Reveal>
          <SectionHead title="Technical details" />
          <RuledList items={project.technicalDetails} />
        </Reveal>

        <Reveal>
          <SectionHead title="Challenges" />
          <RuledList items={project.challenges} />
        </Reveal>
      </div>

      <Reveal>
        <Link
          to="/#projects"
          className="mt-[clamp(56px,7vw,92px)] inline-flex items-center gap-2 text-sm text-dim transition-colors duration-[380ms] hover:text-brand"
        >
          <ArrowLeft className="size-3.5" />
          All projects
        </Link>
      </Reveal>
    </Container>
  )
}
