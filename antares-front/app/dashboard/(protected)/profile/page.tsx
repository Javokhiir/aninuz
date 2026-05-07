"use client"

import { useState } from "react"
import { toast } from "sonner"
import { adminAuth, adminUsers } from "@/http/admin/api"

type PassStep = "idle" | "code-sent" | "success"
type SubmitHandler = (e: { preventDefault(): void }) => Promise<void>

export default function ProfilePage() {
  const stored = typeof window !== "undefined" ? localStorage.getItem("admin_user") : null
  const initialUser = stored ? JSON.parse(stored) : {}

  const [form, setForm] = useState({
    name: initialUser.name || "",
    email: initialUser.email || "",
    phone: "",
  })
  const [saving, setSaving] = useState(false)

  const [passStep, setPassStep] = useState<PassStep>("idle")
  const [sendingCode, setSendingCode] = useState(false)
  const [passForm, setPassForm] = useState({
    code: "",
    password: "",
    password_confirmation: "",
  })
  const [changingPass, setChangingPass] = useState(false)
  const [countdown, setCountdown] = useState(0)

  const setField = (key: string, value: string) =>
    setForm((f) => ({ ...f, [key]: value }))
  const setPassField = (key: string, value: string) =>
    setPassForm((f) => ({ ...f, [key]: value }))

  const handleProfileSave: SubmitHandler = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      const res = await adminUsers.updateProfile(form)
      localStorage.setItem("admin_user", JSON.stringify(res.data.user))
      toast.success("Profil yangilandi")
    } catch {
      toast.error("Saqlashda xatolik")
    } finally {
      setSaving(false)
    }
  }

  const handleRequestCode = async () => {
    setSendingCode(true)
    try {
      await adminAuth.requestPasswordCode()
      toast.success("Tasdiqlash kodi ceo@anin.uz ga yuborildi")
      setPassStep("code-sent")
      setPassForm({ code: "", password: "", password_confirmation: "" })
      setCountdown(60)
      const timer = setInterval(() => {
        setCountdown((c) => {
          if (c <= 1) { clearInterval(timer); return 0 }
          return c - 1
        })
      }, 1000)
    } catch (err: unknown) {
      const e = err as { message?: string }
      toast.error(e?.message || "Kod yuborishda xatolik")
    } finally {
      setSendingCode(false)
    }
  }

  const handleChangePassword: SubmitHandler = async (e) => {
    e.preventDefault()
    if (passForm.password !== passForm.password_confirmation) {
      toast.error("Parollar mos kelmaydi")
      return
    }
    if (passForm.password.length < 8) {
      toast.error("Parol kamida 8 ta belgidan iborat bolishi kerak")
      return
    }
    setChangingPass(true)
    try {
      await adminAuth.changePasswordWithCode(passForm)
      toast.success("Parol muvaffaqiyatli ozgartirildi")
      setPassStep("success")
      setPassForm({ code: "", password: "", password_confirmation: "" })
    } catch (err: unknown) {
      const e = err as { message?: string }
      toast.error(e?.message || "Parolni ozgartirishda xatolik")
    } finally {
      setChangingPass(false)
    }
  }

  const handleResetFlow = () => {
    setPassStep("idle")
    setCountdown(0)
    setPassForm({ code: "", password: "", password_confirmation: "" })
  }

  return (
    <div className="max-w-2xl space-y-6">
      {/* Profile */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Profil</h2>
        <form onSubmit={handleProfileSave} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Ism</label>
            <input
              value={form.name}
              onChange={(e) => setField("name", e.target.value)}
              className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setField("email", e.target.value)}
              className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Telefon</label>
            <input
              value={form.phone}
              onChange={(e) => setField("phone", e.target.value)}
              className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            type="submit"
            disabled={saving}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 disabled:opacity-50"
          >
            {saving ? "Saqlanmoqda..." : "Saqlash"}
          </button>
        </form>
      </div>

      {/* Password change */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-1">Parolni o&#39;zgartirish</h2>
        <p className="text-sm text-gray-500 mb-5">
          Xavfsizlik uchun tasdiqlash kodi{" "}
          <span className="font-semibold text-gray-700">ceo@anin.uz</span>{" "}
          ga yuboriladi.
        </p>

        {/* idle */}
        {passStep === "idle" && (
          <button
            onClick={handleRequestCode}
            disabled={sendingCode}
            className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white text-sm font-medium px-5 py-2.5 rounded-lg transition-colors disabled:opacity-50"
          >
            {sendingCode ? (
              <>
                <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Yuborilmoqda...
              </>
            ) : (
              <>
                <span>📧</span> Tasdiqlash kodini yuborish
              </>
            )}
          </button>
        )}

        {/* code-sent */}
        {passStep === "code-sent" && (
          <form onSubmit={handleChangePassword} className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex items-start gap-2 text-sm text-blue-700">
              <span className="mt-0.5">✉️</span>
              <span>
                Tasdiqlash kodi <strong>ceo@anin.uz</strong> manziliga yuborildi.
                Kodni kiriting va yangi parolni belgilang.
              </span>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tasdiqlash kodi (6 ta raqam)
              </label>
              <input
                value={passForm.code}
                onChange={(e) => setPassField("code", e.target.value.replace(/\D/g, "").slice(0, 6))}
                placeholder="000000"
                maxLength={6}
                required
                className="w-44 border rounded-lg px-3 py-2 text-center tracking-widest font-mono text-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Yangi parol</label>
              <input
                type="password"
                value={passForm.password}
                onChange={(e) => setPassField("password", e.target.value)}
                placeholder="Kamida 8 ta belgi"
                required
                minLength={8}
                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Parolni tasdiqlang</label>
              <input
                type="password"
                value={passForm.password_confirmation}
                onChange={(e) => setPassField("password_confirmation", e.target.value)}
                placeholder="Parolni qayta kiriting"
                required
                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-1">
              <button
                type="submit"
                disabled={changingPass || passForm.code.length !== 6}
                className="bg-blue-600 text-white px-5 py-2 rounded-lg text-sm hover:bg-blue-700 disabled:opacity-50"
              >
                {changingPass ? "Tekshirilmoqda..." : "Parolni o&#39;zgartirish"}
              </button>

              <button
                type="button"
                onClick={handleRequestCode}
                disabled={sendingCode || countdown > 0}
                className="text-sm text-gray-500 hover:text-gray-700 disabled:opacity-40"
              >
                {countdown > 0 ? `Qayta yuborish (${countdown}s)` : "Kodni qayta yuborish"}
              </button>

              <button
                type="button"
                onClick={handleResetFlow}
                className="text-sm text-red-400 hover:text-red-600 ml-auto"
              >
                Bekor qilish
              </button>
            </div>
          </form>
        )}

        {/* success */}
        {passStep === "success" && (
          <div className="flex flex-col items-start gap-4">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3 text-green-700 text-sm w-full">
              <span className="text-xl">✅</span>
              <span>
                Parol muvaffaqiyatli ozgartirildi.
                Barcha boshqa qurilmalar tizimdan chiqarildi.
              </span>
            </div>
            <button
              onClick={handleResetFlow}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              Parolni yana o&#39;zgartirish
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
