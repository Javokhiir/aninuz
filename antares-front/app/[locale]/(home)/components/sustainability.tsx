"use client"

import { BadgeCheck, Battery, TrendingUp, Wind } from "lucide-react"
import { useTranslations } from "next-intl"

import { FadeUp, MaskText } from "@/components/motion/mask-text"

/**
 * Sustainability statement.
 *
 * Sealing quality is an emissions story — a packing that holds is a leak that
 * never happens — so this section is the one place the page uses a green
 * accent instead of the Antares blue. Built on the flat ink surface rather than
 * over stock nature footage, which would read as borrowed sentiment.
 */

const CARDS = [
  { key: "c1", Icon: Wind },
  { key: "c2", Icon: Battery },
  { key: "c3", Icon: TrendingUp },
  { key: "c4", Icon: BadgeCheck },
] as const

const ACCENT = "#42ec8b"

const SustainabilitySection = () => {
  const t = useTranslations("home.sustainability")

  return (
    <section id="sustainability" className="bg-ink relative w-full overflow-hidden py-20 text-white md:py-32">
      {/* A single soft pool of the accent, so the colour reads as light in the
          room rather than a flat tinted panel. */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 50% 0%, rgba(66,236,139,0.14) 0%, rgba(66,236,139,0) 70%)",
        }}
      />

      <div className="relative rcontainer">
        <div className="text-center">
          <span className="label-mono" style={{ color: ACCENT }}>
            {t("eyebrow")}
          </span>

          <MaskText
            as="h2"
            lines={[t("titleLine1")]}
            className="rtitle rtitle-large mt-4"
          />
          {/* Second line carries the accent — the emphasis inmarco puts on the
              word that makes the claim a commitment rather than a feature. */}
          <div style={{ color: ACCENT }}>
            <MaskText
              as="div"
              lines={[t("titleLine2")]}
              className="rtitle rtitle-large"
              delay={0.08}
            />
          </div>

          <FadeUp delay={0.2}>
            <p className="text-hint mx-auto mt-6 max-w-[62ch] text-base leading-relaxed md:text-lg">
              {t("subtitle")}
            </p>
          </FadeUp>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {CARDS.map(({ key, Icon }, i) => (
            <FadeUp key={key} delay={i * 0.07}>
              <div className="bg-ink-alt flex h-full items-start gap-3 rounded-[var(--radius-panel)] border border-white/10 p-5">
                <span
                  className="flex size-9 shrink-0 items-center justify-center rounded-[var(--radius-fluid)]"
                  style={{ backgroundColor: "rgba(66,236,139,0.12)" }}
                >
                  <Icon
                    className="size-4"
                    style={{ color: ACCENT }}
                    strokeWidth={1.8}
                  />
                </span>
                <div>
                  <h3 className="font-medium">{t(`${key}Title`)}</h3>
                  <p className="text-hint mt-1 text-sm leading-relaxed">
                    {t(`${key}Desc`)}
                  </p>
                </div>
              </div>
            </FadeUp>
          ))}
        </div>

        <FadeUp delay={0.2}>
          <p className="text-hint mx-auto mt-10 max-w-[64ch] text-center text-sm leading-relaxed md:text-base">
            {t("note")}
          </p>
        </FadeUp>
      </div>
    </section>
  )
}

export default SustainabilitySection
