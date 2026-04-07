import React from "react"
import { setRequestLocale } from "next-intl/server"
import { Locale } from "@/i18n/routing"

import Gallery from "./components"

const GalleryPage = async ({
  params,
}: {
  params: Promise<{ locale: Locale }>
}) => {
  const { locale } = await params
  setRequestLocale(locale)
  return (
    <div>
      <Gallery />
    </div>
  )
}

export default GalleryPage
