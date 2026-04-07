"use client"

import React from "react"
import { Search } from "lucide-react"
import { useQueryState } from "nuqs"

import { cn } from "@/lib/utils"
import { useDebouncedValue } from "@/hooks/useDebouncedValue"

import { Input } from "./ui/input"

type Props = React.ComponentProps<typeof Input>

export const SearchInput = ({ className, placeholder, ...props }: Props) => {
  const [searchQuery, setSearchQuery] = useQueryState("search", {
    defaultValue: "",
  })
  const [search, setSearch] = React.useState(searchQuery)

  const debouncedValue = useDebouncedValue(search, 300)

  React.useEffect(() => {
    setSearchQuery(debouncedValue)
  }, [debouncedValue, setSearchQuery])

  return (
    <div className="relative w-full">
      <Input
        {...props}
        type="search"
        className={cn("h-12 w-full pl-10", className)}
        placeholder={placeholder || "Поиск..."}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center justify-center pl-3">
        <Search className="text-muted-foreground size-5" />
      </span>
    </div>
  )
}
