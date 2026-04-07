"use client"

import { useEffect, useState } from "react"
import { useTranslations } from "next-intl"

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

const HeroSection = () => {
  const t = useTranslations("about.hero")
  const width = useWindowWidth()

  return (
    <div className="overflow-x-clip">
      <div
        className="bg-primary flex h-[calc(100vh-60px)] flex-col items-center justify-center gap-10 bg-cover bg-no-repeat px-5 md:h-[calc(100vh-90px-60px)] md:px-0"
        style={{
          backgroundImage:
            width > 768
              ? "url('/images/about/background.svg')"
              : "url('/images/about/backgroundMobile.svg')",
        }}
      >
        <h1 className="text-primary-foreground text-center uppercase md:leading-[70px]">
          {t("title")}
          <br /> Antares Investments
        </h1>
        <p className="text-primary-foreground mx-auto max-w-[600px] text-center">
          <span className="font-bold">{t("subtitleBold")}</span>
          <br />
          {t("subtitle")}
        </p>
      </div>
      <p className="animate-marquee text-primary font-panchang flex h-[60px] items-center text-2xl text-nowrap">
        ANTARES INVESTMENTS • ANTARES INVESTMENTS • ANTARES INVESTMENTS •
        ANTARES INVESTMENTS • ANTARES INVESTMENTS • ANTARES INVESTMENTS •
        ANTARES INVESTMENTS • ANTARES INVESTMENTS • ANTARES INVESTMENTS •
      </p>
      <div className="bg-primary h-[1px] w-[100vw]" />
    </div>
  )
}

export default HeroSection
