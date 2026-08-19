"use client"

import { Link } from "@/i18n/routing"
import { useQuery } from "@tanstack/react-query"
import { useTranslations } from "next-intl"

import { CategoriesResponse, Category } from "@/types/models/categories"
import { CompaniesResponse } from "@/types/models/company"
import { getCategories } from "@/http/requests/categories"
import { getCompanies } from "@/http/requests/companies"
import { useQueryParams } from "@/hooks/useQueryParams"
import { Pagination } from "@/components/ui/pagination/index"
import { Skeleton } from "@/components/ui/skeleton"
import BorderGlow from "@/components/ui/BorderGlow"

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
// couple of lines, so strip the markup down to plain text.
const plainText = (html: string | null) =>
  html
    ?.replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim() || null

const Categories = () => {
  const { getParam } = useQueryParams()
  const page = getParam("page", "1")
  const t = useTranslations("products")

  const { isLoading, data: categories } = useQuery<CategoriesResponse>({
    queryKey: ["root-categories", page],
    queryFn: () =>
      getCategories({
        config: {
          params: {
            page,
            per_page: 12,
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

  if (isLoading) {
    return (
      <div className="grid w-full grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 md:gap-8">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-[340px] w-full rounded-[20px]" />
        ))}
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-[1400px]">
      <div className="grid w-full grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 md:gap-8">
        {categories?.data.map((category: Category) => {
          const image = category.images?.[0]
          const description = plainText(localised(category, "content"))
          const childCount = category.children?.length ?? 0

          return (
            <Link
              key={category.id}
              className="w-full"
              href={
                brandSlug
                  ? `/products/${brandSlug}?category=${category.slug}`
                  : "/products"
              }
            >
              <BorderGlow
                borderRadius={20}
                backgroundColor="#0a1628"
                glowColor="210 80 70"
                colors={["#60a5fa", "#818cf8", "#38bdf8"]}
                glowRadius={35}
                glowIntensity={1.2}
                coneSpread={28}
                fillOpacity={0.4}
                className="h-full w-full transition-transform duration-300 hover:-translate-y-1"
              >
                <div className="flex h-full flex-col">
                  <div className="relative h-[180px] w-full shrink-0 overflow-hidden rounded-t-[20px] bg-white/5">
                    {image ? (
                      <img
                        src={image.preview_url || image.url}
                        alt={categoryTitle(category)}
                        loading="lazy"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center">
                        <span className="text-5xl font-extrabold text-white/10 uppercase">
                          {categoryTitle(category).charAt(0)}
                        </span>
                      </div>
                    )}
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#0a1628] to-transparent p-4 pt-10">
                      <h2 className="text-lg leading-tight font-bold text-white">
                        {categoryTitle(category)}
                      </h2>
                    </div>
                  </div>

                  <div className="flex flex-1 flex-col justify-between gap-4 p-5">
                    {description ? (
                      <p className="line-clamp-3 text-sm leading-relaxed text-white/60">
                        {description}
                      </p>
                    ) : (
                      <span />
                    )}
                    {childCount > 0 && (
                      <p className="text-xs font-semibold tracking-widest text-sky-400 uppercase">
                        {t("subcategories", { count: childCount })}
                      </p>
                    )}
                  </div>
                </div>
              </BorderGlow>
            </Link>
          )
        })}
      </div>

      {categories?.meta.total === 0 && (
        <div className="py-16 text-center text-gray-400">{t("empty")}</div>
      )}

      <div className="mt-8">
        <Pagination limit={12} totalCount={categories?.meta.total || 0} />
      </div>
    </div>
  )
}

export default Categories
