"use client"

import { FrameSequence, frameURLs } from "../frame-sequence"
import { $, $$, gsap, ScrollTrigger, u, viewport } from "../gsap"
import { FadeSlide, onceInRange, RevealGroup, TextWipe } from "./primitives"

/**
 * The port-to-road scene — the longest sequence on the site.
 *
 * Two pinned stages back it: 600vh of "first screen" and 1100vh of "second
 * screen". Scroll offsets below are the source site's, kept in the same
 * `top+=<n>vh` form so the choreography is directly comparable:
 *
 *   0    → 100vh   the container car slides in, then hands off to the canvas
 *   100  → 450vh   crane frame sequence (lift-up → rotate → put-container)
 *   250  → 440vh   crane settles, containers drift out, the truck drives in
 *   450vh → end    camera pulls back, the land grows, the service cards run
 *                  past horizontally while the speedometer tracks scroll speed
 *   last 180vh     truck frame sequence, then the road transition swings the
 *                  rig 90° and lifts it into the reliability section
 */
export function initService(root: ParentNode) {
  const el = $(root, ".home-service-wrap")
  if (!el) return () => {}

  const sequences: FrameSequence[] = []
  const timelines: (gsap.core.Timeline | null)[] = []
  let speedTicker: gsap.TickerCallback | null = null

  // Warm the crane canvas early so the first scrub already has frames.
  const earlyTimer = window.setTimeout(() => {
    if (el.isConnected) buildFrameSequences(false)
  }, 400)

  const trigger = onceInRange(el, () => {
    if (!viewport().isMobile) initSpeedometer()
    buildScrub()
    buildReveals()
  })

  const isDesktop = () => viewport().size > 991
  const spin = {
    rotationZ: gsap.utils.unitize((v: string) => parseFloat(v) % 360),
  }

  /* ------------------------------------------------------------------ */
  /* Speedometer                                                         */
  /* ------------------------------------------------------------------ */

  /**
   * Reads scroll velocity off Lenis and eases a 0–95 readout toward it.
   * Above 500px/s a little jitter is added so the number never sits still.
   */
  function initSpeedometer() {
    const inner = $(el!, ".home-service-speed-inner")
    const digits = inner?.querySelector<HTMLElement>("[data-speed]")
    if (!inner || !digits) return

    let shown = 0
    let target = 0
    let lastScroll = window.scrollY

    speedTicker = (_time: number, delta: number) => {
      const scroll = window.ucLenis?.scroll ?? window.scrollY

      if (
        inner.classList.contains("active") &&
        inner.classList.contains("on-start")
      ) {
        let velocity = Math.abs(scroll - lastScroll) / (delta / 1000)
        if (!Number.isFinite(velocity)) velocity = 0
        const jitter = velocity > 500 ? Math.random() * 2 - 1 : 0
        target = Math.min(95, velocity / 25 + jitter)
      } else {
        target = 0
      }
      lastScroll = scroll

      const lerp = target > shown ? 0.1 : target === 0 ? 0.15 : 0.06
      shown += (target - shown) * lerp
      if (shown < 0.5 && target === 0) shown = 0

      const value = String(Math.round(shown)).padStart(2, "0")
      if (digits.dataset.currentSpeed !== value) {
        digits.textContent = value
        digits.dataset.currentSpeed = value
      }
    }
    gsap.ticker.add(speedTicker)
  }

  /* ------------------------------------------------------------------ */
  /* Frame sequences                                                     */
  /* ------------------------------------------------------------------ */

  let craneSequence: FrameSequence | null = null
  let truckSequence: FrameSequence | null = null

  function buildFrameSequences(withTruck = true) {
    if (viewport().isMobile) {
      const mbCanvas = el!.querySelector<HTMLCanvasElement>(
        ".home-service-mb-crane-sq"
      )
      if (mbCanvas && !craneSequence) {
        craneSequence = new FrameSequence({
          canvas: mbCanvas,
          frames: frameURLs("mb-lift", 63),
          fit: "cover",
          lerp: 1,
          scrollTrigger: {
            trigger: $(el!, ".home-service-mb-sq-stick"),
            start: "top+=1px top",
            endTrigger: $(el!, ".home-service-mb-empty-block.first-screen"),
            end: () => `bottom top+=${u(405, "rem")}`,
            scrub: true,
          },
        })
        sequences.push(craneSequence)
      }
      return
    }

    const craneCanvas = el!.querySelector<HTMLCanvasElement>(
      ".home-service-crane-sq"
    )
    if (craneCanvas && !craneSequence) {
      // The three clips play back to back as one continuous scrub.
      craneSequence = new FrameSequence({
        canvas: craneCanvas,
        frames: [
          ...frameURLs("lift-up", 159),
          ...frameURLs("rotate", 97),
          ...frameURLs("put-container", 97),
        ],
        fit: "cover",
        lerp: 1,
        scrollTrigger: {
          trigger: $(el!, ".home-service-first-screen"),
          start: () => `top+=${u(100, "vh") + 1} top`,
          end: () => `top+=${u(450, "vh")} top`,
          scrub: true,
        },
      })
      sequences.push(craneSequence)
    }

    if (!withTruck) return

    const truckCanvas = el!.querySelector<HTMLCanvasElement>(
      ".home-service-truck-sq"
    )
    if (truckCanvas && !truckSequence) {
      const frames = frameURLs("truck", 89)
      // Tablet holds the first frame a little longer before the turn starts.
      const lead = isDesktop() ? 0 : 20
      truckSequence = new FrameSequence({
        canvas: truckCanvas,
        frames: [...Array(lead).fill(frames[0]), ...frames],
        fit: "contain",
        clear: true,
        lerp: 1,
        scrollTrigger: {
          trigger: $(el!, ".home-service-second-screen"),
          start: () => `bottom-=${u(180, "vh")} bottom`,
          end: () => `bottom-=${u(100, "vh")} bottom`,
          scrub: true,
        },
      })
      sequences.push(truckSequence)
    }
  }

  /* ------------------------------------------------------------------ */
  /* Scrubbed timelines                                                  */
  /* ------------------------------------------------------------------ */

  let moveTruckIn: gsap.core.Timeline | null = null

  function buildScrub() {
    buildFrameSequences()
    if (viewport().isMobile) return

    const first = $(el!, ".home-service-first-screen")
    const second = $(el!, ".home-service-second-screen")
    if (!first || !second) return

    /* --- 0 → 100vh: the loaded car rolls in, canvas takes over --- */

    gsap.set($(el!, ".home-service-crane-static.cont-w"), {
      clipPath: "inset(34.5% 2.6% 41.8% 86%)",
    })
    $$(el!, ".home-service-crane-static img").forEach((img) =>
      img.removeAttribute("loading")
    )

    const moveCraneIn = gsap.timeline({
      scrollTrigger: {
        trigger: first,
        start: "top top+=50%",
        end: () => `top+=${u(100, "vh")} top`,
        scrub: true,
      },
    })
    timelines.push(moveCraneIn)

    moveCraneIn
      .fromTo(
        $(el!, ".home-service-crane-static.o-car"),
        { x: () => -u(500, "rem") },
        { x: 0, ease: "none", duration: 1 },
        0
      )
      .to($(el!, ".home-service-crane-sq"), {
        autoAlpha: 1,
        duration: 0,
        ease: "none",
      })
      .to(
        $$(
          el!,
          ".home-service-crane-static.o-car, .home-service-crane-static.cont-w"
        ),
        { autoAlpha: 0, duration: 0, ease: "none" }
      )

    /* --- 250 → 440vh: crane settles, containers drift, truck arrives --- */

    const craneRot = gsap.timeline({
      scrollTrigger: {
        trigger: first,
        start: () => `top+=${u(250, "vh")} top`,
        end: () => `top+=${u(440, "vh")} top`,
        scrub: true,
      },
    })
    timelines.push(craneRot)

    craneRot
      .to($(el!, ".home-service-truck"), { autoAlpha: 1, duration: 0 })
      .to(
        $(el!, ".home-service-cont-wrap"),
        {
          xPercent: 80,
          scale: 0.85,
          yPercent: 8,
          keyframes: {
            "0%": { filter: "blur(0px)", autoAlpha: 1 },
            "80%": { filter: "blur(1px)", autoAlpha: 1 },
            "100%": { filter: "blur(3px)", autoAlpha: 0.95 },
          },
          ease: "none",
          duration: 0.7,
        },
        0
      )
      .to(
        $(el!, ".home-service-crane-sq"),
        {
          transformOrigin: "center bottom",
          keyframes: {
            "0%": { rotationZ: 360, y: 0 },
            "30%": { rotationZ: 360.5, y: () => u(10, "rem") },
            "70%": { rotationZ: 357, y: () => u(12, "rem") },
            "100%": { rotationZ: 360, y: () => u(12, "rem") },
            easeEach: "none",
          },
          ease: "none",
          duration: 0.7,
        },
        0
      )
      .to($(el!, ".home-service-crane"), {
        xPercent: 20.9,
        ease: "none",
        duration: 0.7,
      })
      .to(
        $(el!, ".home-service-crane-sq"),
        {
          scale: 0.9,
          transformOrigin: "center bottom",
          y: () => -u(9.6, "rem"),
          ease: "none",
          duration: 0.7,
        },
        "<=.1"
      )
      .fromTo(
        $(el!, ".home-service-truck"),
        { x: () => u(100, "vw") },
        { x: 0, ease: "none", duration: 0.8 },
        "<=0"
      )
      .from(
        $$(el!, ".home-service-truck-wheel-i"),
        { rotationZ: 360 * 4, ease: "none", duration: 0.8, modifiers: spin },
        "<=0"
      )

    gsap.set($(el!, ".home-service-main"), { autoAlpha: 0 })

    /* --- 450vh → second screen: pull back, extend the road, run the cards --- */

    const track = $(el!, ".home-service-main-inner")!
    const trackWidth = track.getBoundingClientRect().width
    const textRatio = viewport().size / (trackWidth + viewport().size)

    moveTruckIn = gsap.timeline({
      scrollTrigger: {
        trigger: first,
        start: () => `top+=${u(450, "vh")} top`,
        endTrigger: second,
        end: () => `bottom-=${u(100, "vh")} bottom`,
        scrub: true,
        onEnter: () => {
          gsap.set(
            $$(
              el!,
              ".home-service-main, .home-service-truck-cont, .home-service-crane-static.out-top, .home-service-crane-static.out-bot, .home-service-main-inner"
            ),
            { autoAlpha: 1 }
          )
          gsap.set($(el!, ".home-service-crane-sq"), { autoAlpha: 0 })
          $(el!, ".home-service-speed-inner")?.classList.add("active")
        },
        onLeaveBack: () => {
          gsap.set(
            $$(
              el!,
              ".home-service-main, .home-service-truck-cont, .home-service-crane-static.out-top, .home-service-crane-static.out-bot, .home-service-main-inner"
            ),
            { autoAlpha: 0 }
          )
          gsap.set($(el!, ".home-service-crane-sq"), { autoAlpha: 1 })
          $(el!, ".home-service-speed-inner")?.classList.remove("active")
        },
      },
    })
    timelines.push(moveTruckIn)

    moveTruckIn
      .to(
        $(el!, ".home-service-stick.second-screen"),
        { top: 0, ease: "sine.inOut", duration: 1 },
        0
      )
      .to(
        $(el!, ".home-service-land"),
        { height: () => u(60, "vh"), ease: "sine.inOut", duration: 1 },
        0
      )
      .to(
        $(el!, ".home-service-truck-inner"),
        {
          transformOrigin: "0% 100%",
          scale: isDesktop() ? 0.6 : 1,
          ease: "sine.inOut",
          duration: 1,
          immediateRender: false,
        },
        0
      )
      .to(
        $(el!, ".home-service-scene"),
        {
          transformOrigin: "-5% 100%",
          scale: isDesktop() ? 0.55 : 0.95,
          ease: "sine.inOut",
          duration: 1,
        },
        0
      )
      .to(
        $(el!, ".home-service-crane-static.out-top"),
        { yPercent: -18, ease: "sine.inOut", duration: 1 },
        0
      )
      .to(
        $(el!, ".home-service-scene"),
        {
          xPercent: -80,
          filter: "blur(5px)",
          y: () => u(5, "rem"),
          ease: "none",
          duration: 1,
        },
        "<=0.4"
      )
      .to(
        $$(el!, ".home-service-truck-wheel-i"),
        {
          rotationZ: 360 * 8,
          ease: "none",
          duration: 1,
          modifiers: spin,
          onStart: () =>
            $(el!, ".home-service-speed-inner")?.classList.add("on-start"),
          onReverseComplete: () =>
            $(el!, ".home-service-speed-inner")?.classList.remove("on-start"),
        },
        0
      )
      .to(
        $(el!, ".home-service-truck-inner"),
        { xPercent: isDesktop() ? -12 : -20, ease: "none", duration: 0.5 },
        "<=.48"
      )
      .to(
        $(el!, ".home-service-label"),
        { autoAlpha: 1, duration: 0, ease: "none" },
        "<=0"
      )
      .to(
        $(el!, ".home-service-label"),
        {
          x: () => -($(el!, ".home-service-label") as HTMLElement).offsetWidth,
          duration: 3,
          ease: "none",
        },
        "<=0"
      )
      .to(
        $(el!, ".home-service-main-inner"),
        { x: -trackWidth, duration: 3, ease: "none" },
        "<=0"
      )
      .to(
        $(el!, ".home-service-text-wrap"),
        {
          keyframes: [
            { x: 0, duration: 3 * textRatio, ease: "none" },
            {
              x: isDesktop() ? 0 : trackWidth,
              duration: 3 * (1 - textRatio),
              ease: "none",
            },
          ],
          ease: "none",
        },
        "<=0"
      )
      .to(
        $(el!, ".home-service-land"),
        { autoAlpha: 0, duration: 0, ease: "none" },
        "<=.32"
      )
      .to(
        $(el!, ".home-service-truck-inner"),
        {
          xPercent: 0,
          x: () => (isDesktop() ? u(325, "rem") : 0),
          duration: 2,
          ease: "none",
        },
        "<=0.2"
      )
      .to(
        $$(el!, ".home-service-truck-wheel-i"),
        { rotationZ: 360 * 12, ease: "none", duration: 2, modifiers: spin },
        "<=0"
      )

    /* --- last 180vh: the rig turns out onto the road --- */

    const cmsHeight =
      ($(el!, ".home-service-cms") as HTMLElement)?.offsetHeight ?? 0
    const mainPadTop =
      parseFloat(getComputedStyle($(el!, ".home-service-main")!).paddingTop) ||
      0
    const textHeight =
      ($(el!, ".home-service-text-wrap") as HTMLElement)?.offsetHeight ?? 0

    const truckRot = gsap.timeline({
      scrollTrigger: {
        trigger: second,
        start: () => `bottom-=${u(180, "vh") + 1} bottom`,
        end: () => `bottom-=${u(100, "vh")} bottom`,
        scrub: true,
      },
    })
    timelines.push(truckRot)

    // The road plate scales so its 60vh height matches the artwork's aspect.
    const roadScale = u(60, "vh") / u(isDesktop() ? 244 : 172.3, "rem")
    gsap.set($(el!, ".home-service-road-big"), {
      autoAlpha: 0,
      filter: "blur(1px)",
    })

    truckRot
      .to($$(el!, ".home-service-cms, .home-service-btn-wrap"), {
        autoAlpha: 0,
        rotationX: isDesktop() ? -90 : 0,
        y: isDesktop() ? cmsHeight + mainPadTop : 0,
        filter: "blur(2px)",
        duration: 1,
        ease: "none",
      })
      .to(
        $(el!, ".home-service-main"),
        {
          "--road-height": () => `${u(20, "vh")}px`,
          keyframes: {
            "0%": { "--bright-fade": 0 },
            "40%": { "--bright-fade": 1 },
            "100%": { "--bright-fade": 0 },
          },
          backgroundColor: "#0C0C0C",
          duration: 1,
          ease: "none",
        },
        isDesktop() ? "<=0" : "<=0.9"
      )
      .to(
        $(el!, ".home-service-road-big"),
        {
          x: () => -u(100, "vw"),
          filter: "blur(0px)",
          autoAlpha: 1,
          duration: 1,
          ease: "none",
        },
        "<=0"
      )
      .to(
        $(el!, ".home-service-main-road.top"),
        { backgroundColor: "#0C0C0C", duration: 1, ease: "none" },
        "<=0"
      )
      .fromTo(
        $(el!, ".home-service-road-big-img"),
        { scaleY: 0 },
        { scaleY: 1, backgroundColor: "#0C0C0C", duration: 1, ease: "none" },
        "<=0"
      )
      .to(
        $$(
          el!,
          ".home-service-truck-cont, .home-service-truck-car, .home-service-truck-wheel"
        ),
        { autoAlpha: 0, duration: 0, ease: "none" },
        "<=.05"
      )
      .to(
        $(el!, ".home-service-truck-sq"),
        { autoAlpha: 1, duration: 0, ease: "none" },
        "<=0"
      )
      .to(
        $(el!, ".home-service-text-wrap"),
        {
          rotationX: isDesktop() ? 0 : -90,
          y: isDesktop() ? 0 : textHeight + mainPadTop * 3,
          filter: "blur(2px)",
          autoAlpha: 0,
          duration: 1,
          ease: "none",
        },
        "<=0"
      )
      .to(
        $(el!, ".home-service-label"),
        { y: cmsHeight + mainPadTop, autoAlpha: 0, duration: 1, ease: "none" },
        "<=0"
      )
      .to(
        $(el!, ".home-service-truck-inner"),
        {
          y: () => u(10, "vh"),
          yPercent: isDesktop() ? 35 : 58,
          duration: 1,
          ease: "none",
        },
        "<=0.1"
      )
      .to(
        $(el!, ".home-service-truck-sq"),
        { bottom: 0, left: 0, scale: 1.04 * 1.0435, duration: 1, ease: "none" },
        "<=0"
      )
      .to($(el!, ".home-service-truck-sq"), {
        autoAlpha: 0,
        duration: 0,
        ease: "none",
      })
      .to(
        $(el!, ".home-service-new-truck-wrap"),
        { autoAlpha: 1, duration: 0, ease: "none" },
        "<=0"
      )
      .to(
        $$(el!, ".home-service-new-truck-inner"),
        {
          x: () => (isDesktop() ? 0 : -u(20, "rem")),
          duration: 0,
          ease: "none",
        },
        "<=0"
      )

    /* --- final 100vh: swing the rig 90° and lift it into the next section --- */
    ;($(el!, ".home-service-road") as HTMLElement)?.style.setProperty(
      "--scale-factor",
      String(roadScale)
    )

    const truckArtHeight = (isDesktop() ? 782.675 : 748.816) / (2880 / 809)
    const finalTruckScale = (isDesktop() ? 244 : 172.3) / truckArtHeight

    const roadTransition = gsap.timeline({
      scrollTrigger: {
        trigger: second,
        start: () => `bottom-=${u(100, "vh")} bottom`,
        end: "bottom bottom",
        scrub: true,
        fastScrollEnd: true,
      },
    })
    timelines.push(roadTransition)

    roadTransition
      .to($$(el!, ".home-service-new-truck-inner"), {
        xPercent: 0,
        yPercent: 0,
        duration: 0.5,
      })
      .to(
        $(el!, ".home-service-road-big"),
        { x: () => -u(200, "vw"), duration: 1, ease: "none" },
        "<=0"
      )
      .from(
        $(el!, ".home-service-road-wrap"),
        { x: () => u(100, "vw"), duration: 1, ease: "none" },
        "<=0"
      )
      .to(
        $(el!, ".home-service-road"),
        { "--scale-factor": 1, duration: 0.5, ease: "none" },
        "<=.6"
      )
      .to(
        $(el!, ".home-service-main"),
        { scale: 1 / roadScale, duration: 0.5, ease: "none" },
        "<=0"
      )
      .to(
        $$(el!, ".home-service-new-truck"),
        {
          scale: finalTruckScale,
          yPercent: -80,
          y: 0,
          duration: 0.5,
          ease: "none",
        },
        "<=0"
      )
      .to(
        $(el!, ".home-service-new-truck-stick"),
        { top: () => u(20, "vh"), duration: 0.5, ease: "none" },
        "<=0"
      )
      .to(
        $$(el!, ".home-service-new-truck-inner"),
        {
          scale: isDesktop() ? 0.346 : 0.49,
          xPercent: -60,
          y: () => -u(120, "rem"),
          yPercent: isDesktop() ? -0.3 : -0.8,
          x: 0,
          duration: 0.5,
          ease: "none",
        },
        "<=0"
      )
      .to($$(el!, ".home-service-new-truck-rot"), {
        rotation: 90,
        duration: 1,
        ease: "power1.inOut",
      })
      // the cab and trailer rock against each other through the turn
      .to(
        $(el!, ".home-service-new-truck-inner.only-car"),
        {
          rotation: 12,
          duration: 0.4,
          ease: "power1.inOut",
          yoyo: true,
          repeat: 1,
        },
        "<=0"
      )
      .to(
        $(el!, ".home-service-new-truck-inner.container-truck"),
        {
          rotation: -12,
          duration: 0.4,
          ease: "power1.inOut",
          yoyo: true,
          repeat: 1,
        },
        "<0.1"
      )
      .to(
        $(el!, ".home-service-new-truck-inner.container-truck"),
        {
          scaleX: isDesktop() ? 0.39 : 0.555,
          duration: 0.4,
          ease: "power1.inOut",
        },
        "<=0"
      )
      .to(
        $$(el!, ".home-service-road-wrap, .home-service-main"),
        { y: () => -u(120, "rem"), duration: 0.6, ease: "none" },
        "<=0"
      )
      .to(
        $$(el!, ".home-service-new-truck-rot"),
        { y: () => -u(220, "rem"), duration: 0.7, ease: "none" },
        "<=0"
      )
      .to(
        $(el!, ".home-service-main"),
        { autoAlpha: 0, duration: 0, ease: "none" },
        "<=0"
      )

    /* --- park the truck above the reliability list --- */

    const truckPosition = gsap.timeline({
      scrollTrigger: {
        trigger: $(el!, ".home-service-sub-list"),
        start: () => `top+=${u(30, "vh")} bottom`,
        end: () => `top+=${u(50, "vh")} center`,
        scrub: true,
      },
    })
    timelines.push(truckPosition)

    const parkTop = isDesktop() ? 650 : 560
    truckPosition
      .to(
        $$(el!, ".home-service-new-truck"),
        {
          scale: finalTruckScale,
          top: () => -u(parkTop, "rem"),
          xPercent: 0,
          yPercent: 0,
          duration: 1,
          ease: "none",
        },
        "<=0"
      )
      .to(
        $$(el!, ".home-service-new-truck-inner"),
        {
          x: 0,
          y: 0,
          xPercent: isDesktop() ? -9.4 : -3.4,
          duration: 1,
          ease: "none",
        },
        "<=0"
      )
      .to(
        $(el!, ".home-service-new-truck-stick"),
        { top: 0, duration: 1, ease: "none" },
        "<=0"
      )
      .to(
        $$(el!, ".home-service-new-truck-rot"),
        {
          y: () =>
            -(
              u(parkTop, "rem") -
              u(50, "vh") +
              u((((isDesktop() ? 244 : 172.3) / 809) * 2880) / 2, "rem")
            ),
          duration: 1,
          ease: "none",
        },
        "<=0"
      )

    // Once the reliability list is on screen the speedometer stands down.
    timelines.push(
      gsap.timeline({
        scrollTrigger: {
          trigger: $(el!, ".home-service-sub-list"),
          start: "bottom top+=62.5%",
          onEnter: () =>
            $(el!, ".home-service-speed-inner")?.classList.remove(
              "active",
              "on-start"
            ),
          onLeaveBack: () =>
            $(el!, ".home-service-speed-inner")?.classList.add(
              "active",
              "on-start"
            ),
        },
      })
    )
  }

  /* ------------------------------------------------------------------ */
  /* Copy reveals                                                        */
  /* ------------------------------------------------------------------ */

  function buildReveals() {
    new RevealGroup({
      trigger: el!,
      scrollTrigger: {
        trigger: $(el!, ".third-screen .home-service-title") ?? undefined,
      },
      tweens: () => [
        new TextWipe({
          el: $(el!, ".third-screen .home-service-title .heading"),
        }),
      ],
    })

    new RevealGroup({
      trigger: el!,
      scrollTrigger: {
        trigger: $(el!, ".third-screen .home-service-desc") ?? undefined,
      },
      tweens: () => [
        new TextWipe({ el: $(el!, ".third-screen .home-service-desc .txt") }),
      ],
    })

    const subItems = $$(el!, ".home-service-sub-item")
    gsap.set(subItems, { autoAlpha: 0 })
    subItems.forEach((item, i) => {
      gsap.set(item, { autoAlpha: 1 })
      new RevealGroup({
        trigger: item,
        timeline: gsap.timeline({ delay: i * 0.15 }),
        tweens: () => [
          new FadeSlide({ el: item, from: { y: "1rem" } }),
          new TextWipe({
            el: item.querySelector(".home-service-sub-title .heading"),
          }),
          new TextWipe({
            el: item.querySelector(".home-service-sub-desc .txt"),
          }),
        ],
      })
    })

    // The horizontal track reveals ride on `moveTruckIn` as their scroller.
    requestAnimationFrame(() => {
      if (
        !moveTruckIn?.scrollTrigger ||
        !Number.isFinite(moveTruckIn.scrollTrigger.end)
      )
        return

      new RevealGroup({
        trigger: el!,
        containerAnimation: moveTruckIn,
        stagger: 0.05,
        scrollTrigger: {
          trigger: $(el!, ".home-service-main-inner") ?? undefined,
          start: "left left",
          containerAnimation: moveTruckIn,
        },
        tweens: () => [
          new TextWipe({ el: $(el!, ".home-service-title") }),
          new FadeSlide({ el: $(el!, ".home-service-btn-wrap") }),
          new TextWipe({ el: $(el!, ".home-service-sub .txt") }),
        ],
      })

      $$(el!, ".home-service-item").forEach((item) => {
        new RevealGroup({
          trigger: item,
          containerAnimation: moveTruckIn!,
          scrollTrigger: {
            trigger: item,
            start: "left left+=60%",
            containerAnimation: moveTruckIn!,
          },
          tweens: () => [
            new FadeSlide({ el: item }),
            ...Array.from(
              item.querySelectorAll(".home-service-item-title .heading h3")
            ).map((h) => new TextWipe({ el: h })),
            new TextWipe({
              el: item.querySelector(".home-service-item-desc .txt"),
            }),
          ],
        })
      })
    })
  }

  return () => {
    window.clearTimeout(earlyTimer)
    trigger.kill()
    if (speedTicker) gsap.ticker.remove(speedTicker)

    // Triggers that ride the horizontal track must go before the track itself,
    // otherwise they refresh against a container animation that no longer has
    // a ScrollTrigger.
    if (moveTruckIn) {
      ScrollTrigger.getAll()
        .filter((st) => st.vars.containerAnimation === moveTruckIn)
        .forEach((st) => st.kill())
    }

    timelines.forEach((t) => t?.scrollTrigger?.kill())
    timelines.forEach((t) => t?.kill())
    sequences.forEach((s) => s.destroy())
  }
}
