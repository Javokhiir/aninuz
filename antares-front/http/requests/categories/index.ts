import { CategoriesResponse } from "@/types/models/categories"
import { $api } from "@/http/instance"

export const getCategories = (requestConfig?: AxiosRequestConfig) =>
  $api
    .get<CategoriesResponse>("/categories", requestConfig?.config)
    .then((res) => res.data)
