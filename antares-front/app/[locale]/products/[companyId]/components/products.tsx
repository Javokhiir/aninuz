"use client"

import { Products } from "@/types/models/product"
import ProductCard from "@/components/product"

/**
 * Matches the real card's shape so the grid does not jump when data lands, and
 * loads in brand red rather than grey — the page is the right colour before any
 * data arrives. The media block sweeps (shimmer) while the text bars pulse, so
 * the two zones read as different things rather than one flat blink.
 */
export const ProductCardSkeleton = () => (
  <div
    className="overflow-hidden border border-[var(--card-border)] bg-[var(--card-bg)]"
    style={{ borderRadius: "var(--radius-panel)" }}
  >
    <div className="h-56 overflow-hidden bg-[var(--wash)]">
      <div className="animate-shimmer h-full w-full bg-[length:200%_100%] bg-[linear-gradient(90deg,transparent,var(--brand),transparent)] opacity-50" />
    </div>
    <div className="space-y-3 p-6">
      <div className="h-5 w-3/4 animate-pulse rounded-full bg-[var(--brand)]/45" />
      <div className="h-4 w-1/2 animate-pulse rounded-full bg-[var(--brand)]/25" />
      <div className="h-4 w-1/3 animate-pulse rounded-full bg-[var(--brand)]/20" />
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
