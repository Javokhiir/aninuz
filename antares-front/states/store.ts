import { toast } from "sonner"
import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"

import { Product } from "./../types/models/product"

type CartProduct = Product & {
  quantity: number
}

type CartStore = {
  cart: CartProduct[]
  changeQuantity: (id: number, action: "increment" | "decrement") => void
  addToCart: (product: Product) => void
  addToCartWithQuantity: (product: Product, quantity: number) => void
  deleteProduct: (id: number) => void
  clearCart: () => void
  totalItems: () => number
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      cart: [],
      addToCart: (product) => {
        set((state) => {
          const existingProduct = state.cart.find((p) => p.id === product.id)

          if (existingProduct) {
            const cart = state.cart.map((p) =>
              p.id === product.id ? { ...p, quantity: p.quantity + 1 } : p
            )
            return { cart }
          }
          toast.success("Товар успешно добавлен в корзину")
          return { cart: [...state.cart, { ...product, quantity: 1 }] }
        })
      },
      addToCartWithQuantity: (product, quantity) => {
        set((state) => {
          const existingProduct = state.cart.find((p) => p.id === product.id)
          if (existingProduct) {
            const cart = state.cart.map((p) =>
              p.id === product.id
                ? { ...p, quantity: quantity + p.quantity }
                : p
            )
            return { cart }
          }
          toast.success("Товар успешно добавлен в корзину")
          return { cart: [...state.cart, { ...product, quantity: quantity }] }
        })
      },
      changeQuantity: (id, action) => {
        set((state) => {
          const cart = state.cart.map((product) => {
            if (product.id === id) {
              let newQuantity = product.quantity

              if (action === "increment") {
                newQuantity += 1
              } else if (action === "decrement") {
                newQuantity = Math.max(1, product.quantity - 1)
              }

              return { ...product, quantity: newQuantity }
            } else {
            }

            return product
          })

          return { cart }
        })
      },
      deleteProduct: (id) => {
        set((state) => ({
          cart: state.cart.filter((product) => product.id !== id),
        }))
        toast.success("Товар успешно удален из корзины")
      },
      clearCart: () => set({ cart: [] }),
      totalItems: () =>
        get().cart.reduce((sum, item) => sum + item.quantity, 0),
    }),
    {
      name: "cart-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
)

type NavBarColorStore = {
  color: string
  changeColor: (color: string) => void
}

export const useNavBarColorStore = create<NavBarColorStore>()((set) => ({
  color: "primary",
  changeColor: (color) => set({ color }),
}))

type CompanyColorStore = {
  color: string
  setColor: (color: string) => void
}

export const useCompanyColorStore = create<CompanyColorStore>()(
  persist(
    (set) => ({
      color: "muted",

      setColor: (color) => {
        set({ color })
      },
    }),
    {
      name: "company-color-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
)
