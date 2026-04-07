"use client"

import React, { useEffect, useState } from "react"
import Image from "next/image"
import { Link, usePathname } from "@/i18n/routing"
import { useCartStore } from "@/states/store"
import { motion } from "framer-motion"
import { ChevronDown, Home, Layout, Phone, User } from "lucide-react"
import { useTranslations } from "next-intl"

import { cn } from "@/lib/utils"
import { useMounted } from "@/hooks/useMouted"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Icons } from "@/components/icons"

import { LangSwitcher } from "../langSwitcher"
import { Button } from "../ui/button"
import SearchModal from "./searchModal"

interface NavBarProps {
  className?: string
}

export function NavBar({ className }: NavBarProps) {
  const mounted = useMounted()

  const pathname = usePathname()

  const totalItems = useCartStore((state) => state.totalItems())

  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("")
  const [active, setActive] = useState(false)

  const t = useTranslations("nav")

  const serviceItems = [
    { name: t("catalog"), url: "/catalog", icon: Layout },
    { name: t("certificates"), url: "/certificates", icon: Layout },
    { name: t("events"), url: "/events", icon: Layout },
    { name: t("gallery"), url: "/gallery", icon: Layout },
  ]

  const items = [
    { name: t("home"), url: "/", icon: Home },
    { name: t("products"), url: "/products", icon: Layout },
    { name: t("childServices"), url: "/services", icon: Layout },
    { name: t("about"), url: "/about", icon: User },
    { name: t("contact"), url: "/contacts", icon: Phone },
    {
      name: t("services"),
      url: "/service",
      icon: Layout,
      children: serviceItems,
    },
  ]

  useEffect(() => {
    let activeTab = null

    const directMatch = items.find((item) => item.url === pathname)
    if (directMatch) {
      activeTab = directMatch
    } else {
      const serviceItem = items.find((item) =>
        item.children?.some((child) => child.url === pathname)
      )
      if (serviceItem) {
        activeTab = serviceItem
      } else if (pathname.startsWith("/products")) {
        activeTab = items.find((item) => item.url === "/products")
      }
    }

    if (activeTab) {
      setActiveTab(activeTab.url)
    } else {
      setActiveTab("")
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname])

  return (
    <nav
      className={cn(
        "fixed left-1/2 z-50 mx-auto mb-6 w-full -translate-x-1/2 sm:top-0 lg:pt-6",
        className
      )}
    >
      <div className="mx-auto flex h-[60px] w-full max-w-[1400px] items-center justify-between bg-white p-1 px-4 shadow-[0px_0px_12px_6px_rgba(167,183,236,0.1)] md:h-full md:rounded-xl lg:bg-white/50 lg:backdrop-blur-sm">
        <Link href="/" className="md:w-[120px]">
          <Image
            src="/logos/logo-no-text.png"
            alt="logo"
            className="block md:hidden"
            width={40}
            height={80}
          />
          <Image
            src="/logos/logo-with-text.png"
            alt="logo"
            className="hidden h-10 md:block"
            width={500}
            height={50}
          />
        </Link>

        <div className="hidden h-14 w-full items-center gap-3 border border-none md:w-fit lg:flex">
          {items.map((item) => {
            const Icon = item.icon
            const isActive = activeTab === item.url

            return item.children ? (
              <div
                key={item.name}
                onMouseEnter={item.children ? () => setActive(true) : undefined}
                className={cn(
                  `group relative w-fit cursor-pointer rounded-full px-6 py-2 text-sm font-semibold transition-colors md:text-base`,
                  `text-foreground/80 hover:text-primary`,
                  isActive && `text-primary`
                )}
              >
                <span className="hidden items-center gap-2 text-nowrap md:flex">
                  {item.name}{" "}
                  {item.children && (
                    <ChevronDown
                      className={`transition-transform duration-300 group-hover:rotate-180`}
                    />
                  )}
                </span>
                <span className="md:hidden">
                  <Icon size={18} strokeWidth={2.5} />
                </span>
                {active !== null && (
                  <div
                    onMouseLeave={() => setActive(false)}
                    className={`${item.children ? "opacity-100" : "opacity-0"} transition-all duration-200`}
                  >
                    {active === true && (
                      <div className="absolute top-[calc(100%_+_1.2rem)] left-1/2 -mt-12 flex -translate-x-1/2 transform flex-col justify-end pt-12">
                        <div className="rounded-2xl border-black/[0.2] bg-white not-even:shadow-[0px_0px_10px_-5px_rgba(28,60,173,0.5)]">
                          <div className="flex h-full w-max flex-col p-4">
                            {serviceItems.map((item) => {
                              return (
                                <Link
                                  key={item.name}
                                  href={item.url}
                                  className={cn(
                                    `hover:bg-primary/5 group/group-b flex w-full cursor-pointer items-center rounded-full px-6 py-2 text-sm font-semibold transition-colors md:text-base`,
                                    `text-foreground/80 hover:text-primary`
                                  )}
                                >
                                  <div
                                    className={`bg-primary absolute -left-1 z-5 h-10 w-1 rounded-l-full opacity-0 shadow-[10px_0px_20px_2px_rgba(28,60,173,0.5)] transition-all duration-300 group-hover/group-b:opacity-100`}
                                  />
                                  <span className="relative z-20 hidden md:inline">
                                    {item.name}
                                  </span>
                                </Link>
                              )
                            })}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
                {isActive && (
                  <motion.div
                    layoutId="lamp"
                    className={`bg-primary/5 absolute inset-0 -z-10 w-full rounded-full`}
                    initial={false}
                    transition={{
                      type: "spring",
                      stiffness: 300,
                      damping: 30,
                    }}
                  >
                    <div
                      className={`bg-primary absolute -top-4 left-1/2 h-1 w-10 -translate-x-1/2 rounded-t-full`}
                    >
                      <div
                        className={`bg-primary/20 absolute -top-2 -left-2 h-6 w-12 rounded-full blur-md`}
                      />
                      <div
                        className={`bg-primary/20 absolute -top-1 h-6 w-8 rounded-full blur-md`}
                      />
                      <div
                        className={`bg-primary/20 absolute top-0 left-2 h-4 w-4 rounded-full blur-sm`}
                      />
                    </div>
                  </motion.div>
                )}
              </div>
            ) : (
              <Link
                key={item.name}
                href={item.url}
                onClick={() => setActiveTab(item.url)}
                onMouseEnter={item.children ? () => setActive(true) : undefined}
                className={cn(
                  "group relative w-fit cursor-pointer rounded-full px-6 py-2 text-sm font-semibold transition-colors md:text-base",
                  `text-foreground/80 hover:text-primary`,
                  isActive && `text-primary`
                )}
              >
                <span className="hidden items-center gap-2 text-nowrap md:flex">
                  {item.name}
                </span>
                {isActive && (
                  <motion.div
                    layoutId="lamp"
                    className={`bg-primary/5 absolute inset-0 -z-10 w-full rounded-full`}
                    initial={false}
                    transition={{
                      type: "spring",
                      stiffness: 300,
                      damping: 30,
                    }}
                  >
                    <div
                      className={`bg-primary absolute -top-4 left-1/2 h-1 w-10 -translate-x-1/2 rounded-t-full`}
                    >
                      <div
                        className={`bg-primary/20 absolute -top-2 -left-2 h-6 w-12 rounded-full blur-md`}
                      />
                      <div
                        className={`bg-primary/20 absolute -top-1 h-6 w-8 rounded-full blur-md`}
                      />
                      <div
                        className={`bg-primary/20 absolute top-0 left-2 h-4 w-4 rounded-full blur-sm`}
                      />
                    </div>
                  </motion.div>
                )}
              </Link>
            )
          })}
        </div>
        <div className="hidden w-fit items-center gap-6 lg:flex">
          <SearchModal />
          <Link
            href="/cart"
            className={`border-primary group hover:bg-primary relative flex rounded-sm border-[2px] p-2 ${pathname === "/cart" ? `bg-primary text-white` : `text-primary bg-transparent`}`}
          >
            <Icons.ShoppingCart
              className={`text-primary h-6 w-6 group-hover:text-white ${pathname === "/cart" ? `text-white` : ""}`}
            />
            {mounted ? (
              <small
                className={`text-primary border-primary ${totalItems === 0 && "hidden"} absolute top-0 right-0 flex h-7 w-7 translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 bg-white text-xs font-bold`}
              >
                {totalItems > 99 ? "99+" : totalItems}
              </small>
            ) : null}
          </Link>

          <LangSwitcher className="bg-primary text-primary-foreground h-12 p-4 font-semibold shadow-[inset_0px_1px_4px_5px_rgba(255,255,255,0.1),0px_15px_10px_-6px_hsla(227,72%,39%,0.3)]" />
        </div>

        {/* Mobile */}
        <Button
          className="relative flex h-10 w-10 flex-col items-center justify-center bg-white shadow-none hover:bg-transparent lg:hidden"
          onClick={() => setIsMobileOpen(!isMobileOpen)}
        >
          <span
            className={`transform-all bg-primary absolute h-[3px] w-[40px] rounded-full duration-300 ${
              isMobileOpen ? "top-[18px] rotate-45" : "top-3.5"
            }`}
          />

          <span
            className={`transform-all bg-primary absolute h-[3px] w-[40px] rounded-full duration-300 ${
              isMobileOpen ? "bottom-[19px] -rotate-45" : "bottom-3.5"
            }`}
          />
        </Button>
        <div
          className={`transform-all rotate-l-2xl fixed top-0 left-0 z-50 h-[calc(100svh-59px)] w-screen duration-300 lg:hidden ${
            isMobileOpen ? "translate-y-[59px]" : "-translate-y-[100%]"
          }`}
        >
          <div className="h-full p-5">
            <div className="flex h-full flex-col gap-10 rounded-[24px] bg-white/50 px-10 py-5 backdrop-blur-md">
              <div className="flex h-full w-full flex-col items-center justify-center gap-2">
                {items.map((item) =>
                  item.children ? (
                    <Accordion
                      type="single"
                      className="w-full py-0"
                      collapsible
                      key={item.name}
                    >
                      <AccordionItem
                        value="item-1"
                        className="flex flex-col gap-4"
                      >
                        <AccordionTrigger
                          className={cn(
                            "text-primary mx-auto flex w-full cursor-pointer items-center justify-center rounded-full px-6 py-2 text-center text-3xl font-bold uppercase"
                          )}
                        >
                          {item.name}
                        </AccordionTrigger>

                        <AccordionContent className="flex flex-col gap-1 pb-0">
                          {item.children.map((child) => (
                            <Link
                              href={child.url}
                              key={child.name}
                              onClick={() => setIsMobileOpen(false)}
                              className={cn(
                                "text-primary mx-auto flex w-full cursor-pointer items-center justify-center rounded-full px-6 text-center text-xl font-bold uppercase"
                              )}
                            >
                              {child.name}
                            </Link>
                          ))}
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  ) : (
                    <Link
                      href={item.url}
                      key={item.name}
                      onClick={() => setIsMobileOpen(false)}
                      className={cn(
                        "text-primary mx-auto flex w-full cursor-pointer items-center justify-center rounded-full px-6 py-1 text-center text-3xl font-bold uppercase"
                      )}
                    >
                      {item.name}
                    </Link>
                  )
                )}
              </div>
              <div className="flex items-center justify-center gap-10">
                <SearchModal setIsMobileOpen={setIsMobileOpen} />
                <Link
                  href="/cart"
                  onClick={() => setIsMobileOpen(false)}
                  className="text-pimary border-primary group hover:bg-primary flex rounded-sm border-[2px] p-2"
                >
                  <Icons.ShoppingCart className="text-primary h-6 w-6 group-hover:text-white" />
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="md:w-[120px] lg:hidden">
          <LangSwitcher className="bg-primary text-primary-foreground ml-auto h-12 p-4 font-semibold shadow-[inset_0px_1px_4px_5px_rgba(255,255,255,0.1),0px_15px_10px_-6px_hsla(227,72%,39%,0.3)]" />
        </div>
      </div>
    </nav>
  )
}
