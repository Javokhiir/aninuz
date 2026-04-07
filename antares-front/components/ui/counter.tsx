"use client"

import React from "react"
import { useCartStore } from "@/states/store"
import { MinusIcon, PlusIcon } from "lucide-react"

import { Button } from "./button"

export const Counter = ({
  quantity,
  id,
  setQuantity,
}: {
  quantity: number
  id?: number
  setQuantity?: React.Dispatch<React.SetStateAction<number>>
}) => {
  const { changeQuantity } = useCartStore()
  return (
    <div className="flex w-max items-center rounded-md border-2 p-1">
      <Button
        variant="ghost"
        className="h-6 w-6 md:h-8 md:w-8"
        onClick={() =>
          id
            ? changeQuantity(id, "decrement")
            : quantity > 1
              ? setQuantity && setQuantity(--quantity)
              : "null"
        }
      >
        <MinusIcon className="size-5" />
      </Button>
      <p className="font-panchang text-sm font-semibold md:text-base">
        {quantity}
      </p>

      <Button
        variant="ghost"
        className="h-6 w-6 md:h-8 md:w-8"
        onClick={() =>
          id
            ? changeQuantity(id, "increment")
            : setQuantity && setQuantity(++quantity)
        }
      >
        <PlusIcon className="size-5" />
      </Button>
    </div>
  )
}
