import { $admin } from "./instance"

export const adminAuth = {
  login: (email: string, password: string) =>
    $admin.post("/login", { email, password }),
  logout: () => $admin.post("/logout"),
  me: () => $admin.get("/me"),
  requestPasswordCode: () => $admin.post("/auth/request-code"),
  changePasswordWithCode: (data: {
    code: string
    password: string
    password_confirmation: string
  }) => $admin.post("/auth/change-password", data),
}

export const adminProducts = {
  list: (params?: Record<string, unknown>) => $admin.get("/products", { params }),
  show: (id: number) => $admin.get(`/products/${id}`),
  create: (data: FormData) => $admin.post("/products", data),
  update: (id: number, data: FormData) => $admin.post(`/products/${id}`, data, {
    headers: { "X-HTTP-Method-Override": "PUT" },
  }),
  delete: (id: number) => $admin.delete(`/products/${id}`),
  deleteImage: (productId: number, imageId: number) =>
    $admin.post(`/products/${productId}/delete-image`, { image_id: imageId }),
}

export const adminCategories = {
  list: (params?: Record<string, unknown>) => $admin.get("/categories", { params }),
  show: (id: number) => $admin.get(`/categories/${id}`),
  create: (data: FormData) => $admin.post("/categories", data),
  update: (id: number, data: FormData) => $admin.post(`/categories/${id}`, data, {
    headers: { "X-HTTP-Method-Override": "PUT" },
  }),
  delete: (id: number) => $admin.delete(`/categories/${id}`),
}

export const adminBrands = {
  list: (params?: Record<string, unknown>) => $admin.get("/brands", { params }),
  show: (id: number) => $admin.get(`/brands/${id}`),
  create: (data: Record<string, unknown>) => $admin.post("/brands", data),
  update: (id: number, data: Record<string, unknown>) => $admin.put(`/brands/${id}`, data),
  delete: (id: number) => $admin.delete(`/brands/${id}`),
}

export const adminServices = {
  list: (params?: Record<string, unknown>) => $admin.get("/services", { params }),
  show: (id: number) => $admin.get(`/services/${id}`),
  create: (data: FormData) => $admin.post("/services", data),
  update: (id: number, data: FormData) => $admin.post(`/services/${id}`, data, {
    headers: { "X-HTTP-Method-Override": "PUT" },
  }),
  delete: (id: number) => $admin.delete(`/services/${id}`),
}

export const adminEvents = {
  list: (params?: Record<string, unknown>) => $admin.get("/events", { params }),
  show: (id: number) => $admin.get(`/events/${id}`),
  create: (data: FormData) => $admin.post("/events", data),
  update: (id: number, data: FormData) => $admin.post(`/events/${id}`, data, {
    headers: { "X-HTTP-Method-Override": "PUT" },
  }),
  delete: (id: number) => $admin.delete(`/events/${id}`),
}

export const adminOrders = {
  list: (params?: Record<string, unknown>) => $admin.get("/orders", { params }),
  show: (id: number) => $admin.get(`/orders/${id}`),
  complete: (id: number) => $admin.post(`/orders/${id}/complete`),
  cancel: (id: number) => $admin.post(`/orders/${id}/cancel`),
}

export const adminReviews = {
  list: (params?: Record<string, unknown>) => $admin.get("/reviews", { params }),
  delete: (id: number) => $admin.delete(`/reviews/${id}`),
}

export const adminUsers = {
  list: (params?: Record<string, unknown>) => $admin.get("/users", { params }),
  show: (id: number) => $admin.get(`/users/${id}`),
  create: (data: Record<string, unknown>) => $admin.post("/users", data),
  update: (id: number, data: Record<string, unknown>) => $admin.put(`/users/${id}`, data),
  delete: (id: number) => $admin.delete(`/users/${id}`),
  updateProfile: (data: Record<string, unknown>) => $admin.post("/profile", data),
  updatePassword: (data: Record<string, unknown>) => $admin.post("/profile/password", data),
}
