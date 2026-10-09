type ProductsTheme = {
  brand: string
  brandSoft: string
  accent: string
  onBrand: string
  sectionBg: string
  cardBg: string
  cardBorder: string
  wash: string
}

export type ProductBrandProfile = {
  id: "inmarco" | "erith-global"
  translationKey: "inmarco" | "erithGlobal"
  name: string
  aliases: readonly string[]
  fallbackSlug: string
  logo: string
  heroImage: string
  theme: ProductsTheme
}

/**
 * The product catalogue is brand-led. Each profile owns its exact display
 * name, known API slugs, imagery and colour tokens, while the shared layouts
 * keep navigation and interaction patterns consistent between brands.
 */
export const PRODUCT_BRANDS: readonly ProductBrandProfile[] = [
  {
    id: "inmarco",
    translationKey: "inmarco",
    name: "INMARCO",
    aliases: ["inmarco", "inmarco-fzc"],
    fallbackSlug: "inmarco",
    logo: "/images/products/inmar.png",
    heroImage: "/images/posters/hero-reel.jpg",
    theme: {
      brand: "#d11410",
      brandSoft: "#e8554f",
      accent: "#ff6a62",
      onBrand: "#ffffff",
      sectionBg: "#151112",
      cardBg: "#1e191a",
      cardBorder: "hsla(1, 45%, 62%, 0.16)",
      wash: "hsla(1, 70%, 50%, 0.10)",
    },
  },
  {
    id: "erith-global",
    translationKey: "erithGlobal",
    name: "Erith Global",
    aliases: ["erith", "erith-global"],
    fallbackSlug: "erith",
    logo: "/images/products/erit.png",
    heroImage: "/images/industries/machinery.jpg",
    theme: {
      brand: "#f2d000",
      brandSoft: "#ffe55c",
      accent: "#ffe45a",
      onBrand: "#111111",
      sectionBg: "#0d0e0f",
      cardBg: "#17191b",
      cardBorder: "hsla(51, 88%, 60%, 0.18)",
      wash: "hsla(51, 92%, 48%, 0.10)",
    },
  },
] as const

const normaliseBrand = (value: string) =>
  value.toLowerCase().replace(/[^a-z0-9]/g, "")

export const getProductBrandProfile = (companyId: string) => {
  const normalised = normaliseBrand(companyId)

  return (
    PRODUCT_BRANDS.find((brand) =>
      brand.aliases.some((alias) => {
        const normalisedAlias = normaliseBrand(alias)
        return (
          normalisedAlias === normalised || normalised.includes(normalisedAlias)
        )
      })
    ) ?? PRODUCT_BRANDS[0]
  )
}

export const getProductsThemeVars = (companyId: string) => {
  const theme = getProductBrandProfile(companyId).theme

  return {
    "--brand": theme.brand,
    "--brand-soft": theme.brandSoft,
    "--accent": theme.accent,
    "--on-brand": theme.onBrand,
    "--section-bg": theme.sectionBg,
    "--card-bg": theme.cardBg,
    "--card-border": theme.cardBorder,
    "--wash": theme.wash,
  } as React.CSSProperties
}

/** Default kept for brand-agnostic legacy surfaces. */
export const productsThemeVars = getProductsThemeVars("inmarco")
