import Image from "next/image"

interface Logo {
  id: number
  name: string
  src: string
}

interface LogoCarouselProps {
  logos: Logo[]
}

export function LogoCarousel({ logos }: LogoCarouselProps) {
  return (
    <div className="grid w-full grid-cols-3 place-items-center gap-5 py-8 md:grid-cols-5 md:gap-4">
      {logos.map((logo) => (
        <div
          key={logo.id}
          className="flex h-14 w-24 items-center justify-center md:h-24 md:w-48"
        >
          <Image
            src={logo.src}
            alt={logo.name}
            width={120}
            height={40}
            loading="lazy"
            sizes="(max-width: 767px) 96px, 192px"
            className="h-auto max-h-[80%] w-auto max-w-[80%] object-contain"
          />
        </div>
      ))}
    </div>
  )
}
