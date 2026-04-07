import React from "react"
import { setRequestLocale } from "next-intl/server"
import { Locale } from "@/i18n/routing"

import HeroSection from "./components/hero"
import OfferSection from "./components/offer"
import WhySection from "./components/why"

const AboutPage = async ({
  params,
}: {
  params: Promise<{ locale: Locale }>
}) => {
  const { locale } = await params
  setRequestLocale(locale)
  return (
    <div className="space-y-10 overflow-x-clip md:space-y-20">
      <HeroSection />
      <WhySection />
      <OfferSection />
    </div>
  )
}

export default AboutPage
