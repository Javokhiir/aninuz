import { create } from "zustand"

type CartDrawerStore = {
  open: boolean
  openCart: () => void
  closeCart: () => void
}

/**
 * Open/closed state for the cart drawer.
 *
 * Deliberately separate from `useCartStore`: that one is persisted to
 * `localStorage`, and a drawer that remembers it was open would re-open itself
 * on every visit. This is session state and belongs nowhere but memory.
 */
export const useCartDrawer = create<CartDrawerStore>()((set) => ({
  open: false,
  openCart: () => set({ open: true }),
  closeCart: () => set({ open: false }),
}))
