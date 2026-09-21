"use client"

import React, { useMemo, useState } from "react"
import Image from "next/image"
import { useCartStore } from "@/states/store"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation } from "@tanstack/react-query"
import { Check } from "lucide-react"
import { useTranslations } from "next-intl"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"

import { cn } from "@/lib/utils"
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

type PaymentMethod = "click" | "payme"

// Design only: the choice is not sent with the order until the providers are
// integrated.
const PAYMENT_METHODS: {
  id: PaymentMethod
  logo: string
  logoWidth: number
  logoHeight: number
}[] = [
  {
    id: "click",
    logo: "/logos/payments/click.svg",
    logoWidth: 94,
    logoHeight: 24,
  },
  {
    id: "payme",
    logo: "/logos/payments/payme-mark.svg",
    logoWidth: 24,
    logoHeight: 24,
  },
]

const CheckOutForm = () => {
  const t = useTranslations("checkout")
  const tv = useTranslations("validation")

  const { cart, clearCart } = useCartStore()
  const [payment, setPayment] = useState<PaymentMethod | null>(null)

  const formSchema = useMemo(
    () =>
      z.object({
        name: z.string().min(2, { message: tv("nameMin") }),
        surname: z.string().min(2, { message: tv("surnameMin") }),
        email: z.string().email({ message: tv("emailInvalid") }),
        phoneNumber: z
          .string({ message: tv("phoneRequired") })
          .min(1, { message: tv("phoneRequired") }),
        city: z.string().min(1, { message: tv("cityRequired") }),
        address: z.string().min(1, { message: tv("addressRequired") }),
        products: z.array(z.string()),
      }),
    [tv]
  )

  const form = useForm<z.infer<typeof formSchema>>({
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
      toast.success(t("orderCreated"))
      clearCart()
    },

    onError: () => {
      toast.error(t("smthWentWrong"))
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

          <fieldset className="flex flex-col gap-3">
            <legend className="text-md mb-3 font-bold text-black uppercase">
              {t("payment.title")}
            </legend>
            <div className="grid gap-3 sm:grid-cols-2">
              {PAYMENT_METHODS.map((method) => {
                const selected = payment === method.id
                return (
                  <label
                    key={method.id}
                    className={cn(
                      "relative flex cursor-pointer items-center gap-4 rounded-xl border-2 bg-white p-4 transition-colors",
                      selected
                        ? "border-blue-700"
                        : "border-gray-200 hover:border-gray-300"
                    )}
                  >
                    <input
                      type="radio"
                      name="payment"
                      value={method.id}
                      checked={selected}
                      onChange={() => setPayment(method.id)}
                      className="sr-only"
                    />
                    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-gray-50">
                      <Image
                        src={method.logo}
                        alt={t(`payment.${method.id}`)}
                        width={method.logoWidth}
                        height={method.logoHeight}
                        className="h-6 w-auto"
                      />
                    </span>
                    <span className="flex min-w-0 flex-col">
                      <span className="text-sm font-semibold text-black">
                        {t(`payment.${method.id}`)}
                      </span>
                      <span className="text-muted-foreground text-xs">
                        {t(`payment.${method.id}Desc`)}
                      </span>
                    </span>
                    <span className="ml-auto flex shrink-0 items-center gap-2">
                      <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-semibold tracking-wide text-gray-500 uppercase">
                        {t("payment.comingSoon")}
                      </span>
                      <span
                        className={cn(
                          "flex h-5 w-5 items-center justify-center rounded-full border-2",
                          selected
                            ? "border-blue-700 bg-blue-700 text-white"
                            : "border-gray-300"
                        )}
                      >
                        {selected && <Check className="h-3 w-3" />}
                      </span>
                    </span>
                  </label>
                )
              })}
            </div>
            <p className="text-muted-foreground text-xs">{t("payment.hint")}</p>
          </fieldset>

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
