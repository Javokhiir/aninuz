"use client"

import React from "react"
import Image from "next/image"
import { useTranslations } from "next-intl"

import { Card, CardContent } from "@/components/ui/card"
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { Icons } from "@/components/icons"

const images = [
  {
    id: 1,
    type: "image",
    src: "/gallery/first.jpg",
  },
  {
    id: 2,
    type: "image",
    src: "/gallery/second.jpg",
  },
  {
    id: 3,
    type: "video",
    src: "/gallery/third.mp4",
  },
  {
    id: 4,
    type: "video",
    src: "/gallery/fourth.mp4",
  },
  {
    id: 5,
    type: "video",
    src: "/gallery/fifth.mp4",
  },
  {
    id: 6,
    type: "video",
    src: "/gallery/sixth.mp4",
  },
]

const Gallery = () => {
  const [api, setApi] = React.useState<CarouselApi>();
  const [current, setCurrent] = React.useState(0)
  const [count, setCount] = React.useState(0)
  const t = useTranslations("gallery");

  React.useEffect(() => {
    if (!api) {
      return
    }

    setCount(api.scrollSnapList().length)
    setCurrent(api.selectedScrollSnap() + 1)
 
    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1)
    });
    console.log(current, count);
  }, [api, current, count])
  
  return (
    <div className="space-y-10">
      <div className="layout-container">
        <h1 className="mx-auto max-w-[1200px] bg-gradient-to-r from-black via-blue-700 to-black bg-clip-text text-center font-extrabold text-transparent uppercase md:p-10">
          {t("title")}
        </h1>
        <p className="mx-auto max-w-[500px] text-center">{t("subtitle")}</p>
      </div>
      <Carousel setApi={setApi} className="w-full">
        <CarouselContent className="">
          {images.map((image, index) => (
            <CarouselItem
              key={index}
              className={`mt-auto basis-2/3 sm:basis-1/2 md:basis-1/3 lg:basis-2/9 ${image.id === 1 ? "ml-10" : image.id === images.length ? "pr-10" : ""}`}
            >
              <Card className="overflow-clip rounded-2xl p-0">
                <CardContent className="flex aspect-square items-center justify-center p-0">
                  {image.type === "image" ? (
                    <Image
                      width={500}
                      height={500}
                      src={image.src}
                      alt="gallery"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <video
                      src={image.src}
                      className="h-full w-full object-cover"
                      controls
                      loop
                      muted
                      autoPlay
                    />
                  )}
                </CardContent>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        <div className="relative z-[20] mx-auto flex items-center justify-center space-x-2 py-10">
          <CarouselPrevious className={`transform-all hover:bg-primary/90 relative left-0 ${current === 1 ? "w-[55px] border border-primary text-primary" : "w-[85px] bg-primary text-white" } h-[50px] translate-x-0 cursor-pointer rounded-lg duration-300 hover:scale-105 hover:text-white`}>
            <Icons.ArrowLeft className="h-12 w-12" />
          </CarouselPrevious>
          <CarouselNext className={`transform-all hover:bg-primary/90 relative right-0 ${current === count ? "w-[55px] border border-primary text-primary" : "w-[85px] bg-primary text-white" } h-[50px] cursor-pointer rounded-lg duration-300 hover:scale-105 hover:text-white`}>
            <Icons.ArrowRight className="h-12 w-12" />
          </CarouselNext>
        </div>
      </Carousel>

      <div className="layout-container flex w-full flex-col justify-between gap-5 py-0 md:flex-row md:gap-10">
        <h2 className="mx-auto max-w-[450px] bg-gradient-to-r from-black via-blue-700 to-black bg-clip-text text-center font-extrabold text-transparent md:mx-0 md:text-start lg:text-4xl">
          {t("individual")}
        </h2>

        <div className="space-y-2">
          <Icons.Quote className="text-primary mx-auto h-6 w-6 md:mx-0" />
          <p className="mx-auto max-w-[600px] text-center text-lg uppercase md:mx-0 md:text-start">
            {t("quote")}
          </p>
        </div>
      </div>
    </div>
  )
}

export default Gallery
