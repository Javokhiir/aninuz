"use client"

import { useEffect } from "react"
import Lenis from "lenis"

import { gsap, ScrollTrigger } from "@/lib/uc/gsap"

declare global {
  interface Window {
    /** Exposed so scroll readers (the scene's speedometer) can sample it. */
    ucLenis?: Lenis
  }
}

/**
 * Momentum scrolling for the landing page.
 *
 * Lenis moves the scroll position on its own schedule, so anything measuring
 * scroll has to be told when it moved. Framer's `useScroll` listens to the
 * native scroll event and follows for free; GSAP's ScrollTrigger does not, and
 * a scrubbed pin that samples on its own clock lags the page by a frame and
 * judders. So Lenis is stepped from the GSAP ticker and ScrollTrigger is
 * updated from Lenis' own scroll callback — one clock, one sample per frame.
 *
 * Users who ask for reduced motion keep the native scroll.
 */
export function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return

    const lenis = new Lenis({
      duration: 1.1,
      // Matches --e-expo-out: fast settle, no rubber band at the end.
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      touchMultiplier: 1.6,
    })
    window.ucLenis = lenis

    lenis.on("scroll", ScrollTrigger.update)

    // GSAP hands the ticker seconds; Lenis wants milliseconds.
    const tick = (time: number) => lenis.raf(time * 1000)
    gsap.ticker.add(tick)
    // Pinned scrubs must not be skipped over after a slow frame.
    gsap.ticker.lagSmoothing(0)

    return () => {
      gsap.ticker.remove(tick)
      lenis.destroy()
      delete window.ucLenis
    }
  }, [])

  return null
}

export default SmoothScroll
