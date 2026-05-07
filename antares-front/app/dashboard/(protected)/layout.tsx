"use client"

import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import Link from "next/link"
import { Toaster } from "sonner"
import { adminAuth } from "@/http/admin/api"

const menuItems = [
  { href: "/dashboard/home", label: "Dashboard", icon: "🏠" },
  { header: "ECOMMERCE" },
  { href: "/dashboard/orders", label: "Orders", icon: "📋" },
  { href: "/dashboard/products", label: "Products", icon: "📦" },
  { header: "EXTRA" },
  { href: "/dashboard/services", label: "Services", icon: "⚙️" },
  { href: "/dashboard/events", label: "Events", icon: "📰" },
  { href: "/dashboard/categories", label: "Categories", icon: "🗂️" },
  { href: "/dashboard/brands", label: "Brands", icon: "🏷️" },
  { href: "/dashboard/reviews", label: "Reviews", icon: "💬" },
  { header: "SETTINGS" },
  { href: "/dashboard/users", label: "Users", icon: "👥" },
  { href: "/dashboard/profile", label: "Profile", icon: "👤" },
]

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [user, setUser] = useState<{ name: string; email: string; role?: string } | null>(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem("admin_token")
    if (!token) {
      router.replace("/dashboard/login")
      return
    }
    const stored = localStorage.getItem("admin_user")
    if (stored) setUser(JSON.parse(stored))
  }, [router])

  const handleLogout = async () => {
    try { await adminAuth.logout() } catch {}
    localStorage.removeItem("admin_token")
    localStorage.removeItem("admin_user")
    router.push("/dashboard/login")
  }

  if (!user) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    )
  }

  return (
    <div className="flex h-screen overflow-hidden bg-gray-100">
      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-200
        md:relative md:translate-x-0
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
      `}>
        <div className="flex items-center justify-between h-16 px-6 border-b bg-blue-600">
          <span className="text-white font-bold text-lg">
            <b>Antares</b> Admin
          </span>
          <button onClick={() => setSidebarOpen(false)} className="md:hidden text-white">✕</button>
        </div>
        <nav className="py-4 overflow-y-auto h-[calc(100%-4rem)]">
          {menuItems.map((item, i) => {
            if ("header" in item) {
              return (
                <div key={i} className="px-6 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider mt-2">
                  {item.header}
                </div>
              )
            }
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href!}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-6 py-2.5 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-blue-50 text-blue-600 border-r-2 border-blue-600"
                    : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                <span>{item.icon}</span>
                {item.label}
              </Link>
            )
          })}
        </nav>
      </aside>

      {/* Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-white shadow-sm flex items-center justify-between px-6">
          <button onClick={() => setSidebarOpen(true)} className="md:hidden text-gray-600">
            ☰
          </button>
          <div className="flex-1" />
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">{user.name}</span>
            <button
              onClick={handleLogout}
              className="text-sm text-red-500 hover:text-red-700 transition-colors"
            >
              Logout
            </button>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>

      <Toaster richColors position="bottom-right" />
    </div>
  )
}
