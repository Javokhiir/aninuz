"use client"

import { Link } from "@/i18n/routing"
import { useQuery } from "@tanstack/react-query"
import { CircleAlertIcon } from "lucide-react"
import { useTranslations } from "next-intl"

import { CompaniesResponse, Company } from "@/types/models/company"
import { getCompanies } from "@/http/requests/companies"
import { useQueryParams } from "@/hooks/useQueryParams"
import { Card } from "@/components/ui/card"
import { Pagination } from "@/components/ui/pagination/index"
import { Skeleton } from "@/components/ui/skeleton"

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
    <div className="grid w-full grid-cols-2 gap-5 md:grid-cols-3 md:gap-10">
      <Skeleton className="h-[125px] w-full rounded-xl" />
      <Skeleton className="h-[125px] w-full rounded-xl" />
      <Skeleton className="h-[125px] w-full rounded-xl" />
    </div>
  ) : (
    <div className="mx-auto max-w-[1400px]">
      <div className="grid w-full grid-cols-2 gap-5 md:grid-cols-3 md:gap-10">
        {companies?.data.map((company: Company) => (
          <Link
            key={company.id}
            className="w-full"
            href={`/products/${company.slug}`}
          >
            <Card className="flex flex-col items-center justify-center gap-0 overflow-hidden rounded-xl border-[5px] border-[rgba(238,240,246,1)] p-0">
              <div
                className="flex h-[80px] w-[100px] items-center justify-center sm:h-[100px] sm:w-[140px] md:h-[120px] md:w-[250px]"
                dangerouslySetInnerHTML={{ __html: company.svg }}
              />
            </Card>
          </Link>
        ))}

        {companies?.meta.total === 0 && (
          <p className="text-primary col-span-3 flex w-full items-center gap-5 rounded-xl bg-white p-5">
            <CircleAlertIcon /> {t("products")}
          </p>
        )}
      </div>
      <div className="col-span-3">
        <Pagination limit={10} totalCount={companies?.meta.total || 0} />
      </div>
    </div>
  )
}

export default Companies
