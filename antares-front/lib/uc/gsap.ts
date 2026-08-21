"use client"

import { gsap } from "gsap"
import { CustomEase } from "gsap/CustomEase"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { SplitText } from "gsap/SplitText"

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, SplitText, CustomEase)
  ScrollTrigger.config({ ignoreMobileResize: true })
  if (process.env.NODE_ENV !== "production") {
    // Handy for poking at timelines from the console during development.
    Object.assign(window as unknown as Record<string, unknown>, {
      gsap,
      ScrollTrigger,
    })
  }
}

/** Live viewport breakpoints — the timelines read these on every (re)build. */
export function viewport() {
  const w = typeof window === "undefined" ? 1728 : window.innerWidth
  return {
    size: w,
    isMobile: w <= 767,
    isTablet: w > 767 && w <= 991,
    isDesktop: w > 991,
  }
}

export const vw = () =>
  typeof window === "undefined" ? 1728 : window.innerWidth
export const vh = () =>
  typeof window === "undefined" ? 1080 : window.innerHeight

/**
 * The scene's own root size, in px.
 *
 * The source site sets `html { font-size: 0.5787vw }` — 10px at its 1728px
 * design width — so every `rem` in its stylesheet scales with the window
 * instead of reflowing. This project cannot adopt that globally: Tailwind sizes
 * everything else in `rem` against the browser default, and moving the root
 * would resize the entire site. So the scale is reproduced here instead, read
 * from the viewport rather than from the document, and mirrored in CSS as
 * `--uc-rem` on the scene wrapper. The two must stay in step — the timelines
 * position elements the stylesheet has already laid out.
 */
export function ucRootPx() {
  const w = typeof window === "undefined" ? 1728 : window.innerWidth
  if (w <= 767) return (w * 2.5445292621) / 100
  if (w <= 991) return (w * 1.0090817356) / 100
  return (w * 0.57870370373) / 100
}

/** `rem(32)` -> 3.2rem in pixels, matching the source site's `J()` helper. */
export function rem(value: number) {
  if (typeof window === "undefined") return value
  return (value / 10) * ucRootPx()
}

/** Converts the authoring units used in the original timelines into pixels. */
/**
 * Small-viewport height, measured the way the source measures it.
 *
 * `100svh` is the height with the mobile browser's chrome showing. Reading it
 * from a probe element rather than `innerHeight` keeps the timelines stable
 * while the address bar slides in and out, which would otherwise re-time every
 * `vh` offset mid-scroll. Cached until the window resizes.
 */
let svhCache: number | null = null
if (typeof window !== "undefined") {
  window.addEventListener("resize", () => {
    svhCache = null
  })
}

function svh() {
  if (svhCache !== null) return svhCache
  const probe = document.createElement("div")
  probe.style.cssText =
    "position:fixed;top:0;left:0;height:100svh;width:0;pointer-events:none;visibility:hidden;"
  document.body.appendChild(probe)
  svhCache = probe.getBoundingClientRect().height
  document.body.removeChild(probe)
  return svhCache
}

/**
 * Converts the authoring units used in the original timelines into pixels.
 *
 * `rem` is in tenths, not whole root ems — the source's stylesheet is authored
 * against a 10px design root, so its timelines say `u(325, "rem")` and mean
 * 32.5rem. Dropping that division scales every offset in the scene by ten,
 * which is enough to throw the whole choreography off the screen.
 */
export function u(value: number, unit: "rem" | "vh" | "vw" | "px" = "px") {
  if (typeof window === "undefined") return value
  switch (unit) {
    case "rem":
      return (value / 10) * ucRootPx()
    case "vh":
      // Below the tablet breakpoint the source measures against 100svh.
      return (
        (value * (window.innerWidth <= 767 ? svh() : window.innerHeight)) / 100
      )
    case "vw":
      return (value * window.innerWidth) / 100
    default:
      return value
  }
}

/** `$(root, ".sel")` -> first match, `$$` -> all matches. Null-safe. */
export const $ = <T extends Element = HTMLElement>(
  root: ParentNode,
  sel: string
) => root.querySelector<T>(sel)

export const $$ = <T extends Element = HTMLElement>(
  root: ParentNode,
  sel: string
) => Array.from(root.querySelectorAll<T>(sel))

export { gsap, ScrollTrigger, SplitText, CustomEase }
