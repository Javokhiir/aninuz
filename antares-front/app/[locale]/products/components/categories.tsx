"use client"

import React, { useState } from "react"
import { Link } from "@/i18n/routing"
import { useQuery } from "@tanstack/react-query"
import { ChevronDown } from "lucide-react"
import { useTranslations } from "next-intl"

import { CategoriesResponse, Category } from "@/types/models/categories"
import { CompaniesResponse } from "@/types/models/company"
import { getCategories } from "@/http/requests/categories"
import { getCompanies } from "@/http/requests/companies"
import { Skeleton } from "@/components/ui/skeleton"

import { productsThemeVars } from "../theme"

// Categories shipping a background render. Keyed by slug; anything not listed
// falls back to its uploaded image, then to a letter mark.
const CATEGORY_VIDEOS = new Set([
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

// `content` is rich text from the admin editor; the card only has room for a
// few lines, so reduce the markup to plain text.
const plainText = (html: string | null) =>
  html
    ?.replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim() || null

const CategoryCard = ({
  category,
  href,
}: {
  category: Category
  href: string
}) => {
  const [open, setOpen] = useState(false)
  const t = useTranslations("products")

  const image = category.images?.[0]
  const video = CATEGORY_VIDEOS.has(category.slug)
    ? `/videos/categories/${category.slug}.webm`
    : null
  const title = categoryTitle(category)
  const description = plainText(localised(category, "content"))
  const children = category.children ?? []

  return (
    <div className="group relative">
      <div className="flex h-full flex-col overflow-hidden rounded-lg border border-[var(--card-border)] bg-[var(--card-bg)] transition-all duration-300 hover:border-[var(--accent)]">
        <Link href={href} className="block">
          <div className="relative h-64 overflow-hidden">
            {video ? (
              <video
                // React sets `muted` as a property, not an attribute, so Chrome
                // still treats the element as unmuted and blocks autoplay. Muting
                // via ref before asking it to play is what actually starts it.
                ref={(el) => {
                  if (!el) return
                  el.muted = true
                  void el.play().catch(() => {})
                }}
                src={video}
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
                aria-hidden
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
            ) : image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={image.preview_url || image.url}
                alt={title}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-white/[0.03]">
                <span className="text-7xl font-bold text-white/10 uppercase">
                  {title.charAt(0)}
                </span>
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-[var(--card-bg)] via-[var(--card-bg)]/60 to-transparent" />
            <div className="absolute right-0 bottom-0 left-0 p-6">
              <h3 className="mb-2 text-2xl tracking-tight text-white transition-colors group-hover:text-[var(--accent)]">
                {title}
              </h3>
            </div>
          </div>
        </Link>

        <div className="flex flex-1 flex-col p-6">
          {description && (
            <p className="mb-4 text-sm leading-relaxed text-gray-400">
              {description}
            </p>
          )}

          {children.length > 0 && (
            <div className="mt-auto">
              <button
                type="button"
                onClick={() => setOpen((v) => !v)}
                aria-expanded={open}
                className="flex w-full items-center justify-between text-sm font-medium text-[var(--accent)]"
              >
                {t("subcategories", { count: children.length })}
                <ChevronDown
                  className={`h-4 w-4 transition-transform duration-300 ${
                    open ? "rotate-180" : ""
                  }`}
                />
              </button>

              <div
                className={`grid transition-all duration-300 ${
                  open
                    ? "mt-4 grid-rows-[1fr] opacity-100"
                    : "grid-rows-[0fr] opacity-0"
                }`}
              >
                <ul className="space-y-2 overflow-hidden">
                  {children.map((child) => (
                    <li key={child.id}>
                      <Link
                        href={`${href.split("?")[0]}?category=${child.slug}`}
                        className="block text-sm text-gray-400 transition-colors hover:text-white"
                      >
                        {categoryTitle(child)}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

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
    <section
      className="bg-[var(--section-bg)] py-24"
      style={productsThemeVars}
    >
      <div className="mx-auto max-w-[1400px] px-6 lg:px-12">
        <div className="mb-16">
          <div className="mb-4 flex items-center space-x-3">
            <div className="h-[2px] w-12 bg-[var(--accent)]" />
            <span className="text-sm tracking-widest text-gray-400 uppercase">
              {t("categoriesEyebrow")}
            </span>
          </div>
          <h1 className="text-4xl tracking-tight text-white lg:text-5xl">
            {t("title")}
          </h1>
        </div>

        {isLoading ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton
                key={i}
                className="h-[420px] w-full rounded-lg bg-white/5"
              />
            ))}
          </div>
        ) : categories?.data.length ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
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
          <p className="py-16 text-center text-gray-400">{t("empty")}</p>
        )}
      </div>
    </section>
  )
}

export default Categories
