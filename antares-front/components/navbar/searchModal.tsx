"use client"

import React, { useEffect, useState } from "react"
import { useMutation } from "@tanstack/react-query"

import { ProductsResponse } from "@/types/models/product"
import { searchAllProducts } from "@/http/requests"
import { useQueryParams } from "@/hooks/useQueryParams"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { Icons } from "../icons"
import ProductCard from "../product"
import { SearchInput } from "../Search"
import { ScrollArea } from "../ui/scroll-area"
import { Skeleton } from "../ui/skeleton"

const SearchModal = ({
  setIsMobileOpen,
}: {
  setIsMobileOpen?: React.Dispatch<React.SetStateAction<boolean>>
}) => {
  const { getParam } = useQueryParams()
  const search = getParam("search")

  const [productsData, setProductsData] = useState<ProductsResponse>()
  const [searchModalOpen, setSearchModalOpen] = useState(false)

  const searchMutation = useMutation({
    mutationFn: searchAllProducts,
    onSuccess: (data: ProductsResponse) => {
      setProductsData(data)
    },
  })

  useEffect(() => {
    if (search) {
      searchMutation.mutate({
        search,
      })
    } else {
      setProductsData(undefined)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search])

  return (
    <div>
      <DropdownMenu open={searchModalOpen} onOpenChange={setSearchModalOpen}>
        <DropdownMenuTrigger>
          <div className="text-pimary border-primary group hover:bg-primary flex rounded-sm border-[2px] p-2">
            <Icons.Search className="text-primary h-6 w-6 group-hover:text-white" />
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className="mx-auto min-h-[60vh] min-w-[90vw] translate-x-[5vw] rounded-[30px] md:-translate-x-[5vw]"
          sideOffset={17}
        >
          <div className="flex min-h-[30vh] w-full flex-col items-center justify-center gap-5 p-5">
            <h4 className="text-xl font-bold">Поиск по сайту</h4>
            <div className="flex w-full max-w-lg items-center gap-2">
              <SearchInput className="h-10" />
            </div>
            <ScrollArea className="max-h-[50vh]">
              <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                {searchMutation.isPending
                  ? [1, 2].map((item) => (
                      <Skeleton key={item} className="h-[300px] w-[300px]" />
                    ))
                  : productsData?.data && productsData.data.length > 0
                    ? productsData?.data.map((product) => (
                        <div
                          onClick={() => {
                            // eslint-disable-next-line @typescript-eslint/no-unused-expressions
                            setSearchModalOpen(false),
                              setIsMobileOpen && setIsMobileOpen(false)
                          }}
                          key={product.id}
                        >
                          <ProductCard
                            product={product}
                            companyName={product.brand.toLowerCase()}
                          />
                        </div>
                      ))
                    : search &&
                      productsData?.data.length === 0 && (
                        <p className="text-center">Ничего не найдено</p>
                      )}
              </div>
            </ScrollArea>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

export default SearchModal
