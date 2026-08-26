"use client"

import React from "react"
import Image from "next/image"
import { Link } from "@/i18n/routing"
import { useCartStore } from "@/states/store"
import { ArrowRight, ShoppingBasket } from "lucide-react"
import { useTranslations } from "next-intl"

import { Product } from "@/types/models/product"

/**
 * Product card for the brand listing.
 *
 * Carries the Inmarco red the same way the category index does: the media sits
 * on a red ground, and the footer wipes to a full red bar on hover instead of
 * only tinting a link. The tokens come from the products theme, so the card
 * follows whatever partner colour that file is set to.
 */
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
      <div
        className="flex h-full flex-col overflow-hidden border border-[var(--card-border)] bg-[var(--card-bg)] transition-[border-color,transform] duration-500 hover:-translate-y-1 hover:border-[var(--brand)]"
        style={{
          borderRadius: "var(--radius-panel)",
          transitionTimingFunction: "var(--e-expo-out)",
        }}
      >
        <div className="relative h-56 overflow-hidden bg-[var(--wash)]">
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
              // No photograph on file. A letter mark read as a rendering bug
              // more than a placeholder, so the slot falls back to our own mark
              // on white — the same ground the real product shots are lit on,
              // which keeps the grid's rhythm intact. Full strength: a faded
              // mark looks like a disabled card rather than a brand plate.
              <div className="flex h-full w-full items-center justify-center bg-white p-8">
                <Image
                  src="/logos/logo-with-text.png"
                  alt=""
                  width={340}
                  height={34}
                  className="h-auto w-full max-w-[190px]"
                />
              </div>
            )}
          </Link>

          <button
            type="button"
            onClick={() => addToCart(product)}
            aria-label={t("addToCart")}
            className="absolute top-3 right-3 z-10 flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border border-[var(--card-border)] bg-[var(--section-bg)]/80 text-[var(--accent)] backdrop-blur transition-colors hover:border-[var(--brand)] hover:bg-[var(--brand)] hover:text-[var(--on-brand)]"
          >
            <ShoppingBasket className="h-5 w-5" />
          </button>

          {/* Brand rule between media and copy, growing to the full width of the
              card on hover. */}
          <div
            className="absolute right-0 bottom-0 left-0 h-[2px] w-12 bg-[var(--brand)] transition-[width] duration-700 group-hover:w-full"
            style={{ transitionTimingFunction: "var(--e-expo-out)" }}
          />
        </div>

        <Link href={href} className="flex flex-1 flex-col p-6 pb-0">
          <h3 className="rtitle-xsmall mb-2 line-clamp-2 text-white">
            {product.title}
          </h3>
          <p className="mb-6 text-sm text-white/45">{t("price")}</p>
        </Link>

        {/* Footer bar. Empty ground at rest, solid brand red once the card is
            hovered — the card's main piece of colour. */}
        <Link
          href={href}
          className="relative mt-auto overflow-hidden border-t border-[var(--card-border)] px-6 py-4"
        >
          <div
            className="absolute inset-0 origin-left scale-x-0 bg-[var(--brand)] transition-transform duration-700 group-hover:scale-x-100"
            style={{ transitionTimingFunction: "var(--e-expo-out)" }}
            aria-hidden
          />
          <span className="label-mono relative flex items-center justify-between text-[var(--accent)] transition-colors duration-300 group-hover:text-[var(--on-brand)]">
            {t("more")}
            <ArrowRight className="h-4 w-4 transition-transform duration-500 group-hover:translate-x-1" />
          </span>
        </Link>
      </div>
    </div>
  )
}

export default ProductCard
