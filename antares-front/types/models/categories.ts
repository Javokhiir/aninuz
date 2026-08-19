import { Pagination } from "./pagination"

export interface CategoryTranslation {
  locale: string
  title: string | null
  content: string | null
}

export interface CategoryImage {
  id: number
  url: string
  url_webp: string
  preview_url: string
  preview_url_webp: string
  thumb_url: string
}

export interface Category {
  id: number
  title: string | null
  content: string | null
  slug: string
  parent_id: number | null
  order: number | null
  brand: string | null
  is_visible?: boolean
  parent?: Category | null
  children?: Category[]
  images?: CategoryImage[]
  translations?: CategoryTranslation[]
}

export type Categories = Category[]
export type CategoriesResponse = Pagination<Category>
