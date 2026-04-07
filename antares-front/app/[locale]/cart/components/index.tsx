import React from "react"

import CartOrder from "./order"
import CartProducts from "./products"

const Cart = () => {
  return (
    <div className="flex w-full flex-col justify-between gap-10 md:flex-row md:px-0">
      <CartProducts />
      <CartOrder />
    </div>
  )
}

export default Cart
