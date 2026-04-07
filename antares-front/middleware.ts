import { NextRequest } from "next/server"
import { routing } from "@/i18n/routing"
import createMiddleware from "next-intl/middleware"

export default function middleware(request: NextRequest) {
  return createMiddleware({
    // Spread your default config
    ...routing,

    // Override only for middleware
    localeDetection: true, // allow using NEXT_LOCALE cookie
    localePrefix: undefined, // fall back to default ('as-needed')
  })(request)
}

export const config = {
  matcher: [
    "/", // Root
    "/login",
    "/admin/:path*",
    "/(ru|en|uz)/:path*",
    "/((?!_next|_vercel|.*\\..*).*)",
  ],
}
