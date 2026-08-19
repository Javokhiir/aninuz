"use client"

import React, { useEffect, useState } from "react"
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

// Categories are only translated for some locales; fall back so a filter row is
// never blank.
const categoryTitle = (category: Category) =>
  category.title ||
  category.translations?.find((translation) => translation.title)?.title ||
  category.slug

const Dot = ({ active }: { active: boolean }) => (
  <span
    className={`aspect-square h-3 w-3 shrink-0 rounded-full border transition-colors ${
      active
        ? "border-[var(--accent)] bg-[var(--accent)]"
        : "border-gray-600 bg-transparent"
    }`}
  />
)

const Filters = ({ categories, handleFilters }: FiltersProps) => {
  const { getParam } = useQueryParams()
  const category = getParam("category")
  const [isActive, setIsActive] = useState<string>()
  const [open, setOpen] = useState(false)
  const t = useTranslations("products")

  useEffect(() => {
    setIsActive(category)
  }, [category])

  const select = (slug: string) => {
    setIsActive(slug)
    handleFilters(slug)
    toast.success(t("filterSuccess"))
  }

  const renderCategory = (category: Category, depth: number = 1) => {
    const hasChildren = !!category.children?.length
    const indentationStyle =
      depth > 1 ? { marginLeft: `${(depth - 1) * INDENT_SIZE}px` } : {}

    if (hasChildren && depth < MAX_DEPTH) {
      return (
        <Accordion type="single" key={category.id} collapsible>
          <AccordionItem value={`item-${category.id}`} className="border-0">
            <AccordionTrigger
              className="my-1 justify-start gap-2 py-1 text-left text-gray-300 hover:text-white hover:no-underline [&>svg]:ml-auto [&>svg]:text-gray-500"
              style={indentationStyle}
            >
              <Dot active={isActive === category.slug} />
              <span className="line-clamp-2 text-sm leading-normal font-medium">
                {categoryTitle(category)}
              </span>
            </AccordionTrigger>
            <AccordionContent className="pt-2">
              {category.children?.map((child) =>
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
        onClick={() => select(category.slug)}
        className={`my-1 flex w-full cursor-pointer items-center gap-2 text-left transition-colors ${
          isActive === category.slug
            ? "text-[var(--accent)]"
            : "text-gray-400 hover:text-white"
        }`}
        style={indentationStyle}
      >
        <Dot active={isActive === category.slug} />
        <span className="line-clamp-2 text-sm leading-normal font-medium">
          {categoryTitle(category)}
        </span>
      </button>
    )
  }

  const renderFilterPanel = () => (
    <div className="h-min w-full space-y-4 rounded-lg border border-[var(--card-border)] bg-[var(--card-bg)] p-6 md:w-[280px] md:max-w-[280px]">
      <h4 className="text-sm tracking-widest text-gray-400 uppercase">
        {t("filter")}
      </h4>
      <div className="space-y-1">
        <button
          onClick={() => select("")}
          className={`flex w-full cursor-pointer items-center gap-2 transition-colors ${
            !isActive ? "text-[var(--accent)]" : "text-gray-400 hover:text-white"
          }`}
        >
          <Dot active={!isActive} />
          <span className="text-sm font-medium">{t("all")}</span>
        </button>
        {categories.map((cat) => renderCategory(cat))}
      </div>
    </div>
  )

  return (
    <>
      {/* Desktop */}
      <div className="hidden flex-col gap-5 md:flex">{renderFilterPanel()}</div>

      {/* Mobile */}
      <div className="block w-full md:hidden">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="h-12 w-12 border border-[var(--card-border)] bg-[var(--card-bg)] text-[var(--accent)] hover:bg-[var(--card-bg)]">
              <SlidersHorizontal className="size-5" />
            </Button>
          </DialogTrigger>
          <DialogContent className="border-[var(--card-border)] bg-[var(--section-bg)]">
            <ScrollArea className="max-h-[70vh] px-2">
              <DialogHeader className="space-y-4">
                <DialogTitle className="text-white">{t("filter")}</DialogTitle>
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
