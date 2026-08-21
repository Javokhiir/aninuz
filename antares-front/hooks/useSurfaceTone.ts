"use client"

import { useEffect, useState } from "react"

/**
 * What the fixed chrome is currently floating over.
 *
 * "dark" means a dark surface is behind the pills, so their contents have to be
 * white; "light" means the opposite. The landing alternates between ink-black
 * sections, sand-coloured ones and a video, and the inner pages put a dark hero
 * under a white document, so a single hard-coded colour for the chrome is wrong
 * for a good part of any scroll.
 *
 * The tone is measured at the pill's own position rather than declared per
 * section: `elementsFromPoint` gives the real stack under that point and the
 * first layer in it that actually paints something opaque decides. That layer
 * can be
 *
 *  - a background colour,
 *  - a background gradient (its first opaque colour stop is read),
 *  - a same-origin `<video>` / `<img>` / `<canvas>`, whose own pixels are
 *    sampled around the point,
 *
 * and only when none of those can be read does a section's `data-chrome="dark"
 * | "light"` or the document background decide. A surface painted by a
 * cross-origin image is the one case that still needs the attribute.
 *
 * Chrome must exclude itself from the probe with `data-chrome-ignore`, or it
 * would measure its own glass.
 */
export type Tone = "light" | "dark"

/** Perceived lightness, sRGB-weighted; 0 is black, 1 is white. */
function luminance(r: number, g: number, b: number) {
  return (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255
}

const toneOf = (r: number, g: number, b: number): Tone =>
  luminance(r, g, b) < 0.55 ? "dark" : "light"

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

/**
 * A gradient paints the element even though its background-color is
 * transparent, so its first opaque stop stands in for the surface.
 */
function parseGradient(value: string): [number, number, number, number] | null {
  if (!value.includes("gradient")) return null
  const stops = value.match(/rgba?\([^)]+\)/g)
  if (!stops) return null
  for (const stop of stops) {
    const rgb = parseRgb(stop)
    if (rgb && rgb[3] >= 0.6) return rgb
  }
  return null
}

// One scratch canvas for every probe; allocating per read would churn.
let probe: HTMLCanvasElement | null = null

/**
 * Average colour of a media element's own pixels around the sampled point.
 * Returns null for cross-origin sources (the canvas is tainted), for media that
 * has not painted a frame yet, and for anything the browser refuses to draw.
 */
function sampleMedia(
  el: HTMLVideoElement | HTMLImageElement | HTMLCanvasElement,
  x: number,
  y: number
): Tone | null {
  const rect = el.getBoundingClientRect()
  if (!rect.width || !rect.height) return null

  const natural =
    el instanceof HTMLVideoElement
      ? { w: el.videoWidth, h: el.videoHeight }
      : el instanceof HTMLImageElement
        ? { w: el.naturalWidth, h: el.naturalHeight }
        : { w: el.width, h: el.height }
  if (!natural.w || !natural.h) return null

  // Where the point falls inside the box, carried over to the source pixels.
  // object-fit is not modelled: for a cover-cropped fill this is off by the
  // crop, which does not change a light/dark verdict in practice.
  const fx = (x - rect.left) / rect.width
  const fy = (y - rect.top) / rect.height
  const sx = Math.min(natural.w - 8, Math.max(0, Math.round(fx * natural.w) - 4))
  const sy = Math.min(natural.h - 8, Math.max(0, Math.round(fy * natural.h) - 4))

  try {
    probe ??= document.createElement("canvas")
    probe.width = 8
    probe.height = 8
    const ctx = probe.getContext("2d", { willReadFrequently: true })
    if (!ctx) return null
    ctx.drawImage(el, sx, sy, 8, 8, 0, 0, 8, 8)
    const { data } = ctx.getImageData(0, 0, 8, 8)

    let r = 0
    let g = 0
    let b = 0
    let n = 0
    for (let i = 0; i < data.length; i += 4) {
      if (data[i + 3] < 150) continue
      r += data[i]
      g += data[i + 1]
      b += data[i + 2]
      n++
    }
    if (!n) return null
    return toneOf(r / n, g / n, b / n)
  } catch {
    // Tainted canvas — a cross-origin frame. That element has to declare itself.
    return null
  }
}

function readTone(x: number, y: number): Tone {
  const stack = document.elementsFromPoint(x, y)

  for (const el of stack) {
    if (!(el instanceof HTMLElement) && !(el instanceof SVGElement)) continue
    if (el.closest("[data-chrome-ignore]")) continue

    if (
      el instanceof HTMLVideoElement ||
      el instanceof HTMLImageElement ||
      el instanceof HTMLCanvasElement
    ) {
      const sampled = sampleMedia(el, x, y)
      if (sampled) return sampled
    }

    const style = getComputedStyle(el)

    const rgb = parseRgb(style.backgroundColor)
    // Anything more translucent than this lets the layer below dominate, so
    // keep walking down the stack instead of trusting it.
    if (rgb && rgb[3] >= 0.6) return toneOf(rgb[0], rgb[1], rgb[2])

    const grad = parseGradient(style.backgroundImage)
    if (grad) return toneOf(grad[0], grad[1], grad[2])

    // Only once nothing about this element could be measured does its own
    // declaration count, so a section that paints a real surface never has to
    // keep an attribute in sync with it.
    const declared = el.closest("[data-chrome]")?.getAttribute("data-chrome")
    if (declared === "dark" || declared === "light") return declared
  }

  // Nothing in the stack paints anything readable — the point is over the page
  // canvas itself. The inner pages sit on the white body with only a pattern
  // image behind them, and that has to read as light rather than as the "dark"
  // default, which put white type on a white page.
  const canvas =
    parseRgb(getComputedStyle(document.body).backgroundColor) ??
    parseRgb(getComputedStyle(document.documentElement).backgroundColor)
  if (canvas && canvas[3] >= 0.6) return toneOf(canvas[0], canvas[1], canvas[2])

  return "light"
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
      const votes = xs.map((x) => readTone(x, py))
      const dark = votes.filter((t) => t === "dark").length
      setTone(dark * 2 >= votes.length ? "dark" : "light")
    }

    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(read)
    }

    read()
    window.addEventListener("scroll", schedule, { passive: true })
    window.addEventListener("resize", schedule)

    // The bar outlives every route change, and much of what it floats over
    // arrives after it: client navigation, images, the first video frame. So it
    // re-reads on a slow tick too — three hit-tests four times a second is far
    // cheaper than wiring every one of those events into the hook.
    const tick = window.setInterval(schedule, 250)

    return () => {
      if (frame) cancelAnimationFrame(frame)
      window.clearInterval(tick)
      window.removeEventListener("scroll", schedule)
      window.removeEventListener("resize", schedule)
    }
  }, [y])

  return tone
}
