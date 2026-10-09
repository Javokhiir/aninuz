import { setRequestLocale } from "next-intl/server"
import { Locale } from "@/i18n/routing"

import HeroSection from "./components/hero"
import LazyHomeSections from "./components/lazy-home-sections"
import Partners from "./components/partners"

export default async function Home({
  params,
}: {
  params: Promise<{ locale: Locale }>
}) {
  const { locale } = await params
  setRequestLocale(locale)
  return (
    <div className="space-y-10 md:space-y-20">
      <HeroSection />
      <div className="mx-auto max-w-[1400px] space-y-10 px-5 md:space-y-20">
        <Partners />
        <LazyHomeSections />
      </div>
    </div>
  )
}
