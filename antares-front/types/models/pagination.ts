export interface Pagination<T> {
  meta: {
    total: number
    current_page: number
    per_page: number
    color?: string
    svg?: string
  }
  data: T[]
}
