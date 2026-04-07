"use client"

import React from "react"
import Image from "next/image"
import { useCartStore } from "@/states/store"
import { XIcon } from "lucide-react"
import { useTranslations } from "next-intl"

import { Card } from "@/components/ui/card"
import { Counter } from "@/components/ui/counter"

const CartProducts = () => {
  const { cart, deleteProduct } = useCartStore()
  const t = useTranslations("cart")

  return (
    <Card className="h-min w-full rounded-xl border-none p-5">
      {cart.length > 0 ? (
        cart.map((product, index) => (
          <div key={product.id}>
            <div
              className={`bg-muted/20 h-[1px] w-full ${index === 0 ? "hidden" : ""}`}
            />
            <div className="flex gap-4 pt-5 md:p-5">
              <Image
                src={product.images[0].url_webp}
                alt={product.title}
                width={500}
                height={500}
                className="aspect-square max-h-[100px] w-full max-w-[100px] rounded-xl object-contain md:max-h-[200px] md:max-w-[200px]"
              />
              <div className="flex w-full flex-col gap-4 overflow-x-hidden">
                <div className="flex items-center justify-between">
                  <h3 className="line-clamp-1 text-base font-semibold md:text-lg">
                    {product.title}
                  </h3>
                  <button onClick={() => deleteProduct(product.id)}>
                    <XIcon />
                  </button>
                </div>
                <div
                  className="line-clamp-3"
                  dangerouslySetInnerHTML={{
                    __html: product.content || "no content",
                  }}
                />
                <div className="mt-auto line-clamp-1 flex items-center gap-5">
                  <Counter quantity={product.quantity} id={product.id} />
                  <p className="text-sm font-bold uppercase md:text-base">
                    {t("priceOnRequest")}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))
      ) : (
        <p className="text-muted-foreground text-center">{t("emptyCart")}</p>
      )}
    </Card>
  )
}

export default CartProducts
