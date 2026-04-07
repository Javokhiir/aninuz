import React from "react"

import HeroSection from "./components/hero"
import OfferSection from "./components/offer"
import WhySection from "./components/why"

const AboutPage = () => {
  return (
    <div className="space-y-10 overflow-x-clip md:space-y-20">
      <HeroSection />
      <WhySection />
      <OfferSection />
    </div>
  )
}

export default AboutPage
