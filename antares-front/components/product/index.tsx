"use client"

import React from "react"
import Image from "next/image"
import { Link } from "@/i18n/routing"
import { useCartStore, useCompanyColorStore } from "@/states/store"
import { useTranslations } from "next-intl"

import { Product } from "@/types/models/product"

import { Icons } from "../icons"
import { Button } from "../ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "../ui/card"

const ProductCard = ({
  product,
  companyName,
}: {
  product: Product
  companyName: string
}) => {
  const t = useTranslations("products.productCard")
  const { addToCart } = useCartStore()
  const { color } = useCompanyColorStore()

  return (
    <div
      className="h-full max-w-[300px]"
      style={{ ["--hover-color" as string]: color }}
    >
      <div className="group h-full w-full transition-all duration-150">
        <Card
          className="border-primary/10 h-full max-w-[300px] gap-2 rounded-[30px] border-0 border-b-[5px] p-1 pb-2 transition-transform duration-300 group-hover:translate-y-[-10px] md:gap-5"
          style={{ willChange: "transform" }}
        >
          <CardHeader className="relative flex h-[60%] items-center justify-center overflow-hidden rounded-[30px] border-2 border-gray-100">
            <Link href={`/products/${companyName}/${product.slug}`}>
              <Image
                src={product.images[0]?.url_webp || "/logos/logo-with-text.png"}
                alt="product"
                width={500}
                height={500}
                className="relative z-0 min-h-[150px] max-w-[150px] object-contain md:max-w-[200px]"
              />
            </Link>

            <Button
              variant="ghost"
              onClick={() => addToCart(product)}
              className="text-muted absolute top-2 right-2 z-10 h-10 w-10 cursor-pointer rounded-full border-1 p-0 group-hover:text-[var(--hover-color)] md:top-3 md:right-3 md:h-12 md:w-12 md:border-2 [&_svg:not([class*='size-'])]:size-4 md:[&_svg:not([class*='size-'])]:size-6"
            >
              <Icons.ProductCart className="w-full" />
            </Button>
          </CardHeader>

          <Link
            href={`/products/${companyName}/${product.slug}`}
            className="flex h-[40%] w-full flex-col justify-between space-y-2 md:space-y-4"
          >
            <CardContent className="space-y-2 p-2 px-2 pb-0 md:px-5">
              <h4 className="line-clamp-2 w-full text-sm font-semibold md:line-clamp-1 md:text-base">
                {product.title}
              </h4>
              <p className="text-sm md:text-base">{t("price")}</p>
            </CardContent>
            <CardFooter className="text-muted mt-auto ml-auto flex flex-col items-end pt-0 group-hover:text-[var(--hover-color)]">
              <p className="mt-auto text-end text-xs md:text-base">
                {t("more")}
              </p>
              <Icons.LongArrowRight className="ml-auto" />
            </CardFooter>
          </Link>
        </Card>
      </div>
    </div>
  )
}

export default ProductCard
