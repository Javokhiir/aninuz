import React from "react"
import { setRequestLocale } from "next-intl/server"

import { fetchBuildJson } from "@/http/buildFetch"

import CompanyProducts from "./components"

interface Props {
  params: Promise<{ locale: string; companyId: string }>
}

export async function generateStaticParams() {
  const data = await fetchBuildJson<{ data: { slug: string }[] }>("/brands")
  const slugs = (data?.data ?? []).map((brand) => ({ companyId: brand.slug }))

  return slugs.length > 0 ? slugs : [{ companyId: "_" }]
}

const CompanyIdPage = async ({ params }: Props) => {
  const { locale, companyId } = await params
  setRequestLocale(locale)
  return <CompanyProducts companyId={companyId} />
}

export default CompanyIdPage
