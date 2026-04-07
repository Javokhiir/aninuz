import React from "react"
import { useTranslations } from "next-intl"

import Events from "./components"

const EventsPage = () => {
  const t = useTranslations("events")
  return (
    <div className="mx-auto max-w-[1400px] space-y-10 p-5 py-10 md:space-y-0 md:p-0 md:px-5 md:py-0">
      <h1 className="mx-auto bg-gradient-to-r from-black via-blue-700 to-black bg-clip-text text-center font-extrabold text-transparent uppercase md:p-10">
        {t("title")}
      </h1>
      <Events />
    </div>
  )
}

export default EventsPage
