"use client"

import { Products } from "@/types/models/product"
import ProductCard from "@/components/product"

const ProductsSection = ({
  companyName,
  products,
}: {
  companyName: string
  products?: Products
}) => {
  console.log("products", products)
  return (
    <div className="grid w-full grid-cols-2 gap-2 rounded-[20px] bg-white/80 sm:grid-cols-2 md:grid-cols-1 md:gap-10 md:p-5 lg:grid-cols-2 xl:grid-cols-3">
      {products?.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          companyName={companyName}
        />
      ))}
    </div>
  )
}

export default ProductsSection
