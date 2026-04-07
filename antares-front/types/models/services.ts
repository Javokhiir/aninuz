import { Pagination } from "./pagination"

export interface Service {
  id: number
  title: string
  content: string
  slug: string
  images: {
    url: string
    url_webp: string
    preview_url: string
    preview_url_webp: string
    thumb_url: string
  }[]
}

export type ServiceResponse = { data: Service }

export type ServicesResponse = Pagination<Service>
