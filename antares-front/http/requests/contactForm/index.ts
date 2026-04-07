import { ContactFormRequest } from "@/types/models/contactForm"
import { $api } from "@/http/instance"

export const postContactsForm = ({
  data,
  config,
}: AxiosRequestConfig & { data: ContactFormRequest }) =>
  $api.post(`/review`, data, config)
