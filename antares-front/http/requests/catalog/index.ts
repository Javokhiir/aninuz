import { CatalogsResponse } from "@/types/models/catalogs"
import { $api } from "@/http/instance"

export const getCatalogs = (requestConfig?: AxiosRequestConfig) =>
  $api
    .get<CatalogsResponse>("/catalog", requestConfig?.config)
    .then((res) => res.data)
