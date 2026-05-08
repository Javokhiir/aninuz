import axios from "axios"

const ADMIN_API_URL = process.env.NEXT_PUBLIC_ADMIN_API_URL
  || (process.env.NEXT_PUBLIC_API_URL || "").replace(/\/api$/, "") + "/api/admin"

export const $admin = axios.create({
  baseURL: ADMIN_API_URL,
})

$admin.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("admin_token")
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`
    }
  }
  return config
})

$admin.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401 && typeof window !== "undefined") {
      const isLoginRequest = error?.config?.url?.includes("/login")
      if (!isLoginRequest) {
        localStorage.removeItem("admin_token")
        localStorage.removeItem("admin_user")
        window.location.href = "/dashboard/login"
      }
    }
    return Promise.reject(error?.response?.data || error)
  }
)
