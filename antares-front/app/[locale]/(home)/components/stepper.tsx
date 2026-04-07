"use client"

import React from "react"
import { Link } from "@/i18n/routing"
import { motion } from "framer-motion"
import { useTranslations } from "next-intl"

import { Icons } from "@/components/icons"

const StepperSection = () => {
  const t = useTranslations("home.stepper")
  return (
    <section className="mx-auto max-w-[1400px] space-y-10 px-5 md:px-0">
      <h2 className="mx-auto w-full bg-gradient-to-bl from-black via-blue-700 to-black bg-clip-text text-left font-extrabold text-transparent uppercase md:leading-16">
        {t("title")}
      </h2>
      <div className="flex w-full flex-col justify-between md:flex-row">
        <div className="space-y-5">
          <p className="text-muted-foreground max-w-[550px] text-lg">
            {t("subtitle")}
          </p>
          <div className="hidden items-center gap-2 md:flex">
            <Link
              href={"/about"}
              className="bg-primary text-primary-foreground flex h-12 w-12 -rotate-[25deg] items-center justify-center rounded-full p-3 font-semibold shadow-[inset_0px_1px_4px_5px_rgba(255,255,255,0.1),0px_15px_10px_-6px_hsla(227,72%,39%,0.3)] transition-all duration-300 hover:rotate-[20deg]"
            >
              <Icons.ArrowRight />
            </Link>
            <p className="text-muted max-w-[120px]">{t("more")}</p>
          </div>
        </div>
        <div className="min-h-[300px] space-y-2">
          <div className="flex gap-4">
            <div className="flex flex-col items-center">
              <motion.div
                style={{
                  willChange: "transform",
                  transform: "translateZ(0)",
                }}
                initial={{ scale: 0.01 }}
                whileInView={{ scale: 1 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                className="border-primary bg-primary h-6 w-6 rounded-full border-4"
              />
              <motion.div
                style={{
                  willChange: "transform, opacity",
                  transformOrigin: "top",
                }}
                initial={{ opacity: 0, scaleY: 0 }} // Initial state with no height (scaleY = 0)
                whileInView={{ opacity: 1, scaleY: 1 }}
                transition={{ duration: 0.5, ease: "easeOut", delay: 0.5 }}
                viewport={{ once: true }}
                className="from-primary h-16 w-1 bg-gradient-to-b to-transparent"
              />
            </div>
            <motion.p
              style={{
                overflow: "hidden",
                willChange: "transform",
                transform: "translateZ(0)",
              }}
              initial={{ opacity: 0, translateX: 16 }}
              whileInView={{ opacity: 1, translateX: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="max-w-[300px] text-lg font-semibold"
            >
              {t("step1")}
            </motion.p>
          </div>
          <div className="flex gap-4">
            <div className="flex flex-col items-center">
              <motion.div
                style={{
                  willChange: "transform",
                  transform: "translateZ(0)",
                }}
                initial={{ scale: 0.01 }}
                whileInView={{ scale: 1 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                className="border-primary h-6 w-6 rounded-full border-4 bg-white"
              />
              <motion.div
                style={{
                  willChange: "transform, opacity",
                  transformOrigin: "top",
                }}
                initial={{ opacity: 0, scaleY: 0 }} // Initial state with no height (scaleY = 0)
                whileInView={{ opacity: 1, scaleY: 1 }}
                transition={{ duration: 0.5, ease: "easeOut", delay: 0.5 }}
                viewport={{ once: true }}
                className="from-primary h-16 w-1 bg-gradient-to-b to-transparent"
              />
            </div>

            <motion.p
              style={{
                overflow: "hidden",
                willChange: "transform",
                transform: "translateZ(0)",
              }}
              initial={{ opacity: 0, translateX: 16 }}
              whileInView={{ opacity: 1, translateX: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="max-w-[300px] text-lg font-semibold"
            >
              {t("step2")}
            </motion.p>
          </div>
          <div className="flex gap-4">
            <div className="flex flex-col items-center">
              <motion.div
                style={{
                  willChange: "transform",
                  transform: "translateZ(0)",
                }}
                initial={{ scale: 0.01 }}
                whileInView={{ scale: 1 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                className="border-primary h-6 w-6 rounded-full border-4 bg-white"
              />
              <motion.div
                style={{
                  willChange: "transform, opacity",
                  transformOrigin: "top",
                }}
                initial={{ opacity: 0, scaleY: 0 }} // Initial state with no height (scaleY = 0)
                whileInView={{ opacity: 1, scaleY: 1 }}
                transition={{ duration: 0.5, ease: "easeOut", delay: 0.5 }}
                viewport={{ once: true }}
                className="from-primary h-16 w-1 bg-gradient-to-b to-transparent"
              />
            </div>
            <motion.p
              style={{
                overflow: "hidden",
                willChange: "transform",
                transform: "translateZ(0)",
              }}
              initial={{ opacity: 0, translateX: 16 }}
              whileInView={{ opacity: 1, translateX: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="max-w-[300px] text-lg font-semibold"
            >
              {t("step3")}
            </motion.p>
          </div>
        </div>
      </div>
      <div className="ml-auto flex w-min items-center gap-5 md:hidden">
        <p className="text-muted w-max max-w-[120px] text-end">{t("more")}</p>
        <Link
          href="/about"
          className="bg-primary text-primary-foreground flex h-12 w-12 -rotate-[25deg] items-center justify-center rounded-full p-3 font-semibold shadow-[inset_0px_1px_4px_5px_rgba(255,255,255,0.1),0px_15px_10px_-6px_hsla(227,72%,39%,0.3)] transition-all duration-300 hover:rotate-[20deg]"
        >
          <Icons.ArrowRight />
        </Link>
      </div>
    </section>
  )
}

export default StepperSection
