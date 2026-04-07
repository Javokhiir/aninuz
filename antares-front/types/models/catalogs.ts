import { Pagination } from "./pagination"

export interface Catalog {
  id: number
  title: string
  file: {
    id: number
    name: string
    mime: string
    url: string
  }
}

export type CatalogResponse = Catalog
export type CatalogsResponse = Pagination<Catalog>
