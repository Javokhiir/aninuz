"use client"

import { motion, Variants } from "framer-motion"

import { cn } from "@/lib/utils"

const EXPO_OUT = [0.16, 1, 0.3, 1] as const

type MaskTextProps = {
  /** One entry per visual line. Each line is clipped and slides up on its own. */
  lines: string[]
  className?: string
  lineClassName?: string
  delay?: number
  /** `false` replays the reveal every time the block re-enters the viewport. */
  once?: boolean
  /**
   * `inView` waits for the block to scroll into frame. `mount` plays straight
   * away — use it for above-the-fold copy, which is already in frame.
   */
  trigger?: "inView" | "mount"
  as?: "h1" | "h2" | "h3" | "p" | "div"
}

const lineVariants: Variants = {
  hidden: { y: "110%" },
  show: { y: "0%" },
}

/**
 * Line-by-line mask reveal: each line rides up from behind its own clip box so
 * the text appears to be uncovered rather than faded in. Lines are passed in
 * explicitly instead of being measured, which keeps the break points identical
 * between server and client render.
 *
 * The viewport trigger lives on the clip box, not on the text inside it. The
 * text starts translated a full line below its slot, so observing the text
 * directly means observing a box that sits outside the layout — which reports
 * intersection unreliably and can leave a heading stuck off-screen. The clip
 * box never moves, so it is the honest thing to watch.
 */
export function MaskText({
  lines,
  className,
  lineClassName,
  delay = 0,
  once = true,
  trigger = "inView",
  as: Tag = "div",
}: MaskTextProps) {
  const play =
    trigger === "mount"
      ? { animate: "show" as const }
      : {
          whileInView: "show" as const,
          viewport: { once, amount: 0.2 as const },
        }

  return (
    <Tag className={className}>
      {lines.map((line, i) => (
        <motion.span
          key={line + i}
          className="block overflow-hidden pb-[0.12em]"
          initial="hidden"
          {...play}
        >
          <motion.span
            className={cn("block", lineClassName)}
            variants={lineVariants}
            transition={{
              duration: 1,
              ease: EXPO_OUT,
              delay: delay + i * 0.09,
            }}
          >
            {line}
          </motion.span>
        </motion.span>
      ))}
    </Tag>
  )
}

/**
 * Softer sibling of MaskText for supporting copy — rises a short distance and
 * fades, so it never competes with the headline it sits under.
 */
export function FadeUp({
  children,
  className,
  delay = 0,
  once = true,
}: {
  children: React.ReactNode
  className?: string
  delay?: number
  once?: boolean
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, amount: 0.2 }}
      transition={{ duration: 0.9, ease: EXPO_OUT, delay }}
    >
      {children}
    </motion.div>
  )
}

export { EXPO_OUT }
