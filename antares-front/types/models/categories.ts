import { Pagination } from "./pagination"

export interface Category {
  id: number
  title: string
  slug: string
  parent: number
  children: Category[]
}

export type Categories = Category[]
export type CategoriesResponse = Pagination<Category>
