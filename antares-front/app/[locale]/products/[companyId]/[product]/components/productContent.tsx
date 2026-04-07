"use client"

import React, { useState } from "react"
import { useCartStore, useCompanyColorStore } from "@/states/store"
import { useTranslations } from "next-intl"

import { Product } from "@/types/models/product"
import { hexToRgba } from "@/lib/utils"
import { Counter } from "@/components/ui/counter"
import SpecialButton from "@/components/ui/special-button"

import OneClickBuy from "./oneClickBuy"

const ProductContent = ({ product }: { product: Product }) => {
  const { addToCartWithQuantity } = useCartStore()
  const { color } = useCompanyColorStore()

  const [quantity, setQuantity] = useState(1)

  const t = useTranslations("products.productId")

  return (
    <div className="order-last w-full space-y-4 md:order-first">
      <div className="space-y-4">
        <h4 className="max-w-[500px] text-3xl font-bold">
          {product.title || "No title"}
        </h4>
        <div
          style={{ backgroundColor: color }}
          className="h-[4px] max-w-[300px] rounded-full"
        />
        <p className="text-lg font-bold uppercase">{t("functionalities")}</p>
        <div
          className="list-none! overflow-x-scroll"
          dangerouslySetInnerHTML={{
            __html: product.content || "<p>No content</p>",
          }}
        />
      </div>
      <p className="font-bold uppercase">{t("price")}</p>
      <div className="flex w-full flex-col items-center justify-start gap-4 md:flex-row">
        <div className="flex w-full items-center gap-4">
          <Counter quantity={quantity} setQuantity={setQuantity} />
          <SpecialButton
            onClick={() => {
              addToCartWithQuantity(product, quantity)
              setQuantity(1)
            }}
            style={{
              backgroundColor: color,
              boxShadow: `0px 10px 10px -4px ${hexToRgba(color, 0.4)}`,
            }}
            className="h-11 flex-1 px-2 capitalize md:px-10"
          >
            {t("addToCard")}
          </SpecialButton>
        </div>
        <OneClickBuy productId={product.id} />
      </div>
    </div>
  )
}

export default ProductContent
