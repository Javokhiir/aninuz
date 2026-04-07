import { useCallback } from "react"
import {
  useSearchParams as useNextSearchParams,
  usePathname,
  useRouter,
} from "next/navigation"

export const useQueryParams = () => {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useNextSearchParams()

  const getParam = (name: string, defaultValue?: string) =>
    searchParams.get(name) ?? defaultValue

  const setParam = useCallback(
    (name: string, value: string | number | null) => {
      const params = new URLSearchParams(searchParams.toString())

      if (value) params.set(name, String(value))
      else params.delete(name)
      router.push(`${pathname}?${params.toString()}`)
    },
    [pathname, router, searchParams]
  )

  const clearParams = useCallback(
    (deleteParams?: string[]) => {
      const params = new URLSearchParams(searchParams?.toString())
      if (deleteParams) {
        deleteParams.forEach((param) => params.delete(param))
        router.push(`${pathname}?${params.toString()}`)
      } else {
        router.push(pathname)
      }
    },
    [pathname, router, searchParams]
  )

  return {
    getParam,
    setParam,
    clearParams,
  }
}
