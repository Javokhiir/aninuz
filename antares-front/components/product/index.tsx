"use client"

import React from "react"
import Image from "next/image"
import { Link } from "@/i18n/routing"
import { useCartStore } from "@/states/store"
import { ArrowRight, ShoppingBasket } from "lucide-react"
import { useTranslations } from "next-intl"

import { Product } from "@/types/models/product"

const ProductCard = ({
  product,
  companyName,
}: {
  product: Product
  companyName: string
}) => {
  const t = useTranslations("products.productCard")
  const { addToCart } = useCartStore()

  const href = `/products/${companyName}/${product.slug}`
  const image = product.images?.[0]

  return (
    <div className="group relative">
      <div className="flex h-full flex-col overflow-hidden rounded-lg border border-[var(--card-border)] bg-[var(--card-bg)] transition-all duration-300 hover:border-[var(--accent)]">
        <div className="relative h-56 overflow-hidden">
          <Link href={href} className="block h-full w-full">
            {image ? (
              <Image
                src={image.url_webp || image.url}
                alt={product.title}
                width={500}
                height={500}
                className="h-full w-full object-contain p-6 transition-transform duration-700 group-hover:scale-110"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-white/[0.03]">
                <span className="text-6xl font-bold text-white/10 uppercase">
                  {product.title?.charAt(0)}
                </span>
              </div>
            )}
          </Link>

          <button
            type="button"
            onClick={() => addToCart(product)}
            aria-label={t("addToCart")}
            className="absolute top-3 right-3 z-10 flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border border-[var(--card-border)] bg-[var(--section-bg)]/80 text-gray-400 backdrop-blur transition-colors hover:border-[var(--accent)] hover:text-[var(--accent)]"
          >
            <ShoppingBasket className="h-5 w-5" />
          </button>
        </div>

        <Link href={href} className="flex flex-1 flex-col p-6">
          <h3 className="mb-2 line-clamp-2 text-lg tracking-tight text-white transition-colors group-hover:text-[var(--accent)]">
            {product.title}
          </h3>
          <p className="mb-4 text-sm text-gray-400">{t("price")}</p>

          <span className="mt-auto flex items-center gap-2 text-sm font-medium text-[var(--accent)]">
            {t("more")}
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </span>
        </Link>
      </div>
    </div>
  )
}

export default ProductCard
