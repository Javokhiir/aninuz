import React from "react"
import { Link } from "@/i18n/routing"

import { Icons } from "@/components/icons"
import { setRequestLocale } from "next-intl/server"

import { fetchBuildJson } from "@/http/buildFetch"

import Service from "./components"

interface Props {
  params: Promise<{ locale: string; service: string }>
}

export async function generateStaticParams() {
  const data = await fetchBuildJson<{ data: { slug: string }[] }>(
    "/services?expand=images"
  )
  const slugs = (data?.data ?? []).map((service) => ({ service: service.slug }))

  return slugs.length > 0 ? slugs : [{ service: "_" }]
}

const ServiceId = async ({ params }: Props) => {
  const { locale, service: serviceParam } = await params
  setRequestLocale(locale)
  return (
    <div className="layout-container py-10">
      <Link href={"/services"}>
        <Icons.ArrowLeft />
      </Link>
      <div>
        <div className="relative flex w-full items-center justify-center">
          <div className="bg-primary/20 absolute -top-4 w-[80%] rounded-t-[20px] p-3 md:p-6" />
          <div className="bg-primary/40 mx-auto w-[90%] rounded-t-[20px] p-2 backdrop-blur-sm md:p-4" />
        </div>
        <Service service={serviceParam} />
      </div>
    </div>
  )
}

export default ServiceId
