"use client"

import React from "react"
import { motion } from "framer-motion"
import { useTranslations } from "next-intl"

import { Button } from "@/components/ui/button"
import { Icons } from "@/components/icons"

const WhySection = () => {
  const t = useTranslations("about.whyUs")
  return (
    <section className="layout-container space-y-10 overflow-y-clip md:space-y-20">
      <h2 className="w-full bg-gradient-to-r from-black via-blue-700 to-black bg-clip-text text-center font-extrabold text-transparent uppercase md:text-left md:leading-16">
        {t("title")}
      </h2>
      <div className="flex flex-col items-center justify-center md:flex-row md:items-start md:justify-between">
        <div className="order-last space-y-10 md:order-first">
          <p className="flex max-w-[400px] items-center justify-center text-lg">
            {t("subtitle")}
          </p>
          <Button className="bg-primary text-primary-foreground h-12 p-4 text-lg font-semibold shadow-[inset_0px_1px_4px_5px_rgba(255,255,255,0.1),0px_15px_10px_-6px_hsla(227,72%,39%,0.3)]">
            {t("getInTouch")}
          </Button>
        </div>
        <div className="relative order-first ml-5 grid h-[650px] max-w-[400px] grid-cols-6 grid-rows-8 gap-5 md:order-last md:-mt-14 md:mr-10 md:ml-0 md:h-[700px] md:w-[800px] md:max-w-full md:grid-cols-6 md:grid-rows-3">
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            viewport={{ once: true }}
            className="bg-primary text-primary-foreground absolute bottom-[30%] left-0 flex h-8 w-8 items-center justify-center rounded-full p-2 font-semibold shadow-[inset_0px_1px_4px_5px_rgba(255,255,255,0.1),0px_15px_10px_-6px_hsla(227,72%,39%,0.3)] transition-all duration-300 hover:rotate-[20deg] md:bottom-[35%] md:h-12 md:w-12 md:-translate-x-full md:p-3"
          >
            <Icons.ArrowRight />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            viewport={{ once: true }}
            className="bg-primary text-primary-foreground absolute top-10 left-0 flex h-8 w-8 translate-x-[15%] rotate-[20deg] items-center justify-center rounded-full p-2 font-semibold shadow-[inset_0px_1px_4px_5px_rgba(255,255,255,0.1),10px_25px_20px_-10px_hsla(227,72%,39%,0.3)] transition-all duration-300 hover:rotate-0 md:top-[20%] md:h-12 md:w-12 md:translate-x-[200%] md:p-3"
          >
            <Icons.ArrowRight />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, marginTop: -200, rotate: 0 }}
            whileInView={{
              opacity: 1,
              marginTop: 0,
              rotate: window.innerWidth <= 768 ? -15 : -20,
            }}
            transition={{ duration: 1, delay: 0.6 }}
            viewport={{ once: true }}
            className="border-primary col-start-2 col-end-7 row-start-1 row-end-3 flex h-full w-full origin-right items-center justify-center rounded-full border-[3px] text-center md:col-start-4 md:col-end-7 md:row-start-1 md:row-end-1 md:h-full md:w-[420px]"
          >
            <p className="text-primary max-w-[150px] rotate-[15deg] text-sm font-semibold md:rotate-[20deg] md:text-xl">
              {t("bubble1")}
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, marginTop: -500, rotate: 0 }}
            whileInView={{
              opacity: 1,
              marginTop: 0,
              rotate: window.innerWidth <= 768 ? -25 : 22,
            }}
            transition={{ duration: 1, delay: 0.4 }}
            viewport={{ once: true }}
            className="border-primary col-start-1 col-end-4 row-start-3 row-end-7 flex h-full w-full items-center justify-center rounded-full border-[3px] text-center md:col-start-2 md:col-end-5 md:row-start-2 md:row-end-3 md:h-full md:w-[420px]"
          >
            <p className="text-primary max-w-[250px] rotate-[22deg] text-center text-sm font-semibold md:-rotate-[22deg] md:text-xl">
              {t("bubble2")}
            </p>
          </motion.div>
          <motion.div
            initial={{
              opacity: 0,
              marginTop: window.innerWidth <= 768 ? "-20rem" : "-40rem",
            }}
            whileInView={{
              opacity: 1,
              marginTop: window.innerWidth <= 768 ? "0rem" : "-2rem",
            }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="border-primary col-start-4 col-end-7 row-start-3 row-end-7 -mt-8 flex h-full w-full -rotate-10 items-center justify-center rounded-full border-[3px] text-center md:col-start-1 md:col-end-4 md:row-start-3 md:row-end-4 md:w-[420px] md:rotate-0"
          >
            <p className="text-primary max-w-[200px] rotate-10 text-sm font-semibold md:rotate-0 md:text-xl">
              {t("bubble3")}
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, marginTop: -600, rotate: 0 }}
            whileInView={{
              opacity: 1,
              marginTop: window.innerWidth <= 768 ? -40 : 0,
              rotate: window.innerWidth <= 768 ? 0 : -15,
            }}
            transition={{ duration: 1, delay: 0.2 }}
            viewport={{ once: true }}
            className="border-primary col-start-1 col-end-6 row-start-7 row-end-9 flex h-full w-full items-center justify-center rounded-full border-[3px] text-center md:col-start-5 md:col-end-7 md:row-start-2 md:row-end-4 md:h-[420px] md:origin-right"
          >
            <p className="text-primary max-w-[150px] text-sm font-semibold md:rotate-[15deg] md:text-xl">
              {t("bubble4")}
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default WhySection
