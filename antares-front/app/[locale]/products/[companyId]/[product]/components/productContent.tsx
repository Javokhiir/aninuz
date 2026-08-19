"use client"

import React, { useState } from "react"
import { useCartStore } from "@/states/store"
import { useTranslations } from "next-intl"

import { Product } from "@/types/models/product"
import { Counter } from "@/components/ui/counter"

import DatasheetDownload from "./datasheet"
import OneClickBuy from "./oneClickBuy"

const ProductContent = ({ product }: { product: Product }) => {
  const { addToCartWithQuantity } = useCartStore()
  const [quantity, setQuantity] = useState(1)
  const t = useTranslations("products.productId")

  return (
    <div className="w-full space-y-6">
      <div className="space-y-4">
        <h1 className="text-4xl tracking-tight text-white lg:text-5xl">
          {product.title}
        </h1>
        <div className="h-[2px] w-12 bg-[var(--accent)]" />
      </div>

      <div>
        <p className="mb-3 text-sm tracking-widest text-gray-400 uppercase">
          {t("functionalities")}
        </p>
        <div
          className="rich-dark"
          dangerouslySetInnerHTML={{ __html: product.content || "" }}
        />
      </div>

      <p className="text-sm tracking-widest text-[var(--accent)] uppercase">
        {t("price")}
      </p>

      <div className="flex w-full flex-col gap-3 sm:flex-row">
        <div className="flex flex-1 items-center gap-3">
          <Counter
            quantity={quantity}
            setQuantity={setQuantity}
            className="h-12 border-[var(--card-border)] bg-[var(--card-bg)] text-white [&_button]:text-white [&_button:hover]:bg-white/10"
          />
          <button
            type="button"
            onClick={() => {
              addToCartWithQuantity(product, quantity)
              setQuantity(1)
            }}
            className="h-12 flex-1 cursor-pointer rounded-lg bg-[var(--accent)] px-6 text-sm font-medium whitespace-nowrap text-[#0b1220] capitalize transition-opacity hover:opacity-90"
          >
            {t("addToCard")}
          </button>
        </div>
        <div className="flex-1">
          <OneClickBuy productId={product.id} />
        </div>
      </div>

      <DatasheetDownload
        productSlug={product.slug}
        productTitle={product.title}
      />
    </div>
  )
}

export default ProductContent
