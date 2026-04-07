import React from "react"

import CompanyProducts from "./components"

interface Props {
  params: Promise<{ companyId: string }>
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
  const { companyId } = await params
  return <CompanyProducts companyId={companyId} />
}

export default CompanyIdPage
