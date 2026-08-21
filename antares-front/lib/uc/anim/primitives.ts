"use client"

import { gsap, rem, ScrollTrigger, SplitText, viewport } from "../gsap"

/**
 * The reveal vocabulary the whole site is built from.
 *
 * Every entrance on unitedcarriers.com is one of four tweens — a per-line
 * colour wipe, a fade-and-lift, a clipped image, or a drawn rule — collected
 * into a `RevealGroup` that fires once when its trigger reaches 85% of the
 * viewport. These classes reproduce that vocabulary, including the two-phase
 * behaviour: `init()` parks an element in its "from" state as soon as it is
 * within 100vh of the viewport, and `animation` plays it in on entry.
 */

export interface Reveal {
  animation?: gsap.core.Animation
  delay?: number | string
  init(): void
}

type El = Element | null | undefined

const resolve = (el: El): HTMLElement | null => (el as HTMLElement) || null

/* ------------------------------------------------------------------------ */
/* Text: per-line gradient wipe (`.split-line-p`)                            */
/* ------------------------------------------------------------------------ */

/**
 * Splits the element into lines and sweeps a gradient across each one via the
 * `--bg-progress` custom property. The gradient itself lives in the stylesheet
 * (`.split-line-p`), so this only drives the progress value.
 */
export class TextWipe implements Reveal {
  animation?: gsap.core.Tween
  delay?: number | string
  private split?: SplitText
  private el: HTMLElement | null
  private clampedHeight = false

  constructor({
    el,
    delay,
    keepSplit = false,
    ...vars
  }: {
    el: El
    delay?: number | string
    keepSplit?: boolean
  } & gsap.TweenVars) {
    this.el = resolve(el)
    this.delay = delay
    if (!this.el || !this.el.textContent?.trim()) return

    const height = this.el.offsetHeight
    this.clampedHeight = this.el.scrollHeight > height + 1

    // Pin the measured width so re-splitting cannot reflow the copy.
    gsap.set(this.el, { width: this.el.offsetWidth + 5 })

    this.split = new SplitText(this.el, { type: "lines" })
    const lines = this.split.lines as HTMLElement[]
    if (!lines.length) return

    if (this.clampedHeight) gsap.set(this.el, { height, overflow: "hidden" })

    lines.forEach((line) => {
      line.classList.add("split-line-p")
      // Carry the inherited colour into the gradient's solid stop.
      gsap.set(line, {
        "--color-final": window.getComputedStyle(line.parentElement!).color,
      })
    })

    gsap.set(lines, { "--bg-progress": "30" })

    this.animation = gsap.to(lines, {
      "--bg-progress": "100",
      stagger: 0.1,
      duration: 1.2,
      ease: "power1.inOut",
      onComplete: () => {
        if (keepSplit) return
        this.split?.revert()
        if (this.clampedHeight)
          gsap.set(this.el, { clearProps: "height,overflow" })
      },
      ...vars,
    })
  }

  init() {
    /* the wipe already starts from --bg-progress: 30 */
  }
}

/* ------------------------------------------------------------------------ */
/* Blocks: fade + slide                                                      */
/* ------------------------------------------------------------------------ */

type SlideType = "top" | "bottom" | "left" | "right" | "default"

/** Fade in while sliding 3.2rem from the given direction. */
export class FadeSlide implements Reveal {
  animation?: gsap.core.Tween
  delay?: number | string
  private el: HTMLElement | null
  private from: gsap.TweenVars = {}

