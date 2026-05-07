"use client"

import { useState, useEffect, useCallback } from "react"
import { toast } from "sonner"
import { ResourceTable } from "@/app/dashboard/components/ResourceTable"
import { adminOrders } from "@/http/admin/api"

export default function OrdersPage() {
  const [data, setData] = useState<{ data: Record<string, unknown>[]; current_page: number; last_page: number } | null>(null)
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)

  const load = useCallback(async (p = 1) => {
    setLoading(true)
    try {
      const res = await adminOrders.list({ page: p, per_page: 15 })
      setData(res.data)
    } catch { toast.error("Failed to load orders") } finally { setLoading(false) }
  }, [])

  useEffect(() => { load(page) }, [load, page])

  const handleComplete = async (item: Record<string, unknown>) => {
    try { await adminOrders.complete(item.id as number); toast.success("Order completed"); load(page) } catch { toast.error("Failed") }
  }

  const handleCancel = async (item: Record<string, unknown>) => {
    if (!confirm("Cancel this order?")) return
    try { await adminOrders.cancel(item.id as number); toast.success("Order cancelled"); load(page) } catch { toast.error("Failed") }
  }

  const statusColors: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-700",
    completed: "bg-green-100 text-green-700",
    cancelled: "bg-red-100 text-red-600",
  }

  const columns = [
    { key: "id", label: "#ID", render: (v: unknown) => `#${v}` },
    {
      key: "customer_name",
      label: "Customer",
      render: (v: unknown, row: Record<string, unknown>) => (
        <div>
          <div className="font-medium text-sm">{String(v)}</div>
          <div className="text-xs text-gray-400">{String(row.email)}</div>
          <div className="text-xs text-gray-500">{String(row.phone || "")}</div>
        </div>
      ),
    },
    { key: "address", label: "Address" },
    {
      key: "status",
      label: "Status",
      render: (v: unknown) => (
        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[String(v)] || "bg-gray-100 text-gray-600"}`}>
          {String(v || "pending")}
        </span>
      ),
    },
    {
      key: "created_at",
      label: "Date",
      render: (v: unknown) => v ? new Date(String(v)).toLocaleDateString() : "",
    },
  ]

  return (
    <ResourceTable
      title="Orders"
      columns={columns}
      data={data?.data || []}
      loading={loading}
      pagination={data ? { currentPage: data.current_page, lastPage: data.last_page, onPageChange: setPage } : undefined}
      extraActions={(row) => (
        row.status === "pending" ? (
          <div className="flex gap-1">
            <button onClick={() => handleComplete(row)}
              className="text-green-600 hover:text-green-800 text-xs px-2 py-1 rounded border border-green-200 hover:border-green-400">
              Complete
            </button>
            <button onClick={() => handleCancel(row)}
              className="text-red-500 hover:text-red-700 text-xs px-2 py-1 rounded border border-red-200 hover:border-red-400">
              Cancel
            </button>
          </div>
        ) : null
      )}
    />
  )
}
