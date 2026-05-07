import { NextRequest, NextResponse } from "next/server"
import { routing } from "@/i18n/routing"
import createMiddleware from "next-intl/middleware"

export default function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname
  if (pathname.startsWith('/dashboard')) {
    return NextResponse.next()
  }
  return createMiddleware({
    ...routing,
    localeDetection: true,
    localePrefix: undefined,
  })(request)
}

export const config = {
  matcher: [
    "/",
    "/login",
    "/admin/:path*",
    "/(ru|en|uz)/:path*",
    "/((?!_next|_vercel|.*\\..*).*)",
  ],
}
