"use client"

import React, { useEffect, useState } from "react"
import { useCompanyColorStore } from "@/states/store"
import { SlidersHorizontal } from "lucide-react"
import { useTranslations } from "next-intl"
import { toast } from "sonner"

import { Categories, Category } from "@/types/models/categories"
import { useQueryParams } from "@/hooks/useQueryParams"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"

type FiltersProps = {
  categories: Categories
  handleFilters: (filter: string) => void
}

const MAX_DEPTH = 4
const INDENT_SIZE = 12 // pixels

const Filters = ({ categories, handleFilters }: FiltersProps) => {
  const { getParam } = useQueryParams()
  const category = getParam("category")
  const { color } = useCompanyColorStore()
  const [isActive, setIsActive] = useState<string>()
  const [open, setOpen] = useState(false)
  const t = useTranslations("products")

  useEffect(() => {
    setIsActive(category)
  }, [category])

  const renderCategory = (category: Category, depth: number = 1) => {
    const hasChildren = category.children && category.children.length > 0
    const isOpen = category.children?.some((c) => c.slug === isActive)

    const indentationStyle =
      depth > 1 ? { marginLeft: `${(depth - 1) * INDENT_SIZE}px` } : {}

    if (hasChildren && depth < MAX_DEPTH) {
      return (
        <Accordion type="single" key={category.id} collapsible>
          <AccordionItem value={`item-${category.id}`}>
            <AccordionTrigger
              className="my-1 justify-start gap-2 py-0 text-left hover:no-underline [&>svg]:ml-auto [&>svg]:text-black"
              style={indentationStyle}
            >
              <div
                className="flex aspect-square h-6 w-6 items-center justify-center rounded-full border-[3px] border-white shadow-sm"
                style={{ backgroundColor: isOpen ? color : "white" }}
              />
              <span className="line-clamp-2 text-left text-sm leading-normal font-medium">
                {category.title}
              </span>
            </AccordionTrigger>
            <AccordionContent className="pt-4">
              {category.children.map((child) =>
                renderCategory(child, depth + 1)
              )}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      )
    }

    return (
      <button
        key={category.id}
        onClick={() => {
          setIsActive(category.slug)
          handleFilters(category.slug)
          toast.success(t("filterSuccess"))
        }}
        className="my-1 flex cursor-pointer items-center gap-2 text-left"
        style={indentationStyle}
      >
        <div
          className="aspect-square size-6 rounded-full border-[4px] border-white shadow-sm"
          style={{
            backgroundColor: isActive === category.slug ? color : "white",
          }}
        />
        <span className="line-clamp-2 text-sm leading-normal font-medium">
          {category.title}
        </span>
      </button>
    )
  }

  const renderFilterPanel = () => (
    <div
      style={{ borderColor: color }}
      className="h-min w-full space-y-4 rounded-[20px] border-2 bg-white p-4 md:w-[300px] md:max-w-[300px]"
    >
      <h4 className="text-lg">{t("filter")}</h4>
      <div className="space-y-2 px-2 text-sm">
        <button
          onClick={() => {
            setIsActive("")
            handleFilters("")
            toast.success(t("filterSuccess"))
          }}
          className="flex cursor-pointer items-center gap-2"
        >
          <div
            className="aspect-square h-6 w-6 rounded-full border-[3px] border-white shadow-sm"
            style={{ backgroundColor: !isActive ? color : "white" }}
          />
          <span className="text-left text-sm font-medium">{t("all")}</span>
        </button>
        {categories.map((cat) => renderCategory(cat))}
      </div>
    </div>
  )

  return (
    <>
      {/* Desktop */}
      <div className="hidden flex-col items-center gap-5 md:flex">
        {renderFilterPanel()}
      </div>

      {/* Mobile */}
      <div className="block w-full md:hidden">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="h-12 w-12" style={{ backgroundColor: color }}>
              <SlidersHorizontal className="size-6" />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <ScrollArea className="max-h-[70vh] px-2">
              <DialogHeader className="space-y-4">
                <DialogTitle>{t("filter")}</DialogTitle>
                {renderFilterPanel()}
              </DialogHeader>
            </ScrollArea>
          </DialogContent>
        </Dialog>
      </div>
    </>
  )
}

export default Filters
