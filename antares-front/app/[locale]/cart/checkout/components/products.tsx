"use client"

import React from "react"
import Image from "next/image"
import { useCartStore } from "@/states/store"
import { XIcon } from "lucide-react"
import { useTranslations } from "next-intl"

import { Card } from "@/components/ui/card"
import { Counter } from "@/components/ui/counter"

const CheckoutProducts = () => {
  const { cart, deleteProduct } = useCartStore()
  const t = useTranslations("checkout")
  return (
    <Card className="h-min w-full rounded-xl border-none py-5">
      {cart.map((product, index) => (
        <div key={product.id}>
          <div
            className={`bg-muted/20 h-[1px] w-full ${index === 0 ? "hidden" : ""}`}
          />
          <div className="flex gap-4 p-5 pb-0">
            <Image
              src={product.images[0].url_webp}
              alt={product.slug}
              width={500}
              height={500}
              className="aspect-square max-h-[150px] w-full max-w-[120px] rounded-xl object-cover md:max-w-[150px]"
            />
            <div className="flex w-full flex-col gap-4 overflow-x-hidden">
              <div className="flex items-center justify-between">
                <h3 className="line-clamp-1 text-base font-semibold md:text-lg">
                  {product.title}
                </h3>
                <button
                  className="cursor-pointer"
                  onClick={() => deleteProduct(product.id)}
                >
                  <XIcon />
                </button>
              </div>
              <div
                className="line-clamp-1"
                dangerouslySetInnerHTML={{ __html: product.content || "" }}
              />
              <div className="mt-auto flex items-center gap-5">
                <Counter quantity={product.quantity} id={product.id} />
                <p className="text-xs font-bold uppercase md:text-base">
                  {t("price")}{" "}
                </p>
              </div>
            </div>
          </div>
        </div>
      ))}
    </Card>
  )
}

export default CheckoutProducts
