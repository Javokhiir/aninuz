import { setRequestLocale } from "next-intl/server"

import { fetchBuildJson } from "@/http/buildFetch"

import EventId from "./components"

interface Props {
  params: Promise<{ locale: string; event: string }>
}

export async function generateStaticParams() {
  const data = await fetchBuildJson<{ data: { slug: string }[] }>(
    "/events?expand=images"
  )
  const slugs = (data?.data ?? []).map((event) => ({ event: event.slug }))

  return slugs.length > 0 ? slugs : [{ event: "_" }]
}

const EventsPage = async ({ params }: Props) => {
  const { locale, event } = await params
  setRequestLocale(locale)
  return <EventId event={event} />
}

export default EventsPage
