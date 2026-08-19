import axios from "axios"
import { routing } from "@/i18n/routing"

export const $api = axios.create({
  withCredentials: true,
  baseURL: process.env.NEXT_PUBLIC_API_URL,
})

// Derive the locale from the URL segment rather than the NEXT_LOCALE cookie:
// `output: "export"` disables middleware, so that cookie is never kept in sync
// with the locale the user is actually browsing.
const getLocale = () => {
  if (typeof window === "undefined") return routing.defaultLocale

  const segment = window.location.pathname.split("/")[1]
  return routing.locales.includes(segment as (typeof routing.locales)[number])
    ? segment
    : routing.defaultLocale
}

$api.interceptors.request.use((config) => {
  config.headers["Accept-Language"] = getLocale()

  return config
})

$api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle errors without token refresh logic
    if (error?.response?.data) {
      // Forward API error details
      return Promise.reject(error.response.data)
    }

    // Handle network errors or other issues
    return Promise.reject(error)
  }
)
