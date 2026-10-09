import React from "react"
import { setRequestLocale } from "next-intl/server"

import { fetchBuildJson } from "@/http/buildFetch"

import { PRODUCT_BRANDS } from "../theme"
import CompanyProducts from "./components"

interface Props {
  params: Promise<{ locale: string; companyId: string }>
}

export async function generateStaticParams() {
  const data = await fetchBuildJson<{ data: { slug: string }[] }>("/brands")
  // Every brand on the selector gets its own page, even one the API does not
  // list yet, so it never lands on the placeholder and borrows another brand.
  const slugs = new Set([
    ...(data?.data ?? []).map((brand) => brand.slug),
    ...PRODUCT_BRANDS.map((brand) => brand.fallbackSlug),
  ])

  // The placeholder page is always exported: .htaccess falls back to it for
  // slugs that were not in the API at build time.
  return [...slugs, "_"].map((companyId) => ({ companyId }))
}

const CompanyIdPage = async ({ params }: Props) => {
  const { locale, companyId } = await params
  setRequestLocale(locale)
  return <CompanyProducts companyId={companyId} />
}

export default CompanyIdPage
