"use client"

import React from "react"
import { useCartStore } from "@/states/store"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation } from "@tanstack/react-query"
import { useTranslations } from "next-intl"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"

import { postOrder } from "@/http/requests"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { PhoneInput } from "@/components/ui/phone-input"

const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  surname: z
    .string()
    .min(2, { message: "Last Name must be at least 2 characters." }),
  email: z.string({ message: "Email is required" }).email(),
  phoneNumber: z.string({
    message: "Phone number is required",
  }),
  city: z.string({ message: "City is required" }),
  address: z.string({ message: "Address is required" }),
  products: z.array(z.string().min(1, { message: "Product is required" })),
})

const CheckOutForm = () => {
  const t = useTranslations("checkout")

  const { cart, clearCart } = useCartStore()

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      surname: "",
      email: "",
      phoneNumber: "",
      city: "",
      address: "",
      products: [],
    },
  })

  const postOrderMutation = useMutation({
    mutationFn: postOrder,

    onSuccess: () => {
      form.reset()
      toast.success("Заказ успешно создан!")
      clearCart()
    },

    onError: () => {
      toast.error("Что то пошло не так")
    },
  })

  const handleSubmit = (values: z.infer<typeof formSchema>) => {
    const data = {
      customer_name: values.name + " " + values.surname,
      email: values.email,
      phone: values.phoneNumber,
      address: values.address + ", " + values.city,
      products: cart.map((product) => {
        return {
          quantity: product.quantity,
          id: product.id,
        }
      }),
    }
    postOrderMutation.mutate({ data })
  }

  return (
    <Card className="h-min w-full rounded-xl border-none p-5">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className="flex w-full flex-col gap-10"
        >
          <div className="flex w-full justify-between gap-10">
            <div className="flex w-full flex-col justify-between gap-3">
              <span className="text-md font-bold text-black uppercase">
                {t("credentials")}
              </span>

              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormControl>
                      <Input placeholder={t("name")} {...field} />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="surname"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormControl>
                      <Input placeholder={t("surname")} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormControl>
                      <Input placeholder={t("email")} type="email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phoneNumber"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormControl>
                      <PhoneInput
                        {...field}
                        defaultCountry="UZ"
                        placeholder="+998 99 999 99 99"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel className="py-2"> {t("city")}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t("cityPlaceholder")}
                        type="text"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel className="py-2">{t("address")}</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder={t("addressPlaceholder")} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          <Button
            disabled={postOrderMutation.isPending}
            type="submit"
            className="ml-auto"
          >
            {t("btn")}
          </Button>
        </form>
      </Form>
    </Card>
  )
}

export default CheckOutForm
