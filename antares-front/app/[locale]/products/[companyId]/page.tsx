import React from "react"

import CompanyProducts from "./components"

interface Props {
  params: Promise<{ companyId: string }>
}

const CompanyIdPage = async ({ params }: Props) => {
  const { companyId } = await params
  return <CompanyProducts companyId={companyId} />
}

export default CompanyIdPage
