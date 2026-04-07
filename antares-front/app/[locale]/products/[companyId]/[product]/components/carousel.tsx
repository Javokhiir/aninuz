"use client"

import Image from "next/image"
import { useCompanyColorStore } from "@/states/store"

import { Product } from "@/types/models/product"
// import { hexToRgba } from "@/lib/utils"
import {
  Carousel,
  CarouselContent,
  CarouselIndicator,
  CarouselItem,
} from "@/components/ui/product-carousel"

// import SpecialButton from "@/components/ui/special-button"

const ProductImageCarousel = ({ images }: { images: Product["images"] }) => {
  const { color } = useCompanyColorStore()
  if (!images || images.length === 0) return null
  return (
    <div className="relative order-first mx-auto w-full max-w-[500px] space-y-5 md:order-last md:mx-0">
      <Carousel
        key={images.map((img) => img.id).join("-")}
        className="flex flex-row gap-0"
      >
        <CarouselContent className="">
          {images.map((image) => (
            <CarouselItem key={image.id}>
              <Image
                src={image.url_webp}
                draggable={false}
                width={500}
                height={500}
                alt="product"
                className="h-full w-full rounded-xl object-cover"
              />
            </CarouselItem>
          ))}
        </CarouselContent>

        <CarouselIndicator
          className="right-0"
          style={{ backgroundColor: color }}
        />
      </Carousel>
      {/* <div className="flex items-center justify-center gap-4 md:justify-end">
        <SpecialButton
          style={{
            backgroundColor: color,
            boxShadow: `0px 10px 10px -4px ${hexToRgba(color, 0.4)}`,
          }}
          className="border-primary px-4 font-semibold capitalize md:h-12 md:px-10 md:text-lg"
        >
          скачать описание
        </SpecialButton>
        <SpecialButton
          style={{
            backgroundColor: color,
            boxShadow: `0px 10px 10px -4px ${hexToRgba(color, 0.4)}`,
          }}
          className="border-primary px-4 font-semibold capitalize md:h-12 md:px-10 md:text-lg"
        >
          инструкция
        </SpecialButton>
      </div> */}
    </div>
  )
}

export default ProductImageCarousel
