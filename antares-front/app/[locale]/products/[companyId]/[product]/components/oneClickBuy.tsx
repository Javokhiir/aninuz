"use client"

import { useCompanyColorStore } from "@/states/store"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation } from "@tanstack/react-query"
import { useTranslations } from "next-intl"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"

import { OneClickBuyRequest } from "@/types/models/product"
import { hexToRgba } from "@/lib/utils"
import { oneClickBuy } from "@/http/requests"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { PhoneInput } from "@/components/ui/phone-input"
import SpecialButton from "@/components/ui/special-button"

const oneClickBuySchema = z.object({
  name: z.string().min(2, {
    message: "Name is required",
  }),
  phoneNumber: z.string().min(2, {
    message: "phoneNumber must be valid.",
  }),
})

const OneClickBuy = ({ productId }: { productId: number }) => {
  const { color } = useCompanyColorStore()
  const t = useTranslations("products.productId")

  const form = useForm<z.infer<typeof oneClickBuySchema>>({
    resolver: zodResolver(oneClickBuySchema),
    defaultValues: {
      name: "",
      phoneNumber: "",
    },
  })

  const oneClickBuyMutation = useMutation({
    mutationFn: oneClickBuy,
    onSuccess: () => {
      form.reset()
      toast.success(t("requestHasBeenSent"))
    },
    onError: () => {
      toast.error(t("smthWentWrong"))
    },
  })

  function onSubmit(values: z.infer<typeof oneClickBuySchema>) {
    const data: OneClickBuyRequest = {
      name: values.name,
      phone: values.phoneNumber,
      product_id: productId,
    }
    oneClickBuyMutation.mutate({ data: data })
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <SpecialButton
          style={{
            backgroundColor: color,
            boxShadow: `0px 10px 10px -4px ${hexToRgba(color, 0.4)}`,
          }}
          className="h-11 w-full capitalize"
        >
          {t("findOutPrice")}
        </SpecialButton>
      </DialogTrigger>
      <DialogContent className="w-full">
        <DialogHeader className="w-full space-y-4">
          <div className="space-y-2">
            <DialogTitle> {t("findOutPrice")}</DialogTitle>
            <DialogDescription>{t("leaveYourContact")}</DialogDescription>
          </div>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="w-full space-y-4"
            >
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input {...field} placeholder={t("name")} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phoneNumber"
                render={({ field }) => (
                  <FormItem>
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
              <div className="flex w-full justify-end">
                <Button
                  type="submit"
                  className="ml-auto"
                  disabled={oneClickBuyMutation.isPending}
                  style={{ backgroundColor: color }}
                >
                  {t("sendRequest")}
                </Button>
              </div>
            </form>
          </Form>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}

export default OneClickBuy
