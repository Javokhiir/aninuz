import React from "react"
import { setRequestLocale } from "next-intl/server"

import CompanyProducts from "./components"

interface Props {
  params: Promise<{ locale: string; companyId: string }>
}

export async function generateStaticParams() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/brands`)
    const data = await res.json()
    const slugs = (data?.data ?? []).map((brand: { slug: string }) => ({
      companyId: brand.slug,
    }))
    return slugs.length > 0 ? slugs : [{ companyId: "_" }]
  } catch {
    return [{ companyId: "_" }]
  }
}

const CompanyIdPage = async ({ params }: Props) => {
  const { locale, companyId } = await params
  setRequestLocale(locale)
  return <CompanyProducts companyId={companyId} />
}

export default CompanyIdPage
