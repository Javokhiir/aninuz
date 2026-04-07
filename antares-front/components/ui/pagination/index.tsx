"use client"

import type { FC } from "react"

import { cn } from "@/lib/utils"
import { useQueryParams } from "@/hooks/useQueryParams"

import { DOTS, usePagination } from "./hooks/usePagination"
import {
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  Pagination as PaginationPrimitive,
} from "./pagination-primitive"

type Props = {
  totalCount: number
  limit: number
}

export const Pagination: FC<Props> = ({ totalCount, limit }) => {
  const { getParam, setParam } = useQueryParams()

  const currentPage = Number(getParam("page") || 1)
  const pagesCount = Math.ceil(totalCount / limit)

  const paginationRange = usePagination({
    currentPage,
    totalCount,
    limit,
  })

  const onPageChange = (page: number) => {
    if (page < 1) page = 1
    if (page > pagesCount) page = pagesCount
    setParam("page", page)
  }

  if (currentPage === 0 || paginationRange.length < 2) {
    return null
  }

  const lastPage = paginationRange[paginationRange.length - 1]
  return (
    <PaginationPrimitive>
      <PaginationContent>
        <PaginationPrevious
          onClick={() => onPageChange(currentPage - 1)}
          className={cn({
            "text-muted-foreground hover:text-muted-foreground cursor-not-allowed":
              currentPage === 1,
          })}
        />

        {paginationRange.map((pageNumber, index) =>
          pageNumber === DOTS ? (
            <PaginationEllipsis key={pageNumber + "" + index} />
          ) : (
            <PaginationItem key={pageNumber}>
              <PaginationLink
                isActive={currentPage === pageNumber}
                onClick={() => onPageChange(pageNumber)}
              >
                {pageNumber}
              </PaginationLink>
            </PaginationItem>
          )
        )}

        <PaginationNext
          onClick={() => onPageChange(currentPage + 1)}
          className={cn({
            "text-muted-foreground hover:text-muted-foreground cursor-not-allowed":
              currentPage === lastPage,
          })}
        />
      </PaginationContent>
    </PaginationPrimitive>
  )
}
