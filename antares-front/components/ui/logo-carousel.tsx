"use client"

import { useCallback, useEffect, useState } from "react"
import Image from "next/image"
import { AnimatePresence, motion } from "framer-motion"

interface Logo {
  id: number
  name: string
  src: string
}

interface LogoColumnProps {
  logos: Logo[]
  columnIndex: number
  currentTime: number
}

function LogoColumn({ logos, columnIndex, currentTime }: LogoColumnProps) {
  const CYCLE_DURATION = 4000
  const columnDelay = columnIndex * 400
  const adjustedTime =
    (currentTime + columnDelay) % (CYCLE_DURATION * logos.length)
  const currentIndex = Math.floor(adjustedTime / CYCLE_DURATION)
  const currentLogo = logos[currentIndex]

  return (
    <motion.div
      className="relative h-14 w-24 overflow-hidden md:h-24 md:w-48"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        delay: columnIndex * 0.1,
        duration: 0.5,
        ease: "easeOut",
      }}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={`${currentLogo.id}-${currentIndex}`}
          className="absolute inset-0 flex items-center justify-center"
          initial={{ y: "10%", opacity: 0 }}
          animate={{
            y: "0%",
            opacity: 1,
            transition: {
              type: "spring",
              stiffness: 300,
              damping: 20,
            },
          }}
          exit={{
            y: "-20%",
            opacity: 0,
            transition: { duration: 0.7 },
          }}
        >
          <Image
            src={currentLogo.src}
            alt={currentLogo.name}
            width={120}
            height={40}
            className="h-auto max-h-[80%] w-auto max-w-[80%] object-contain"
          />
        </motion.div>
      </AnimatePresence>
    </motion.div>
  )
}

interface LogoCarouselProps {
  columns?: number
  logos: Logo[]
}

export function LogoCarousel({ columns = 2, logos }: LogoCarouselProps) {
  const [logoColumns, setLogoColumns] = useState<Logo[][]>([])
  const [time, setTime] = useState(0)

  const distributeLogos = useCallback(
    (logos: Logo[]) => {
      const shuffled = [...logos].sort(() => Math.random() - 0.5)
      const result: Logo[][] = Array.from({ length: columns }, () => [])

      shuffled.forEach((logo, index) => {
        result[index % columns].push(logo)
      })

      const maxLength = Math.max(...result.map((col) => col.length))
      result.forEach((col) => {
        while (col.length < maxLength) {
          col.push(shuffled[Math.floor(Math.random() * shuffled.length)])
        }
      })

      return result
    },
    [columns]
  )

  useEffect(() => {
    setLogoColumns(distributeLogos(logos))
  }, [logos, distributeLogos])

  useEffect(() => {
    const interval = setInterval(() => {
      setTime((prev) => prev + 200)
    }, 200)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="flex w-full justify-center gap-5 py-8 md:justify-between md:gap-4">
      {logoColumns.map((columnLogos, index) => (
        <LogoColumn
          key={index}
          logos={columnLogos}
          columnIndex={index}
          currentTime={time}
        />
      ))}
    </div>
  )
}
