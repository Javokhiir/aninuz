import { createNavigation } from "next-intl/navigation"
import { defineRouting } from "next-intl/routing"

export const routing = defineRouting({
  locales: ["ru", "en", "uz"],

  defaultLocale: "ru",
  localeDetection: false,
  localePrefix: "always",
})

export type Locale = (typeof routing.locales)[number]

export const { Link, redirect, usePathname, useRouter } =
  createNavigation(routing)
