"use client"

import { useEffect, useState } from "react"

/**
 * What the fixed chrome is currently floating over.
 *
 * "dark" means a dark surface is behind the pills, so their contents have to be
 * white; "light" means the opposite. The landing alternates between ink-black
 * sections, sand-coloured ones and a video, so a single hard-coded colour for
 * the chrome is wrong for roughly half the scroll.
 *
 * The surface is read from the document rather than declared per section where
 * that is possible: `elementsFromPoint` at the pill's own position gives the
 * real stack, and the first element in it that paints an opaque background
 * decides the tone. Sections whose colour comes from a video or a photo rather
 * than a background colour can't be read that way, so they mark themselves with
 * `data-chrome="dark" | "light"` and that wins.
 *
 * Chrome must exclude itself from the probe with `data-chrome-ignore`, or it
 * would measure its own glass.
 */
export type Tone = "light" | "dark"

/** Perceived lightness, sRGB-weighted; 0 is black, 1 is white. */
function luminance(r: number, g: number, b: number) {
  return (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255
}

function parseRgb(value: string): [number, number, number, number] | null {
  const m = value.match(/rgba?\(([^)]+)\)/)
  if (!m) return null
  const parts = m[1]
    .split(/[,\s/]+/)
    .filter(Boolean)
    .map(Number)
  if (parts.length < 3 || parts.some(Number.isNaN)) return null
  return [parts[0], parts[1], parts[2], parts.length > 3 ? parts[3] : 1]
}

function readTone(x: number, y: number): Tone | null {
  const stack = document.elementsFromPoint(x, y)

  for (const el of stack) {
    if (!(el instanceof HTMLElement) && !(el instanceof SVGElement)) continue
    if (el.closest("[data-chrome-ignore]")) continue

    const declared = el.closest("[data-chrome]")?.getAttribute("data-chrome")
    if (declared === "dark" || declared === "light") return declared

    const rgb = parseRgb(getComputedStyle(el).backgroundColor)
    // Anything more translucent than this lets the layer below dominate, so
    // keep walking down the stack instead of trusting it.
    if (rgb && rgb[3] >= 0.6) {
      return luminance(rgb[0], rgb[1], rgb[2]) < 0.55 ? "dark" : "light"
    }
  }

  return null
}

/**
 * @param y  Viewport offset of the point to sample, or a function returning it
 *           (the bottom pill's position depends on the viewport height).
 */
export function useSurfaceTone(y: number | (() => number)): Tone {
  const [tone, setTone] = useState<Tone>("dark")

  useEffect(() => {
    let frame = 0

    const read = () => {
      frame = 0
      const py = typeof y === "function" ? y() : y
      // Three samples across the pill's width: a section boundary or a dark
      // panel under one edge shouldn't flip the whole bar on its own, so the
      // darker reading only wins if at least two points agree.
      const xs = [0.3, 0.5, 0.7].map((f) => window.innerWidth * f)
      const votes = xs.map((x) => readTone(x, py)).filter(Boolean) as Tone[]
      if (!votes.length) return
      const dark = votes.filter((t) => t === "dark").length
      setTone(dark * 2 >= votes.length ? "dark" : "light")
    }

    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(read)
    }

    read()
    window.addEventListener("scroll", schedule, { passive: true })
    window.addEventListener("resize", schedule)
    return () => {
      if (frame) cancelAnimationFrame(frame)
      window.removeEventListener("scroll", schedule)
      window.removeEventListener("resize", schedule)
    }
  }, [y])

  return tone
}
