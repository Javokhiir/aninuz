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
          <div className="col-span-3 py-16 text-center text-gray-400">
            {t("empty")}
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
