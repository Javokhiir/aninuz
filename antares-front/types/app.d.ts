interface ApiResponse<T> {
  message: string
  success: boolean
  data: T
}

type AxiosRequestConfig<Data = undefined> = Data extends undefined
  ? { config?: import("axios").AxiosRequestConfig }
  : { data: Data; config?: import("axios").AxiosRequestConfig }
