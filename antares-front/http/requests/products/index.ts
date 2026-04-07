import {
  OneClickBuyRequest,
  ProductResponse,
  ProductsResponse,
} from "@/types/models/product"
import { $api } from "@/http/instance"

export const getAllProductsByCompanyId = ({
  brand,
  config,
}: AxiosRequestConfig & { brand: string }) =>
  $api
    .get<ProductsResponse>(`/products/${brand}`, config)
    .then((res) => res.data)

export const getProductById = ({
  product_slug,
  config,
}: AxiosRequestConfig & { product_slug: string } & { product_slug: string }) =>
  $api
    .get<ProductResponse>(`/products/detail/${product_slug}`, config)
    .then((res) => res.data)

export const searchAllProducts = ({
  search,
  config,
}: AxiosRequestConfig & { search?: string }) =>
  $api
    .post<ProductsResponse>(`/products/search?query=${search}`, config)
    .then((res) => res.data)

export const searchProductsByBrands = ({ config }: AxiosRequestConfig) =>
  $api
    .post<ProductsResponse>(`/products/search`, config)
    .then((res) => res.data)

export const oneClickBuy = ({
  data,
  config,
}: AxiosRequestConfig & { data: OneClickBuyRequest }) =>
  $api.post(`/products/getinfo`, data, config)
