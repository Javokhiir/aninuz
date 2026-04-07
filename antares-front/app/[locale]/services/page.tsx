import { setRequestLocale } from "next-intl/server"
import { Locale } from "@/i18n/routing"

import Services from "./components"

const ServicesPage = async ({
  params,
}: {
  params: Promise<{ locale: Locale }>
}) => {
  const { locale } = await params
  setRequestLocale(locale)
  return <Services />
}

export default ServicesPage
