import { routing } from "@/i18n/routing"

/**
 * JSON fetch for build-time `generateStaticParams()`.
 *
 * Node's fetch() sends `Accept-Language: *` by default, which the API rejects
 * (it feeds the header straight into setLocale()), so every build-time request
 * has to name a real locale. Failures are logged rather than swallowed — a
 * silent failure here ships a static export with placeholder routes.
 */
export const fetchBuildJson = async <T>(path: string): Promise<T | null> => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}${path}`

  // One flaky response during export silently drops every page behind it
  // (a whole locale's products, once), so a request gets a few attempts.
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const res = await fetch(url, {
        headers: { "Accept-Language": routing.defaultLocale },
      })

      if (res.ok) return (await res.json()) as T

      console.warn(
        `[generateStaticParams] ${url} responded ${res.status} (attempt ${attempt})`
      )
    } catch (error) {
      console.warn(
        `[generateStaticParams] ${url} failed (attempt ${attempt}):`,
        error
      )
    }

    await new Promise((resolve) => setTimeout(resolve, 1500 * attempt))
  }

  return null
}
