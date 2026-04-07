"use client"

import React from "react"
import { useParams } from "next/navigation"
import { Link, usePathname } from "@/i18n/routing"
// import { useCartStore, useCompanyColorStore } from "@/states/store"
import { useQuery } from "@tanstack/react-query"
import { useTranslations } from "next-intl"

import { ProductResponse } from "@/types/models/product"
import { getProductById } from "@/http/requests/products"
import { useQueryParams } from "@/hooks/useQueryParams"
import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
// import { Counter } from "@/components/ui/counter"
// import SpecialButton from "@/components/ui/special-button"
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table"
import { Icons } from "@/components/icons"

import ProductAccordion from "./accordion"
import ProductImageCarousel from "./carousel"
import ProductContent from "./productContent"

// import ProductToolsView from "./tools"

const ProductId = () => {
  const pathname = usePathname()

  const t = useTranslations("products.productId")

  const { getParam } = useQueryParams()
  const images = getParam("expand", "images, faqs")
  const product_slug = pathname.split("/")[3]

  const { isLoading, data: product } = useQuery<ProductResponse>({
    queryKey: ["product", product_slug, images],
    queryFn: () =>
      getProductById({
        product_slug,
        config: {
          params: { expand: images },
        },
      }),
  })

  const { companyId } = useParams()

  // const t = useTranslations("products.productId")
  return isLoading ? (
    <div className="layout-container">
      <div className="flex flex-col justify-center gap-5 py-10 md:flex-row md:gap-10">
        <div className="w-full md:order-2">
          <Skeleton className="h-[400px] w-full rounded-xl" />
        </div>
        <div className="w-full space-y-5 md:order-1">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton key={i} className="h-[50px] w-full rounded-xl" />
          ))}
        </div>
      </div>
      <Skeleton className="h-[500px] w-full rounded-xl" />
    </div>
  ) : (
    <div className="layout-container space-y-10 py-10 md:space-y-20">
      <Link href={`/products/${companyId}`}>
        <button className="mr-auto cursor-pointer md:m-0">
          <Icons.ArrowLeft className="text-muted-foreground hover: h-full transition-all duration-150" />
        </button>
      </Link>

      <div className="flex flex-col gap-10 py-5 md:flex-row">
        {product?.data && <ProductContent product={product.data} />}
        {product?.data && product.data.images.length > 0 && (
          <ProductImageCarousel images={product.data.images} />
        )}
      </div>

      <div className="w-full space-y-10">
        {product?.data && product?.data.table_content && (
          <div className="flex w-full flex-col gap-10 overflow-x-scroll md:flex-row">
            <div className="w-full space-y-5">
              <p className="text-lg font-bold">{t("technicalDetails")}</p>
              <div
                className="w-full"
                dangerouslySetInnerHTML={{ __html: product.data.table_content }}
              />
            </div>
          </div>
        )}
        {product?.data && (
          <div className="flex w-full flex-col gap-10 overflow-x-scroll md:flex-row">
            <div className="w-full space-y-5">
              <div
                className="w-full"
                dangerouslySetInnerHTML={{
                  __html: product.data.table_content_second,
                }}
              />
            </div>
          </div>
        )}
      </div>
      {product?.data && product.data.faqs!.length > 0 ? (
        <div className="space-y-10">
          <h3 className="text-center text-3xl font-semibold">{t("faq")}</h3>
          <Card className="border-0 px-5">
            <ProductAccordion faqs={product.data.faqs || []} />
          </Card>
        </div>
      ) : null}

      {/* <ProductToolsView /> */}
    </div>
  )
}

export default ProductId
