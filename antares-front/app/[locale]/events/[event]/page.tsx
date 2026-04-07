import { setRequestLocale } from "next-intl/server"

import EventId from "./components"

interface Props {
  params: Promise<{ locale: string; event: string }>
}

export async function generateStaticParams() {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/events?expand=images`
    )
    const data = await res.json()
    const slugs = (data?.data ?? []).map((event: { slug: string }) => ({
      event: event.slug,
    }))
    return slugs.length > 0 ? slugs : [{ event: "_" }]
  } catch {
    return [{ event: "_" }]
  }
}

const EventsPage = async ({ params }: Props) => {
  const { locale, event } = await params
  setRequestLocale(locale)
  return <EventId event={event} />
}

export default EventsPage
