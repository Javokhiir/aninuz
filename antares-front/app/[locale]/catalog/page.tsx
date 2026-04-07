import React from "react"
import { setRequestLocale } from "next-intl/server"
import { Locale } from "@/i18n/routing"

import Catalog from "./components"

const CatalogPage = async ({
  params,
}: {
  params: Promise<{ locale: Locale }>
}) => {
  const { locale } = await params
  setRequestLocale(locale)
  return <Catalog />
}

export default CatalogPage
