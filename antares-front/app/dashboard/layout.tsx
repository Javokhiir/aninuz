import type { Metadata } from "next"
import "@/app/[locale]/globals.css"

export const metadata: Metadata = {
  title: "Antares Admin",
  robots: { index: false, follow: false },
}

export default function DashboardRootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-gray-100 min-h-screen">
        {children}
      </body>
    </html>
  )
}
