"use client"

import { useEffect, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"

/**
 * Full-screen intro counter. Runs once per session so returning to the landing
 * from another route doesn't replay it. The count is time-driven rather than
 * tied to real asset loading — the hero video streams in behind it anyway, and
 * a deterministic 1.6s beat keeps the handover to the hero reveal predictable.
 */
export function Preloader() {
  const [visible, setVisible] = useState(false)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    if (sessionStorage.getItem("antares-intro-played")) return
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return

    sessionStorage.setItem("antares-intro-played", "1")
    setVisible(true)
    document.body.dataset.preloading = "true"

    const start = performance.now()
    const duration = 1600
    let frame = 0

    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration)
      // Ease-out so the number sprints early and settles on 100.
      setProgress(Math.round((1 - Math.pow(1 - t, 3)) * 100))
      if (t < 1) {
        frame = requestAnimationFrame(tick)
      } else {
        setTimeout(() => {
          setVisible(false)
          delete document.body.dataset.preloading
        }, 260)
      }
    }
    frame = requestAnimationFrame(tick)

    // rAF stops in a background tab, so a page opened in one could sit behind
    // the curtain indefinitely. This wall-clock cap retires it regardless.
    const safety = setTimeout(() => {
      setVisible(false)
      delete document.body.dataset.preloading
    }, duration + 2000)

    return () => {
      cancelAnimationFrame(frame)
      clearTimeout(safety)
      delete document.body.dataset.preloading
    }
  }, [])

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="preloader"
          className="bg-sand fixed inset-0 z-[999] flex items-center justify-center"
          exit={{ y: "-100%" }}
          transition={{ duration: 0.9, ease: [0.87, 0, 0.13, 1] }}
        >
          <span
            className="text-sand-alt tabular-nums select-none"
            style={{
              fontSize: "clamp(4rem, 14vw, 12rem)",
              fontWeight: 500,
              letterSpacing: "-0.04em",
            }}
          >
            {progress}%
          </span>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default Preloader
