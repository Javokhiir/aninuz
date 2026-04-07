"use client"

import React from "react"
import Image from "next/image"
import { useQuery } from "@tanstack/react-query"
import { saveAs } from "file-saver"
import { CircleAlertIcon } from "lucide-react"
import { useTranslations } from "next-intl"

import { Catalog as CatalogType } from "@/types/models/catalogs"
import { getCatalogs } from "@/http/requests"
import { useQueryParams } from "@/hooks/useQueryParams"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Pagination } from "@/components/ui/pagination"
import { Skeleton } from "@/components/ui/skeleton"
import SpecialButton from "@/components/ui/special-button"
import { Icons } from "@/components/icons"

const Catalog = () => {
  const t = useTranslations("catalog")
  const { getParam } = useQueryParams()
  const page = getParam("page", "1")

  const { isLoading, data: catalogs } = useQuery({
    queryKey: ["catalog", page],
    queryFn: () =>
      getCatalogs({
        config: { params: { page, per_page: 12 } },
      }),
  })

  const handleDownload = (catalog: CatalogType) => {
    saveAs(catalog.file.url, catalog.title)
  }

  return (
    <div className="layout-container mx-auto max-w-[1400px] space-y-10 p-5 py-10 md:space-y-10 md:p-0 md:px-5 md:py-0">
      <h1 className="bg mx-auto w-max bg-gradient-to-r from-black via-blue-700 to-black bg-clip-text font-extrabold text-transparent uppercase md:p-10">
        {t("title")}
      </h1>
      <div className="grid grid-cols-2 gap-5 md:grid-cols-3 md:gap-10 lg:grid-cols-4">
        {isLoading ? (
          [1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-[300px] w-full rounded-[24px]" />
          ))
        ) : catalogs?.data && catalogs.meta.total > 0 ? (
          catalogs.data.map((catalog) => (
            <Card
              key={catalog.id}
              className="overflow-hidden rounded-[24px] border-none bg-white p-7 shadow-[2px_20px_18px_1px_rgba(187,194,232,0.15)]"
            >
              <CardHeader className="p-0">
                {/* <object
                  data={catalog.file.url}
                  type="application/pdf"
                  width="100%"
                  height="100%"
                >
                  <iframe
                    src={catalog.file.url}
                    width="100%"
                    height="100%"
                    className="rounded-[16px]"
                  >
                    <p>
                      Your browser does not support PDFs.
                      <a href={catalog.file.url}>Download the PDF</a>.
                    </p>
                  </iframe>
                </object> */}

                <Image
                  src={"/catalog/default.png"}
                  width="500"
                  height="500"
                  className="mx-auto h-[150px] rounded-[16px] bg-white object-contain object-center p-5 shadow-[2px_40px_28px_1px_rgba(187,194,232,0.15)]"
                  alt="catalog"
                />
              </CardHeader>
              <CardContent className="flex h-full w-full flex-col justify-between space-y-2 p-0">
                <h3 className="text-primary line-clamp-2 font-semibold">
                  {catalog.title}
                </h3>
                <div className="flex w-full items-center justify-between gap-5 px-0">
                  <div className="relative">
                    <div className="bg-primary/10 absolute left-0 z-0 h-12 w-12 rounded-full" />
                    <a
                      href={catalog.file.url}
                      target="__blank"
                      download={catalog.file.url}
                    >
                      <SpecialButton className="relative z-5 ml-3 h-12 w-12 rounded-full opacity-60 shadow-none backdrop-blur-2xl [&_svg:not([class*='size-'])]:size-6">
                        <Icons.Eye />
                      </SpecialButton>
                    </a>
                  </div>
                  <SpecialButton
                    onClick={() => handleDownload(catalog)}
                    className="h-12 w-12 rounded-full shadow-none [&_svg:not([class*='size-'])]:size-6"
                  >
                    <Icons.Download />
                  </SpecialButton>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <p className="text-muted-foreground col-span-4 flex items-center gap-5 rounded-2xl bg-white p-5 shadow">
            <CircleAlertIcon /> {t("notFound")}
          </p>
        )}
      </div>
      <Pagination limit={12} totalCount={catalogs?.meta.total || 0} />
    </div>
  )
}

export default Catalog
