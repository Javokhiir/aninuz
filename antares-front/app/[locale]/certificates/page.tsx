import React from "react"
import Image from "next/image"
import { useTranslations } from "next-intl"

import { Card } from "@/components/ui/card"
import { Icons } from "@/components/icons"

const CertificatesPage = () => {
  const t = useTranslations("certificates")
  return (
    <div className="layout-container space-y-10 md:space-y-20">
      <div className="mx-auto max-w-[1400px] space-y-10">
        <h1 className="mx-auto w-max bg-gradient-to-r from-black via-blue-700 to-black bg-clip-text font-extrabold text-transparent uppercase md:p-10">
          {t("title")}
        </h1>
        <div className="flex flex-col items-center justify-between gap-5 md:flex-row">
          <div className="order-2 max-w-[500px] space-y-2 md:order-1">
            <Icons.Quote className="mb-5 h-full w-min max-w-[40px]" />
            <h3 className="text-lg font-semibold uppercase">
              {t("quotation")}
            </h3>
            <p>{t("quotationSubtitle")}</p>
          </div>
          <div className="border-primary order-1 ml-auto flex max-w-[300px] flex-col items-end justify-end space-y-2 border-b-2 py-2 md:order-2">
            <h2 className="ml-auto w-max bg-gradient-to-r from-black via-blue-700 to-black bg-clip-text leading-[60px] font-extrabold text-transparent">
              4 {t("10years")}
            </h2>
            <p className="text-muted-foreground ml-auto max-w-[150px] text-end text-sm">
              {t("experience")}
            </p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2 md:grid-cols-3 lg:grid-cols-4">
          <a href="/certificates/cer1.png" target="_blank">
            <Card className="border-none p-4 shadow-[0px_10px_20px_20px_rgba(187,194,232,0.05)]">
              <Image
                src="/certificates/cer1.png"
                alt="certificate"
                className="w-full"
                width={500}
                height={500}
              />
            </Card>
          </a>
          <a href="/certificates/cer2.png" target="_blank">
            <Card className="border-none p-4 shadow-[0px_10px_20px_20px_rgba(187,194,232,0.05)]">
              <Image
                src="/certificates/cer2.png"
                alt="certificate"
                className="w-full"
                width={500}
                height={500}
              />
            </Card>
          </a>
        </div>
      </div>
    </div>
  )
}

export default CertificatesPage
