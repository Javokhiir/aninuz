"use client"

import React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation } from "@tanstack/react-query"
import { useTranslations } from "next-intl"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"

import { postContactsForm } from "@/http/requests"
import AnimatedBorderTrail from "@/components/ui/animated-trails"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { PhoneInput } from "@/components/ui/phone-input"
import { Textarea } from "@/components/ui/textarea"
import { Icons } from "@/components/icons"

const contactsFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string({ message: "Email is required" }).email(),
  phone: z
    .string()
    .min(13, { message: "Phone number must be at least 13 characters." }),
  message: z.string({ message: "Message is required" }),
})
const ContactsForm = () => {
  const t = useTranslations("contacts")

  const form = useForm<z.infer<typeof contactsFormSchema>>({
    resolver: zodResolver(contactsFormSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      message: "",
    },
  })

  const postFormMutation = useMutation({
    mutationFn: postContactsForm,

    onSuccess: () => {
      form.reset()
      toast.success("Message sent successfully!")
    },
    onError: () => {
      toast.error("Что то пошло не так")
    },
  })

  const onSubmit = (values: z.infer<typeof contactsFormSchema>) => {
    postFormMutation.mutate({ data: values })
  }

  return (
    <div className="border-primary relative rounded-[20px] border-[2px] bg-white p-2 md:p-5">
      <div className="absolute -top-4 -left-4 z-0 h-[200px] w-[200px] bg-white shadow-[-5px_4px_60px_60px_rgba(255,255,255,1)] md:h-[300px] md:w-[300px]" />
      <div className="absolute -right-4 -bottom-4 z-0 h-[200px] w-[200px] bg-white shadow-[-5px_4px_60px_60px_rgba(255,255,255,1)] md:h-[300px] md:w-[300px]" />
      <Icons.ContactsCenterDecor className="absolute top-0 left-0 z-0 -translate-x-2/3" />
      <AnimatedBorderTrail
        className="overflow-hidden rounded-[20px] bg-white"
        contentClassName="rounded-[20px] bg-white"
        trailSize="lg"
      >
        <div className="relative z-1 w-full max-w-[400px] gap-10 space-y-5 rounded-[20px] bg-white p-5">
          <h3 className="text-lg">{t("leaveRequest")}</h3>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex w-full flex-col gap-3"
            >
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        className="bg-secondary h-12 w-full border-none"
                        placeholder={t("name")}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        className="bg-secondary h-12 w-full border-none"
                        placeholder={t("email")}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phone"
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
                name="message"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Textarea
                        className="bg-secondary border-none"
                        placeholder={t("message")}
                        rows={5}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                disabled={postFormMutation.isPending}
                className="bg-primary text-primary-foreground ml-auto h-12 w-min p-4 text-lg font-semibold shadow-[inset_0px_1px_4px_5px_rgba(255,255,255,0.1),0px_15px_10px_-6px_hsla(227,72%,39%,0.3)]"
              >
                {t("leaveRequestBtn")}
              </Button>
            </form>
          </Form>
        </div>
      </AnimatedBorderTrail>
    </div>
  )
}

export default ContactsForm
