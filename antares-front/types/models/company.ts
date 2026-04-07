import { Pagination } from "./pagination"

export interface Company {
  id: number
  color: string
  svg: string
  title: string
  slug: string
}

export type CompaniesResponse = Pagination<Company>
