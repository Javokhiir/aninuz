import { useMemo } from "react"

type Params = {
  totalCount: number
  limit: number
  siblingCount?: number
  currentPage: number
}

export const DOTS = 0

export const usePagination = ({
  totalCount,
  limit,
  siblingCount = 1,
  currentPage,
}: Params) => {
  const paginationRange = useMemo(() => {
    const totalPageCount = Math.ceil(totalCount / limit)

    const totalPageNumbers = siblingCount + 5

    const range = (start: number, end: number) => {
      const length = end - start + 1
      return Array.from({ length }, (_, idx) => idx + start)
    }

    if (totalPageNumbers >= totalPageCount) {
      return range(1, totalPageCount)
    }

    // Calculate left and right sibling index and make sure they are within range 1 and totalPageCount
    const leftSiblingIndex = Math.max(currentPage - siblingCount, 1)
    const rightSiblingIndex = Math.min(
      currentPage + siblingCount,
      totalPageCount
    )

    const shouldShowLeftDots = leftSiblingIndex > 2
    const shouldShowRightDots = rightSiblingIndex < totalPageCount - 2

    const firstPageIndex = 1
    const lastPageIndex = totalPageCount

    if (!shouldShowLeftDots && shouldShowRightDots) {
      const leftItemCount = 3 + 2 * siblingCount
      const leftRange = range(1, leftItemCount)

      return [...leftRange, DOTS, lastPageIndex]
    }

    if (shouldShowLeftDots && !shouldShowRightDots) {
      const rightItemCount = 3 + 2 * siblingCount
      const rightRange = range(
        totalPageCount - rightItemCount + 1,
        totalPageCount
      )
      return [firstPageIndex, DOTS, ...rightRange]
    }

    const middleRange = range(leftSiblingIndex, rightSiblingIndex)
    return [firstPageIndex, DOTS, ...middleRange, DOTS, lastPageIndex]
  }, [totalCount, limit, siblingCount, currentPage])

  return paginationRange
}
