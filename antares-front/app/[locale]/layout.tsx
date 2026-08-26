import type { Metadata } from "next"
import { Onest } from "next/font/google"

import "./globals.css"

import { routing, Locale } from "@/i18n/routing"
import { siteConfig } from "@/siteConfig"
import { NextIntlClientProvider } from "next-intl"
import { getMessages, setRequestLocale } from "next-intl/server"

import { Suspense } from "react"

import { Toaster } from "@/components/ui/sonner"
import { CartDrawer } from "@/components/cart/cart-drawer"
import { FloatingHeader } from "@/components/relats/site-chrome"
import { SiteFrame } from "@/components/relats/site-frame"
import { Providers } from "@/components/Providers"

const onest = Onest({
  variable: "--font-onest",
  subsets: ["latin", "cyrillic"],
})

export const metadata: Metadata = {
  title: siteConfig.name,
  description: siteConfig.description,
  metadataBase: new URL(siteConfig.url),
  keywords: siteConfig.keywords,

  icons: {
    icon: "/logos/favicon.svg",
    apple: "/logos/logo-no-text.png",
    shortcut: "/logos/logo-with-text.png",
  },
  openGraph: {
    type: "website",
    locale: "ru",
    title: siteConfig.name,
    description: siteConfig.description,
    url: siteConfig.url,
    siteName: siteConfig.name,
    images: [
      {
        url: siteConfig.url + "/logos/logo-no-text.png",
        width: 1200,
        height: 630,
        alt: siteConfig.name,
      },
    ],
  },
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

const RootLayout = async ({
  children,
  params,
}: Readonly<{
  children: React.ReactNode
  params: Promise<{ locale: Locale }>
}>) => {
  const { locale: finalLocale } = await params

  setRequestLocale(finalLocale)
  const messages = await getMessages({ locale: finalLocale })
  return (
    <html lang={finalLocale} suppressHydrationWarning>
      <body
        style={{ backgroundImage: "url('/images/background.svg')" }}
        className={`${onest.variable} bg-cover bg-repeat antialiased`}
      >
        <Providers>
          <NextIntlClientProvider messages={messages} locale={finalLocale}>
            {/* One piece of chrome for the whole site: the landing's floating
                glass pills, now the bar on every page. */}
            <Suspense>
              <FloatingHeader />
            </Suspense>
            <SiteFrame>{children}</SiteFrame>

            {/* Site-wide, so the cart opens over whatever page you are on. */}
            <CartDrawer />
          </NextIntlClientProvider>

        </Providers>
        <Toaster
          richColors
          theme="light"
          className="bg-transparent"
          toastOptions={{
            classNames: {
              error: "text-destructive-foreground bg-destructive",
              success: "text-green-foreground bg-green",
            },

            closeButton: true,
            duration: 5000,
          }}
          position="bottom-right"
        />
      </body>
    </html>
  )
}
export default RootLayout
