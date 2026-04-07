import { Pagination } from "./pagination"

export interface Event {
  id: number
  title: string
  content: string
  slug: string
  address: string
  date: string
  images: {
    id: number
    preview_url: string
    preview_url_webp: string
    thumb_url: string
    url: string
    url_webp: string
  }[]
}

export type EventResponse = { data: Event }
export type EventsResponse = Pagination<Event>
