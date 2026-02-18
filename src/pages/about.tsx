import { FadeUp } from "@/components/fade-up"
import { ContactLink } from "@/components/contact-link"
import { PageHeading, SectionHeading } from "@/components/section-heading"
import { PageContainer } from "@/components/page-container"
import { usePageMeta } from "@/hooks/use-page-meta"
import { skillAreas, contactLinks, beyondCode } from "@/data/about"

export default function AboutPage() {
  usePageMeta({
    title: "About",
    description:
      "About Purbayan Pramanik — developer from Kolkata, India. Web development, systems programming, and Linux.",
  })

  return (
    <PageContainer className="space-y-16">
      {/* Section 1 + 2: Opening Paragraph + Photo */}
      <FadeUp>
        <div className="flex flex-col-reverse md:flex-row md:items-start md:gap-12">
          <div className="flex-1 mt-8 md:mt-0">
            <PageHeading title="about" />

            <div className="mt-6 space-y-4 font-mono text-base md:text-lg leading-relaxed text-secondary-foreground">
              <p>
                I'm Purbayan — a developer from Kolkata, India,
                graduating in 2026. I like building things that work well and
                look clean, whether that's a web app, a TCP server, or my Linux
                desktop.
              </p>
              <p>
                I got into programming through curiosity about how things work
                under the hood, and that hasn't really changed. I still pick
                projects mostly based on what I'd learn from them.
              </p>
            </div>
          </div>

           <div className="flex justify-center md:justify-end md:shrink-0">
            <div className="size-40 md:size-48 rounded-lg border-2 border-primary overflow-hidden shadow-[0_0_20px_rgba(122,162,247,0.15)]">
              <img
                src="/purbayan.png"
                alt="Purbayan Pramanik"
                loading="lazy"
                width={192}
                height={192}
                className="size-full object-cover"
              />
            </div>
          </div>
        </div>
      </FadeUp>

      {/* Section 3: What I Do */}
      <FadeUp delay={0.1}>
        <SectionHeading title="what I do" />

        <div className="grid grid-cols-1 gap-4 mt-6">
          {skillAreas.map((area) => (
            <div
              key={area.title}
              className="group border border-border/50 rounded-lg p-5 transition-all duration-150 hover:border-primary/50 hover:shadow-[0_0_20px_rgba(122,162,247,0.1)]"
            >
              <div className="flex items-center gap-3">
                <area.icon className="size-5 text-primary shrink-0" />
                <h3 className="font-mono font-semibold text-foreground">
                  {area.title}
                </h3>
              </div>
              <ul className="mt-3 space-y-1.5 ml-8">
                {area.points.map((point) => (
                  <li
                    key={point}
                    className="text-sm text-muted-foreground font-mono leading-relaxed"
                  >
                    {point}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </FadeUp>

      {/* Section 4: Beyond Code */}
      <FadeUp delay={0.2}>
        <SectionHeading title="beyond code" />

        <ul className="mt-6 space-y-2">
          {beyondCode.map((item) => (
            <li
              key={item}
              className="text-base md:text-lg text-secondary-foreground font-mono leading-relaxed flex items-baseline gap-3"
            >
              <span className="text-primary font-mono text-sm shrink-0">—</span>
              {item}
            </li>
          ))}
        </ul>
      </FadeUp>

      {/* Section 5: Contact Links */}
      <FadeUp delay={0.3}>
        <SectionHeading title="get in touch" />

        <div className="mt-6 space-y-1">
          {contactLinks.map((link) => (
            <ContactLink
              key={link.label}
              href={link.href}
              label={link.label}
              display={link.display}
              icon={link.icon}
              external={link.external}
            />
          ))}
        </div>
      </FadeUp>

      {/* Section 6: Open Source note */}
      <FadeUp delay={0.4}>
        <p className="text-base md:text-lg text-secondary-foreground font-mono leading-relaxed">
          I've also contributed to open source — including{" "}
          <a
            href="https://github.com/apache/echarts"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            Apache ECharts
          </a>{" "}
          (65k+ stars) and the shadcn ecosystem through{" "}
          <a
            href="https://github.com/fiddle-factory/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            fiddle-factory
          </a>
          .
        </p>
      </FadeUp>
    </PageContainer>
  )
}
