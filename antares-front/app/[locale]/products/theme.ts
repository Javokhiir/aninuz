/**
 * Shared palette for the products section.
 *
 * The section carries the Inmarco partnership, so it runs on their red rather
 * than the Antares blue — and it runs on it hard: the hero is a full-bleed
 * field of the brand red, the index rows wipe red on hover, and even the ink
 * ground and the hairlines are tinted toward it rather than left neutral, so
 * nothing on the page reads as a leftover from the blue theme.
 *
 * The surfaces stay in the landing page's spatial language (fluid radii, the
 * `rcontainer` gutter, the shared easing set) and stay dark enough that the
 * header's tone detection reads them without any extra hinting.
 *
 * Two reds, not one:
 *
 *  - `brand` is Inmarco's own #d11410, sampled from their mark. It is the fill
 *    colour — buttons, the eyebrow rule, active chips — where it sits under
 *    white text and reads exactly as the logo does.
 *  - `accent` is a lightened tint of it. #d11410 only clears 3.5:1 against the
 *    ink ground, which fails small text; the tint clears 6:1 and keeps the same
 *    hue, so links and hairlines use it instead.
 *
 * Every products surface reads from here, so re-branding the section for a
 * different partner means editing this file only.
 */
export const PRODUCTS_THEME = {
  /** Inmarco red, sampled from their mark. Fills only — white sits on it. */
  brand: "#d11410",
  /**
   * The lighter red from Inmarco's own mark. Used where the colour lies over
   * photography — the duotone — so the media keeps its detail instead of being
   * pushed to the deep red's near-black shadows.
   */
  brandSoft: "#e8554f",
  /** Lightened tint of the brand red, for text and hairlines on the ink ground. */
  accent: "#ff5a52",
  /** Text/icon colour that sits on a `brand` fill. */
  onBrand: "#ffffff",
  /**
   * Grounds carry a warm cast rather than a red one. Earlier they were a deep
   * red (#180809 / #231011) and, with the duotone over the media on top, the
   * whole page read as dipped in colour. The red now comes from the marks that
   * mean something — the chips, the rules, the hovered card — and the surfaces
   * stay out of its way.
   */
  sectionBg: "#151112",
  cardBg: "#1e191a",
  /** Hairline. Warm rather than white, so the rules still belong to the palette. */
  cardBorder: "hsla(1, 45%, 62%, 0.16)",
  /** Wash used behind media blocks and loading bars. */
  wash: "hsla(1, 70%, 50%, 0.10)",
} as const

/** Inline custom properties consumed by the Tailwind `[var(--…)]` classes. */
export const productsThemeVars = {
  "--brand": PRODUCTS_THEME.brand,
  "--brand-soft": PRODUCTS_THEME.brandSoft,
  "--accent": PRODUCTS_THEME.accent,
  "--on-brand": PRODUCTS_THEME.onBrand,
  "--section-bg": PRODUCTS_THEME.sectionBg,
  "--card-bg": PRODUCTS_THEME.cardBg,
  "--card-border": PRODUCTS_THEME.cardBorder,
  "--wash": PRODUCTS_THEME.wash,
} as React.CSSProperties
