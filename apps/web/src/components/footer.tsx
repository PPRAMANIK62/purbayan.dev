import { Link } from "react-router-dom"
import { SOCIAL } from "@/data/social-links"
import { Container } from "@/components/container"
import { Reveal } from "@/components/reveal"
import { SectionHead } from "@/components/section-head"

const links = [
  { label: "GitHub", href: SOCIAL.github.url, external: true },
  { label: "LinkedIn", href: SOCIAL.linkedin.url, external: true },
  { label: "X", href: SOCIAL.x.url, external: true },
  { label: "Email", href: SOCIAL.email.url, external: true },
  { label: "Résumé", href: "/resume", external: false },
] as const

export function Footer() {
  return (
    <footer id="contact" className="pb-[clamp(72px,10vw,150px)]">
      <Container>
        <Reveal>
          <SectionHead title="Contact" note="Kolkata · IST" />
        </Reveal>

        <Reveal delay={0.06}>
          <p className="max-w-[17ch] font-display text-[clamp(1.8rem,4.6vw,3.4rem)] font-semibold leading-[1.06] tracking-[-0.032em] [font-variation-settings:'wdth'_95]">
            Graduated 2026, looking for the next interface to own.
          </p>

          <a
            href={SOCIAL.email.url}
            className="mt-[clamp(22px,3vw,34px)] inline-block break-words font-display text-[clamp(1.1rem,2.6vw,1.7rem)] font-medium tracking-[-0.02em] bg-[linear-gradient(var(--c-brand),var(--c-brand))] bg-[length:0%_1.5px] bg-[position:0_100%] bg-no-repeat transition-[background-size,color] duration-[620ms] ease-brand hover:text-brand hover:bg-[length:100%_1.5px]"
          >
            {SOCIAL.email.display}
          </a>

          <nav className="mt-[clamp(30px,4vw,46px)] flex flex-wrap gap-y-2.5 gap-x-[clamp(18px,3vw,34px)]">
            {links.map((link) =>
              link.external ? (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="border-b border-transparent pb-[5px] text-[13px] uppercase tracking-[0.14em] text-dim transition-colors duration-[380ms] hover:border-brand hover:text-ink"
                >
                  {link.label}
                </a>
              ) : (
                <Link
                  key={link.label}
                  to={link.href}
                  className="border-b border-transparent pb-[5px] text-[13px] uppercase tracking-[0.14em] text-dim transition-colors duration-[380ms] hover:border-brand hover:text-ink"
                >
                  {link.label}
                </Link>
              ),
            )}
          </nav>
        </Reveal>

        <div className="mt-[clamp(56px,7vw,92px)] flex flex-wrap justify-between gap-x-5 gap-y-2 border-t border-line pt-6 text-[12.5px] text-faint">
          <span>Purbayan Pramanik · Kolkata, India</span>
          <span>
            Built with React and Tailwind.{" "}
            <a
              href={SOCIAL.portfolio.url}
              target="_blank"
              rel="noopener noreferrer"
              className="underline decoration-line underline-offset-4 transition-colors duration-150 hover:text-dim"
            >
              Source
            </a>
            .
          </span>
        </div>
      </Container>
    </footer>
  )
}
