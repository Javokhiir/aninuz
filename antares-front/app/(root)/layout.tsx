import type { Metadata } from "next"

export const metadata: Metadata = {
  robots: { index: false, follow: true },
}

export default function RootRedirectLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ru">
      <body>{children}</body>
    </html>
  )
}
