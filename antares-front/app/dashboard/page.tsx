"use client"

import { useEffect } from "react"

// The admin panel is the Laravel Blade dashboard served by the backend, which
// lives under the same `/api` prefix as the rest of the Laravel routes.
// `output: "export"` rules out a server-side redirect, so bounce on the client.
const ADMIN_URL = `${process.env.NEXT_PUBLIC_API_URL}/dashboard`

export default function DashboardRedirect() {
  useEffect(() => {
    window.location.replace(ADMIN_URL)
  }, [])

  return (
    <main className="flex min-h-screen items-center justify-center p-5">
      <p className="text-center">
        Admin panelga o&apos;tilmoqda…{" "}
        <a className="underline" href={ADMIN_URL}>
          Agar avtomatik ochilmasa, shu yerni bosing
        </a>
      </p>
    </main>
  )
}
