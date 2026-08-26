"use client"

import React from "react"
import { usePathname } from "@/i18n/routing"

import Footer from "@/components/footer"

/**
 * Sections that paint their own ground edge to edge.
 *
 * They open on a full-bleed banner that runs *under* the floating header, and
 * they close on their own dark colour. Both pieces of the shared shell work
 * against that: the top offset would open a strip of the light body pattern
 * above the banner, and the footer — which is drawn for the light ground — would
 * end the page on white. So these routes opt out of both and take
 * responsibility for filling the viewport themselves.
 */
const FULL_BLEED_EXACT = ["/services"]

/**
 * Prefixed rather than exact, because every page under it is redesigned: the
 * brand listing and the product detail both paint their own dark ground.
 *
 * `/services/[service]` is deliberately *not* here — it is still on the old
 * light layout, and dropping the offset and the footer under it would leave its
 * content beneath the floating header. It stays an exact match above until it
 * is redesigned too.
 */
const FULL_BLEED_PREFIX = ["/products"]

/**
 * The shell every page renders inside: the top offset that clears the floating
 * header, and the site footer.
 */
export const SiteFrame = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname()
  const fullBleed =
    FULL_BLEED_EXACT.includes(pathname) ||
    FULL_BLEED_PREFIX.some((route) => pathname.startsWith(route))

  if (fullBleed) {
    // No ground of its own: each of these pages paints a `min-h-svh` root in
    // its own colour, so a floor here would only be a second colour to keep in
    // sync — and the cart's is light while the catalogue's is dark.
    return <>{children}</>
  }

  return (
    <>
      <div className="min-h-svh pt-[60px] md:mt-[90px] md:pt-0">{children}</div>
      <Footer />
    </>
  )
}
