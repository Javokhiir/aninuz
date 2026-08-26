"use client"

import Image from "next/image"
import { Link } from "@/i18n/routing"
import { useQuery } from "@tanstack/react-query"
import { ArrowRight } from "lucide-react"
import { useTranslations } from "next-intl"

import { getAllServices } from "@/http/requests"
import { useQueryParams } from "@/hooks/useQueryParams"
import { Pagination } from "@/components/ui/pagination"

import { servicesThemeVars } from "../theme"

type ServiceItem = {
  id: number | string
  slug: string
  title?: string | null
  images: { preview_url_webp?: string; preview_url?: string; url?: string }[]
}

/**
 * One service, as a discrete catalogue card — the same recipe the products
 * grid uses, on the house blue. The media sits under a light brand duotone at
 * rest so the photograph reads, and deepens on hover: the card answers the
 * pointer by going to the brand colour rather than by dimming.
 */
const ServiceCard = ({ service }: { service: ServiceItem }) => {
  const t = useTranslations("services")
  const image = service.images?.[0]
  const src = image?.preview_url_webp || image?.preview_url || image?.url

  return (
    <Link
      href={`/services/${service.slug}`}
      className="group flex flex-col overflow-hidden border border-[var(--card-border)] bg-[var(--card-bg)] transition-[transform,border-color,box-shadow] duration-500 hover:-translate-y-1.5 hover:border-[var(--brand)] hover:shadow-[0_30px_60px_-30px_rgba(28,59,171,0.65)]"
      style={{
        borderRadius: "var(--radius-panel)",
        transitionTimingFunction: "var(--e-expo-out)",
      }}
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        {/* Ground. Brand blue shows wherever the media has not painted, so a
            service with no photograph still belongs to the palette. */}
        <div className="absolute inset-0 bg-[var(--brand)]" />

        {src ? (
          <Image
            src={src}
            alt={service.title ?? ""}
            width={600}
            height={450}
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-1000 group-hover:scale-108"
            style={{ transitionTimingFunction: "var(--e-expo-out)" }}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-6xl font-medium text-white/25 uppercase">
              {service.title?.charAt(0)}
            </span>
          </div>
        )}

        <div className="absolute inset-0 bg-[var(--brand)] opacity-20 mix-blend-multiply transition-opacity duration-700 group-hover:opacity-75" />
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--card-bg)] via-transparent to-transparent" />
      </div>

      <div className="flex flex-1 flex-col p-6">
        <h2 className="rtitle-xsmall mb-6 line-clamp-2 text-white transition-colors duration-300 group-hover:text-[var(--accent)]">
          {service.title}
        </h2>

        {/* Footer bar. Empty ground at rest, solid brand blue once the card is
            hovered — the card's main piece of colour. */}
        <div className="relative mt-auto -mx-6 -mb-6 overflow-hidden border-t border-[var(--card-border)] px-6 py-4">
          <div
            className="absolute inset-0 origin-left scale-x-0 bg-[var(--brand)] transition-transform duration-700 group-hover:scale-x-100"
            style={{ transitionTimingFunction: "var(--e-expo-out)" }}
            aria-hidden
          />
          <span className="label-mono relative flex items-center justify-between text-[var(--accent)] transition-colors duration-300 group-hover:text-[var(--on-brand)]">
            {t("browse")}
            <ArrowRight className="h-4 w-4 transition-transform duration-500 group-hover:translate-x-1" />
          </span>
        </div>
      </div>
    </Link>
  )
}

/**
 * Loading state. Cards of the real shape sweeping in brand blue, so the grid
 * holds its layout and its colour before any data lands.
 */
const GridSkeleton = ({ count = 8 }: { count?: number }) => (
  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
    {Array.from({ length: count }).map((_, i) => (
      <div
        key={i}
        className="overflow-hidden border border-[var(--card-border)] bg-[var(--card-bg)]"
        style={{ borderRadius: "var(--radius-panel)" }}
      >
        <div className="relative aspect-[4/3] overflow-hidden bg-[var(--wash)]">
          <div className="animate-shimmer absolute inset-0 bg-[length:200%_100%] bg-[linear-gradient(90deg,transparent,var(--brand),transparent)] opacity-60" />
        </div>
        <div className="space-y-3 p-6">
          <div className="h-6 w-3/5 animate-pulse rounded-full bg-[var(--brand)]/55" />
          <div className="h-4 w-2/5 animate-pulse rounded-full bg-[var(--brand)]/30" />
        </div>
      </div>
    ))}
  </div>
)

const Services = () => {
  const t = useTranslations("services")
  const { getParam } = useQueryParams()
  const page = getParam("page", "1")

  const { isLoading, data: services } = useQuery({
    queryKey: ["services", page],
    queryFn: () =>
      getAllServices({
        config: { params: { page, per_page: 12 } },
      }),
  })

  const total = services?.meta.total || 0

  return (
    <div className="min-h-svh bg-[var(--section-bg)]" style={servicesThemeVars}>
      {/* Banner. Blue and black rather than a field of colour: a light multiply
          for the hue, then a black scrim carrying most of the density. */}
      <header className="relative h-[clamp(340px,40vw,460px)] overflow-hidden">
        <div className="absolute inset-0 bg-[var(--brand)]" />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/posters/third.jpg"
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-[var(--brand)] opacity-40 mix-blend-multiply" />
        <div className="absolute inset-0 bg-black/45" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/45 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[var(--section-bg)] to-transparent" />

        <div className="rcontainer relative flex h-full flex-col justify-end pt-28 pb-10">
          <h1 className="rtitle rtitle-large mb-4 text-white">{t("title")}</h1>

          <p className="max-w-[54ch] text-sm leading-relaxed text-white/70 md:text-base">
            {t("lead")}
          </p>
        </div>
      </header>

      <section className="pt-14 pb-24">
        <div className="rcontainer">
          <div className="label-mono mb-8 flex items-center justify-end border-b border-[var(--card-border)] pb-4">
            <span className="text-[var(--accent)]">
              {t("count", { count: total })}
            </span>
          </div>

          {isLoading ? (
            <GridSkeleton />
          ) : services?.data?.length ? (
            <>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {services.data.map((service: ServiceItem) => (
                  <ServiceCard key={service.id} service={service} />
                ))}
              </div>
              <div className="mt-12">
                <Pagination limit={12} totalCount={total} />
              </div>
            </>
          ) : (
            <p className="py-24 text-center text-white/50">{t("empty")}</p>
          )}
        </div>
      </section>
    </div>
  )
}

export default Services
