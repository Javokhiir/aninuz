import React from "react"

import CheckOutForm from "./form"
import CheckoutProducts from "./products"

const CheckOut = () => {
  return (
    <div className="flex flex-col gap-5 pb-10 md:flex-row md:gap-10">
      <CheckOutForm />
      <CheckoutProducts />
    </div>
  )
}

export default CheckOut
