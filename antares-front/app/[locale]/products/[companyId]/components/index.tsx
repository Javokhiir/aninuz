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

  return (
    <section className="bg-[var(--section-bg)] py-16" style={productsThemeVars}>
      <div className="mx-auto max-w-[1400px] px-6 lg:px-12">
        <Link
          href="/products"
          className="mb-6 inline-flex items-center gap-2 text-sm text-gray-400 transition-colors hover:text-[var(--accent)]"
        >
          <ArrowLeft className="h-4 w-4" />
          {t("title")}
        </Link>

        <div className="mb-10">
          <div className="mb-4 flex items-center space-x-3">
            <div className="h-[2px] w-12 bg-[var(--accent)]" />
            <span className="text-sm tracking-widest text-gray-400 uppercase">
              {companyId}
            </span>
          </div>
          <h1 className="text-4xl tracking-tight text-white lg:text-5xl">
            {categoryTitle(activeCategory) || t("all")}
          </h1>
        </div>

        <div className="mb-8 flex items-center justify-between gap-3">
          <SearchInput className="border border-[var(--card-border)] bg-[var(--card-bg)] text-white md:max-w-[420px]" />
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
            <p className="flex h-min flex-1 items-center gap-3 rounded-lg border border-[var(--card-border)] bg-[var(--card-bg)] p-6 text-gray-400">
              <CircleAlertIcon className="h-5 w-5" /> {t("notFound")}
            </p>
          )}
        </div>

        <div className="mt-12">
          <Pagination limit={12} totalCount={allProducts?.meta.total || 0} />
        </div>
      </div>
    </section>
  )
}

export default CompanyProducts
