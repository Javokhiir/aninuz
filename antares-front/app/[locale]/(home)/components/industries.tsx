"use client"

import { useEffect, useRef, useState } from "react"
import {
  motion,
  MotionValue,
  useMotionValueEvent,
  useScroll,
  useTransform,
} from "framer-motion"
import { useTranslations } from "next-intl"

import { cn } from "@/lib/utils"
import { SplitTitle } from "@/components/motion/split-title"

/**
 * Industries stage — a port of the reference site's own construction.
 *
 * Three parts:
 *
 *  - **Markers.** The section is a tall spacer measured in viewports: an
 *    opening beat, then one beat per industry. Nothing is drawn here; the
 *    height *is* the timeline, which is why the pacing holds on any screen
 *    without measuring anything.
 *  - **Stage.** One sticky plate for the whole section: the sleeve stays on
 *    screen from the opening beat to the last industry, because it is the
 *    product every beat is talking about. Only the colour over it changes. The opening beat is a full-bleed
 *    product shot carrying the statement, and it does not play on its own —
 *    scroll drives its `currentTime`, so the sleeve turns only while the reader
 *    moves and stops the moment they do. (The reference marks its industry
 *    clips `autoplay-onscroll` and leaves this one unmarked, for the same
 *    reason.) The clip is encoded with a 6-frame GOP; seeking a normally
 *    encoded video snaps to the nearest keyframe and turns scrubbing into
 *    half-second jumps. Each industry beat then swaps in its own lit
 *    colour ground with a transparent product render over it. Every plate stays mounted and
 *    only opacity and transform move, so nothing pops in.
 *  - **Chrome.** A glass tab card pinned bottom-left whose active row expands to
 *    show that industry's footage, and a glass spec card on the right carrying
 *    the product's ratings. Both fade in once the opening beat is done, so the
 *    statement is never competing with them.
 */

type Spec = { label: string; /** Standard designation, shown as a chip. */ code?: string; value: string }

type Industry = {
  key: string
  /** Basename of the Antares product-category clip and its poster. */
  clip: string
  /**
   * The ground the product sits on. A lit colour field rather than footage —
   * the render is the subject, and a moving photograph behind it competes
   * with the very thing it is meant to present.
   */
  ground: string
  product: string
  specs: Spec[]
  /** i18n keys for the equipment this industry applies the product to. */
  applications: string[]
  /**
   * Footage of the setting the product serves, for the tab thumbnail. The row
   * answers "where is this used", so it shows the site, not the part — the
   * part is already filling the plate behind it. Stock footage under the
   * Pexels licence, trimmed and re-encoded into `public/videos/industries/`.
   */
  apply: string
}

const INDUSTRIES: Industry[] = [
  {
    key: "oilgas",
    apply: "/videos/industries/oilgas.mp4",
    applications: ["valves", "pumps", "compressors"],
    clip: "compression-packings",
    ground:
      "radial-gradient(ellipse 95% 75% at 50% 25%, #6b6560 0%, #45403c 55%, #2a2724 100%)",
    product: "ULTRA FE 1003",
    specs: [
      { label: "certification", code: "API 622 · API 607", value: "fire-safe qualified" },
      { label: "emission", value: "< 20 ppm fugitive" },
      { label: "form", value: "continuous rope · preformed rings" },
    ],
  },
  {
    key: "power",
    apply: "/videos/industries/power.mp4",
    applications: ["turbines", "boilerFeed", "valves"],
    clip: "graphite-moulded-products",
    ground:
      "radial-gradient(ellipse 95% 75% at 50% 25%, #2f5f7a 0%, #1d3d50 55%, #0e1e28 100%)",
    product: "CG 900",
    specs: [
      { label: "material", value: "flexible graphite" },
      { label: "service", value: "high temperature · high pressure" },
      { label: "resistance", value: "oxidation · pressure surge" },
    ],
  },
  {
    key: "chemical",
    apply: "/videos/industries/chemical.mp4",
    applications: ["reactors", "pumps", "agitators"],
    clip: "flange-joint-gaskets",
    ground:
      "radial-gradient(ellipse 95% 75% at 50% 25%, #4a3f7a 0%, #2e2750 55%, #17142b 100%)",
    product: "PE 504",
    specs: [
      { label: "chemicalRange", value: "pH 0 – 14" },
      { label: "friction", value: "low · self-lubricating" },
      { label: "service", value: "pumps · valves" },
    ],
  },
  {
    key: "metallurgy",
    apply: "/videos/industries/metallurgy.mp4",
    applications: ["furnaces", "moltenMetal", "flanges"],
    clip: "thermal-insulation",
    ground:
      "radial-gradient(ellipse 95% 75% at 50% 25%, #9c3f1c 0%, #6b2810 55%, #331306 100%)",
    product: "CG 102",
    specs: [
      { label: "reinforcement", value: "Inconel" },
      { label: "conductivity", value: "high thermal" },
      { label: "resistance", value: "thermal shock · cycling" },
    ],
  },
  {
    key: "machinery",
    apply: "/videos/industries/machinery.mp4",
    applications: ["pumps", "reciprocating", "agitators"],
    clip: "metallic-gaskets",
    ground:
      "radial-gradient(ellipse 95% 75% at 50% 25%, #55632e 0%, #37401e 55%, #1b200f 100%)",
    product: "HY 105",
    specs: [
      { label: "construction", value: "aramid corners · PTFE faces" },
      { label: "core", value: "high-tensile aramid" },
      { label: "service", value: "pumps · reciprocating" },
    ],
  },
]

