import React from "react"

import ProductId from "./components"

export async function generateStaticParams() {
  try {
    const brandsRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/brands`)
    const brandsData = await brandsRes.json()
    const brands: { slug: string }[] = brandsData?.data ?? []

    const params: { companyId: string; product: string }[] = []
    for (const brand of brands) {
      const productsRes = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/products/${brand.slug}`
      )
      const productsData = await productsRes.json()
      const products: { slug: string }[] = productsData?.data ?? []
      products.forEach((p) =>
        params.push({ companyId: brand.slug, product: p.slug })
      )
    }
    return params.length > 0 ? params : [{ companyId: "_", product: "_" }]
  } catch {
    return [{ companyId: "_", product: "_" }]
  }
}

const ProductIdPage = () => {
  return <ProductId />
}

export default ProductIdPage
