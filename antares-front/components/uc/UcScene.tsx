"use client"

import { useEffect, useRef } from "react"

import { ScrollTrigger } from "@/lib/uc/gsap"
import { initService } from "@/lib/uc/anim/service"

import ServiceWrap from "./ServiceWrap"

import "./uc-scene.css"

/**
 * Mounts the port-to-road scene.
 *
 * The markup is a faithful port of the source site, so every timeline in
 * `lib/uc/anim/` finds its targets by class name. Two things have to be true
 * for it to behave:
 *
 *   • the stylesheet is scoped under `.uc-scene`, so the wrapper below is not
 *     decoration — without it nothing is laid out and the pinned stages
 *     collapse to zero height;
 *   • ScrollTrigger has to measure *after* the scene's fonts and images have
 *     settled, otherwise the pin distances are computed against a shorter
 *     document and the scrub ends early.
 */
export default function UcScene() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const root = ref.current
    if (!root) return

    const teardown = initService(root)

    // The scene adds several screens of pinned height. Anything that measured
    // the page before it mounted (the sections above it) is now stale.
    ScrollTrigger.refresh()

    const onLoad = () => ScrollTrigger.refresh()
    window.addEventListener("load", onLoad)
    const fonts = (document as Document & { fonts?: FontFaceSet }).fonts
    fonts?.ready.then(onLoad)

    return () => {
      window.removeEventListener("load", onLoad)
      teardown()
      ScrollTrigger.refresh()
    }
  }, [])

  return (
    <div className="uc-scene" ref={ref}>
      <ServiceWrap />
    </div>
  )
}
