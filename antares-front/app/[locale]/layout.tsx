import type { Metadata } from "next"
import { Onest } from "next/font/google"

import "./globals.css"

import { cookies } from "next/headers"
import { Locale } from "@/i18n/routing"
import { siteConfig } from "@/siteConfig"
import { NextIntlClientProvider } from "next-intl"
import { getMessages } from "next-intl/server"

import { Toaster } from "@/components/ui/sonner"
import Footer from "@/components/footer"
import { NavBar } from "@/components/navbar"
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

const RootLayout = async ({
  children,
  params,
}: Readonly<{
  children: React.ReactNode
  params: Promise<{ locale: Locale }>
}>) => {
  const cookieStore = cookies()
  const cookieLocale = (await cookieStore).get("NEXT_LOCALE")?.value as
    | Locale
    | undefined

  const { locale: paramLocale } = await params

  const finalLocale: Locale = cookieLocale || paramLocale

  const messages = await getMessages({ locale: finalLocale })
  return (
    <html lang={finalLocale} suppressHydrationWarning>
      <body
        style={{ backgroundImage: "url('/images/background.svg')" }}
        className={`${onest.variable} bg-cover bg-repeat antialiased`}
      >
        <Providers>
          <NextIntlClientProvider messages={messages} locale={finalLocale}>
            <NavBar />
            <div className="min-h-svh pt-[60px] md:mt-[90px] md:pt-0">
              {children}
            </div>
            <Footer />
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
