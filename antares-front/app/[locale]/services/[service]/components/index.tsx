"use client"

import Image from "next/image"
import { useQuery } from "@tanstack/react-query"

import { getServiceById } from "@/http/requests"
import { Skeleton } from "@/components/ui/skeleton"

const Service = ({ service }: { service: string }) => {
  const { isLoading, data } = useQuery({
    queryKey: ["service", service],
    queryFn: () => getServiceById({ service: service }),
  })

  if (isLoading) {
    return (
      <div className="space-y-5 rounded-2xl bg-white p-10">
        <Skeleton className="mx-auto h-[100px] w-full max-w-[700px] rounded-xl" />
        <div className="layout-container space-y-10">
          <Skeleton className="h-[300px] w-full rounded-xl" />
          <Skeleton className="h-[50px] w-full rounded-xl" />
          <Skeleton className="h-[50px] w-full rounded-xl" />
        </div>
      </div>
    )
  }
  return (
    <div className="rounded-2xl bg-white p-10">
      <div className="relative">
        <Image
          src={
            data?.data.images[0].preview_url ||
            "https://img.freepik.com/free-vector/503-error-service-unavailable-concept-illustration_114360-1937.jpg"
          }
          alt={data?.data.title || "image"}
          width={500}
          height={500}
          className="mb-4 h-auto rounded-2xl border object-cover md:float-right md:ml-6 md:max-w-[300px]"
        />
        <h3 className="mb-4 text-2xl font-bold">{data?.data.title}</h3>
        <div
          className="text-justify"
          dangerouslySetInnerHTML={{ __html: data?.data.content || "" }}
        />
      </div>
    </div>
  )
}

export default Service
