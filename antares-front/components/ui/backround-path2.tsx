"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"

import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel"
import SpecialButton from "@/components/ui/special-button"
import { SpinningText } from "@/components/ui/spinning-text"
import { Icons } from "@/components/icons"

function FloatingPaths({ position }: { position: number }) {
  const paths = Array.from({ length: 36 }, (_, i) => ({
    id: i,
    d: `M-${380 - i * 5 * position} -${189 + i * 6}C-${
      380 - i * 5 * position
    } -${189 + i * 6} -${312 - i * 5 * position} ${216 - i * 6} ${
      152 - i * 5 * position
    } ${343 - i * 6}C${616 - i * 5 * position} ${470 - i * 6} ${
      684 - i * 5 * position
    } ${875 - i * 6} ${684 - i * 5 * position} ${875 - i * 6}`,
    color: `rgba(15,23,42,${0.1 + i * 0.03})`,
    width: 0.5 + i * 0.03,
  }))

  return (
    <div className="pointer-events-none absolute inset-0">
      <svg
        className="text-primary h-full w-full dark:text-white"
        viewBox="0 0 696 316"
        fill="none"
      >
        {paths.map((path) => (
          <motion.path
            key={path.id}
            d={path.d}
            stroke="currentColor"
            strokeWidth={path.width}
            strokeOpacity={0.1 + path.id * 0.03}
            initial={{ pathLength: 0.3, opacity: 0.6 }}
            animate={{
              pathLength: 1,
              opacity: [0.3, 0.6, 0.3],
              pathOffset: [0, 1, 0],
            }}
            transition={{
              duration: 20 + Math.random() * 10,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
            }}
          />
        ))}
      </svg>
    </div>
  )
}

export function BackgroundPaths() {
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % 3)
    }, 3000)

    return () => clearInterval(interval)
  }, [])
  const renderCarouselItem = (activeIndex: number) => (
    <CarouselItem className="flex h-[60px] items-center gap-2">
      <div className="flex flex-col items-center gap-1">
        {[0, 1, 2].map((index) => (
          <div
            key={index + 1}
            style={{
              height: index === activeIndex ? 25 : 15,
              width: index === activeIndex ? 4 : 3,
            }}
            className={`rounded-full ${index === activeIndex ? "bg-primary" : "bg-primary/50"}`}
          />
        ))}
      </div>

      <p className="max-w-[250px] rounded-xl p-5 text-left">
        Надежные поставки оборудования и запчастей
      </p>
    </CarouselItem>
  )
  return (
    <div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-white md:min-h-[calc(100vh-90px)] dark:bg-neutral-950">
      <div className="absolute inset-0">
        <FloatingPaths position={1} />
        <FloatingPaths position={-1} />
      </div>

      <div className="relative z-10 container mx-auto px-4 text-center md:px-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2 }}
          className="mx-auto"
        >
          <div className="relative mx-auto max-w-[1400px] space-y-5 px-5 md:space-y-10 md:px-0">
            <h1 className="mx-auto bg-gradient-to-r from-black via-blue-700 to-black bg-clip-text text-center font-extrabold text-transparent uppercase md:leading-[80px]">
              Мы знаем, как <br className="md:hidden" /> важна
              <br className="hidden md:inline" /> каждая деталь
            </h1>
            <p className="mt-10 text-center text-sm md:mt-0 md:text-lg">
              Критически важные компоненты для вашего бизнеса: оперативная
              доставка, <br /> проверенные решения, гарантированное качество
            </p>
            <Link href="/products">
              <SpecialButton className="mx-auto hidden md:flex">
                Перейти в каталог
              </SpecialButton>
            </Link>

            <div
              className="absolute top-20 left-0 flex h-[70px] w-[70px] items-center justify-center bg-contain bg-no-repeat md:h-[100px] md:w-[100px] md:translate-x-full lg:h-[120px] lg:w-[120px]"
              style={{ backgroundImage: "url('/images/badge.svg') " }}
            >
              <Icons.ArrowRight className="absolute max-w-[15px] -rotate-[30deg] text-white md:max-w-[18px] lg:max-w-[25px]" />
              <SpinningText
                radius={
                  window.innerWidth < 768
                    ? 4
                    : window.innerWidth < 1024
                      ? 4.25
                      : 4.5
                }
                fontSize={
                  window.innerWidth < 768
                    ? 0.5
                    : window.innerWidth < 1024
                      ? 0.7
                      : 0.8
                }
                className="text-xs leading-none font-medium text-white"
              >
                {`Оборудование • будущего • `}
              </SpinningText>
            </div>

            <div className="flex w-full flex-col justify-between md:flex-row">
              <div className="order-2 w-max space-y-2 self-end md:order-1 md:space-y-5 md:self-start">
                <div>
                  <h1 className="mb-2 ml-auto w-max bg-gradient-to-r from-black via-blue-700 to-black bg-clip-text text-end font-extrabold text-transparent uppercase md:ml-0 md:text-start md:leading-[80px]">
                    100+
                  </h1>
                  <p className="text-primary text-end text-xs md:text-start md:text-sm">
                    Инвестиционных <br /> инструментов
                  </p>
                </div>
                <p className="max-w-[200px] text-end text-sm md:max-w-[300px] md:text-start md:text-base">
                  Достигайте целей с нашей инновационной платформой
                </p>
              </div>

              <Carousel
                className="order-1 h-max w-max rounded-xl border text-xs backdrop-blur-sm md:order-2"
                orientation="vertical"
              >
                <CarouselContent
                  className="h-[90px] text-xs md:h-[120px] md:text-base"
                  style={{
                    transform: `translateY(-${currentIndex * 100}%)`,
                    transition: "transform 0.5s ease-in-out",
                  }}
                >
                  {[0, 1, 2].map((index) => renderCarouselItem(index))}
                </CarouselContent>
              </Carousel>
            </div>

            <Link href="/products">
              <SpecialButton className="md:hidden">
                Перейти в каталог
              </SpecialButton>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