/**
 * Beat lengths in viewports. The reference gives its opening roughly three
 * times an industry beat; section height falls out of these, so re-pacing the
 * whole thing is a one-number edit.
 */
const BASE_BEATS = 5
const ITEM_BEATS = 2
const TOTAL_BEATS = BASE_BEATS + INDUSTRIES.length * ITEM_BEATS
// Tailwind needs a static class, so the section height below is written out as
// `h-[1500vh]`. Keep it equal to TOTAL_BEATS * 100 when re-pacing the beats.
const BASE_END = BASE_BEATS / TOTAL_BEATS

const IndustriesSection = () => {
  const t = useTranslations("home.industries")
  const ref = useRef<HTMLElement>(null)
  const baseVideoRef = useRef<HTMLVideoElement>(null)
  const [active, setActive] = useState(-1)
  const [baseDuration, setBaseDuration] = useState(0)

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  })

  // -1 while the opening beat holds, then one index per industry beat.
  useMotionValueEvent(scrollYProgress, "change", (p) => {
    if (p < BASE_END) {
      setActive(-1)
      return
    }
    const local = (p - BASE_END) / (1 - BASE_END)
    setActive(
      Math.min(INDUSTRIES.length - 1, Math.max(0, Math.floor(local * INDUSTRIES.length)))
    )
  })

  const statementOpacity = useTransform(
    scrollYProgress,
    [BASE_END - 0.05, BASE_END + 0.02],
    [1, 0]
  )
  // A slow push across the whole section rather than just the opening beat —
  // the sleeve is on screen the entire time now.
  const baseScale = useTransform(scrollYProgress, [0, 1], [1.04, 1.16])
  const chromeOpacity = useTransform(
    scrollYProgress,
    [BASE_END + 0.02, BASE_END + 0.09],
    [0, 1]
  )

  // Metadata can land before React attaches its handler — a cached file usually
  // does — so read the duration directly as well as listening for it.
  useEffect(() => {
    const video = baseVideoRef.current
    if (!video) return

    if (video.readyState >= HTMLMediaElement.HAVE_METADATA) {
      setBaseDuration(video.duration)
      return
    }
    const onMeta = () => setBaseDuration(video.duration)
    video.addEventListener("loadedmetadata", onMeta)
    return () => video.removeEventListener("loadedmetadata", onMeta)
  }, [])

  useEffect(() => {
    const video = baseVideoRef.current
    if (!video || !baseDuration) return

    let frame = 0
    let target = 0

    // The clip plays out across the whole section, so the sleeve keeps turning
    // through every industry beat rather than freezing after the opening.
    const map = (p: number) => {
      const local = Math.min(1, Math.max(0, p))
      // Stop a hair short so rounding can never seek past the last frame.
      return local * (baseDuration - 0.05)
    }

    target = map(scrollYProgress.get())
    const unsubscribe = scrollYProgress.on("change", (p) => {
      target = map(p)
    })

    // One seek per frame — seeking on every scroll event floods the decoder.
    const tick = () => {
      if (Math.abs(video.currentTime - target) > 0.01) {
        video.currentTime = target
      }
      frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)

    return () => {
      unsubscribe()
      cancelAnimationFrame(frame)
    }
  }, [scrollYProgress, baseDuration])

  const current = active >= 0 ? INDUSTRIES[active] : null

  return (
    <section
      id="industries"
      ref={ref}
      className="relative h-[1500vh] w-full"
    >
      <div className="bg-ink sticky top-0 h-svh w-full overflow-hidden">
        <motion.div
          style={{ scale: baseScale }}
          className="absolute inset-0 will-change-transform"
        >
          <video
            ref={baseVideoRef}
            className="h-full w-full object-cover"
            src="/videos/industries/self-closing.mp4"
            poster="/images/industries/self-closing.jpg"
            muted
            playsInline
            preload="auto"
            // Seeking a never-played element is legal, but some browsers only
            // paint the seeked frame once it has been "used" — start it and
            // pause immediately.
            autoPlay
            onPlay={(e) => e.currentTarget.pause()}
          />
          {INDUSTRIES.map((industry, i) => (
            <IndustryTint
              key={industry.key}
              industry={industry}
              index={i}
              active={active}
            />
          ))}

          <div className="absolute inset-0 bg-black/25" />

          <motion.div
            style={{ opacity: statementOpacity }}
            className="absolute inset-0 flex items-center justify-center px-5"
          >
            <SplitTitle
              as="h2"
              text={t("stage")}
              className="rtitle-large max-w-[18ch] text-center text-white"
            />
          </motion.div>
        </motion.div>

        <SpecAnnotation show={active >= 0} progress={scrollYProgress} />

        <motion.div
          style={{ opacity: chromeOpacity }}
          className="rcontainer pointer-events-none absolute inset-x-0 top-0 flex h-full items-end gap-6 py-10"
        >
          <IndustryTabs active={active} labelOf={(k) => t(`tabs.${k}`)} />
          <SpecCard
            industry={current}
            labelOf={(k) => t(`specs.${k}`)}
            appLabel={(k) => t(`applications.${k}`)}
            appliedIn={t("appliedIn")}
          />
        </motion.div>
      </div>
    </section>
  )
}

