import { useEffect, useState } from "react"

export const useDebouncedValue = <T extends string | number | undefined | null>(
  value: T | null,
  delay = 250
) => {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)
    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}
