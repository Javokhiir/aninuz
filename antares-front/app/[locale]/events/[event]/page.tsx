import EventId from "./components"

interface Props {
  params: Promise<{ event: string }>
}

const EventsPage = async ({ params }: Props) => {
  const { event } = await params
  return <EventId event={event} />
}

export default EventsPage
