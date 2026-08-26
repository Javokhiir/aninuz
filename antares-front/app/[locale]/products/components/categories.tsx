"use client"

import React, { useRef } from "react"
import { Link } from "@/i18n/routing"
import { useQuery } from "@tanstack/react-query"
import { ArrowRight } from "lucide-react"
import { useTranslations } from "next-intl"

import { CategoriesResponse, Category } from "@/types/models/categories"
import { CompaniesResponse } from "@/types/models/company"
import { getCategories } from "@/http/requests/categories"
import { getCompanies } from "@/http/requests/companies"

import { productsThemeVars } from "../theme"

// Categories shipping their own footage and poster frame in `public/`. Keyed by
// slug; anything not listed falls back to its uploaded image, then to the flat
// brand ground.
const CATEGORY_MEDIA = new Set([
  "compression-packings",
  "flange-isolation-gaskets",
  "flange-joint-gaskets",
  "graphite-moulded-products",
  "metallic-gaskets",
  "thermal-insulation",
  "wiping-pad",
])

// The API only fills `title`/`content` for the active locale, so an untranslated
// category comes back null. Fall back to any translation we have, then the slug,
// so a card never renders empty.
const localised = (category: Category, field: "title" | "content") =>
  category[field] ||
  category.translations?.find((translation) => translation[field])?.[field] ||
  null

const categoryTitle = (category: Category) =>
  localised(category, "title") || category.slug

/**
 * One category, as a discrete product-catalogue card.
 *
 * The media is the card's top half: the poster frame at rest under a brand-red
 * duotone, which is what carries the Inmarco colour across the whole grid, and
 * the category's own clip playing once the card is hovered. Only the hovered
 * clip plays — seven autoplaying videos would run seven decoders for footage
 * nobody is looking at.
 */
