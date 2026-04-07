"use client"

import { Link } from "@/i18n/routing"
import { useCartStore } from "@/states/store"

// import {
//   Accordion,
//   AccordionContent,
//   AccordionItem,
//   AccordionTrigger,
// } from "@/components/ui/accordion"
// import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
// import { Input } from "@/components/ui/input"
import SpecialButton from "@/components/ui/special-button"

import { fakeCart } from "./fake"

const CartOrder = () => {
  const { cart } = useCartStore((state) => state)
  const totalItems = useCartStore((state) => state.totalItems())
  return (
    <Card className="h-max w-full rounded-xl border-none p-5 md:max-w-[400px] md:p-10">
      <h3 className="text-lg font-bold uppercase">итог:</h3>
      <div className="border-b-1 border-black/80 py-2">
        <p className="flex w-full items-center justify-between">
          <span>Цена:</span>
          <span className="text-sm">По запросу</span>
        </p>
        <p className="flex w-full items-center justify-between">
          <span>Количество товаров:</span>
          <span className="text-sm">{totalItems || 0} шт</span>
        </p>
      </div>

      <SpecialButton disabled={cart.length === 0} className="w-full">
        <Link
          href={fakeCart.total > 0 ? "/cart/checkout" : "#"}
          className="w-full"
        >
          Оформить
        </Link>
      </SpecialButton>

      {/* <Accordion
        type="single"
        className="border-t-1 border-b-1 border-black/80"
        collapsible
      >
        <AccordionItem value="item-1">
          <AccordionTrigger className="text-lg font-bold uppercase" plus>
            добавить промокод
          </AccordionTrigger>
          <AccordionContent className="flex items-center gap-2">
            <Input className="outline-none focus:ring-offset-0" />
            <Button>Применить</Button>
          </AccordionContent>
        </AccordionItem>
      </Accordion> */}
    </Card>
  )
}

export default CartOrder
