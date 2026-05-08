"use client"

import { useState, useEffect, useCallback } from "react"
import { toast } from "sonner"
import { ResourceTable } from "@/app/dashboard/components/ResourceTable"
import { Modal } from "@/app/dashboard/components/Modal"
import { adminBrands } from "@/http/admin/api"

const LOCALES = ["ru", "en", "uz"]

export default function BrandsPage() {
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
    try {
      const res = await adminBrands.list({ page: p, per_page: 15 })
      setData(res.data)
    } catch { toast.error("Failed to load brands") } finally { setLoading(false) }
  }, [])

  useEffect(() => { load(page) }, [load, page])

  const openCreate = () => { setEditItem(null); setForm({}); setActiveLocale("ru"); setModalOpen(true) }

  const openEdit = async (item: Record<string, unknown>) => {
    setEditItem(item)
    try {
      const res = await adminBrands.show(item.id as number)
      const detail = res.data
      const localeForm: Record<string, unknown> = { ...detail }
      LOCALES.forEach(loc => {
        const t = (detail.translations as Record<string, unknown>[] | undefined)
          ?.find((tr: Record<string, unknown>) => tr.locale === loc)
        if (t) {
          localeForm[`title_${loc}`] = t.title
        }
      })
      setForm(localeForm)
    } catch {
      setForm({ ...item })
    }
    setActiveLocale("ru")
    setModalOpen(true)
  }

  const handleDelete = async (item: Record<string, unknown>) => {
    try { await adminBrands.delete(item.id as number); toast.success("Brand deleted"); load(page) } catch { toast.error("Failed to delete") }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      const payload: Record<string, unknown> = {
        slug: form.slug,
        color: form.color,
        is_active: form.is_active,
        svg: form.svg,
      }
      LOCALES.forEach(loc => {
        if (form[`title_${loc}`]) {
          payload[loc] = { title: form[`title_${loc}`] }
        }
      })
      if (editItem) {
        await adminBrands.update(editItem.id as number, payload)
      } else {
        await adminBrands.create(payload)
      }
      toast.success(editItem ? "Brand updated" : "Brand created")
      setModalOpen(false); load(page)
    } catch { toast.error("Failed to save") } finally { setSubmitting(false) }
  }

  const setField = (key: string, value: unknown) => setForm(f => ({ ...f, [key]: value }))

  const columns = [
    { key: "id", label: "#ID" },
    {
      key: "svg",
      label: "Logo",
      render: (v: unknown) => v
        ? <div className="w-10 h-10 flex items-center justify-center [&_svg]:max-h-8 [&_svg]:w-auto [&_path]:fill-gray-700" dangerouslySetInnerHTML={{ __html: String(v) }} />
        : <span className="text-gray-300 text-xs">—</span>,
    },
    { key: "title", label: "Title", render: (v: unknown) => <span className="font-medium">{String(v || "")}</span> },
    { key: "slug", label: "Slug" },
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
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400 border-b pb-1 mb-3">Translations</h3>
            <div className="flex gap-2 mb-4">
              {LOCALES.map(loc => (
                <button key={loc} type="button" onClick={() => setActiveLocale(loc)}
                  className={`px-3 py-1 rounded text-sm font-medium transition-colors ${activeLocale === loc ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>
                  {loc.toUpperCase()}
                </button>
              ))}
            </div>
            {LOCALES.map(loc => (
              <div key={loc} className={loc !== activeLocale ? "hidden" : ""}>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title ({loc})</label>
                <input value={String(form[`title_${loc}`] || "")} onChange={e => setField(`title_${loc}`, e.target.value)}
                  className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
            ))}
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400 border-b pb-1 mb-3">General</h3>
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Slug</label>
                <input value={String(form.slug || "")} onChange={e => setField("slug", e.target.value)}
                  className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Color</label>
                <div className="flex items-center gap-2">
                  <input type="color" value={String(form.color || "#000000")} onChange={e => setField("color", e.target.value)}
                    className="h-10 w-14 border rounded-lg cursor-pointer" />
                  <input value={String(form.color || "#000000")} onChange={e => setField("color", e.target.value)}
                    className="flex-1 border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
              </div>
            </div>
            <label className="flex items-center gap-2 text-sm mb-3">
              <input type="checkbox" checked={Boolean(form.is_active)} onChange={e => setField("is_active", e.target.checked)} className="rounded" />
              Active
            </label>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400 border-b pb-1 mb-3">SVG Logo</h3>
            {form.svg && (
              <div className="mb-3 p-3 bg-gray-900 rounded-lg flex items-center justify-center min-h-[60px]">
                <div
                  className="[&_svg]:max-h-12 [&_svg]:w-auto [&_path]:fill-white [&_svg]:max-w-[180px]"
                  dangerouslySetInnerHTML={{ __html: String(form.svg) }}
                />
              </div>
            )}
            <label className="block text-sm font-medium text-gray-700 mb-1">Paste SVG code</label>
            <textarea
              value={String(form.svg || "")}
              onChange={e => setField("svg", e.target.value)}
              rows={5}
              placeholder={'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">...</svg>'}
              className="w-full border rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => setModalOpen(false)} className="px-4 py-2 border rounded-lg text-sm text-gray-600 hover:bg-gray-50">Cancel</button>
            <button type="submit" disabled={submitting} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed">
              {submitting ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </Modal>
    </>
  )
}
