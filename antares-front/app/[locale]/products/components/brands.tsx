"use client"

import Image from "next/image"
import { Link } from "@/i18n/routing"
import { useQuery } from "@tanstack/react-query"
import { ArrowRight } from "lucide-react"
import { motion, useReducedMotion } from "motion/react"
import { useTranslations } from "next-intl"

import { CompaniesResponse, Company } from "@/types/models/company"
import { getCompanies } from "@/http/requests/companies"

import { PRODUCT_BRANDS, ProductBrandProfile } from "../theme"

const normalise = (value: string) =>
  value.toLowerCase().replace(/[^a-z0-9]/g, "")

const companyNames = (company: Company) => [
  company.slug,
  company.title ?? "",
  ...(company.translations?.map((translation) => translation.title ?? "") ??
    []),
]

const resolveBrandSlug = (
  brand: ProductBrandProfile,
  companies?: CompaniesResponse
) => {
  const aliases = brand.aliases.map(normalise)
  const company = companies?.data.find((candidate) =>
    companyNames(candidate).some((name) => {
      const normalisedName = normalise(name)
      return aliases.some((alias) => normalisedName.includes(alias))
    })
  )

  return company?.slug ?? brand.fallbackSlug
}

const BrandCard = ({
  brand,
  href,
  index,
}: {
  brand: ProductBrandProfile
  href: string
  index: number
}) => {
  const t = useTranslations("products.brandSelector")
  const reduceMotion = useReducedMotion()

  return (
    <Link href={href} className="group block h-full">
      <motion.article
        initial={reduceMotion ? false : { opacity: 0, y: 28 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.7,
          delay: index * 0.1,
          ease: [0.16, 1, 0.3, 1],
        }}
        className="relative min-h-[420px] overflow-hidden border border-white/10 bg-[#17191b] transition-[transform,border-color] duration-500 group-hover:-translate-y-1.5 group-hover:border-[var(--selector-accent)] md:min-h-[500px]"
        style={
          {
            "--selector-accent": brand.theme.brand,
            "--selector-on": brand.theme.onBrand,
            borderRadius: "var(--radius-panel)",
            transitionTimingFunction: "var(--e-expo-out)",
          } as React.CSSProperties
        }
      >
        <Image
          src={brand.heroImage}
          alt=""
          fill
          sizes="(max-width: 767px) 100vw, 50vw"
          className="object-cover transition-transform duration-1000 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-black/40" />
        <div
          className="absolute inset-0 opacity-45 mix-blend-multiply transition-opacity duration-500 group-hover:opacity-65"
          style={{ backgroundColor: brand.theme.brand }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0c0d0e] via-[#0c0d0e]/35 to-transparent" />

        <div className="relative flex min-h-[420px] flex-col justify-between p-6 md:min-h-[500px] md:p-9">
          <div className="flex h-24 w-48 items-center justify-center bg-white px-5 py-3 shadow-[0_14px_40px_rgba(0,0,0,0.18)] md:h-28 md:w-56">
            <Image
              src={brand.logo}
              alt={`${brand.name} logo`}
              width={340}
              height={150}
              className="h-full w-full object-contain"
            />
          </div>

          <div>
            <h2 className="rtitle rtitle-small mb-4 text-white">
              {brand.name}
            </h2>
            <p className="mb-8 max-w-[48ch] text-sm leading-relaxed text-white/70 md:text-base">
              {t(`brands.${brand.translationKey}.description`)}
            </p>

            <span className="relative flex items-center justify-between overflow-hidden border-t border-white/15 pt-5 text-sm font-medium text-white">
              <span>{t("open")}</span>
              <span
                className="flex h-11 w-11 items-center justify-center rounded-full bg-[var(--selector-accent)] text-[var(--selector-on)] transition-transform duration-500 group-hover:translate-x-1"
                aria-hidden
              >
                <ArrowRight className="h-5 w-5" />
              </span>
            </span>
          </div>
        </div>
      </motion.article>
    </Link>
  )
}

const Brands = () => {
  const t = useTranslations("products.brandSelector")

  const { data: companies } = useQuery<CompaniesResponse>({
    queryKey: ["product-brand-selector"],
    queryFn: () => getCompanies({ config: { params: { page: 1 } } }),
    staleTime: 5 * 60 * 1000,
  })

  return (
    <main className="min-h-[calc(100dvh-90px)] bg-[#0d0f12] text-white">
      <section className="rcontainer pt-20 pb-20 md:pt-24 md:pb-28">
        <div className="mb-10 max-w-[760px] md:mb-14">
          <p className="label-mono mb-5 text-white/45">{t("eyebrow")}</p>
          <h1 className="rtitle rtitle-large mb-5 text-white">{t("title")}</h1>
          <p className="max-w-[62ch] text-sm leading-relaxed text-white/60 md:text-base">
            {t("lead")}
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-[1.08fr_0.92fr]">
          {PRODUCT_BRANDS.map((brand, index) => (
            <BrandCard
              key={brand.id}
              brand={brand}
              index={index}
              href={`/products/${resolveBrandSlug(brand, companies)}`}
            />
          ))}
        </div>
      </section>
    </main>
  )
}

export default Brands
