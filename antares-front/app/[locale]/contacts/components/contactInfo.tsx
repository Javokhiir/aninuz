import React from "react"
import { Link } from "@/i18n/routing"
import { useTranslations } from "next-intl"

import AnimatedBorderTrail from "@/components/ui/animated-trails"
import { Icons } from "@/components/icons"

const ContactsInfo = () => {
  const t = useTranslations("contacts")
  return (
    <AnimatedBorderTrail
      className="mt-15 overflow-hidden rounded-[20px] bg-white shadow-[0px_25px_30px_0px_hsla(222,19%,53%,0.05)] md:mt-0"
      contentClassName="rounded-[20px]  bg-white"
      trailSize="lg"
    >
      <div className="relative z-1 space-y-10 rounded-[20px] bg-white p-10">
        <h3 className="text-primary text-3xl font-bold uppercase">
          {t("contactInfo")}
        </h3>

        <div className="space-y-4">
          <Link
            href="https://yandex.uz/maps/-/CHbcJZJO"
            target="_blank"
            className="flex items-center gap-4 text-lg"
          >
            <div className="size-5">
              <Icons.LocationDot className="size-5" />
            </div>
            <p className="capitalize">{t("address")}</p>
          </Link>
          <Link
            href="mailto:info@anin.uz"
            className="flex items-center gap-4 text-lg"
          >
            <div className="size-5">
              <Icons.ContactsMail className="size-5" />
            </div>
            <p>info@anin.uz</p>
          </Link>
          <Link
            href="tel:+998337192219"
            className="flex items-center gap-4 text-lg"
          >
            <div className="size-5">
              <Icons.ContactsPhone className="size-5" />
            </div>
            <p className="capitalize">+998 33 719 22 19</p>
          </Link>
        </div>
      </div>
    </AnimatedBorderTrail>
  )
}

export default ContactsInfo
