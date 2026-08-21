import { setRequestLocale, getTranslations } from "next-intl/server"
import { Locale } from "@/i18n/routing"

import Preloader from "@/components/motion/preloader"
import SmoothScroll from "@/components/motion/smooth-scroll"
import {
  FloatingCta,
  type FloatingAction,
} from "@/components/relats/site-chrome"

import CapabilitiesSection from "./components/capabilities"
import HeroSection from "./components/hero"
import IndustriesSection from "./components/industries"
import LineSection from "./components/line"
import MapSection from "./components/map"
import MosaicSection from "./components/mosaic"
import Partners from "./components/partners"
import UcScene from "@/components/uc/UcScene"
import SustainabilitySection from "./components/sustainability"

/**
 * Landing page.
 *
 * Chrome is two fixed pills for the whole scroll — the site bar hides itself
 * here — and the body is a run of full-bleed sections, most of them sticky and
 * scroll-scrubbed, with the flat document sections held back to the tail.
 */
export default async function Home({
  params,
}: {
  params: Promise<{ locale: Locale }>
}) {
  const { locale } = await params
  setRequestLocale(locale)

  const t = await getTranslations({ locale, namespace: "home.cta" })

  // The bottom pill swaps its label as each section takes the middle of the
  // screen, so one control serves the whole page.
  const actions: FloatingAction[] = [
    {
      id: "hero",
      label: t("catalog"),
      href: "/catalog",
      thumbnail: "/images/posters/thermal-insulation.jpg",
    },
    {
      id: "capabilities",
      label: t("engineer"),
      href: "/contacts",
      thumbnail: "/images/posters/third.jpg",
    },
    {
      id: "mosaic",
      label: t("products"),
      href: "/products",
      thumbnail: "/images/posters/compression-packings.jpg",
    },
    {
      id: "industries",
      label: t("services"),
      href: "/services",
      thumbnail: "/images/posters/metallic-gaskets.jpg",
    },
    {
      id: "sustainability",
      label: t("about"),
      href: "/about",
      thumbnail: "/images/posters/graphite-moulded-products.jpg",
    },
  ]

  return (
    <>
      <Preloader />
      <SmoothScroll />

      <HeroSection />
      <MosaicSection />
      <CapabilitiesSection />
      <IndustriesSection />
      <UcScene />
      <SustainabilitySection />

      <div className="rcontainer space-y-16 py-20 md:space-y-24 md:py-28">
        <Partners />
        <MapSection />
        <LineSection />
      </div>

      <FloatingCta actions={actions} />
    </>
  )
}
