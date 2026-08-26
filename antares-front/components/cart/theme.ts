/**
 * Palette for the cart.
 *
 * The catalogue pages are dark because they are showrooms — the product has to
 * be the brightest thing on screen. The cart is the opposite: a working page of
 * text, numbers and controls that people read and edit. So it keeps the house
 * blue and the shared banner, but sets its working area on the site's light
 * ground rather than the ink one, and drops the depth effects the showroom
 * cards use. Nothing here is decorated; everything is legible.
 */
export const CART_THEME = {
  /** Antares blue, matching `--primary` in globals.css. */
  brand: "#1c3bab",
  onBrand: "#ffffff",
  /** Working ground: the site's off-white, not the ink. */
  pageBg: "#faf9f8",
  cardBg: "#ffffff",
  cardBorder: "rgba(28, 28, 28, 0.1)",
  /** Muted fill for inert controls and loading bars. */
  wash: "rgba(28, 59, 171, 0.06)",
} as const

/** Inline custom properties consumed by the Tailwind `[var(--…)]` classes. */
export const cartThemeVars = {
  "--brand": CART_THEME.brand,
  "--on-brand": CART_THEME.onBrand,
  "--page-bg": CART_THEME.pageBg,
  "--card-bg": CART_THEME.cardBg,
  "--card-border": CART_THEME.cardBorder,
  "--wash": CART_THEME.wash,
} as React.CSSProperties
