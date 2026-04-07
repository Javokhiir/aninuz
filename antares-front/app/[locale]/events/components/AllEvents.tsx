import React from "react"
import Image from "next/image"
import { Link } from "@/i18n/routing"
import { useTranslations } from "next-intl"

import { Event } from "@/types/models/events"
import { Icons } from "@/components/icons"

const AllEvents = ({ events }: { events: Event[] }) => {
  const t = useTranslations("events")
  return (
    <div className="bg-white md:p-5">
      {events.map((event) => (
        <div key={event.id} className="flex flex-col gap-5 md:flex-row">
          <Image
            src={event.images[0].url}
            alt="event"
            width={500}
            height={500}
            className="h-[200px] w-full min-w-[300px] rounded-xl object-cover object-center md:max-w-[400px]"
          />
          <div className="flex w-full flex-col gap-10 rounded-xl bg-white p-5 shadow-[inset_0px_0px_50px_5px_rgba(243,246,255,1)] md:flex-row">
            <div className="w-full">
              <div className="border-primary text-primary flex w-max items-center gap-2 rounded-full border-2 p-2 px-4">
                <Icons.Calendar className="h-5 w-5" />
                <p className="text-muted-foreground">
                  {event.date.slice(0, 10)}
                </p>
                <div className="bg-primary h-5 w-[2px] rounded-full" />
                <Icons.Watch className="h-5 w-5" />
                <p className="text-muted-foreground">
                  {event.date.slice(11, 19)}
                </p>
              </div>
              <div className="space-y-2 pt-5">
                <h3 className="line-clamp-1 text-xl font-semibold">
                  {event.title}
                </h3>
                <div
                  className="line-clamp-2"
                  dangerouslySetInnerHTML={{ __html: event.content || "" }}
                />
                <div className="text-primary flex items-center gap-2">
                  <Icons.LocationWithCirle />{" "}
                  <p className="text-muted-foreground">{event.address}</p>
                </div>
              </div>
            </div>
            <div className="border-primary/20 flex w-full items-center justify-end gap-5 p-5 md:w-min md:justify-center md:border-l md:pl-10">
              <Link
                href={`/events/${event.slug}`}
                className="flex items-center gap-2 md:items-end"
              >
                <p className="text-primary text-lg">{t("learnMore")}</p>
                <Icons.ArrowRight className="text-primary h-5 w-5 rotate-45 md:h-7 md:w-7" />
              </Link>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default AllEvents
