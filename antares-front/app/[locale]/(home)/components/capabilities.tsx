"use client"

import { useTranslations } from "next-intl"

import { FadeUp, MaskText } from "@/components/motion/mask-text"

/**
 * Technical capabilities.
 *
 * A sand panel that reads like a spec sheet: mono eyebrow, a statement set in
 * display type, then a numbered list where each row is introduced by a hairline
 * rule. The media column is sticky, so the still sits alongside the whole list
 * as it scrolls rather than scrolling away with the first item.
 */

const ITEMS = ["cap1", "cap2", "cap3", "cap4", "cap5"] as const

const CapabilitiesSection = () => {
  const t = useTranslations("home.capabilities")

  return (
    <section id="capabilities" className="bg-sand text-ink w-full py-20 md:py-32">
      <div className="rcontainer grid grid-cols-1 gap-12 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] md:gap-16">
        <div className="md:sticky md:top-24 md:self-start">
          <span className="label-mono text-hint">{t("eyebrow")}</span>

          <MaskText
            as="h2"
            lines={[t("titleLine1"), t("titleLine2")]}
            className="rtitle rtitle-large mt-5"
          />

          <FadeUp delay={0.15}>
            <p className="text-ink/70 mt-6 max-w-[46ch] text-base leading-relaxed md:text-lg">
              {t("subtitle")}
            </p>
          </FadeUp>

          <FadeUp delay={0.25}>
            <div className="bg-ink mt-10 inline-block rounded-[var(--radius-fluid)] px-6 py-4 text-center">
              <span className="block text-2xl font-medium text-white">
                {t("badgeValue")}
              </span>
              <span className="label-mono text-primary mt-1 block">
                {t("badgeLabel")}
              </span>
            </div>
          </FadeUp>
        </div>

        <div>
          <span className="label-mono text-hint">{t("listTitle")}</span>

          <ul className="mt-6">
            {ITEMS.map((key, i) => (
              <FadeUp key={key} delay={i * 0.06}>
                <li className="border-ink/15 border-t py-6">
                  <div className="flex gap-4">
                    <span className="label-mono text-primary pt-1.5">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <div>
                      <h3 className="text-lg font-medium md:text-xl">
                        {t(`${key}Title`)}
                      </h3>
                      <p className="text-ink/60 mt-2 max-w-[52ch] text-sm leading-relaxed md:text-base">
                        {t(`${key}Desc`)}
                      </p>
                    </div>
                  </div>
                </li>
              </FadeUp>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}

export default CapabilitiesSection
