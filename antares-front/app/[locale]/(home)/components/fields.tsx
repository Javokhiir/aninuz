"use client"

import React from "react"
import { motion } from "framer-motion"
import { useTranslations } from "next-intl"

const FieldsSection = () => {
  const t = useTranslations("home.fields")
  return (
    <section className="space-y-10">
      <div className="border-primary flex flex-col items-center justify-between gap-2 border-b-2 pb-2 md:flex-row md:gap-0">
        <h2 className="w-max bg-gradient-to-r from-black to-blue-700 bg-clip-text text-left font-extrabold text-transparent uppercase md:leading-16">
          {t("title")}
        </h2>
        <p className="text-muted-foreground max-w-[350px] text-center text-sm md:text-left md:text-lg">
          {t("subtitle")}
        </p>
      </div>
      <div className="space-y-4">
        <motion.div
          style={{
            willChange: "transform, opacity",
          }}
          initial={{ opacity: 0, transform: "translate3d(-100%, 0, 0)" }}
          whileInView={{ opacity: 1, transform: "translate3d(0, 0, 0)" }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="bg-primary group grid h-20 grid-cols-2 grid-rows-1 items-center gap-10 overflow-clip rounded-full p-1 pl-6 md:h-32 md:grid-cols-3 md:p-2 md:pl-12"
        >
          <h4 className="text-center text-base font-semibold text-white md:mx-0 md:text-start md:text-2xl lg:text-3xl">
            {t("field1")}
          </h4>
          <p className="text-muted hidden w-full max-w-[300px] text-xl font-medium md:block">
            {t("field1Desc")}
          </p>
          <div
            className="flex h-full w-full items-center justify-end rounded-full bg-cover bg-center px-5 md:px-10"
            style={{ backgroundImage: "url('/images/hero/fields/field1.png')" }}
          ></div>
        </motion.div>
        <motion.div
          style={{
            willChange: "transform, opacity",
          }}
          initial={{ opacity: 0, transform: "translate3d(-100%, 0, 0)" }}
          whileInView={{ opacity: 1, transform: "translate3d(0, 0, 0)" }}
          transition={{ duration: 0.5, delay: 0.3 }}
          viewport={{ once: true }}
          className="bg-primary group grid h-20 grid-cols-2 grid-rows-1 items-center gap-10 overflow-clip rounded-full p-1 md:h-32 md:grid-cols-3 md:p-2 md:pl-12"
        >
          <div className="order-2 flex w-full items-center justify-between gap-2 pr-5 md:order-first md:pr-10">
            <h4 className="mx-auto text-base font-semibold text-white md:mx-0 md:text-2xl lg:text-3xl">
              {t("field2")}
            </h4>
          </div>
          <div
            className="order-1 flex h-full w-full items-center justify-end rounded-full bg-cover bg-center px-5 md:order-2"
            style={{ backgroundImage: "url('/images/hero/fields/field2.png')" }}
          ></div>
          <div className="order-last hidden items-center justify-between px-10 md:flex">
            <p className="text-muted w-full max-w-[300px] text-xl font-medium">
              {t("field2Desc")}
            </p>
          </div>
        </motion.div>
        <motion.div
          style={{
            willChange: "transform, opacity",
          }}
          initial={{ opacity: 0, transform: "translate3d(-100%, 0, 0)" }}
          whileInView={{ opacity: 1, transform: "translate3d(0, 0, 0)" }}
          transition={{ duration: 0.5, delay: 0.5 }}
          viewport={{ once: true }}
          className="bg-primary group grid h-20 grid-cols-2 grid-rows-1 items-center gap-10 overflow-clip rounded-full p-1 pl-6 md:h-32 md:grid-cols-3 md:p-2 md:pl-12"
        >
          <h4 className="w-full text-center text-base font-semibold text-white md:text-start md:text-2xl lg:text-3xl">
            {t("field3")}
          </h4>
          <p className="text-muted hidden w-full max-w-[300px] text-xl font-medium md:block">
            {t("field3Desc")}
          </p>
          <div
            className="flex h-full w-full items-center justify-end rounded-full bg-cover bg-center px-5 md:px-10"
            style={{ backgroundImage: "url('/images/hero/fields/field3.png')" }}
          ></div>
        </motion.div>
        <motion.div
          style={{
            willChange: "transform, opacity",
          }}
          initial={{ opacity: 0, transform: "translate3d(-100%, 0, 0)" }}
          whileInView={{ opacity: 1, transform: "translate3d(0, 0, 0)" }}
          transition={{ duration: 0.5, delay: 0.7 }}
          viewport={{ once: true }}
          className="bg-primary group grid h-20 grid-cols-2 grid-rows-1 items-center gap-2 overflow-clip rounded-full p-1 md:h-32 md:grid-cols-3 md:gap-10 md:p-2 md:pl-12"
        >
          <div className="order-2 flex w-full items-center justify-between gap-2 pr-5 md:order-first md:pr-10">
            <h4 className="mx-auto text-base font-semibold text-white md:mx-0 md:text-start md:text-2xl lg:text-3xl">
              {t("field4")}
            </h4>
          </div>
          <div
            className="flex h-full w-full items-center justify-end rounded-full bg-cover bg-center px-5"
            style={{ backgroundImage: "url('/images/hero/fields/field4.png')" }}
          ></div>

          <div className="order-last hidden items-center justify-between px-10 md:flex">
            <p className="text-muted w-full max-w-[300px] text-xl font-medium">
              {t("field4Desc")}
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default FieldsSection
