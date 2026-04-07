"use client"

import { useEffect, useState } from "react"
import { Link } from "@/i18n/routing"
import { useTranslations } from "next-intl"

import { BackgroundPaths } from "@/components/ui/background-path"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel"
import SpecialButton from "@/components/ui/special-button"
import { SpinningText } from "@/components/ui/spinning-text"
import { Icons } from "@/components/icons"

const HeroSection = () => {
  const t = useTranslations("home.hero")
  const [currentIndex, setCurrentIndex] = useState(0)

  const carouselItems = [t("carousel1"), t("carousel2"), t("carousel3")]

  const [width, setWidth] = useState(0)

  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth)
    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % 3)
    }, 3000)

    return () => clearInterval(interval)
  }, [])
  const renderCarouselItem = (carouselIndex: string) => (
    <CarouselItem
      key={carouselIndex}
      className="flex h-[60px] items-center gap-2"
    >
      <p className="max-w-[300px] rounded-xl p-5 text-left">{carouselIndex}</p>
    </CarouselItem>
  )
  return (
    <main className="relative flex flex-col items-center justify-center py-20 md:min-h-screen md:py-0">
      <div className="relative z-[5] mx-auto h-full w-full space-y-5 px-5 md:space-y-10 md:px-0 lg:max-w-[1400px]">
        <div className="relative z-[2] mx-auto space-y-24 md:w-max md:space-y-10">
          <h1 className="mx-auto w-full max-w-[1000px] bg-gradient-to-r from-black via-blue-700 to-black bg-clip-text text-center font-extrabold text-transparent uppercase md:leading-[80px]">
            {t("title")}
          </h1>

          <p className="mx-auto mt-10 max-w-[700px] text-center text-sm md:mt-0 md:text-lg">
            {t("p")}
          </p>
          <div
            className="absolute top-36 left-0 flex h-[70px] w-[70px] items-center justify-center overflow-clip bg-contain bg-no-repeat sm:top-20 md:h-[100px] md:w-[100px] lg:h-[120px] lg:w-[120px] lg:-translate-x-full"
            style={{ backgroundImage: "url('/images/badge.svg') " }}
          >
            <Icons.ArrowRight className="absolute max-w-[15px] -rotate-[30deg] text-white md:max-w-[18px] lg:max-w-[25px]" />
            <SpinningText
              radius={width < 768 ? 4 : width < 1024 ? 4.25 : 4.5}
              fontSize={width < 768 ? 0.5 : width < 1024 ? 0.7 : 0.8}
              className="text-xs leading-none font-medium text-white"
            >
              {t("spinningText")}
            </SpinningText>
          </div>
          <div className="mx-auto w-min">
            <Link href="/products" className="relative z-[2] cursor-pointer">
              <SpecialButton className="mx-auto hidden md:flex">
                {t("goToCatalogBtn")}
              </SpecialButton>
            </Link>
          </div>
        </div>

        <div className="flex w-full flex-col justify-between md:flex-row">
          <div className="order-2 w-max space-y-2 self-end md:order-1 md:space-y-5 md:self-start">
            {/* <div>
              <h1 className="mb-2 ml-auto w-max bg-gradient-to-r from-black via-blue-700 to-black bg-clip-text text-end font-extrabold text-transparent uppercase md:ml-0 md:text-start md:leading-[80px]">
                100+
              </h1>
              <p className="text-primary w-min text-end text-xs md:text-start md:text-sm">
                {t("100Subtitle")}
              </p>
            </div>
            <p className="max-w-[200px] text-end text-sm md:max-w-[300px] md:text-start md:text-base">
              {t("richYourGoal")}
            </p> */}
          </div>

          <Carousel
            className="relative order-1 flex h-max w-max items-center rounded-xl border text-xs backdrop-blur-sm md:order-2"
            orientation="vertical"
          >
            <div className="absolute left-0 flex -translate-x-[200%] flex-col items-center gap-1">
              {[0, 1, 2].map((index) => (
                <div
                  key={index}
                  style={{
                    height: index === currentIndex ? 25 : 15,
                    width: index === currentIndex ? 4 : 3,
                  }}
                  className={`rounded-full transition-all duration-300 ${
                    index === currentIndex ? "bg-primary" : "bg-primary/50"
                  }`}
                />
              ))}
            </div>
            <CarouselContent
              className="h-[90px] text-xs md:h-[120px] md:text-base"
              style={{
                transform: `translateY(-${currentIndex * 100}%)`,
                transition: "transform 0.5s ease-in-out",
              }}
            >
              {carouselItems.map((carousel) => renderCarouselItem(carousel))}
            </CarouselContent>
          </Carousel>
        </div>

        <div className="z-[10] mx-auto w-min">
          <Link href="/products" className="relative">
            <SpecialButton className="mx-auto flex md:hidden">
              {t("goToCatalogBtn")}
            </SpecialButton>
          </Link>
        </div>
      </div>
      <BackgroundPaths />
      <div className="absolute bottom-10 z-[2] h-[10px] w-[100vw] rounded-xl bg-white shadow-[-1px_2px_59px_50px_rgba(255,255,255)]" />
    </main>
  )
}

export default HeroSection
