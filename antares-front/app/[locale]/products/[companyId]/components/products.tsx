"use client"

import { Products } from "@/types/models/product"
import ProductCard from "@/components/product"

/** Matches the real card's shape so the grid does not jump when data lands. */
export const ProductCardSkeleton = () => (
  <div className="overflow-hidden rounded-lg border border-[var(--card-border)] bg-[var(--card-bg)]">
    <div className="h-56 animate-pulse bg-white/[0.04]" />
    <div className="space-y-3 p-6">
      <div className="h-5 w-3/4 animate-pulse rounded bg-white/[0.06]" />
      <div className="h-4 w-1/2 animate-pulse rounded bg-white/[0.04]" />
      <div className="h-4 w-1/3 animate-pulse rounded bg-white/[0.04]" />
    </div>
  </div>
)

export const ProductsGridSkeleton = ({ count = 6 }: { count?: number }) => (
  <div className="grid flex-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
    {Array.from({ length: count }).map((_, i) => (
      <ProductCardSkeleton key={i} />
    ))}
  </div>
)

const ProductsSection = ({
  companyName,
  products,
}: {
  companyName: string
  products?: Products
}) => (
  <div className="grid flex-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
    {products?.map((product) => (
      <ProductCard
        key={product.id}
        product={product}
        companyName={companyName}
      />
    ))}
  </div>
)

export default ProductsSection
