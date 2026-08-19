/**
 * Shared palette for the products section.
 *
 * Derived from the Antares brand blue (`--primary: hsla(227,72%,39%)`). The
 * accent is deliberately lighter than the brand primary: these surfaces are
 * dark, and #1c3bab does not carry enough contrast against them.
 *
 * Both the category grid and the product listing read from here, so re-branding
 * the section means editing this file only.
 */
export const PRODUCTS_THEME = {
  accent: "#60a5fa",
  sectionBg: "#0b1220",
  cardBg: "#0a1628",
  cardBorder: "#1e293b",
} as const

/** Inline custom properties consumed by the Tailwind `[var(--…)]` classes. */
export const productsThemeVars = {
  "--accent": PRODUCTS_THEME.accent,
  "--section-bg": PRODUCTS_THEME.sectionBg,
  "--card-bg": PRODUCTS_THEME.cardBg,
  "--card-border": PRODUCTS_THEME.cardBorder,
} as React.CSSProperties
