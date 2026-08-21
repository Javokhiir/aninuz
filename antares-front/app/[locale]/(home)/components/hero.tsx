"use client"

import { useRef } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import { useTranslations } from "next-intl"

import { SplitTitle } from "@/components/motion/split-title"

/**
 * Full-bleed opening statement.
 *
 * Deliberately bare: one headline over one macro reel, and a scroll cue. The
 * reference hero carries no subheading, no stat row and no inline button — the
 * action lives in the floating pill that follows the whole page — and adding
 * any of them is what makes a page like this read as a template instead.
 *
 * The reel is a single file (`public/videos/hero/hero-reel.mp4`): four framings
 * of the sealing braid cross-dissolved into one continuous move, cut so the
 * last framing lands back on the first, which makes the loop invisible.
 */
const HeroSection = () => {
  const t = useTranslations("home.hero")
  const ref = useRef<HTMLElement>(null)

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  })

  const videoY = useTransform(scrollYProgress, [0, 1], ["0%", "22%"])
  const plateScale = useTransform(scrollYProgress, [0, 1], [1, 1.12])
  const contentOpacity = useTransform(scrollYProgress, [0, 0.55], [1, 0])
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "40%"])

  return (
    <section
      id="hero"
      ref={ref}
      className="relative -mt-[60px] flex h-svh min-h-[560px] w-full items-center justify-center overflow-hidden md:-mt-[90px]"
    >
      <motion.div
        style={{ y: videoY, scale: plateScale }}
        className="absolute inset-0 will-change-transform"
      >
        <video
          className="h-full w-full object-cover"
          src="/videos/hero/hero-reel.mp4"
          poster="/images/posters/hero-reel.jpg"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
        />
        {/* The braid is near-white, so white type needs a real scrim to sit on.
            A vertical gradient anchors the chrome top and bottom; a centred
            pool darkens only where the headline lands. */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/25 to-black/55" />
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 65% 50% at 50% 50%, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0.2) 60%, rgba(0,0,0,0) 100%)",
          }}
        />
      </motion.div>

      <motion.div
        style={{ opacity: contentOpacity, y: contentY }}
        className="rcontainer relative z-10 text-center"
      >
        <SplitTitle
          as="h1"
          text={t("title")}
          className="rtitle rtitle-xlarge mx-auto max-w-[22ch] text-white"
          trigger="mount"
          delay={0.2}
        />
      </motion.div>

      <ScrollHint label={t("scrollHint")} />
    </section>
  )
}

/**
 * Bottom-right scroll affordance. A dot falls inside a capsule and resets, so
 * it reads as a hint rather than an arrow the user might try to click.
 */
function ScrollHint({ label }: { label: string }) {
  return (
    <motion.div
      className="absolute right-10 bottom-[52px] z-[80] flex items-center gap-3 text-white/85"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1.6, duration: 0.8 }}
    >
      <span className="flex h-6 w-4 items-start justify-center rounded-full border border-white/50 pt-1">
        <motion.span
          className="block size-1 rounded-full bg-white"
          animate={{ y: [0, 8, 0], opacity: [1, 0, 1] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
        />
      </span>
      <span className="text-[15px]">{label}</span>
    </motion.div>
  )
}

export default HeroSection
