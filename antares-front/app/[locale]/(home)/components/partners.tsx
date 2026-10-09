"use client"

import { useTranslations } from "next-intl"

import { LogoCarousel } from "@/components/ui/logo-carousel"

const PARTNER_LOGOS = [
  { id: 1, name: "brandy", src: "/images/products/brand.png" },
  { id: 2, name: "garlock", src: "/images/products/gar.png" },
  { id: 3, name: "tritorc", src: "/images/products/tritor.png" },
  { id: 4, name: "INMARCO", src: "/images/products/inmar.png" },
  { id: 5, name: "Erith Global", src: "/images/products/erit.png" },
]

const PartnersSection = () => {
  const t = useTranslations("home.partners")

  return (
    <section className="relative z-30 mx-auto flex max-w-[1400px] flex-col items-center justify-center overflow-x-clip px-5 md:px-0">
      <h3 className="text-center text-2xl font-semibold uppercase md:text-3xl">
        {t("title")}
      </h3>
      <LogoCarousel logos={PARTNER_LOGOS} />
    </section>
  )
}

export default PartnersSection
