import React from "react"
import { useTranslations } from "next-intl"

import { Icons } from "@/components/icons"

import ContactsInfo from "./contactInfo"
import ContactsForm from "./form"

const Contacts = () => {
  const t = useTranslations("contacts")
  return (
    <div className="space-y-10">
      <div className="layout-container space-y-10">
        <h1 className="mx-auto w-full max-w-[900px] bg-gradient-to-r from-black via-blue-700 to-black bg-clip-text text-center text-3xl font-extrabold text-transparent uppercase lg:p-10 lg:text-6xl lg:leading-16">
          {t("title")}
        </h1>

        <div>
          {" "}
          <div className="relative flex w-full items-center justify-center">
            <div className="bg-primary/20 absolute -top-4 w-[80%] rounded-t-[20px] p-3 lg:p-6" />
            <div className="bg-primary/40 mx-auto w-[90%] rounded-t-[20px] p-2 backdrop-blur-sm lg:p-4" />
          </div>
          <div className="relative flex w-full flex-col items-center justify-between gap-10 overflow-clip rounded-xl border-none bg-white p-5 shadow-[0px_25px_30px_0px_hsla(222,19%,53%,0.05)] lg:flex-row lg:p-2 lg:px-21">
            <Icons.ContactsTopDecor className="absolute top-0 left-0 z-0 w-full lg:-translate-x-1/4" />
            <Icons.ContactsLeftDecor className="absolute top-1/2 left-0 z-2 hidden lg:block" />
            <Icons.ContactsRightDecor className="absolute right-0 bottom-5 z-2 hidden lg:block" />
            <ContactsInfo />
            <ContactsForm />
          </div>
        </div>

        <iframe
          src="https://yandex.uz/map-widget/v1/?ll=66.836094%2C39.073932&pt=66.836094%2C39.073932&z=15&controls=routeButtonControl"
          width="100%"
          className="my-20 h-[400px] rounded-3xl lg:h-[400px]"
        ></iframe>
      </div>
    </div>
  )
}

export default Contacts
