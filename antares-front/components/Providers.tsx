"use client"

import {
  MutationCache,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query"
import { NuqsAdapter } from "nuqs/adapters/next/app"

const mutationCache = new MutationCache({
  // onSuccess: () => {
  //   queryClient.invalidateQueries()
  // },
})

const queryClient = new QueryClient({
  mutationCache,
  defaultOptions: {
    queries: {
      retry: false,
      staleTime: 10 * 60 * 1000,
      refetchOnWindowFocus: false,
    },
  },
})

export const Providers = ({ children }: React.PropsWithChildren) => (
  <QueryClientProvider client={queryClient}>
    <NuqsAdapter>{children}</NuqsAdapter>
  </QueryClientProvider>
)
