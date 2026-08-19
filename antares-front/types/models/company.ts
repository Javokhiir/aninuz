import { Pagination } from "./pagination"

export interface CompanyTranslation {
  locale: string
  title: string | null
  content: string | null
}

export interface Company {
  id: number
  color: string | null
  svg: string | null
  title: string | null
  slug: string
  translations?: CompanyTranslation[]
}

export type CompaniesResponse = Pagination<Company>
