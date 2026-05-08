import { NextRequest, NextResponse } from "next/server"
import { routing } from "@/i18n/routing"
import createMiddleware from "next-intl/middleware"

const handleI18nRouting = createMiddleware(routing)

export default function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname
  if (pathname.startsWith('/dashboard')) {
    return NextResponse.next()
  }
  return handleI18nRouting(request)
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
