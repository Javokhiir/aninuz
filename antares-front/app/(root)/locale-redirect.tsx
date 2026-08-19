import { routing } from "@/i18n/routing"

/**
 * `output: "export"` disables middleware, so next-intl never gets to prefix a
 * locale-less URL. Every top-level route therefore gets a static twin under
 * `(root)` that forwards to the default locale. A meta refresh keeps working on
 * plain static hosting and with JS disabled.
 */
export function LocaleRedirect({ path = "" }: { path?: string }) {
  const target = `/${routing.defaultLocale}${path}`

  return (
    <>
      <meta httpEquiv="refresh" content={`0; url=${target}`} />
      <a href={target}>Antares Investments</a>
    </>
  )
}
