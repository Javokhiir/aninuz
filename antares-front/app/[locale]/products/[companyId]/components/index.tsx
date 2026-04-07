"use client"

import React, { useEffect } from "react"
import { Link } from "@/i18n/routing"
import { useCompanyColorStore } from "@/states/store"
import { useMutation, useQuery } from "@tanstack/react-query"
import { CircleAlertIcon } from "lucide-react"
import { useTranslations } from "next-intl"

import { CategoriesResponse } from "@/types/models/categories"
import { ProductsResponse } from "@/types/models/product"
import { getCategories } from "@/http/requests/categories"
import {
  getAllProductsByCompanyId,
  searchProductsByBrands,
} from "@/http/requests/products"
import { useQueryParams } from "@/hooks/useQueryParams"
import { Pagination } from "@/components/ui/pagination"
import { Skeleton } from "@/components/ui/skeleton"
import { Icons } from "@/components/icons"
import { SearchInput } from "@/components/Search"

import Filters from "./filters"
import ProductsSection from "./products"

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
          params: {
            page,
            per_page: 12,

            expand: images,
            category: filter,
          },
        },
      }),
    enabled: !search,
    staleTime: 0,
  })

  const searchMutation = useMutation({
    mutationFn: searchProductsByBrands,
    onSuccess: (data: ProductsResponse) => {
      setProductsData(data)
    },
  })

  useEffect(() => {
    if (search) {
      searchMutation.mutate({
        config: { params: { brand: companyId, query: search } },
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, companyId])

  const handleFilters = (filter: string) => {
    setParam("category", filter)
  }

  const { isLoading: isFiltersLoading, data: filters } =
    useQuery<CategoriesResponse>({
      queryKey: ["filters", page, companyId],
      queryFn: () =>
        getCategories({
          config: {
            params: {
              page: 1,
              per_page: 12,
              brand: companyId,
              expand: "parent, children.children.children.children",
            },
          },
        }),
    })

  const { color, setColor } = useCompanyColorStore()

  useEffect(() => {
    setColor(allProducts?.meta.color || "muted")
  }, [allProducts?.meta.color, setColor])

  const dataShow = search?.trim() ? productsData : allProducts

  return (
    <div className="mx-auto max-w-[1400px] space-y-10 px-4 py-10">
      <div className="flex items-center justify-center md:justify-start md:gap-10">
        <Link href="/products" className="mr-auto md:m-0">
          <Icons.ArrowLeft className="text-muted-foreground hover:text-primary h-full transition-all duration-150" />
        </Link>
        {isLoading ? (
          <Skeleton className="mr-auto h-[70px] w-[200px] md:w-[250px]" />
        ) : (
          <div
            className="mr-auto flex w-[200px] justify-center md:w-[250px]"
            dangerouslySetInnerHTML={{
              __html: allProducts?.meta.svg || "<svg></svg>",
            }}
          />
        )}
      </div>
      <div className="flex items-center justify-between gap-2">
        <SearchInput
          style={{ borderColor: color }}
          className={`border-2 bg-white md:max-w-[500px]`}
        />
        <div className="block md:hidden">
          <Filters
            handleFilters={handleFilters}
            categories={filters?.data || []}
          />
        </div>
      </div>
      <div className="flex gap-10">
        <div className="hidden md:block">
          {isFiltersLoading ? (
            <Skeleton className="h-[500px] w-[300px] max-w-[300px] rounded-[20px] border-2 bg-white" />
          ) : (
            <Filters
              handleFilters={handleFilters}
              categories={filters?.data || []}
            />
          )}
        </div>
        {isLoading || searchMutation.isPending ? (
          <div className="grid flex-1 grid-cols-2 gap-5 md:grid-cols-2 md:gap-10 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, idx) => (
              <Skeleton key={idx} className="h-[300px] w-full rounded-xl" />
            ))}
          </div>
        ) : (
          dataShow?.data &&
          dataShow?.data.length > 0 && (
            <ProductsSection
              companyName={companyId}
              products={dataShow?.data}
            />
          )
        )}
        {dataShow?.data.length === 0 && (
          <p className="text-muted-foreground ronuded-xl flex h-full w-full items-center gap-5 rounded-xl bg-white p-5">
            <CircleAlertIcon /> {t("notFound")}
          </p>
        )}
      </div>
      <Pagination limit={10} totalCount={allProducts?.meta.total || 0} />
    </div>
  )
}

export default CompanyProducts
