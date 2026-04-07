import React from "react"
import { useTranslations } from "next-intl"

import CheckOut from "./components"

const CheckOutPage = () => {
  const t = useTranslations("checkout")
  return (
    <div className="layout-container">
      <h1 className="mx-auto w-full bg-gradient-to-r from-black via-blue-700 to-black bg-clip-text text-center font-extrabold text-transparent uppercase md:p-10">
        {t("title")}
      </h1>
      <CheckOut />
    </div>
  )
}

export default CheckOutPage
