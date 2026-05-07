"use client"

import { useState, useEffect, useCallback } from "react"
import { toast } from "sonner"
import { ResourceTable } from "@/app/dashboard/components/ResourceTable"
import { Modal } from "@/app/dashboard/components/Modal"
import { adminBrands } from "@/http/admin/api"

export default function BrandsPage() {
  const [data, setData] = useState<{ data: Record<string, unknown>[]; current_page: number; last_page: number } | null>(null)
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editItem, setEditItem] = useState<Record<string, unknown> | null>(null)
  const [page, setPage] = useState(1)
  const [form, setForm] = useState<Record<string, unknown>>({})
  const [submitting, setSubmitting] = useState(false)

  const load = useCallback(async (p = 1) => {
    setLoading(true)
    try {
      const res = await adminBrands.list({ page: p, per_page: 15 })
      setData(res.data)
    } catch { toast.error("Failed to load brands") } finally { setLoading(false) }
  }, [])

  useEffect(() => { load(page) }, [load, page])

  const openCreate = () => { setEditItem(null); setForm({}); setModalOpen(true) }
  const openEdit = (item: Record<string, unknown>) => { setEditItem(item); setForm({ ...item }); setModalOpen(true) }

  const handleDelete = async (item: Record<string, unknown>) => {
    try { await adminBrands.delete(item.id as number); toast.success("Brand deleted"); load(page) } catch { toast.error("Failed to delete") }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      if (editItem) { await adminBrands.update(editItem.id as number, form) } else { await adminBrands.create(form) }
      toast.success(editItem ? "Brand updated" : "Brand created")
      setModalOpen(false); load(page)
    } catch { toast.error("Failed to save") } finally { setSubmitting(false) }
  }

  const setField = (key: string, value: unknown) => setForm(f => ({ ...f, [key]: value }))

  const columns = [
    { key: "id", label: "#ID" },
    { key: "title", label: "Title", render: (v: unknown) => <span className="font-medium">{String(v || "")}</span> },
    {
      key: "is_active",
      label: "Status",
      render: (v: unknown) => (
        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${v ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"}`}>
          {v ? "Active" : "Inactive"}
        </span>
      ),
    },
  ]

  return (
    <>
      <ResourceTable title="Brands" columns={columns} data={data?.data || []} loading={loading}
        onAdd={openCreate} onEdit={openEdit} onDelete={handleDelete}
        pagination={data ? { currentPage: data.current_page, lastPage: data.last_page, onPageChange: setPage } : undefined} />

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editItem ? "Edit Brand" : "Add Brand"}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input value={String(form.title || "")} onChange={e => setField("title", e.target.value)} required
              className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Slug</label>
            <input value={String(form.slug || "")} onChange={e => setField("slug", e.target.value)}
              className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Color</label>
            <input type="color" value={String(form.color || "#000000")} onChange={e => setField("color", e.target.value)}
              className="h-10 w-20 border rounded-lg cursor-pointer" />
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={Boolean(form.is_active)} onChange={e => setField("is_active", e.target.checked)} className="rounded" />
            Active
          </label>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => setModalOpen(false)} className="px-4 py-2 border rounded-lg text-sm text-gray-600 hover:bg-gray-50">Cancel</button>
            <button type="submit" disabled={submitting} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 disabled:opacity-50">
              {submitting ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </Modal>
    </>
  )
}
