import { Hero } from "@/components/sections/hero"
import { Work } from "@/components/sections/work"
import { Projects } from "@/components/sections/projects"
import { AlsoBuilt } from "@/components/sections/also-built"
import { Writing } from "@/components/sections/writing"
import { usePageMeta } from "@/hooks/use-page-meta"

export default function HomePage() {
  usePageMeta({
    description:
      "Purbayan Pramanik, full-stack engineer based out of Kolkata, India. Canvas rendering, storyboard tooling, design systems, and the backends behind them.",
  })

  return (
    <>
      <Hero />
      <Work />
      <Projects />
      <AlsoBuilt />
      <Writing />
    </>
  )
}
