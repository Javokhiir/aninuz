"use client"

import React, { useEffect, useState } from "react"
import { useTranslations } from "next-intl"

import { LogoCarousel } from "@/components/ui/logo-carousel"

const useWindowWidth = () => {
  const [width, setWidth] = useState(0)

  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth)
    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  return width
}

const PartnersSection = () => {
  const t = useTranslations("home.partners")
  const width = useWindowWidth()

  const demoLogos = [
    { id: 1, name: "brandy", src: "/images/products/brand.png" },
    { id: 2, name: "garlock", src: "/images/products/gar.png" },
    { id: 3, name: "tritorc", src: "/images/products/tritor.png" },
    { id: 4, name: "inmarco", src: "/images/products/inmar.png" },
    { id: 5, name: "erith", src: "/images/products/erit.png" },
  ]

  return (
    <section className="relative z-30 mx-auto flex max-w-[1400px] flex-col items-center justify-center overflow-x-clip px-5 md:px-0">
      <h3 className="text-center text-2xl font-semibold uppercase md:text-3xl">
        {t("title")}
      </h3>
      <LogoCarousel logos={demoLogos} columns={width < 768 ? 3 : 4} />
    </section>
  )
}

export default PartnersSection
