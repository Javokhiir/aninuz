import { Pagination } from "./pagination"

export interface Faqs {
  id: number
  title: string
  content: string
}

export interface Product {
  id: number
  quantity: number
  slug: string
  content: string
  title: string
  brand: string
  table_content: string
  table_content_second: string
  faqs?: Faqs[]
  images: {
    id: number
    url: string
    url_webp: string
    preview_url: string
    preview_url_webp: string
    thumb_url: string
  }[]
}

export type OneClickBuyRequest = {
  name: string
  phone: string
  product_id: number
}

export type ProductResponse = { data: Product }
export type Products = Product[]
export type ProductsResponse = Pagination<Product>
