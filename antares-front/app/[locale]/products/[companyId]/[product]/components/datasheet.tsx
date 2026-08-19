"use client"

import { useState } from "react"
import { useMutation } from "@tanstack/react-query"
import { Download } from "lucide-react"
import { useTranslations } from "next-intl"
import { toast } from "sonner"

import { postDatasheetLead } from "@/http/requests/datasheet"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"

import { productsThemeVars } from "../../../theme"

/**
 * Per-product datasheets, keyed by product slug. Files live in
 * `public/datasheets/`; anything not listed here falls back to the generic one.
 */
const DATASHEETS: Record<string, string> = {}

const GENERIC_DATASHEET = "/datasheets/general-catalogue.pdf"

const datasheetUrl = (slug: string) => DATASHEETS[slug] ?? GENERIC_DATASHEET

const DatasheetDownload = ({
  productSlug,
  productTitle,
}: {
  productSlug: string
  productTitle: string
}) => {
  const t = useTranslations("products.datasheet")
  const [open, setOpen] = useState(false)
  const [email, setEmail] = useState("")

  const { mutate, isPending } = useMutation({
    mutationFn: () =>
      postDatasheetLead({ email, product_slug: productSlug }),
    // The lead is a marketing nicety; never let a failed write hold the file
    // hostage, so the download starts either way.
    onSettled: () => {
      const link = document.createElement("a")
      link.href = datasheetUrl(productSlug)
      link.download = `${productSlug}.pdf`
      document.body.appendChild(link)
      link.click()
      link.remove()

      toast.success(t("started"))
      setOpen(false)
      setEmail("")
    },
    onError: () => {
      // Surfaced for us, not the visitor — they already got their file.
      console.warn("Datasheet lead was not recorded")
    },
  })

  const submit = (event: React.FormEvent) => {
    event.preventDefault()
    if (!email.trim()) return
    mutate()
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button
          type="button"
          className="flex h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-lg border border-[var(--card-border)] px-6 text-sm font-medium text-gray-300 transition-colors hover:border-[var(--accent)] hover:text-[var(--accent)]"
        >
          <Download className="h-4 w-4" />
          {t("download")}
        </button>
      </DialogTrigger>

      {/* Radix portals the dialog to <body>, outside the section that defines
          the palette, so the custom properties have to be re-applied here. */}
      <DialogContent
        style={productsThemeVars}
        className="border-[var(--card-border)] bg-[var(--section-bg)]"
      >
        <DialogHeader className="space-y-2">
          <DialogTitle className="text-white">{t("title")}</DialogTitle>
          <p className="text-sm text-gray-400">
            {t("description", { product: productTitle })}
          </p>
        </DialogHeader>

        <form onSubmit={submit} className="mt-4 space-y-4">
          <Input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t("emailPlaceholder")}
            className="h-12 border-[var(--card-border)] bg-[var(--card-bg)] text-white placeholder:text-gray-500"
          />
          <button
            type="submit"
            disabled={isPending}
            className="h-12 w-full cursor-pointer rounded-lg bg-[var(--accent)] text-sm font-medium text-[#0b1220] transition-opacity hover:opacity-90 disabled:opacity-60"
          >
            {isPending ? t("sending") : t("submit")}
          </button>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default DatasheetDownload
