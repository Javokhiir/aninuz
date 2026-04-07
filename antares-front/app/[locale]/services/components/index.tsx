"use client"

import Image from "next/image"
import { Link } from "@/i18n/routing"
import { useQuery } from "@tanstack/react-query"
import { CircleAlertIcon } from "lucide-react"
import { useTranslations } from "next-intl"

import { getAllServices } from "@/http/requests"
import { useQueryParams } from "@/hooks/useQueryParams"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Pagination } from "@/components/ui/pagination"
import { Skeleton } from "@/components/ui/skeleton"
import { Icons } from "@/components/icons"

const Services = () => {
  const t = useTranslations("services")
  const { getParam } = useQueryParams()
  const page = getParam("page", "1")

  const { isLoading, data: services } = useQuery({
    queryKey: ["services", page],
    queryFn: () =>
      getAllServices({
        config: { params: { page, per_page: 12 } },
      }),
  })

  return (
    <div className="layout-container mx-auto max-w-[1400px] space-y-10 p-5 py-10 md:space-y-10 md:p-0 md:px-5 md:py-0">
      <h1 className="bg mx-auto w-max bg-gradient-to-r from-black via-blue-700 to-black bg-clip-text font-extrabold text-transparent uppercase md:p-10">
        {t("title")}
      </h1>
      <div className="grid grid-cols-1 justify-center gap-5 sm:grid-cols-2 md:grid-cols-3 md:justify-between md:gap-10 xl:grid-cols-4">
        {isLoading ? (
          [1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-[300px] w-full rounded-[24px]" />
          ))
        ) : services?.data && services?.meta.total <= 0 ? (
          <p className="text-muted-foreground col-span-4 flex items-center gap-5 rounded-2xl bg-white p-5 shadow">
            <CircleAlertIcon /> Services not found
          </p>
        ) : (
          services?.data.map((service) => (
            <Link
              key={service.id}
              href={`/services/${service.slug}`}
              className="h-full"
            >
              <Card className="h-full overflow-hidden rounded-[24px] border-none bg-white p-5 shadow-[2px_20px_18px_1px_rgba(187,194,232,0.15)] md:min-w-[300px]">
                <CardHeader className="p-0">
                  <Image
                    src={service.images[0].preview_url_webp}
                    alt={service.title}
                    width={500}
                    height={500}
                    className="mx-auto h-full w-full rounded-[16px]"
                  />
                </CardHeader>
                <CardContent className="flex min-h-[80px] justify-between gap-5 px-0">
                  <h4 className="line-clamp-2 w-full text-xl font-semibold uppercase">
                    {service.title}
                  </h4>
                  <span className="mt-auto ml-auto flex h-min items-center gap-2">
                    <Icons.ArrowRight className="text-primary h-8 w-8 rotate-[45deg]" />
                  </span>
                </CardContent>
              </Card>
            </Link>
          ))
        )}
      </div>
      <Pagination limit={12} totalCount={services?.meta.total || 0} />
    </div>
  )
}

export default Services
