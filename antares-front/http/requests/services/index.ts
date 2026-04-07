import { ServiceResponse, ServicesResponse } from "@/types/models/services"
import { $api } from "@/http/instance"

export const getAllServices = (requestConfig?: AxiosRequestConfig) =>
  $api
    .get<ServicesResponse>(`/services?expand=images`, requestConfig?.config)
    .then((res) => res.data)
export const getServiceById = ({
  service,
  config,
}: AxiosRequestConfig & { service: string }) =>
  $api
    .get<ServiceResponse>(`/services/${service}?expand=images`, config)
    .then((res) => res.data)
