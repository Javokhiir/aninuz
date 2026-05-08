"use client"

import { useState, useEffect, useCallback } from "react"
import { toast } from "sonner"
import { ResourceTable } from "@/app/dashboard/components/ResourceTable"
import { Modal } from "@/app/dashboard/components/Modal"
import { adminProducts, adminBrands, adminCategories } from "@/http/admin/api"

const LOCALES = ["ru", "en", "uz"]

export default function ProductsPage() {
  const [data, setData] = useState<{ data: Record<string, unknown>[]; current_page: number; last_page: number } | null>(null)
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editItem, setEditItem] = useState<Record<string, unknown> | null>(null)
  const [brands, setBrands] = useState<Record<string, unknown>[]>([])
  const [categories, setCategories] = useState<Record<string, unknown>[]>([])
  const [page, setPage] = useState(1)
  const [activeLocale, setActiveLocale] = useState("ru")
  const [form, setForm] = useState<Record<string, unknown>>({})
  const [submitting, setSubmitting] = useState(false)

  const load = useCallback(async (p = 1) => {
    setLoading(true)
    try {
      const res = await adminProducts.list({ page: p, per_page: 15 })
      setData(res.data)
    } catch {
      toast.error("Failed to load products")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    load(page)
    adminBrands.list({ per_page: 100 }).then(r => setBrands(r.data.data || [])).catch(() => {})
    adminCategories.list({ per_page: 100 }).then(r => setCategories(r.data.data || [])).catch(() => {})
  }, [load, page])

  const openCreate = () => {
    setEditItem(null)
    setForm({})
    setActiveLocale("ru")
    setModalOpen(true)
  }

  const openEdit = async (item: Record<string, unknown>) => {
    setEditItem(item)
    try {
      const res = await adminProducts.show(item.id as number)
      const product = res.data
      const localeForm: Record<string, unknown> = { ...product }
      LOCALES.forEach(loc => {
        const translation = (product.translations as Record<string, unknown>[] | undefined)
          ?.find((t: Record<string, unknown>) => t.locale === loc)
        if (translation) {
          localeForm[loc] = { title: translation.title, content: translation.content }
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
    try {
      await adminProducts.delete(item.id as number)
      toast.success("Product deleted")
      load(page)
    } catch {
      toast.error("Failed to delete product")
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      const fd = new FormData()
      ;["slug", "articul", "status", "brand", "quantity"].forEach(key => {
        if (form[key] !== undefined && form[key] !== null) fd.append(key, String(form[key]))
      })
      fd.append("is_featured", Boolean(form.is_featured) ? "true" : "false")
      fd.append("is_new", Boolean(form.is_new) ? "true" : "false")
      LOCALES.forEach(loc => {
        const locData = (form as Record<string, Record<string, unknown>>)[loc]
        if (locData?.title) fd.append(`${loc}[title]`, String(locData.title))
        if (locData?.content) fd.append(`${loc}[content]`, String(locData.content))
      })
      if (editItem) {
        await adminProducts.update(editItem.id as number, fd)
      } else {
        await adminProducts.create(fd)
      }
      toast.success(editItem ? "Product updated" : "Product created")
      setModalOpen(false)
      load(page)
    } catch {
      toast.error("Failed to save product")
    } finally {
      setSubmitting(false)
    }
  }

  const setField = (key: string, value: unknown) => setForm(f => ({ ...f, [key]: value }))

  const columns = [
    { key: "id", label: "#ID" },
    { key: "title", label: "Name", render: (v: unknown) => <span className="font-medium">{String(v || "")}</span> },
    { key: "articul", label: "Articul" },
    { key: "brand", label: "Brand" },
    {
      key: "status",
      label: "Status",
      render: (v: unknown) => (
        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${v === "active" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"}`}>
          {String(v || "draft")}
        </span>
      ),
    },
    {
      key: "created_at",
      label: "Created",
      render: (v: unknown) => v ? new Date(String(v)).toLocaleDateString() : "",
    },
  ]

  // suppress unused variable warning
  void categories

  return (
    <>
      <ResourceTable
        title="Products"
        columns={columns}
        data={data?.data || []}
        loading={loading}
        onAdd={openCreate}
        onEdit={openEdit}
        onDelete={handleDelete}
        pagination={data ? { currentPage: data.current_page, lastPage: data.last_page, onPageChange: setPage } : undefined}
      />

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editItem ? "Edit Product" : "Add Product"}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex gap-2 border-b pb-3">
            {LOCALES.map(loc => (
              <button key={loc} type="button" onClick={() => setActiveLocale(loc)}
                className={`px-3 py-1 rounded text-sm font-medium transition-colors ${activeLocale === loc ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-600"}`}>
                {loc.toUpperCase()}
              </button>
            ))}
          </div>
          {LOCALES.map(loc => (
            <div key={loc} className={loc !== activeLocale ? "hidden" : "space-y-3"}>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title ({loc})</label>
                <input value={String((form as Record<string, Record<string, unknown>>)[loc]?.title || "")} onChange={e => setField(loc, { ...(form as Record<string, Record<string, unknown>>)[loc], title: e.target.value })}
                  className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Content ({loc})</label>
                <textarea value={String((form as Record<string, Record<string, unknown>>)[loc]?.content || "")} onChange={e => setField(loc, { ...(form as Record<string, Record<string, unknown>>)[loc], content: e.target.value })}
                  rows={4} className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
            </div>
          ))}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Slug</label>
              <input value={String(form.slug || "")} onChange={e => setField("slug", e.target.value)}
                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Articul</label>
              <input value={String(form.articul || "")} onChange={e => setField("articul", e.target.value)}
                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Brand</label>
              <select value={String(form.brand || "")} onChange={e => setField("brand", e.target.value)}
                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">Select brand</option>
                {brands.map((b: Record<string, unknown>) => <option key={String(b.id)} value={String(b.slug || b.id)}>{String(b.title)}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select value={String(form.status || "draft")} onChange={e => setField("status", e.target.value)}
                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="active">Active</option>
                <option value="draft">Draft</option>
                <option value="archived">Archived</option>
              </select>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={Boolean(form.is_featured)} onChange={e => setField("is_featured", e.target.checked)} className="rounded" />
              Featured
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={Boolean(form.is_new)} onChange={e => setField("is_new", e.target.checked)} className="rounded" />
              New
            </label>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => setModalOpen(false)}
              className="px-4 py-2 border rounded-lg text-sm text-gray-600 hover:bg-gray-50">Cancel</button>
            <button type="submit" disabled={submitting}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 disabled:opacity-50">
              {submitting ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </Modal>
    </>
  )
}
