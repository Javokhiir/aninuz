export type OrderFormRequest = {
  customer_name: string
  email: string
  phone: string
  address: string
  products: {
    quantity: number
    id: number
  }[]
}
