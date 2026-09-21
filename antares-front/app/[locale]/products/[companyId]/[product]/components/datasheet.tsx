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
 * Inmarco publishes one PDF per product on its CDN; the key is our product
 * slug, the value is Inmarco's file name. Products without an entry have no
 * datasheet on inmarco.ae either, so the button is not rendered for them.
 */
const DATASHEET_CDN = "https://d24gq0kplkhyxr.cloudfront.net/datasheets/"

const DATASHEETS: Record<string, string> = {
  "cg-100": "CG_100",
  "cg-101": "CG_101",
  "cg-102": "CG_102",
  "cg-501c": "HY_501",
  "cg-503": "Style_CG_503",
  "cg-900": "Style_CG_900",
  "ultra-fe-1003": "ULTRA_FE_1003",
  "ultra-le-1002": "ULTRA_LE_1002",
  "ultra-lt-1004": "ULTRA_LT_1004",
  "ultra-ne-1005": "ULTRA_NE_1005",
  "hy-105": "HY_105",
  "hy-105-hd": "HY_105HD",
  "hy-105t": "HY_105T",
  "hy-107": "HY_107",
  "hy-107-hd": "HY_107HD",
  "hy-120ar": "HY_120_AR",
  "hy-175": "HY_175",
  "hy-501": "HY_501",
  "hy-504": "HY_504",
  "hy-510": "HY_510",
  "hy-606": "HY_606",
  "hy-801": "HY_801",
  "or-120": "OR_120",
  "or-125": "OR_125",
  "or-125sr": "OR_125",
  "pa-106": "PA_106",
  "pa-499": "STYLE_PA_499",
  "pe-102": "STYLE_PE_102",
  "pe-104": "STYLE_PE_104",
  "pe-104a": "PE_104A",
  "pe-504": "PE_504",
  "pe-505": "Style_PE_505",
  "pe-508": "Style_PE_508",
  "pe-509": "Style_PE_509",
  "insulation-gasket-kit-1800-fs": "Insulation_Gasket_Kit_1800_FS",
  "na-420": "NA_420",
  "na-430": "NA_430",
  "na-432": "NA_432",
  "na-442": "NA_442",
  "na-450": "NA_450",
  "na-452-gf": "NA_452_GF",
  "sst-323": "SST_323",
  "inmatex-eptfe-sheetgasket": "INMATEX_ePTFE",
  "600-sintered-ptfe-sheet": "Type_600",
  "gm-300-gm-300z": "GM_300Z",
  "gm-360": "GM_360",
  "gm-310-gm-310c": "GM_310C",
  "corrugated-gasket": "Corrugated_Metal_Gasket",
  "double-jacketed-gasket": "Double_Jacketed_Gasket",
  "kammprofile-gasket": "KAMMPROFILE_GASKET",
  "laminar-gasket": "Laminar_Seal",
  "ring-type-joint-gasket": "Ring_Type_Joint",
  "shim-joint": "Shim_Gasket",
  "soft-iron-ring": "Soft_Iron_Ring",
  "spiral-wound-gasket": "Spiral_WoundGasket",
  "in-123": "IN_123",
  "in-123i": "IN_123I",
  "in-140": "IN_140",
  "750ss-welding-blanket": "750_SS_Welding_Blanket",
  "wiping-pad": "Aramid_Wiping_Pad",
  "high-temperature-wiping-pad": "High_Temperature_Wiping_Pad",
}

const datasheetUrl = (slug: string) =>
  slug in DATASHEETS ? `${DATASHEET_CDN}${DATASHEETS[slug]}.pdf` : null

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

  const url = datasheetUrl(productSlug)

  const { mutate } = useMutation({
    mutationFn: () => postDatasheetLead({ email, product_slug: productSlug }),
    onError: () => {
      // Surfaced for us, not the visitor: they already got their file.
      console.warn("Datasheet lead was not recorded")
    },
  })

  if (!url) return null

  const submit = (event: React.FormEvent) => {
    event.preventDefault()
    if (!email.trim()) return

    // The PDF is cross-origin, so `download` is ignored and it has to open in
    // a tab. That must happen inside the click, before any await, or popup
    // blockers eat it. The lead is recorded in the background either way.
    mutate()
    window.open(url, "_blank", "noopener")

    toast.success(t("started"))
    setOpen(false)
    setEmail("")
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
            className="h-12 w-full cursor-pointer rounded-lg bg-[var(--accent)] text-sm font-medium text-[#0b1220] transition-opacity hover:opacity-90 disabled:opacity-60"
          >
            {t("submit")}
          </button>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default DatasheetDownload
