import { Link } from "react-router-dom"
import { Github, ChevronDown } from "lucide-react"
import { motion } from "motion/react"
import { projects } from "@/data/projects"
import { ProjectCard } from "@/components/project-card"
import { FadeUp } from "@/components/fade-up"
import { usePageMeta } from "@/hooks/use-page-meta"

const staggerEase = [0.25, 0.46, 0.45, 0.94] as const

const lineVariants = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0 },
}

export default function HomePage() {
  usePageMeta({
    description:
      "Purbayan Pramanik — full-stack developer. TypeScript by day, Rust by night.",
  })

  return (
    <>
      {/* Hero */}
      <section className="relative min-h-screen flex flex-col justify-center max-w-3xl mx-auto px-6 pt-16">
        <motion.div
          initial="hidden"
          animate="visible"
          transition={{ staggerChildren: 0.15 }}
        >
          <motion.div
            variants={lineVariants}
            transition={{ duration: 0.4, ease: staggerEase }}
            className="flex items-baseline"
          >
            <span className="text-muted-foreground mr-2 text-4xl md:text-6xl font-mono">
              &gt;
            </span>
            <h1 className="text-4xl md:text-6xl font-bold font-mono text-foreground">
              Purbayan Pramanik
            </h1>
            <span className="cursor" />
          </motion.div>

          <motion.p
            variants={lineVariants}
            transition={{ duration: 0.4, ease: staggerEase }}
            className="text-lg md:text-xl text-secondary-foreground font-mono mt-4"
          >
            full-stack developer · systems enthusiast
          </motion.p>

          <motion.p
            variants={lineVariants}
            transition={{ duration: 0.4, ease: staggerEase }}
            className="text-base md:text-lg text-muted-foreground leading-relaxed font-mono mt-4 whitespace-pre-line"
          >
            {"TypeScript by day, Rust by night.\nI build web apps at work and low-level\nthings for fun."}
          </motion.p>

          <motion.div
            variants={lineVariants}
            transition={{ duration: 0.4, ease: staggerEase }}
            className="flex items-center gap-6 mt-8"
          >
            <Link
              to="/projects"
              className="text-primary font-mono hover:underline"
            >
              → view projects
            </Link>
            <a
              href="https://github.com/PPRAMANIK62"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-primary font-mono hover:underline"
            >
              <Github className="size-4" />
              github
            </a>
          </motion.div>
        </motion.div>

        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, y: [0, 8, 0] }}
          transition={{
            opacity: { delay: 1.2, duration: 0.5 },
            y: { delay: 1.2, duration: 1.5, repeat: Infinity, ease: "easeInOut" }
          }}
        >
          <ChevronDown className="size-6 text-muted-foreground" />
        </motion.div>
      </section>

      {/* Projects Grid */}
      <section className="max-w-6xl mx-auto px-6 py-24">
        <FadeUp>
          <h2 className="text-2xl font-mono font-semibold flex items-baseline">
            <span className="text-muted-foreground mr-2">&gt;</span>
            projects
          </h2>
        </FadeUp>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {projects.map((project, index) => (
            <FadeUp key={project.slug} delay={index * 0.1}>
              <ProjectCard project={project} />
            </FadeUp>
          ))}
        </div>
      </section>

      {/* About Teaser */}
      <section className="max-w-3xl mx-auto px-6 py-24">
        <FadeUp>
          <p className="text-lg text-secondary-foreground leading-relaxed">
            I write TypeScript at work, hack on Rust and C in my free time, and
            configure my Hyprland setup more than I probably should.
          </p>
          <Link
            to="/about"
            className="text-primary font-mono hover:underline mt-4 inline-block"
          >
            → more about me
          </Link>
        </FadeUp>
      </section>
    </>
  )
}
