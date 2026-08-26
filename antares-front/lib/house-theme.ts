/**
 * The house palette for dark full-bleed sections that are Antares' own.
 *
 * Structurally identical to the products theme — same token names, so the same
 * banner and card recipes read from either — but on the Antares blue. The red
 * in `app/[locale]/products/theme.ts` belongs to the Inmarco partnership that
 * catalogue carries; everything else on the site runs on the house colour.
 *
 * The accent is a lightened `--primary`: the brand blue #1c3bab only clears
 * 2:1 against the ink ground, which fails text, while the tint clears 7:1.
 */
export const HOUSE_THEME = {
  /** Antares blue, matching `--primary` in globals.css. Fills only. */
  brand: "#1c3bab",
  /** Lightened tint of the brand blue, for text and hairlines on the ink. */
  accent: "#7ba7ff",
  /** Text/icon colour that sits on a `brand` fill. */
  onBrand: "#ffffff",
  sectionBg: "#0b0d16",
  cardBg: "#121625",
  cardBorder: "hsla(227, 60%, 65%, 0.2)",
  wash: "hsla(227, 72%, 45%, 0.16)",
} as const

/** Inline custom properties consumed by the Tailwind `[var(--…)]` classes. */
export const houseThemeVars = {
  "--brand": HOUSE_THEME.brand,
  "--accent": HOUSE_THEME.accent,
  "--on-brand": HOUSE_THEME.onBrand,
  "--section-bg": HOUSE_THEME.sectionBg,
  "--card-bg": HOUSE_THEME.cardBg,
  "--card-border": HOUSE_THEME.cardBorder,
  "--wash": HOUSE_THEME.wash,
} as React.CSSProperties
