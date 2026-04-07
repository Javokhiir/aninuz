import { CompaniesResponse } from "@/types/models/company"
import { $api } from "@/http/instance"

export const getCompanies = (requestConfig?: AxiosRequestConfig) =>
  $api
    .get<CompaniesResponse>("/brands", requestConfig?.config)
    .then((res) => res.data)
