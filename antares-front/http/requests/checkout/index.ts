import { OrderFormRequest } from "@/types/models/orderForm"
import { $api } from "@/http/instance"

export const postOrder = ({
  data,
  config,
}: AxiosRequestConfig & { data: OrderFormRequest }) =>
  $api.post(`/checkout`, data, config)
