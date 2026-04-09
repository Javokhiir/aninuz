"use client"

import Image from "next/image"
import { Link } from "@/i18n/routing"
import { useQuery } from "@tanstack/react-query"
import { useTranslations } from "next-intl"

import { getAllServices } from "@/http/requests"
import { useQueryParams } from "@/hooks/useQueryParams"
import { Pagination } from "@/components/ui/pagination"
import { Skeleton } from "@/components/ui/skeleton"
import { MaintenanceModal } from "@/components/ui/maintenance-modal"
import BorderGlow from "@/components/ui/BorderGlow"

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
      <MaintenanceModal />
      <h1 className="bg mx-auto w-max bg-gradient-to-r from-black via-blue-700 to-black bg-clip-text font-extrabold text-transparent uppercase md:p-10">
        {t("title")}
      </h1>
      <div className="grid grid-cols-1 justify-center gap-6 sm:grid-cols-2 md:grid-cols-3 md:gap-8 xl:grid-cols-4">
        {isLoading ? (
          [1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-[320px] w-full rounded-[24px]" />
          ))
        ) : services?.data && services?.meta.total <= 0 ? (
          <div className="col-span-4 flex w-full flex-col items-center justify-center gap-6 rounded-2xl bg-white py-16 shadow-sm">
            <div className="relative flex items-center justify-center">
              <span className="absolute inline-flex h-20 w-20 animate-ping rounded-full bg-blue-100 opacity-75" />
              <span className="relative flex h-16 w-16 items-center justify-center rounded-full bg-blue-50">
                <svg className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17 17.25 21A2.652 2.652 0 0 0 21 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 1 1-3.586-3.586l5.654-4.654m5.5-1.337 4.144-4.143a2.121 2.121 0 0 0-3-3L12 8.354M6.75 5.25a.75.75 0 0 1 .75-.75h1.5a.75.75 0 0 1 .75.75v1.5a.75.75 0 0 1-.75.75h-1.5a.75.75 0 0 1-.75-.75v-1.5Z" />
                </svg>
              </span>
            </div>
            <div className="flex flex-col items-center gap-2 text-center">
              <h3 className="text-lg font-bold text-gray-800">{t("maintenanceTitle")}</h3>
              <p className="max-w-sm text-sm text-gray-500">{t("maintenanceDesc")}</p>
            </div>
            <div className="flex items-center gap-2 rounded-full bg-blue-50 px-4 py-2 text-xs font-medium text-blue-600">
              <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-blue-500" />
              {t("maintenanceStatus")}
            </div>
          </div>
        ) : (
          services?.data.map((service) => (
            <Link
              key={service.id}
              href={`/services/${service.slug}`}
              className="h-full"
            >
              <BorderGlow
                borderRadius={24}
                backgroundColor="#0d0d1a"
                glowColor="260 75 70"
                colors={['#c084fc', '#f472b6', '#818cf8']}
                glowRadius={38}
                glowIntensity={1.1}
                coneSpread={26}
                fillOpacity={0.45}
                className="h-full w-full transition-transform duration-300 hover:-translate-y-1"
              >
                <div className="flex h-full flex-col">
                  <div className="relative overflow-hidden rounded-t-[22px]">
                    <Image
                      src={service.images[0].preview_url_webp}
                      alt={service.title}
                      width={500}
                      height={300}
                      className="h-[200px] w-full object-cover transition-transform duration-500 hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d1a]/60 to-transparent" />
                  </div>
                  <div className="flex flex-1 items-end justify-between gap-3 p-4">
                    <h4 className="line-clamp-2 text-base font-semibold uppercase text-white/90">
                      {service.title}
                    </h4>
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/10 text-white/60">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                        <path d="M7 17L17 7M17 7H7M17 7V17" />
                      </svg>
                    </span>
                  </div>
                </div>
              </BorderGlow>
            </Link>
          ))
        )}
      </div>
      <Pagination limit={12} totalCount={services?.meta.total || 0} />
    </div>
  )
}

export default Services
