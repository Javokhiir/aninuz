"use client"

import React, { useEffect, useRef } from "react"
import Image from "next/image"
import { Link } from "@/i18n/routing"
import { useQuery } from "@tanstack/react-query"
import { motion } from "framer-motion"
import { Search, X } from "lucide-react"
import { useTranslations } from "next-intl"

import { ProductsResponse } from "@/types/models/product"
import { searchAllProducts } from "@/http/requests"
import { cn } from "@/lib/utils"
import { useDebouncedValue } from "@/hooks/useDebouncedValue"

/** Shorter than this and every keystroke is a round trip for nothing. */
const MIN_TERM = 2
/** The panel is a shortcut, not a results page — it links to one past this. */
const MAX_ROWS = 6

const SPRING = { type: "spring", stiffness: 320, damping: 34, mass: 0.9 } as const

/**
 * The search field that lives in the tools pill.
 *
 * Closed it is a 40px icon button. Open it becomes the input, and the pill it
 * sits in widens — the nav pill beside it is collapsing to icons at the same
 * time, so the row keeps its centre and the field appears to travel inward
 * rather than the bar jumping. Both pills carry `layout`, so none of that is
 * animated by hand: the widths are a consequence of the content and framer
 * interpolates between them.
 */
export const HeaderSearchField = ({
  open,
  onOpen,
  onClose,
  value,
  onChange,
  onDark,
}: {
  open: boolean
  onOpen: () => void
  onClose: () => void
  value: string
  onChange: (value: string) => void
  onDark: boolean
}) => {
  const t = useTranslations("nav")
  const inputRef = useRef<HTMLInputElement>(null)

  // Opening is a deliberate act, so the caret should already be waiting.
  useEffect(() => {
    if (open) inputRef.current?.focus()
  }, [open])

  if (!open) {
    return (
      <button
        type="button"
        onClick={onOpen}
        aria-label={t("search")}
        aria-expanded={false}
        className={cn(
          "flex size-10 cursor-pointer items-center justify-center rounded-[15px] transition-colors duration-300",
          onDark ? "hover:bg-white/15" : "hover:bg-ink/5"
        )}
      >
        <Search
          className={cn(
            "size-[18px] transition-colors duration-300",
            onDark ? "text-white" : "text-ink"
          )}
        />
      </button>
    )
  }

  return (
    <motion.div
      layout
      transition={SPRING}
      className="flex h-10 w-[min(52vw,320px)] items-center gap-2 rounded-[15px] px-3"
    >
      <Search
        className={cn(
          "size-[18px] shrink-0",
          onDark ? "text-white/70" : "text-ink/50"
        )}
      />
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === "Escape") onClose()
        }}
        placeholder={t("searchPlaceholder")}
        className={cn(
          "h-full min-w-0 flex-1 bg-transparent text-[15px] outline-none",
          onDark
            ? "text-white placeholder:text-white/45"
            : "text-ink placeholder:text-ink/40"
        )}
      />
      <button
        type="button"
        onClick={onClose}
        aria-label={t("close")}
        className={cn(
          "flex size-7 shrink-0 cursor-pointer items-center justify-center rounded-full transition-colors",
          onDark
            ? "text-white/60 hover:bg-white/15 hover:text-white"
            : "text-ink/45 hover:bg-ink/5 hover:text-ink"
        )}
      >
        <X className="size-4" />
      </button>
    </motion.div>
  )
}

const Row = ({
  href,
  title,
  brand,
  image,
  onNavigate,
}: {
  href: string
  title: string
  brand?: string
  image?: string
  onNavigate: () => void
}) => (
  <Link
    href={href}
    onClick={onNavigate}
    className="hover:bg-ink/5 flex items-center gap-3 rounded-[15px] p-2 transition-colors"
  >
    <span className="border-ink/10 relative size-11 shrink-0 overflow-hidden rounded-[10px] border bg-white">
      <Image
        src={image || "/logos/logo-no-text.png"}
        alt=""
        width={88}
        height={88}
        className="size-full object-contain p-1.5"
      />
    </span>
    <span className="min-w-0 flex-1">
      <span className="text-ink block truncate text-[15px]">{title}</span>
      {brand && (
        <span className="label-mono text-ink/40 block truncate">{brand}</span>
      )}
    </span>
  </Link>
)

/**
 * Results, as a plate that grows out from under the bar.
 *
 * Height animates from zero rather than the plate fading in at full size: the
 * panel is attached to the bar above it, and something attached should look
 * like it is being extruded, not like it was already there.
 *
 * The rows are compact — thumbnail, title, brand — rather than the catalogue's
 * product cards. Those cards read from the products theme's custom properties,
 * which do not exist up here, and at six-across in a dropdown they would be
 * a second grid competing with the page behind them.
 */
export const HeaderSearchResults = ({
  term,
  onNavigate,
}: {
  term: string
  onNavigate: () => void
}) => {
  const t = useTranslations("nav")
  // The hook's value is nullable by signature; the field only ever hands it a
  // string, so normalise once here rather than guarding at every use.
  const debounced = (useDebouncedValue(term, 300) ?? "").trim()
  const ready = debounced.length >= MIN_TERM

  const { data, isFetching } = useQuery<ProductsResponse>({
    queryKey: ["header-search", debounced],
    queryFn: () => searchAllProducts({ search: debounced }),
    enabled: ready,
    staleTime: 30_000,
  })

  // Nothing to show yet: no plate at all, rather than an empty one.
  if (!ready) return null

  const results = data?.data ?? []

  return (
    <motion.div
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: "auto", opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      className="pointer-events-auto mt-[10px] w-[min(640px,calc(100vw-40px))] overflow-hidden rounded-[24px] bg-white/92 shadow-[0_28px_70px_-30px_rgba(28,28,28,0.6)] backdrop-blur-[20px]"
    >
      <div className="p-[10px]">
        {isFetching && results.length === 0 ? (
          <div className="space-y-2">
            {[0, 1, 2].map((i) => (
              <div key={i} className="flex items-center gap-3 p-2">
                <span className="bg-ink/5 size-11 shrink-0 animate-pulse rounded-[10px]" />
                <span className="flex-1 space-y-2">
                  <span className="bg-ink/5 block h-3.5 w-2/5 animate-pulse rounded-full" />
                  <span className="bg-ink/5 block h-3 w-1/5 animate-pulse rounded-full" />
                </span>
              </div>
            ))}
          </div>
        ) : results.length > 0 ? (
          <>
            {results.slice(0, MAX_ROWS).map((product) => (
              <Row
                key={product.id}
                onNavigate={onNavigate}
                title={product.title}
                brand={product.brand}
                image={product.images?.[0]?.url_webp || product.images?.[0]?.url}
                href={`/products/${product.brand?.toLowerCase()}/${product.slug}`}
              />
            ))}

            {results.length > MAX_ROWS && (
              <Link
                href={`/catalog?search=${encodeURIComponent(debounced)}`}
                onClick={onNavigate}
                className="label-mono text-ink/50 hover:text-ink border-ink/10 mt-1 flex items-center justify-center border-t px-2 py-3 transition-colors"
              >
                {t("searchAll", { count: results.length })}
              </Link>
            )}
          </>
        ) : (
          <p className="text-ink/45 px-2 py-8 text-center text-sm">
            {t("searchEmpty")}
          </p>
        )}
      </div>
    </motion.div>
  )
}
