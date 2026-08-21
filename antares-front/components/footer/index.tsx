"use client"

import React from "react"
import Image from "next/image"
import { Link } from "@/i18n/routing"
import { useTranslations } from "next-intl"

import { Icons } from "../icons"
import SpecialButton from "../ui/special-button"

const Footer = () => {
  const t = useTranslations("footer")
  return (
    <footer className="relative mx-auto mt-10 max-w-[1900px] border-t pt-5 md:mt-20">
      <div className="relative flex w-full items-start justify-between gap-4">
        <Icons.FooterLeftMobileDecor className="absolute left-0 z-0 mt-1 h-min w-full max-w-[50px] sm:max-w-[80px] md:hidden" />
        <Icons.FooterLeftDecor className="absolute left-0 z-0 hidden h-min md:block md:max-w-[200px] lg:max-w-[280px] xl:max-w-[420px] 2xl:max-w-[600px]" />
        <h2 className="ml-[5%] w-full bg-gradient-to-r from-black via-blue-700 to-black bg-clip-text text-center text-2xl text-nowrap text-transparent uppercase sm:mb-5 sm:text-4xl md:mb-0 md:ml-[5%] 2xl:mt-5">
          {t("title")}
        </h2>
        <Icons.FooterRightDecor className="absolute right-0 mt-6 hidden h-min w-full md:mt-3 md:block md:max-w-[180px] lg:max-w-[230px] xl:max-w-[300px] 2xl:mt-10 2xl:max-w-[400px]" />
        <Icons.FooterRightMobileDecor className="absolute right-0 mt-3 h-min w-full max-w-[30px] sm:max-w-[60px] md:hidden" />
      </div>
      <div className="flex w-full max-w-[300px] flex-col justify-start gap-5 px-10 py-4 md:mx-auto md:max-w-full md:flex-row md:items-end md:justify-center md:gap-48 md:border-b-2 md:px-0">
        <div className="relative z-10 order-last flex flex-col gap-4 md:order-first md:ml-20">
          <Link href="/" className="text-lg capitalize">
            {t("home")}
          </Link>
          <Link href="/about" className="text-lg capitalize">
            {t("about")}
          </Link>
          <Link href="/products" className="text-lg capitalize">
            {t("products")}
          </Link>
          <Link href="/contacts" className="text-lg capitalize">
            {t("contact")}
          </Link>
        </div>
        <div className="order-first flex max-w-[420px] flex-col gap-4 md:order-last md:flex-row md:items-end">
          <p className="text-lg">
            {t("desc")} <br />
            <span className="text-primary"> {t("descBold")}</span>
          </p>
          <Link href="/contacts">
            <SpecialButton>{t("leaveRequestBtn")}</SpecialButton>
          </Link>
        </div>
      </div>
      <div className="mx-auto flex max-w-[1400px] flex-col justify-between gap-10 p-10 pb-32 md:flex-row md:items-center md:pb-10">
        <Image
          src={"/logos/logo-with-text.png"}
          alt="logo"
          width={500}
          height={500}
          className="max-w-[150px]"
        />
        <div className="md:flex md:flex-col md:justify-end">
          <p className="space-x-4">
            <span>Antares Investment {new Date().getFullYear()}</span>
          </p>
          <Link
            className="text-sm hover:underline md:ml-auto"
            href="/user-agreement"
          >
            {t("userAgreement")}
          </Link>
        </div>
      </div>
    </footer>
  )
}

export default Footer
