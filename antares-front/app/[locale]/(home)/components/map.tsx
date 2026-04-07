import React from "react"
import Map from "@/public/images/map/map"
import { useTranslations } from "next-intl"

const MapSection = () => {
  const t = useTranslations("home.map")
  return (
    <section className="mx-auto max-w-[1400px] space-y-5 px-5 md:space-y-20">
      <h2 className="mx-auto w-fit bg-gradient-to-r from-blue-700 to-black bg-clip-text text-center font-extrabold text-transparent uppercase md:leading-16">
        {t("title")}
      </h2>
      <div className="flex w-full flex-col justify-center gap-5 md:flex-row">
        <div className="w-full md:max-w-[230px] md:space-y-[200px]">
          <div className="space-y-2">
            <h3 className="text-center text-xl font-semibold md:w-min md:text-left">
              Antares Investments
            </h3>
            <p className="text-muted-foreground text-center md:text-left">
              {t("subtitle")}
            </p>
          </div>
        </div>
        <Map className="h-full max-w-[300px] sm:max-w-[600px] md:max-w-full" />
      </div>
    </section>
  )
}

export default MapSection
