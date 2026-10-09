import { usePathname } from "@/i18n/routing"

/**
 * The brand slug of the current `/products/<brand>/...` URL.
 *
 * A brand missing from the API at build time is served the exported `_`
 * placeholder page by .htaccess, so the route param reads `_` there. The
 * browser URL still holds the real slug, so read it from the path instead.
 */
export const useBrandSlug = () => usePathname().split("/")[2] ?? ""
