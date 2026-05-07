"use client"

import { useState, useEffect, useCallback } from "react"
import { toast } from "sonner"
import { ResourceTable } from "@/app/dashboard/components/ResourceTable"
import { adminReviews } from "@/http/admin/api"

export default function ReviewsPage() {
  const [data, setData] = useState<{ data: Record<string, unknown>[]; current_page: number; last_page: number } | null>(null)
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)

  const load = useCallback(async (p = 1) => {
    setLoading(true)
    try {
      const res = await adminReviews.list({ page: p, per_page: 15 })
      setData(res.data)
    } catch { toast.error("Failed to load reviews") } finally { setLoading(false) }
  }, [])

  useEffect(() => { load(page) }, [load, page])

  const handleDelete = async (item: Record<string, unknown>) => {
    try { await adminReviews.delete(item.id as number); toast.success("Review deleted"); load(page) } catch { toast.error("Failed to delete") }
  }

  const columns = [
    { key: "id", label: "#ID" },
    { key: "name", label: "Name" },
    { key: "email", label: "Email" },
    { key: "rating", label: "Rating" },
    { key: "content", label: "Content", render: (v: unknown) => <span className="text-xs text-gray-600 max-w-xs block truncate">{String(v || "")}</span> },
    { key: "created_at", label: "Date", render: (v: unknown) => v ? new Date(String(v)).toLocaleDateString() : "" },
  ]

  return (
    <ResourceTable title="Reviews" columns={columns} data={data?.data || []} loading={loading}
      onDelete={handleDelete}
      pagination={data ? { currentPage: data.current_page, lastPage: data.last_page, onPageChange: setPage } : undefined} />
  )
}
