"use client"

import { useQuery } from "@tanstack/react-query"
import { CircleAlertIcon } from "lucide-react"
import { useTranslations } from "next-intl"

import { EventsResponse } from "@/types/models/events"
import { getAllEvents } from "@/http/requests"
import { useQueryParams } from "@/hooks/useQueryParams"
import { Skeleton } from "@/components/ui/skeleton"

import AllEvents from "./AllEvents"
import NearestEvent from "./NearestEvent"

const Events = () => {
  const t = useTranslations("events")
  const { getParam } = useQueryParams()
  const page = getParam("page", "1")

  const { isLoading, data: events } = useQuery<EventsResponse>({
    queryKey: ["events", page],
    queryFn: () =>
      getAllEvents({
        config: { params: { page, per_page: 12 } },
      }),
  })

  if (isLoading) {
    return (
      <div className="w-full space-y-5">
        <Skeleton className="h-[400px] w-full rounded-xl" />
        <Skeleton className="h-[100px] w-full rounded-xl" />
        <Skeleton className="h-[100px] w-full rounded-xl" />
      </div>
    )
  }

  return (
    <div>
      {events?.data && events?.meta.total > 0 ? (
        <div className="flex flex-col justify-between gap-10">
          <NearestEvent event={events?.data[0]} />
          <AllEvents events={events?.data.filter((_, index) => index > 0)} />
        </div>
      ) : (
        <p className="text-muted-foreground col-span-4 flex items-center gap-5 rounded-2xl bg-white p-5 shadow">
          <CircleAlertIcon /> {t("notFound")}
        </p>
      )}
    </div>
  )
}

export default Events
