import React from "react"

import { fetchBuildJson } from "@/http/buildFetch"

import ProductId from "./components"

export async function generateStaticParams() {
  const brandsData =
    await fetchBuildJson<{ data: { slug: string }[] }>("/brands")
  const brands = brandsData?.data ?? []

  const params: { companyId: string; product: string }[] = []
  for (const brand of brands) {
    // The endpoint paginates at 12 by default; without a large page size the
    // export silently omits every product past the first page.
    const productsData = await fetchBuildJson<{ data: { slug: string }[] }>(
      `/products/${brand.slug}?per_page=1000`
    )
    for (const product of productsData?.data ?? []) {
      params.push({ companyId: brand.slug, product: product.slug })
    }
  }

  return params.length > 0 ? params : [{ companyId: "_", product: "_" }]
}

const ProductIdPage = () => {
  return <ProductId />
}

export default ProductIdPage
