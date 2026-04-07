import axios from "axios"
import Cookies from "js-cookie"

export const $api = axios.create({
  withCredentials: true,
  baseURL: process.env.NEXT_PUBLIC_API_URL,
})

$api.interceptors.request.use((config) => {
  // Set language header from cookie
  const locale = Cookies.get("NEXT_LOCALE") || "ru"
  config.headers["Accept-Language"] = locale.toLowerCase()

  return config
})

$api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle errors without token refresh logic
    if (error?.response?.data) {
      // Forward API error details
      return Promise.reject(error.response.data)
    }

    // Handle network errors or other issues
    return Promise.reject(error)
  }
)
