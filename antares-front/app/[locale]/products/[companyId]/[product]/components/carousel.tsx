"use client"

import Image from "next/image"

import { Product } from "@/types/models/product"
import {
  Carousel,
  CarouselContent,
  CarouselIndicator,
  CarouselItem,
} from "@/components/ui/product-carousel"

const ProductImageCarousel = ({
  images,
  title,
}: {
  images: Product["images"]
  title: string
}) => {
  // Products imported without media still need to fill the column, otherwise the
  // two-column layout collapses to a lone text block.
  if (!images || images.length === 0) {
    return (
      <div className="flex aspect-square max-h-[420px] w-full items-center justify-center rounded-lg border border-[var(--card-border)] bg-[var(--card-bg)]">
        <span className="text-8xl font-bold text-white/10 uppercase">
          {title?.charAt(0)}
        </span>
      </div>
    )
  }

  return (
    <div className="relative w-full overflow-hidden rounded-lg border border-[var(--card-border)] bg-[var(--card-bg)]">
      <Carousel
        key={images.map((img) => img.id).join("-")}
        className="flex flex-row gap-0"
      >
        <CarouselContent>
          {images.map((image) => (
            <CarouselItem key={image.id}>
              <Image
                src={image.url_webp || image.url}
                draggable={false}
                width={800}
                height={800}
                alt={title}
                className="aspect-square max-h-[420px] w-full object-contain p-8"
              />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselIndicator
          className="right-0"
          style={{ backgroundColor: "var(--accent)" }}
        />
      </Carousel>
    </div>
  )
}

export default ProductImageCarousel
