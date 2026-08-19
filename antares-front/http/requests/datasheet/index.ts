import { $api } from "@/http/instance"

export const postDatasheetLead = (payload: {
  email: string
  product_slug?: string
}) => $api.post("/datasheet-lead", payload).then((res) => res.data)
