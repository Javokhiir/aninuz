"use client"

import React, { useEffect } from "react"
import Image from "next/image"
import { Link, usePathname } from "@/i18n/routing"
import { useCartDrawer } from "@/states/cart-drawer"
import { useCartStore } from "@/states/store"
import { AnimatePresence, motion } from "framer-motion"
import { ArrowRight, ShoppingBasket, XIcon } from "lucide-react"
import { useTranslations } from "next-intl"

import { Counter } from "@/components/ui/counter"

import { cartThemeVars } from "./theme"

// `--e-expo-out` as a framer-motion cubic array, so the drawer settles on the
// same easing the rest of the site transitions on.
const EXPO_OUT = [0.16, 1, 0.3, 1] as const

/**
 * The cart, as a panel off the right edge.
 *
 * There is no cart page any more: the cart is a running total you check and
 * adjust while browsing, and sending someone to a separate route to do that
 * loses their place in the catalogue. Checkout is still a page — that one is a
 * task with its own form and deserves the whole screen.
 *
 * Light surfaces rather than the catalogue's ink: this is a working panel of
 * text, numbers and controls, not a showroom.
 */
export const CartDrawer = () => {
  const t = useTranslations("cart")
  const pathname = usePathname()
  const { open, closeCart } = useCartDrawer()
  const { cart, deleteProduct } = useCartStore()
  const totalItems = useCartStore((state) => state.totalItems())

  // Route changes come from links inside the panel, so the panel has to get out
  // of the way itself — nothing else knows it is open.
  useEffect(() => closeCart(), [pathname, closeCart])

  // Escape closes, and the page behind must not scroll while the panel is up.
  useEffect(() => {
    if (!open) return

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeCart()
    }
    document.addEventListener("keydown", onKey)

    const { overflow } = document.body.style
    document.body.style.overflow = "hidden"

    return () => {
      document.removeEventListener("keydown", onKey)
      document.body.style.overflow = overflow
    }
  }, [open, closeCart])

  return (
    <AnimatePresence>
      {open && (
        // Above the floating header (z-80): the panel is modal, and a header
        // pill floating over it would both obscure the panel's own heading and
        // offer routes the overlay is meant to be blocking.
        <div className="fixed inset-0 z-[90]" style={cartThemeVars}>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={closeCart}
            className="absolute inset-0 bg-black/45 backdrop-blur-[2px]"
          />

          <motion.aside
            role="dialog"
            aria-modal="true"
            aria-label={t("title")}
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.5, ease: EXPO_OUT }}
            className="absolute inset-y-0 right-0 flex w-full max-w-[440px] flex-col bg-[var(--page-bg)] shadow-[0_0_80px_-20px_rgba(0,0,0,0.5)]"
          >
            <header className="flex items-start justify-between gap-4 border-b border-[var(--card-border)] px-6 py-5">
              <div>
                <span className="label-mono text-ink/50 mb-2 block">
                  {t("eyebrow")}
                </span>
                <h2 className="rtitle-small text-ink">{t("title")}</h2>
              </div>

              <button
                type="button"
                onClick={closeCart}
                aria-label={t("close")}
                className="text-ink/40 hover:text-ink flex size-10 shrink-0 cursor-pointer items-center justify-center rounded-full border border-[var(--card-border)] transition-colors"
              >
                <XIcon className="size-4" />
              </button>
            </header>

            <div className="flex-1 overflow-y-auto px-6 py-5">
              {cart.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center text-center">
                  <span className="mb-5 flex size-14 items-center justify-center rounded-full bg-[var(--wash)] text-[var(--brand)]">
                    <ShoppingBasket className="size-6" />
                  </span>
                  <h3 className="rtitle-xsmall text-ink mb-2">
                    {t("emptyCart")}
                  </h3>
                  <p className="text-ink/55 mb-7 max-w-[30ch] text-sm leading-relaxed">
                    {t("emptyLead")}
                  </p>
                  <Link
                    href="/products"
                    onClick={closeCart}
                    className="label-mono group inline-flex items-center gap-3 bg-[var(--brand)] px-6 py-3.5 text-[var(--on-brand)]"
                    style={{ borderRadius: "var(--radius-fluid)" }}
                  >
                    {t("emptyCta")}
                    <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {/* Layout animation so removing a line lets the rows below
                      travel up rather than jump — the only motion in the list,
                      and it is what makes the delete read as a removal. */}
                  <AnimatePresence initial={false} mode="popLayout">
                    {cart.map((product) => (
                      <motion.div
                        key={product.id}
                        layout
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0, x: 24 }}
                        transition={{ duration: 0.35, ease: EXPO_OUT }}
                        className="flex gap-4 border border-[var(--card-border)] bg-[var(--card-bg)] p-4"
                        style={{ borderRadius: "var(--radius-panel)" }}
                      >
                        {/* Always rendered, always square. A line without a
                            thumbnail collapses to text and stops reading as a
                            product, so a missing image falls back to a letter
                            mark on the brand wash rather than to nothing. */}
                        <div
                          className="relative aspect-square w-24 shrink-0 overflow-hidden border border-[var(--card-border)] bg-[var(--wash)]"
                          style={{ borderRadius: "var(--radius-fluid)" }}
                        >
                          {product.images?.[0] ? (
                            <Image
                              src={
                                product.images[0].url_webp ||
                                product.images[0].url
                              }
                              alt={product.title ?? ""}
                              width={200}
                              height={200}
                              className="size-full object-contain p-2"
                            />
                          ) : (
                            // Same fallback as the catalogue card: our mark on
                            // white rather than a letter. The drawer thumbnail
                            // is small, so the wordless logo is the one that
                            // still reads at this size.
                            <span className="flex size-full items-center justify-center bg-white p-3">
                              <Image
                                src="/logos/logo-no-text.png"
                                alt=""
                                width={120}
                                height={120}
                                className="size-full object-contain"
                              />
                            </span>
                          )}
                        </div>

                        <div className="flex min-w-0 flex-1 flex-col gap-2">
                          <div className="flex items-start justify-between gap-3">
                            <h3 className="text-ink line-clamp-2 text-sm font-medium">
                              {product.title}
                            </h3>
                            <button
                              type="button"
                              onClick={() => deleteProduct(product.id)}
                              aria-label={t("remove")}
                              className="text-ink/35 hover:text-ink -mt-1 shrink-0 cursor-pointer transition-colors"
                            >
                              <XIcon className="size-4" />
                            </button>
                          </div>

                          <div className="mt-auto flex flex-wrap items-center gap-3">
                            <Counter
                              quantity={product.quantity}
                              id={product.id}
                              className="border-[var(--card-border)]"
                            />
                            <p className="label-mono text-[var(--brand)]">
                              {t("priceOnRequest")}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </div>

            {cart.length > 0 && (
              <footer className="border-t border-[var(--card-border)] px-6 py-5">
                <dl className="mb-5 space-y-2">
                  <div className="flex items-baseline justify-between gap-4">
                    <dt className="text-ink/55 text-sm">{t("price")}</dt>
                    <dd className="label-mono text-[var(--brand)]">
                      {t("priceOnRequest")}
                    </dd>
                  </div>
                  <div className="flex items-baseline justify-between gap-4">
                    <dt className="text-ink/55 text-sm">{t("items")}</dt>
                    <dd className="rtitle-xsmall text-ink">
                      {t("itemsUnit", { count: totalItems || 0 })}
                    </dd>
                  </div>
                </dl>

                <Link
                  href="/cart/checkout"
                  onClick={closeCart}
                  className="label-mono group flex items-center justify-between bg-[var(--brand)] px-6 py-4 text-[var(--on-brand)]"
                  style={{ borderRadius: "var(--radius-fluid)" }}
                >
                  {t("checkout")}
                  <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
              </footer>
            )}
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  )
}