/**
 * One industry beat: its footage with the transparent product render laid over
 * it. Both drift together so the plate is never a still frame while on screen.
 */
function IndustryTint({
  industry,
  index,
  active,
}: {
  industry: Industry
  index: number
  active: number
}) {
  return (
    <motion.div
      className="absolute inset-0 mix-blend-multiply"
      style={{ background: industry.ground }}
      animate={{ opacity: index === active ? 0.62 : 0 }}
      transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
    />
  )
}

/**
 * Glass accordion. Every row is always present; the active one grows to admit
 * its footage, which makes the list read as one object rearranging rather than
 * panels swapping.
 */
function IndustryTabs({
  active,
  labelOf,
}: {
  active: number
  labelOf: (key: string) => string
}) {
  return (
    <div className="pointer-events-auto w-full max-w-[500px] overflow-hidden rounded-[20px] bg-white/10 backdrop-blur-xl">
      {INDUSTRIES.map((industry, i) => {
        const isActive = i === active
        return (
          <div key={industry.key}>
            <div className="flex items-center justify-between px-[26px] py-[18px]">
              <span
                className={cn(
                  "text-[15px] transition-colors duration-500 [transition-timing-function:var(--e-expo-out)]",
                  isActive ? "text-white" : "text-white/45"
                )}
              >
                {labelOf(industry.key)}
              </span>
              <span
                className={cn(
                  "size-1.5 rounded-full transition-colors duration-500",
                  isActive ? "bg-white" : "bg-white/25"
                )}
              />
            </div>

            <motion.div
              initial={false}
              animate={{ height: isActive ? "auto" : 0, opacity: isActive ? 1 : 0 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="overflow-hidden"
            >
              <div className="px-[26px] pb-[18px]">
                <div className="relative aspect-video w-full overflow-hidden rounded-[14px]">
                  <video
                    className="h-full w-full object-cover"
                    src={industry.apply}
                    poster={`/images/industries/${industry.key}.jpg`}
                    autoPlay
                    muted
                    loop
                    playsInline
                    preload="none"
                  />
                </div>
              </div>
            </motion.div>
          </div>
        )
      })}
    </div>
  )
}

/**
 * Glass spec sheet for whichever product the active industry uses, with the
 * annotation that ties it to the object: a ring and dot sitting on the sleeve,
 * joined to the card by a dashed leader. The leader is drawn in percentage
 * coordinates over the whole stage so it lands in the same place at any size.
 */
function SpecCard({
  industry,
  labelOf,
  appLabel,
  appliedIn,
}: {
  industry: Industry | null
  labelOf: (key: string) => string
  appLabel: (key: string) => string
  appliedIn: string
}) {
  if (!industry) return null

  return (
    <motion.div
      key={industry.key}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="pointer-events-auto ml-auto hidden w-full max-w-[540px] flex-col gap-7 rounded-[16px] bg-white/15 p-7 text-white backdrop-blur-xl lg:flex"
    >
      <h3 className="rtitle rtitle-large leading-none">{industry.product}</h3>

      <dl className="space-y-5">
        {industry.specs.map((spec) => (
          <div key={spec.label}>
            <dt className="label-mono flex items-center gap-2 text-white/70">
              {labelOf(spec.label)}
            </dt>
            <dd className="mt-1.5 flex flex-wrap items-baseline gap-2">
              {spec.code && (
                <span className="bg-primary rounded-[6px] px-2 py-0.5 font-mono text-[11px] tracking-wider text-white">
                  {spec.code}
                </span>
              )}
              <span
                className="font-mono text-[13px] tracking-wide text-white/90"
              >
                {spec.value}
              </span>
            </dd>
          </div>
        ))}
      </dl>

      <div>
        <span className="label-mono text-white/70">{appliedIn}</span>
        <ul className="mt-2 flex flex-wrap gap-2">
          {industry.applications.map((a) => (
            <li
              key={a}
              className="rounded-full border border-white/25 px-3 py-1 text-[13px] text-white/90"
            >
              {appLabel(a)}
            </li>
          ))}
        </ul>
      </div>

    </motion.div>
  )
}

/**
 * The annotation that ties the spec card to the object.
 *
 * Built the way the reference builds it: a ring, a filled dot at its exact
 * centre, and a leader anchored to that same centre point with its transform
 * origin there, so the line always starts *at* the dot rather than near it.
 * The leader draws itself outward when the beat arrives.
 *
 * The whole thing drifts down with scroll on the same curve as the product
 * render, so it reads as sitting on the sleeve instead of floating over it.
 */
function SpecAnnotation({
  show,
  progress,
}: {
  show: boolean
  progress: MotionValue<number>
}) {
  const y = useTransform(progress, [0, 1], ["-3.5vh", "3.5vh"])

  return (
    <motion.div
      style={{ y }}
      className="pointer-events-none absolute top-[60%] left-[50%] hidden will-change-transform lg:block"
      aria-hidden
    >
      {/* Everything below is positioned against this single point. */}
      <motion.div
        className="relative"
        initial={false}
        animate={{ opacity: show ? 1 : 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      >
        <motion.span
          className="absolute size-20 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/80"
          initial={false}
          animate={{ scale: show ? 1 : 0.6 }}
          transition={{
            duration: 0.6,
            ease: [0.16, 1, 0.3, 1],
            delay: show ? 0.1 : 0,
          }}
        />

        <motion.span
          className="absolute top-0 left-0 h-px origin-left -rotate-[32deg]"
          style={{
            background:
              "repeating-linear-gradient(to right, rgba(255,255,255,0.9) 0 6px, transparent 6px 12px)",
          }}
          initial={false}
          animate={{ width: show ? 200 : 0 }}
          transition={{
            duration: 0.7,
            ease: [0.16, 1, 0.3, 1],
            delay: show ? 0.3 : 0,
          }}
        />

        <span className="absolute size-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white" />
      </motion.div>
    </motion.div>
  )
}

export default IndustriesSection
