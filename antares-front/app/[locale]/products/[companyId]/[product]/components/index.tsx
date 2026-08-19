"use client"

import React from "react"
import { useParams } from "next/navigation"
import { Link, usePathname } from "@/i18n/routing"
import { useQuery } from "@tanstack/react-query"
import { ArrowLeft } from "lucide-react"
import { useTranslations } from "next-intl"

import { ProductResponse } from "@/types/models/product"
import { getProductById } from "@/http/requests/products"
import { useQueryParams } from "@/hooks/useQueryParams"

import { productsThemeVars } from "../../../theme"
import ProductAccordion from "./accordion"
import ProductImageCarousel from "./carousel"
import ProductContent from "./productContent"

const DetailSkeleton = () => (
  <div className="space-y-16">
    <div className="grid gap-12 lg:grid-cols-2">
      <div className="aspect-square w-full animate-pulse rounded-lg bg-white/[0.04]" />
      <div className="space-y-4">
        <div className="h-12 w-2/3 animate-pulse rounded bg-white/[0.06]" />
        <div className="h-[2px] w-12 bg-white/[0.06]" />
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="h-4 w-full animate-pulse rounded bg-white/[0.04]"
          />
        ))}
        <div className="h-12 w-full animate-pulse rounded-lg bg-white/[0.06]" />
      </div>
    </div>
    <div className="h-64 w-full animate-pulse rounded-lg bg-white/[0.04]" />
  </div>
)

const ProductId = () => {
  const pathname = usePathname()
  const t = useTranslations("products.productId")
  const { getParam } = useQueryParams()
  const expand = getParam("expand", "images, faqs")
  const product_slug = pathname.split("/")[3]
  const { companyId } = useParams()

  const { isLoading, data: product } = useQuery<ProductResponse>({
    queryKey: ["product", product_slug, expand],
    queryFn: () =>
      getProductById({ product_slug, config: { params: { expand } } }),
  })

  const data = product?.data
  const faqs = data?.faqs ?? []

  return (
    <section className="bg-[var(--section-bg)] py-16" style={productsThemeVars}>
      <div className="mx-auto max-w-[1400px] px-6 lg:px-12">
        <Link
          href={`/products/${companyId}`}
          className="mb-10 inline-flex items-center gap-2 text-sm text-gray-400 transition-colors hover:text-[var(--accent)]"
        >
          <ArrowLeft className="h-4 w-4" />
          {companyId}
        </Link>

        {isLoading || !data ? (
          <DetailSkeleton />
        ) : (
          <div className="space-y-16">
            <div className="grid gap-12 lg:grid-cols-2">
              <ProductImageCarousel images={data.images} title={data.title} />
              <ProductContent product={data} />
            </div>

            {data.table_content && (
              <div className="space-y-5">
                <div className="flex items-center space-x-3">
                  <div className="h-[2px] w-12 bg-[var(--accent)]" />
                  <span className="text-sm tracking-widest text-gray-400 uppercase">
                    {t("technicalDetails")}
                  </span>
                </div>
                <div
                  className="rich-dark overflow-x-auto rounded-lg border border-[var(--card-border)] bg-[var(--card-bg)] p-2"
                  dangerouslySetInnerHTML={{ __html: data.table_content }}
                />
              </div>
            )}

            {data.table_content_second && (
              <div
                className="rich-dark"
                dangerouslySetInnerHTML={{ __html: data.table_content_second }}
              />
            )}

            {faqs.length > 0 && (
              <div className="space-y-5">
                <div className="flex items-center space-x-3">
                  <div className="h-[2px] w-12 bg-[var(--accent)]" />
                  <span className="text-sm tracking-widest text-gray-400 uppercase">
                    {t("faq")}
                  </span>
                </div>
                <div className="rounded-lg border border-[var(--card-border)] bg-[var(--card-bg)] px-6">
                  <ProductAccordion faqs={faqs} />
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  )
}

export default ProductId