  constructor({
    el,
    type = "default",
    delay,
    keepProps = false,
    from,
    to,
    ...vars
  }: {
    el: El
    type?: SlideType
    delay?: number | string
    keepProps?: boolean
    from?: gsap.TweenVars
    to?: gsap.TweenVars
  } & gsap.TweenVars) {
    this.el = resolve(el)
    this.delay = delay
    if (!this.el) return

    const offset = rem(32)
    const presets: Record<
      SlideType,
      { set: gsap.TweenVars; to: gsap.TweenVars }
    > = {
      bottom: { set: { opacity: 0, y: offset }, to: { opacity: 1, y: 0 } },
      top: { set: { opacity: 0, y: -offset }, to: { opacity: 1, y: 0 } },
      left: { set: { opacity: 0, x: offset }, to: { opacity: 1, x: 0 } },
      right: { set: { opacity: 0, x: -offset }, to: { opacity: 1, x: 0 } },
      default: { set: { opacity: 0, y: offset }, to: { opacity: 1, y: 0 } },
    }

    this.from = { ...presets[type].set, ...from }
    this.animation = gsap.fromTo(this.el, this.from, {
      ...presets[type].to,
      ...to,
      duration: 1,
      ease: "power3",
      clearProps: keepProps ? "" : "all",
      ...vars,
    })
  }

  init() {
    if (this.el) gsap.set(this.el, this.from)
  }
}

/* ------------------------------------------------------------------------ */
/* Media: clip open + scale down                                             */
/* ------------------------------------------------------------------------ */

/** Opens a 20% inset clip while the inner image relaxes from 1.4x. */
export class ClipReveal implements Reveal {
  animation?: gsap.core.Timeline
  delay?: number | string
  private el: HTMLElement | null
  private inner: HTMLElement | null = null
  private radius = 0

  constructor({
    el,
    inner,
    delay,
    keepProps = false,
  }: {
    el: El
    inner?: El
    delay?: number | string
    keepProps?: boolean
  }) {
    this.el = resolve(el)
    this.delay = delay
    if (!this.el) return
    this.inner = resolve(inner) ?? this.el.querySelector("img")
    this.radius =
      parseFloat(String(gsap.getProperty(this.el, "border-radius"))) || 0

    this.animation = gsap
      .timeline()
      .to(this.el, {
        clipPath: `inset(0% round ${this.radius}px)`,
        duration: 2,
        ease: "expo.out",
        clearProps: keepProps ? "" : "all",
      })
      .to(
        this.inner,
        {
          scale: 1,
          autoAlpha: 1,
          duration: 2,
          ease: "expo.out",
          overwrite: true,
          clearProps: keepProps ? "" : "all",
        },
        "<=0"
      )
  }

  init() {
    if (!this.el) return
    gsap.set(this.el, { clipPath: `inset(20% round ${this.radius}px)` })
    gsap.set(this.inner, { scale: 1.4, autoAlpha: 0 })
  }
}

/* ------------------------------------------------------------------------ */
/* Rules: scale a hairline out from one edge                                 */
/* ------------------------------------------------------------------------ */

export class LineDraw implements Reveal {
  animation?: gsap.core.Tween
  delay?: number | string
  private el: HTMLElement | null
  private from: gsap.TweenVars = {}

  constructor({
    el,
    type = "default",
    center = false,
    delay,
    keepProps = false,
    ...vars
  }: {
    el: El
    type?: "top" | "left" | "right" | "bottom" | "default"
    center?: boolean
    delay?: number | string
    keepProps?: boolean
  } & gsap.TweenVars) {
    this.el = resolve(el)
    this.delay = delay
    if (!this.el) return

    const presets = {
      top: {
        set: {
          scaleY: 0,
          transformOrigin: center ? "center center" : "top left",
        },
        to: { scaleY: 1 },
      },
      left: {
        set: {
          scaleX: 0,
          transformOrigin: center ? "center center" : "top left",
        },
        to: { scaleX: 1 },
      },
      right: {
        set: {
          scaleX: 0,
          transformOrigin: center ? "center center" : "top right",
        },
        to: { scaleX: 1 },
      },
      bottom: {
        set: {
          scaleX: 0,
          transformOrigin: center ? "center center" : "bottom right",
        },
        to: { scaleX: 1 },
      },
      default: {
        set: {
          scaleX: 0,
          transformOrigin: center ? "center center" : "top left",
        },
        to: { scaleX: 1 },
      },
    } as const

    this.from = presets[type].set
    this.animation = gsap.fromTo(this.el, this.from, {
      ...presets[type].to,
      duration: 1.2,
      ease: "power1.out",
      clearProps: keepProps ? "" : "all",
      ...vars,
    })
  }

