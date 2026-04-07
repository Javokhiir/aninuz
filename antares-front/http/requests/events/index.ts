import { EventResponse, EventsResponse } from "@/types/models/events"
import { $api } from "@/http/instance"

export const getAllEvents = ({ config }: AxiosRequestConfig) =>
  $api
    .get<EventsResponse>(`/events?expand=images`, config)
    .then((res) => res.data)

export const getEventById = ({
  event,
  config,
}: AxiosRequestConfig & { event: string }) =>
  $api
    .get<EventResponse>(`/events/${event}?expand=images`, config)
    .then((res) => res.data)
