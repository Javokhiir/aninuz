"use client"

import { motion, Variants } from "framer-motion"

import { cn } from "@/lib/utils"

const EXPO_OUT = [0.16, 1, 0.3, 1] as const

/**
 * Word-and-character title reveal.
 *
 * The reference site splits each headline into words, then each word into
 * characters, and lifts the characters out from behind the word's own clip box
 * on a tight stagger. Splitting at the word level (rather than clipping the
 * whole line) is what lets a headline wrap naturally while every character
 * still gets its own delay.
 *
 * The stagger is per character across the whole title, so the reveal reads as
 * one continuous sweep left to right rather than word-by-word bursts.
 */

const charVariants: Variants = {
  hidden: { y: "110%" },
  show: { y: "0%" },
}

type SplitTitleProps = {
  text: string
  className?: string
  /** Seconds before the first character moves. */
  delay?: number
  /** Seconds between consecutive characters. */
  stagger?: number
  once?: boolean
  /** `mount` plays immediately — correct for anything above the fold. */
  trigger?: "inView" | "mount"
  as?: "h1" | "h2" | "h3" | "div"
}

export function SplitTitle({
  text,
  className,
  delay = 0,
  stagger = 0.018,
  once = true,
  trigger = "inView",
  as: Tag = "div",
}: SplitTitleProps) {
  const words = text.split(" ")

  // Running index so the stagger is continuous across word boundaries.
  let charIndex = 0

  const play =
    trigger === "mount"
      ? { animate: "show" as const }
      : {
          whileInView: "show" as const,
          // The trigger sits on the word box, which never moves — watching the
          // characters would mean watching boxes parked outside the layout.
          viewport: { once, amount: 0.2 as const },
        }

  return (
    <Tag className={cn("rtitle", className)}>
      {words.map((word, w) => (
        <motion.span
          key={word + w}
          className="inline-block overflow-hidden pb-[0.14em] align-bottom"
          initial="hidden"
          {...play}
        >
          {[...word].map((char) => {
            const i = charIndex++
            return (
              <motion.span
                key={i}
                className="inline-block"
                variants={charVariants}
                transition={{
                  duration: 0.9,
                  ease: EXPO_OUT,
                  delay: delay + i * stagger,
                }}
              >
                {char}
              </motion.span>
            )
          })}
          {/* Real space between words, outside the clip box so it never
              collapses when the characters are translated away. */}
          {w < words.length - 1 && <span className="inline-block">&nbsp;</span>}
        </motion.span>
      ))}
    </Tag>
  )
}

export default SplitTitle
