"use client"

import { useState, useEffect, useCallback } from "react"
import { toast } from "sonner"
import { ResourceTable } from "@/app/dashboard/components/ResourceTable"
import { Modal } from "@/app/dashboard/components/Modal"
import { adminServices } from "@/http/admin/api"

const LOCALES = ["ru", "en", "uz"]

export default function ServicesPage() {
  const [data, setData] = useState<{ data: Record<string, unknown>[]; current_page: number; last_page: number } | null>(null)
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editItem, setEditItem] = useState<Record<string, unknown> | null>(null)
  const [page, setPage] = useState(1)
  const [activeLocale, setActiveLocale] = useState("ru")
  const [form, setForm] = useState<Record<string, unknown>>({})
  const [submitting, setSubmitting] = useState(false)

  const load = useCallback(async (p = 1) => {
    setLoading(true)
    try { const res = await adminServices.list({ page: p }); setData(res.data) } catch { toast.error("Failed to load") } finally { setLoading(false) }
  }, [])

  useEffect(() => { load(page) }, [load, page])

  const openCreate = () => { setEditItem(null); setForm({}); setActiveLocale("ru"); setModalOpen(true) }
  const openEdit = (item: Record<string, unknown>) => { setEditItem(item); setForm({ ...item }); setActiveLocale("ru"); setModalOpen(true) }

  const handleDelete = async (item: Record<string, unknown>) => {
    try { await adminServices.delete(item.id as number); toast.success("Service deleted"); load(page) } catch { toast.error("Failed") }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); setSubmitting(true)
    try {
      const fd = new FormData()
      if (form.slug) fd.append("slug", String(form.slug))
      fd.append("is_active", form.is_active ? "true" : "false")
      LOCALES.forEach(loc => {
        if (form[`title_${loc}`]) fd.append(`${loc}[title]`, String(form[`title_${loc}`]))
        if (form[`content_${loc}`]) fd.append(`${loc}[content]`, String(form[`content_${loc}`]))
      })
      if (form.image instanceof File) fd.append("image", form.image)
      if (editItem) { await adminServices.update(editItem.id as number, fd) } else { await adminServices.create(fd) }
      toast.success(editItem ? "Updated" : "Created"); setModalOpen(false); load(page)
    } catch { toast.error("Failed") } finally { setSubmitting(false) }
  }

  const setField = (key: string, value: unknown) => setForm(f => ({ ...f, [key]: value }))

  const columns = [
    { key: "id", label: "#ID" },
    { key: "title", label: "Title", render: (v: unknown) => <span className="font-medium">{String(v || "")}</span> },
    { key: "slug", label: "Slug" },
    { key: "is_active", label: "Status", render: (v: unknown) => <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${v ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"}`}>{v ? "Active" : "Inactive"}</span> },
  ]

  return (
    <>
      <ResourceTable title="Services" columns={columns} data={data?.data || []} loading={loading}
        onAdd={openCreate} onEdit={openEdit} onDelete={handleDelete}
        pagination={data ? { currentPage: data.current_page, lastPage: data.last_page, onPageChange: setPage } : undefined} />

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editItem ? "Edit Service" : "Add Service"}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex gap-2 border-b pb-3">
            {LOCALES.map(loc => (
              <button key={loc} type="button" onClick={() => setActiveLocale(loc)}
                className={`px-3 py-1 rounded text-sm font-medium ${activeLocale === loc ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-600"}`}>
                {loc.toUpperCase()}
              </button>
            ))}
          </div>
          {LOCALES.map(loc => (
            <div key={loc} className={loc !== activeLocale ? "hidden" : "space-y-3"}>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title ({loc})</label>
                <input value={String(form[`title_${loc}`] || "")} onChange={e => setField(`title_${loc}`, e.target.value)}
                  className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Content ({loc})</label>
                <textarea value={String(form[`content_${loc}`] || "")} onChange={e => setField(`content_${loc}`, e.target.value)}
                  rows={4} className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
            </div>
          ))}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Slug</label>
            <input value={String(form.slug || "")} onChange={e => setField("slug", e.target.value)}
              className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={Boolean(form.is_active)} onChange={e => setField("is_active", e.target.checked)} className="rounded" />
            Active
          </label>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => setModalOpen(false)} className="px-4 py-2 border rounded-lg text-sm text-gray-600 hover:bg-gray-50">Cancel</button>
            <button type="submit" disabled={submitting} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 disabled:opacity-50">{submitting ? "Saving..." : "Save"}</button>
          </div>
        </form>
      </Modal>
    </>
  )
}