const CategoryCard = ({
  category,
  href,
}: {
  category: Category
  href: string
}) => {
  const videoRef = useRef<HTMLVideoElement>(null)
  const t = useTranslations("products")

  const title = categoryTitle(category)
  const children = category.children ?? []
  const media = CATEGORY_MEDIA.has(category.slug)
  const uploaded = category.images?.[0]?.preview_url || category.images?.[0]?.url
  const poster = media ? `/images/posters/${category.slug}.jpg` : uploaded

  const play = () => {
    const video = videoRef.current
    if (!video) return
    video.muted = true
    void video.play().catch(() => {})
  }

  const stop = () => {
    const video = videoRef.current
    if (!video) return
    video.pause()
    video.currentTime = 0
  }

  return (
    <Link
      href={href}
      onMouseEnter={play}
      onMouseLeave={stop}
      className="group flex flex-col overflow-hidden border border-[var(--card-border)] bg-[var(--card-bg)] transition-[transform,border-color,box-shadow] duration-500 hover:-translate-y-1.5 hover:border-[var(--brand)] hover:shadow-[0_30px_60px_-30px_rgba(209,20,16,0.55)]"
      style={{
        borderRadius: "var(--radius-panel)",
        transitionTimingFunction: "var(--e-expo-out)",
      }}
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        {/* Ground. Brand red shows wherever the media has not painted, so a
            category with no footage still belongs to the palette. */}
        <div className="absolute inset-0 bg-[var(--brand)]" />

        {poster && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={poster}
            alt=""
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-1000 group-hover:scale-108"
            style={{ transitionTimingFunction: "var(--e-expo-out)" }}
          />
        )}

        {media && (
          <video
            ref={videoRef}
            src={`/videos/categories/${category.slug}.webm`}
            muted
            loop
            playsInline
            preload="none"
            aria-hidden
            className="absolute inset-0 h-full w-full object-cover opacity-0 transition-[opacity,transform] duration-1000 group-hover:scale-108 group-hover:opacity-100"
            style={{ transitionTimingFunction: "var(--e-expo-out)" }}
          />
        )}

        {/* Duotone. Multiply keeps the footage's own contrast while forcing its
            hue toward the brand red. Deliberately light: these posters are shot
            on white, and multiply turns every white pixel the full strength of
            whatever sits over it — at the old 20/75 the grid read as pink
            plates rather than photographs. A tenth at rest is a tint, and the
            hover lands on Inmarco's own lighter red rather than the deep one.
            The card still answers the pointer by going to the partner's colour;
            it just no longer drowns the product doing it. */}
        <div className="absolute inset-0 bg-[var(--brand-soft)] opacity-10 mix-blend-multiply transition-opacity duration-700 group-hover:opacity-45" />
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--card-bg)] via-transparent to-transparent" />

        {children.length > 0 && (
          <span className="label-mono absolute top-4 left-4 rounded-full bg-[var(--brand)] px-3 py-1.5 text-[var(--on-brand)]">
            {t("subcategories", { count: children.length })}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-6">
        <h2 className="rtitle-xsmall mb-3 text-white transition-colors duration-300 group-hover:text-[var(--accent)]">
          {title}
        </h2>

        {children.length > 0 && (
          <p className="mb-6 line-clamp-2 text-sm leading-relaxed text-white/45">
            {children
              .slice(0, 4)
              .map((child) => categoryTitle(child))
              .join(" · ")}
            {children.length > 4 && ` · +${children.length - 4}`}
          </p>
        )}

        {/* Footer bar. Empty ground at rest, solid brand red once the card is
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
 * Loading state. Cards of the real shape sweeping in brand red, so the grid
 * holds its layout and its colour before any data lands.
 */
const GridSkeleton = ({ count = 6 }: { count?: number }) => (
  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
    {Array.from({ length: count }).map((_, i) => (
      <div
        key={i}
        className="overflow-hidden border border-[var(--card-border)] bg-[var(--card-bg)]"
        style={{ borderRadius: "var(--radius-panel)" }}
      >
        <div className="relative aspect-[4/3] overflow-hidden bg-[var(--wash)]">
          <div className="animate-shimmer absolute inset-0 bg-[length:200%_100%] bg-[linear-gradient(90deg,transparent,var(--brand),transparent)] opacity-50" />
        </div>
        <div className="space-y-3 p-6">
          <div className="h-6 w-3/5 animate-pulse rounded-full bg-[var(--brand)]/45" />
          <div className="h-4 w-4/5 animate-pulse rounded-full bg-[var(--brand)]/20" />
        </div>
      </div>
    ))}
  </div>
)

const Categories = () => {
  const t = useTranslations("products")

  const { isLoading, data: categories } = useQuery<CategoriesResponse>({
    queryKey: ["root-categories"],
    queryFn: () =>
      getCategories({
        config: {
          params: {
            per_page: 100,
            // Site\CategoryController splits `expand` on ", ", so the space matters.
            expand: "children, images",
          },
        },
      }),
  })

  // Products are still listed per brand, so a category card has to point at the
  // brand listing with the category pre-selected.
  const { data: companies } = useQuery<CompaniesResponse>({
    queryKey: ["companies", "1"],
    queryFn: () => getCompanies({ config: { params: { page: 1 } } }),
  })

  const brandSlug = companies?.data[0]?.slug

  return (
    <div className="min-h-svh bg-[var(--section-bg)]" style={productsThemeVars}>
      {/* Banner. A real image band rather than a slab of flat colour: the
          hero still under a brand-red duotone, with the copy on the ramped
          left side. */}
      <header className="relative h-[clamp(340px,40vw,460px)] overflow-hidden">
        <div className="absolute inset-0 bg-[var(--brand)]" />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/posters/hero-reel.jpg"
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
        />
        {/* Red and black rather than a field of red: a light multiply for the
            hue, then a black scrim that carries most of the density. The banner
            stays in the partner's colour without shouting it. */}
        <div className="absolute inset-0 bg-[var(--brand)] opacity-40 mix-blend-multiply" />
        <div className="absolute inset-0 bg-black/45" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/45 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[var(--section-bg)] to-transparent" />

        <div className="rcontainer relative flex h-full flex-col justify-end pt-28 pb-10">
          <div className="mb-5 flex items-center gap-4">
            <div className="h-[2px] w-12 bg-[var(--brand)]" />
            <span className="label-mono text-white/70">
              {t("categoriesEyebrow")}
            </span>
          </div>

          <h1 className="rtitle rtitle-large mb-4 text-white">{t("title")}</h1>

          <p className="max-w-[54ch] text-sm leading-relaxed text-white/70 md:text-base">
            {t("lead")}
          </p>
        </div>
      </header>

      <section className="pt-14 pb-24">
        <div className="rcontainer">
          {/* Catalogue bar: what the grid is, and how much of it there is. */}
          <div className="label-mono mb-8 flex items-center justify-between border-b border-[var(--card-border)] pb-4">
            <span className="flex items-center gap-3 text-white/60">
              <span className="h-2 w-2 rounded-full bg-[var(--brand)]" />
              {t("partner")}
            </span>
            <span className="text-[var(--accent)]">
              {t("count", { count: categories?.data.length ?? 0 })}
            </span>
          </div>

          {isLoading ? (
            <GridSkeleton />
          ) : categories?.data.length ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {categories.data.map((category) => (
                <CategoryCard
                  key={category.id}
                  category={category}
                  href={
                    brandSlug
                      ? `/products/${brandSlug}?category=${category.slug}`
                      : "/products"
                  }
                />
              ))}
            </div>
          ) : (
            <p className="py-24 text-center text-white/50">{t("empty")}</p>
          )}
        </div>
      </section>
    </div>
  )
}

export default Categories
