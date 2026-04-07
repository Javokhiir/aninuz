import React from "react"
import { Link } from "@/i18n/routing"
import { useTranslations } from "next-intl"

import { Event } from "@/types/models/events"
import { Icons } from "@/components/icons"

const NearestEvent = ({ event }: { event: Event }) => {
  const t = useTranslations("events")
  return (
    <Link
      href={`/events/${event.slug}`}
      className="flex h-[500px] w-full flex-col justify-between rounded-[34px] bg-cover bg-no-repeat object-center p-5"
      style={{
        backgroundImage: `url(${event.images[0].url})`,
      }}
    >
      <p className="bg-primary/50 w-max rounded-full p-2 px-4 font-semibold text-white backdrop-blur-sm">
        {t("nearestEvents")}
      </p>
      <div className="flex items-end justify-between">
        <div className="w-max space-y-2 rounded-2xl p-4 text-white backdrop-blur-sm">
          <div className="flex items-center gap-2">
            <Icons.Calendar />
            <h3 className="text-lg font-semibold">{event.title}</h3>
          </div>
          <div className="flex items-center gap-2">
            <Icons.Microphone className="w-6" />
            <div
              className="line-clamp-2"
              dangerouslySetInnerHTML={{ __html: event.content || "" }}
            />
          </div>
          <div className="flex items-center gap-2">
            <Icons.LocationWithCirle className="w-6" />
            <p className="text-sm">{event.address}</p>
          </div>
        </div>

        <Icons.ArrowRight className="hidden h-16 w-16 rotate-45 rounded-full bg-white/20 p-4 backdrop-blur-lg md:block" />
      </div>
    </Link>
  )
}

export default NearestEvent