  init() {
    if (this.el) gsap.set(this.el, this.from)
  }
}

/* ------------------------------------------------------------------------ */
/* Grouping                                                                  */
/* ------------------------------------------------------------------------ */

/**
 * Collects reveals into one scroll-triggered timeline.
 *
 * Two triggers are used, exactly as on the source site:
 *   • a wide one (`top bottom+=100vh`) that calls `init()` so elements are
 *     parked in their "from" state well before they are seen;
 *   • the play trigger (`top top+=85%`, once) that runs the timeline.
 *
 * Reveals are skipped on mobile unless `allowMobile` is set.
 */
export class RevealGroup {
  timeline?: gsap.core.Timeline

  constructor({
    trigger,
    timeline,
    tweens,
    stagger = 0.1,
    scrollTrigger,
    allowMobile = false,
    containerAnimation,
  }: {
    trigger: El
    timeline?: gsap.core.Timeline
    tweens: Reveal[] | (() => Reveal[])
    stagger?: number
    scrollTrigger?: ScrollTrigger.Vars
    allowMobile?: boolean
    containerAnimation?: gsap.core.Animation
  }) {
    if (viewport().isMobile && !allowMobile) return

    const list = (typeof tweens === "function" ? tweens() : tweens).filter(
      Boolean
    )
    if (!list.length) return

    // Vertical groups get a wide pre-arm trigger so elements are parked in
    // their "from" state before they are seen. Horizontal groups ride a
    // containerAnimation, where that vertical range has no meaning, so they
    // arm on the play timeline instead.
    if (!containerAnimation) {
      gsap.timeline({
        scrollTrigger: {
          trigger: trigger as Element,
          start: "top bottom+=100vh",
          end: "bottom top",
          once: true,
          onEnter: () => list.forEach((t) => t?.init?.()),
        },
      })
    }

    this.timeline =
      timeline ??
      gsap.timeline({
        scrollTrigger: {
          trigger: trigger as Element,
          start: "top top+=85%",
          end: "+=100%",
          once: true,
          ...(containerAnimation
            ? {
                containerAnimation,
                onEnter: () => list.forEach((t) => t?.init?.()),
              }
            : {}),
          ...scrollTrigger,
        },
      })

    list.forEach((t) => {
      if (t?.animation)
        this.timeline!.add(t.animation, t.delay ?? `<=${stagger}`)
    })
  }
}

/**
 * Runs `onEnter` once, the first time `el` comes within a viewport of the
 * scroll position — the site's lazy "build this section's timelines now" hook.
 */
export function onceInRange(el: Element, onEnter: () => void) {
  let armed = true
  const fire = () => {
    if (!armed) return
    armed = false
    // Building a section creates and refreshes ScrollTriggers, so it must not
    // run inside ScrollTrigger's own update pass — that mutates the trigger
    // list mid-iteration. Defer past it instead.
    //
    // A frame is the right moment to do that, but rAF is suspended entirely in
    // a hidden tab, and scroll position can still move there (restored history,
    // an anchor, another script). The timer is the backstop: whichever callback
    // arrives first builds, the other is a no-op, so a background tab can never
    // leave the section permanently inert.
    let built = false
    const build = () => {
      if (built) return
      built = true
      onEnter()
    }
    requestAnimationFrame(build)
    setTimeout(build, 100)
  }
  const st = ScrollTrigger.create({
    trigger: el,
    start: "top bottom+=100%",
    end: "bottom top-=100%",
    onEnter: fire,
    onEnterBack: fire,
  })

  // `onEnter` only fires on a crossing. A page that opens already inside the
  // range — a deep link, a restored scroll position, a back-navigation — never
  // crosses anything, and without this the section would stay inert.
  if (st.isActive) fire()

  return st
}
