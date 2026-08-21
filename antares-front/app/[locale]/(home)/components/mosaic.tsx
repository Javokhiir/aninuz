"use client"

import { useRef } from "react"
import { motion, MotionValue, useScroll, useTransform } from "framer-motion"
import { useTranslations } from "next-intl"

/**
 * Scroll-scrubbed mosaic — the landing page's centre-piece.
 *
 * A single full-bleed video contracts into the middle cell of a product grid as
 * you scroll. The surrounding cards are always mounted but parked off-frame;
 * they slide into their slots on the same scroll range, so the whole grid reads
 * as one plate resolving rather than a set of elements animating in.
 *
 * Everything below is driven by one `scrollYProgress`. Keeping a single source
 * means the cards can never drift out of sync with the centre card or the text.
 */

type Satellite = {
  src: string
  poster: string
  /** Resting position, in viewport units, measured from the centre of the stage. */
  x: number
  y: number
  w: number
  h: number
  /** How far outside its slot the card starts, as a multiplier on x/y. */
  from: number
}

/** Cards are matched to the aspect of their footage: the two tall flanking
 *  cards take the portrait site videos, the four short cards take the
 *  landscape studio clips. Nothing gets stretched to fill a slot it doesn't
 *  fit. */
const SATELLITES: Satellite[] = [
  {
    src: "/gallery/fifth.mp4",
    poster: "/images/posters/fifth.jpg",
    x: -40,
    y: 0,
    w: 20,
    h: 62,
    from: 1.9,
  },
  {
    src: "/gallery/fourth.mp4",
    poster: "/images/posters/fourth.jpg",
    x: 40,
    y: 0,
    w: 20,
    h: 62,
    from: 1.9,
  },
  {
    src: "/videos/categories/metallic-gaskets.webm",
    poster: "/images/posters/metallic-gaskets.jpg",
    x: -22,
    y: -42,
    w: 26,
    h: 20,
    from: 2.4,
  },
  {
    src: "/videos/categories/graphite-moulded-products.webm",
    poster: "/images/posters/graphite-moulded-products.jpg",
    x: 22,
    y: -42,
    w: 26,
    h: 20,
    from: 2.4,
  },
  {
    src: "/videos/categories/flange-joint-gaskets.webm",
    poster: "/images/posters/flange-joint-gaskets.jpg",
    x: -22,
    y: 42,
    w: 26,
    h: 20,
    from: 2.4,
  },
  {
    src: "/videos/categories/wiping-pad.webm",
    poster: "/images/posters/wiping-pad.jpg",
    x: 22,
    y: 42,
    w: 26,
    h: 20,
    from: 2.4,
  },
]

const MosaicSection = () => {
  const t = useTranslations("home.mosaic")
  const ref = useRef<HTMLElement>(null)

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  })

  // The grid resolves over the first 55% of the section; the rest is dwell time
  // so the finished mosaic stays on screen while the last statement reads.
  const width = useTransform(scrollYProgress, [0, 0.55], ["100vw", "56vw"])
  const height = useTransform(scrollYProgress, [0, 0.55], ["100svh", "62svh"])
  const radius = useTransform(scrollYProgress, [0, 0.55], ["0px", "20px"])
  const stageScale = useTransform(scrollYProgress, [0.85, 1], [1, 0.94])
  const stageOpacity = useTransform(scrollYProgress, [0.9, 1], [1, 0.4])
  // Follows the two statement windows so the darkening only exists while there
  // is type to carry.
  const statementScrim = useTransform(
    scrollYProgress,
    [0.04, 0.12, 0.42, 0.5, 0.86, 0.94],
    [0, 1, 1, 1, 1, 0]
  )

  const statements = [
    [t("statement1Line1"), t("statement1Line2")],
    [t("statement2Line1"), t("statement2Line2")],
  ]

  return (
    <section id="mosaic" ref={ref} className="relative h-[420vh] w-full">
      <div className="bg-ink sticky top-0 h-svh w-full overflow-hidden">
        <motion.div
          style={{ scale: stageScale, opacity: stageOpacity }}
          className="absolute inset-0 flex items-center justify-center"
        >
          {SATELLITES.map((s) => (
            <SatelliteCard
              key={s.src}
              satellite={s}
              progress={scrollYProgress}
            />
          ))}

          <motion.div
            style={{ width, height, borderRadius: radius }}
            className="relative z-10 min-h-[54svh] min-w-[88vw] overflow-hidden will-change-transform md:min-h-0 md:min-w-0"
          >
            <video
              className="h-full w-full object-cover"
              src="/videos/categories/compression-packings.webm"
              poster="/images/posters/compression-packings.jpg"
              autoPlay
              muted
              loop
              playsInline
              preload="none"
            />
            <div className="absolute inset-0 bg-black/45" />
          </motion.div>
        </motion.div>

        {/* Statements sit above the whole stage so they stay legible once the
            centre card has shrunk away from them. The pool travels with them so
            the type keeps its footing over a pale product shot as easily as
            over dark site footage. */}
        <motion.div
          style={{ opacity: statementScrim }}
          className="pointer-events-none absolute inset-0 z-[15]"
        >
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse 55% 45% at 50% 50%, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.25) 60%, rgba(0,0,0,0) 100%)",
            }}
          />
        </motion.div>

        <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center px-5">
          {statements.map((lines, i) => (
            <Statement
              key={i}
              lines={lines}
              progress={scrollYProgress}
              range={[0.06 + i * 0.42, 0.44 + i * 0.46]}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

function SatelliteCard({
  satellite,
  progress,
}: {
  satellite: Satellite
  progress: MotionValue<number>
}) {
  const { src, poster, x, y, w, h, from } = satellite

  // Cards start further out than their slot and settle in over the same window
  // the centre card shrinks in, trailing it slightly.
  const tx = useTransform(progress, [0.1, 0.6], [`${x * from}vw`, `${x}vw`])
  const ty = useTransform(progress, [0.1, 0.6], [`${y * from}svh`, `${y}svh`])
  const opacity = useTransform(progress, [0.12, 0.32], [0, 1])

  return (
    <motion.div
      style={{
        x: tx,
        y: ty,
        opacity,
        width: `${w}vw`,
        height: `${h}svh`,
        borderRadius: "20px",
      }}
      className="absolute hidden overflow-hidden will-change-transform md:block"
    >
      <video
        className="h-full w-full object-cover"
        src={src}
        poster={poster}
        autoPlay
        muted
        loop
        playsInline
        preload="none"
      />
    </motion.div>
  )
}

function Statement({
  lines,
  progress,
  range,
}: {
  lines: string[]
  progress: MotionValue<number>
  range: [number, number]
}) {
  const [start, end] = range
  const mid = (start + end) / 2

  const opacity = useTransform(progress, [start, mid, end], [0, 1, 0])
  const y = useTransform(progress, [start, end], ["5vh", "-5vh"])

  return (
    <motion.h2
      style={{ opacity, y }}
      className="rtitle rtitle-xlarge absolute max-w-[16ch] text-center text-white will-change-transform"
    >
      {lines.map((line) => (
        <span key={line} className="block">
          {line}
        </span>
      ))}
    </motion.h2>
  )
}

export default MosaicSection
