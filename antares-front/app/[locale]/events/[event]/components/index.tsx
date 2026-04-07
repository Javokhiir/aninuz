"use client"

import Image from "next/image"
import { useQuery } from "@tanstack/react-query"

import { EventResponse } from "@/types/models/events"
import { getEventById } from "@/http/requests"
import { Skeleton } from "@/components/ui/skeleton"

const EventId = ({ event }: { event: string }) => {
  const { isLoading, data } = useQuery<EventResponse>({
    queryKey: ["event", event],
    queryFn: () => getEventById({ event }),
  })

  if (isLoading) {
    return (
      <div className="layout-container space-y-10">
        <Skeleton className="mx-auto h-[100px] w-[300px] rounded-xl" />
        <div className="layout-container space-y-10">
          <Skeleton className="h-[300px] w-full rounded-xl" />
          <Skeleton className="h-[50px] w-full rounded-xl" />
          <Skeleton className="h-[50px] w-full rounded-xl" />
        </div>
      </div>
    )
  }

  return (
    <div className="layout-container space-y-10">
      <h1 className="mx-auto bg-gradient-to-r from-black via-blue-700 to-black bg-clip-text text-center font-extrabold text-transparent uppercase md:pt-10">
        {data?.data.title}
      </h1>
      <Image
        src={
          data?.data.images[0].url_webp ||
          "https://img.freepik.com/free-vector/503-error-service-unavailable-concept-illustration_114360-1937.jpg"
        }
        alt={data?.data.title || "image"}
        width={500}
        height={500}
        className="mx-auto w-full rounded-xl"
      />
      <div className="space-y-5">
        <h3 className="mx-auto text-left text-xl font-extrabold uppercase md:text-3xl">
          {data?.data.title}
        </h3>
        <div dangerouslySetInnerHTML={{ __html: data?.data.content || "" }} />
      </div>
    </div>
  )
}

export default EventId
