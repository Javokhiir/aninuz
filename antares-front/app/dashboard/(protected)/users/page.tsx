"use client"

import { useState, useEffect, useCallback } from "react"
import { toast } from "sonner"
import { ResourceTable } from "@/app/dashboard/components/ResourceTable"
import { Modal } from "@/app/dashboard/components/Modal"
import { adminUsers } from "@/http/admin/api"

export default function UsersPage() {
  const [data, setData] = useState<{ data: Record<string, unknown>[]; current_page: number; last_page: number } | null>(null)
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editItem, setEditItem] = useState<Record<string, unknown> | null>(null)
  const [page, setPage] = useState(1)
  const [form, setForm] = useState<Record<string, unknown>>({})
  const [submitting, setSubmitting] = useState(false)

  const load = useCallback(async (p = 1) => {
    setLoading(true)
    try { const res = await adminUsers.list({ page: p }); setData(res.data) } catch { toast.error("Failed to load") } finally { setLoading(false) }
  }, [])

  useEffect(() => { load(page) }, [load, page])

  const openCreate = () => { setEditItem(null); setForm({ is_active: true }); setModalOpen(true) }
  const openEdit = (item: Record<string, unknown>) => { setEditItem(item); setForm({ ...item, password: "" }); setModalOpen(true) }

  const handleDelete = async (item: Record<string, unknown>) => {
    try { await adminUsers.delete(item.id as number); toast.success("User deleted"); load(page) } catch { toast.error("Failed") }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); setSubmitting(true)
    try {
      if (editItem) { await adminUsers.update(editItem.id as number, form) } else { await adminUsers.create(form) }
      toast.success(editItem ? "User updated" : "User created"); setModalOpen(false); load(page)
    } catch { toast.error("Failed") } finally { setSubmitting(false) }
  }

  const setField = (key: string, value: unknown) => setForm(f => ({ ...f, [key]: value }))

  const columns = [
    { key: "id", label: "#ID" },
    { key: "name", label: "Name", render: (v: unknown) => <span className="font-medium">{String(v || "")}</span> },
    { key: "email", label: "Email" },
    { key: "phone", label: "Phone" },
    { key: "is_active", label: "Status", render: (v: unknown) => <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${v ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"}`}>{v ? "Active" : "Inactive"}</span> },
  ]

  return (
    <>
      <ResourceTable title="Users" columns={columns} data={data?.data || []} loading={loading}
        onAdd={openCreate} onEdit={openEdit} onDelete={handleDelete}
        pagination={data ? { currentPage: data.current_page, lastPage: data.last_page, onPageChange: setPage } : undefined} />

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editItem ? "Edit User" : "Add User"}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input value={String(form.name || "")} onChange={e => setField("name", e.target.value)} required
                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input type="email" value={String(form.email || "")} onChange={e => setField("email", e.target.value)} required
                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
              <input value={String(form.phone || "")} onChange={e => setField("phone", e.target.value)}
                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            {!editItem && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <input type="password" value={String(form.password || "")} onChange={e => setField("password", e.target.value)} required={!editItem}
                  className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
            )}
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
