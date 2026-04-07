import React from "react"
import { useTranslations } from "next-intl"

import Cart from "./components"

const CartPage = () => {
  const t = useTranslations("cart")
  return (
    <div className="space-y-10">
      <div className="layout-container">
        <h1 className="mx-auto w-max bg-gradient-to-r from-black via-blue-700 to-black bg-clip-text font-extrabold text-transparent uppercase md:p-10">
          {t("title")}
        </h1>
        <Cart />
      </div>
    </div>
  )
}

export default CartPage
