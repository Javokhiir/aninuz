"use client"

import React, { useEffect } from "react"
import { Link } from "@/i18n/routing"
import { useMutation, useQuery } from "@tanstack/react-query"
import { ArrowLeft, CircleAlertIcon } from "lucide-react"
import { useTranslations } from "next-intl"

import { CategoriesResponse, Category } from "@/types/models/categories"
import { ProductsResponse } from "@/types/models/product"
import { getCategories } from "@/http/requests/categories"
import {
  getAllProductsByCompanyId,
  searchProductsByBrands,
} from "@/http/requests/products"
import { useQueryParams } from "@/hooks/useQueryParams"
import { Pagination } from "@/components/ui/pagination"
import { SearchInput } from "@/components/Search"

import { productsThemeVars } from "../../theme"
import Filters from "./filters"
import ProductsSection, { ProductsGridSkeleton } from "./products"

const categoryTitle = (category?: Category) =>
  category &&
  (category.title ||
    category.translations?.find((translation) => translation.title)?.title ||
    category.slug)

const CompanyProducts = ({ companyId }: { companyId: string }) => {
  const { getParam, setParam } = useQueryParams()
  const images = getParam("expand", "images")
  const page = getParam("page", "1")
  const filter = getParam("category")
  const search = getParam("search")
  const t = useTranslations("products")

  const [productsData, setProductsData] = React.useState<ProductsResponse>()

  const { isLoading, data: allProducts } = useQuery<ProductsResponse>({
    queryKey: ["products", page, companyId, images, filter],
    queryFn: () =>
      getAllProductsByCompanyId({
        brand: companyId,
        config: {
          params: { page, per_page: 12, expand: images, category: filter },
        },
      }),
    enabled: !search,
    staleTime: 0,
  })

  const searchMutation = useMutation({
    mutationFn: searchProductsByBrands,
    onSuccess: (data: ProductsResponse) => setProductsData(data),
  })

  useEffect(() => {
    if (search) {
      searchMutation.mutate({
        config: { params: { brand: companyId, query: search } },
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, companyId])

  const handleFilters = (filter: string) => setParam("category", filter)

  const { data: filters } = useQuery<CategoriesResponse>({
    queryKey: ["filters", companyId],
    queryFn: () =>
      getCategories({
        config: {
          params: {
            per_page: 100,
            // Site\CategoryController splits `expand` on ", ", so the space matters.
            expand: "children.children.children",
          },
        },
      }),
  })

  const dataShow = search?.trim() ? productsData : allProducts
  const pending = isLoading || searchMutation.isPending

  // Name the page after the selected category so the header is not empty when a
  // brand has no logo to show.
  const activeCategory = filters?.data.find((c) => c.slug === filter)

  // The banner reuses the selected category's poster so the page keeps the
  // subject it was opened for; the reel still stands in for "all products".
  const bannerPoster = filter
    ? `/images/posters/${filter}.jpg`
    : "/images/posters/hero-reel.jpg"

  return (
    <div className="min-h-svh bg-[var(--section-bg)]" style={productsThemeVars}>
      {/* Same banner language as the category index, one step shorter — this is
          a level down in the catalogue, not its front door. */}
      <header className="relative h-[clamp(260px,28vw,340px)] overflow-hidden">
        <div className="absolute inset-0 bg-[var(--brand)]" />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={bannerPoster}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-[var(--brand)] opacity-40 mix-blend-multiply" />
        <div className="absolute inset-0 bg-black/45" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/45 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[var(--section-bg)] to-transparent" />

        <div className="rcontainer relative flex h-full flex-col justify-end pt-28 pb-8">
          <Link
            href="/products"
            className="label-mono mb-5 inline-flex w-max items-center gap-2 text-white/70 transition-colors hover:text-[var(--accent)]"
          >
            <ArrowLeft className="h-4 w-4" />
            {t("title")}
          </Link>
          <h1 className="rtitle rtitle-large text-white">
            {categoryTitle(activeCategory) || t("all")}
          </h1>
        </div>
      </header>

      <section className="pt-10 pb-24">
        <div className="rcontainer">
          <div className="label-mono mb-8 flex items-center gap-3 border-b border-[var(--card-border)] pb-4 text-white/60">
            <span className="h-2 w-2 rounded-full bg-[var(--brand)]" />
            {companyId}
          </div>

        <div className="mb-8 flex items-center justify-between gap-3">
          <SearchInput className="rounded-[var(--radius-fluid)] border border-[var(--card-border)] bg-[var(--card-bg)] text-white md:max-w-[420px]" />
          <div className="block md:hidden">
            <Filters
              handleFilters={handleFilters}
              categories={filters?.data || []}
            />
          </div>
        </div>

        <div className="flex gap-8">
          <div className="hidden md:block">
            <Filters
              handleFilters={handleFilters}
              categories={filters?.data || []}
            />
          </div>

          {pending ? (
            <ProductsGridSkeleton />
          ) : dataShow?.data?.length ? (
            <ProductsSection companyName={companyId} products={dataShow.data} />
          ) : (
            <p className="flex h-min flex-1 items-center gap-3 rounded-[var(--radius-panel)] border border-[var(--card-border)] bg-[var(--card-bg)] p-6 text-white/50">
              <CircleAlertIcon className="h-5 w-5" /> {t("notFound")}
            </p>
          )}
        </div>

          <div className="mt-12">
            <Pagination limit={12} totalCount={allProducts?.meta.total || 0} />
          </div>
        </div>
      </section>
    </div>
  )
}

export default CompanyProducts
