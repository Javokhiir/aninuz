"use client"

import { Link } from "@/i18n/routing"
import { useQuery } from "@tanstack/react-query"
import { useTranslations } from "next-intl"

import { CompaniesResponse, Company } from "@/types/models/company"
import { getCompanies } from "@/http/requests/companies"
import { useQueryParams } from "@/hooks/useQueryParams"
import { Pagination } from "@/components/ui/pagination/index"
import { Skeleton } from "@/components/ui/skeleton"
import BorderGlow from "@/components/ui/BorderGlow"

const Companies = () => {
  const { getParam } = useQueryParams()
  const page = getParam("page", "1")
  const t = useTranslations("products")

  const { isLoading, data: companies } = useQuery<CompaniesResponse>({
    queryKey: ["companies", page],
    queryFn: () =>
      getCompanies({
        config: { params: { page, per_page: 12 } },
      }),
  })

  return isLoading ? (
    <div className="grid w-full grid-cols-2 gap-5 md:grid-cols-3 md:gap-8">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <Skeleton key={i} className="h-[160px] w-full rounded-[20px]" />
      ))}
    </div>
  ) : (
    <div className="mx-auto max-w-[1400px]">
      <div className="grid w-full grid-cols-2 gap-5 md:grid-cols-3 md:gap-8">
        {companies?.data.map((company: Company) => (
          <Link
            key={company.id}
            className="w-full"
            href={`/products/${company.slug}`}
          >
            <BorderGlow
              borderRadius={20}
              backgroundColor="#0a1628"
              glowColor="210 80 70"
              colors={['#60a5fa', '#818cf8', '#38bdf8']}
              glowRadius={35}
              glowIntensity={1.2}
              coneSpread={28}
              fillOpacity={0.4}
              className="w-full transition-transform duration-300 hover:-translate-y-1"
            >
              <div className="flex h-[160px] flex-col items-center justify-center gap-3 px-6 py-5">
                <div
                  className="flex h-[90px] w-full items-center justify-center [&_path]:fill-white [&_svg]:max-h-[70px] [&_svg]:w-auto [&_svg]:max-w-[180px]"
                  dangerouslySetInnerHTML={{ __html: company.svg }}
                />
                <p className="text-center text-xs font-semibold uppercase tracking-widest text-white/40">
                  {company.title}
                </p>
              </div>
            </BorderGlow>
          </Link>
        ))}

        {companies?.meta.total === 0 && (
          <div className="col-span-3 flex w-full flex-col items-center justify-center gap-6 rounded-2xl bg-white py-16 shadow-sm">
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
        )}
      </div>
      <div className="col-span-3 mt-8">
        <Pagination limit={10} totalCount={companies?.meta.total || 0} />
      </div>
    </div>
  )
}

export default Companies
