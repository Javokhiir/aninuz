"use client"

import dynamic from "next/dynamic"
import { useTranslations } from "next-intl"

// The animation is ~180 KB of inline SVG paths at the foot of the page, so it
// is kept out of the server-rendered HTML and fetched only in the browser.
const LineScrollAnimation = dynamic(
  () =>
    import("@/components/ui/line-animation").then((m) => m.LineScrollAnimation),
  { ssr: false }
)

const LineSection = () => {
  const t = useTranslations("home.line")
  return (
    <section className="relative mx-auto max-w-[1400px] space-y-10 px-5 md:mt-28 md:space-y-0">
      <h2 className="mx-auto w-max bg-gradient-to-r from-black via-blue-700 to-black bg-clip-text text-center text-transparent md:mx-0 md:ml-auto">
        {t("title")}
      </h2>

      <div className="w-full max-w-[1400px]">
        <LineScrollAnimation />
      </div>
    </section>
  )
}

export default LineSection
