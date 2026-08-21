"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { Link, usePathname } from "@/i18n/routing"
import { AnimatePresence, motion } from "framer-motion"
import { useTranslations } from "next-intl"

import { cn } from "@/lib/utils"
import { useSurfaceTone } from "@/hooks/useSurfaceTone"
import { LangSwitcher } from "@/components/langSwitcher"

/**
 * The landing page's persistent chrome.
 *
 * The reference site pins exactly two things for the whole scroll: a glass pill
 * at top centre holding the logo and the section tabs, and a second glass pill
 * at bottom centre holding a single action whose label changes with the section
 * you're in. Nothing else is fixed. Both are lifted here at the reference's own
 * measurements — 52px and 48px tall, 20px radius, 20px and 25px blur — because
 * the proportions are most of what makes the page recognisable.
 */

/** Kept to four so the pill stays near the reference's proportions; the rest of
 *  the site is reachable from the footer. */
const TOP_LINKS = [
  { key: "home", href: "/" },
  { key: "products", href: "/products" },
  { key: "childServices", href: "/services" },
  { key: "contact", href: "/contacts" },
] as const

export function FloatingHeader() {
  const t = useTranslations("nav")
  const pathname = usePathname()

  // 17px of padding plus half the 52px pill: the point the bar actually covers.
  const tone = useSurfaceTone(43)
  const onDark = tone === "dark"

  return (
    <header
      data-chrome-ignore
      className="pointer-events-none fixed inset-x-0 top-0 z-[80] py-[17px]"
    >
      <div className="flex justify-center gap-[10px] px-5">
        <nav
          className={cn(
            "rglass pointer-events-auto flex h-[52px] items-center p-[6px] transition-[background-color,box-shadow] duration-500 [transition-timing-function:var(--e-expo-out)]",
            !onDark && "rglass-on-light"
          )}
        >
          <Link
            href="/"
            aria-label="Antares Investments"
            className="flex h-10 shrink-0 items-center rounded-[8px] pr-5 pl-4"
          >
            <Image
              src="/logos/logo-with-text.png"
              alt="Antares Investments"
              width={340}
              height={34}
              priority
              className={cn(
                "h-[30px] w-auto brightness-0 transition-[filter] duration-500",
                onDark && "invert"
              )}
            />
          </Link>

          <ul className="flex items-center">
            {TOP_LINKS.map(({ key, href }) => {
              const active = pathname === href
              return (
                <li key={key} className="relative">
                  {active && (
                    <motion.span
                      layoutId="chrome-tab"
                      className="bg-ink absolute inset-0 rounded-[15px]"
                      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                    />
                  )}
                  <Link
                    href={href}
                    className={cn(
                      "relative flex h-10 items-center px-4 text-[15px] leading-10 whitespace-nowrap transition-[opacity,color] duration-300 lg:px-7",
                      // The active tab keeps its ink pill on either surface, so
                      // its label stays white while the rest follows the tone.
                      active
                        ? "text-white opacity-100"
                        : cn(
                            "opacity-60 hover:opacity-100",
                            onDark ? "text-white" : "text-ink"
                          )
                    )}
                  >
                    {t(key)}
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>

        {/* Its own pill rather than a slot in the nav: the tabs are the page's
            navigation and the language is a setting, and keeping them apart
            reads that way at a glance. */}
        <div
          className={cn(
            "rglass pointer-events-auto flex h-[52px] shrink-0 items-center p-[6px] transition-[background-color,box-shadow] duration-500 [transition-timing-function:var(--e-expo-out)]",
            !onDark && "rglass-on-light"
          )}
        >
          <LangSwitcher variant="glass" align="end" tone={tone} />
        </div>
      </div>
    </header>
  )
}

export type FloatingAction = {
  /** Section id this action belongs to; matched against what's on screen. */
  id: string
  label: string
  href: string
  thumbnail: string
}

/**
 * Bottom-centre action pill. One element for the whole page — the label and
 * thumbnail cross-fade as different sections come into view, so the reader
 * always has the action that suits what they are looking at without a new
 * button appearing in each section.
 */
export function FloatingCta({ actions }: { actions: FloatingAction[] }) {
  const [index, setIndex] = useState(0)
  const tone = useSurfaceTone(() => window.innerHeight - 64)

  useEffect(() => {
    if (!actions.length) return

    const sections = actions
      .map((a) => document.getElementById(a.id))
      .filter((el): el is HTMLElement => el !== null)

    if (!sections.length) return

    // Whichever registered section covers the middle of the viewport owns the
    // pill. Reading from a scroll handler rather than IntersectionObserver
    // keeps it correct for the tall sticky sections, which stay "intersecting"
    // for several viewports at a time.
    const pick = () => {
      const mid = window.innerHeight / 2
      let next = 0
      sections.forEach((el, i) => {
        const r = el.getBoundingClientRect()
        if (r.top <= mid && r.bottom >= mid) next = i
      })
      setIndex(next)
    }

    pick()
    window.addEventListener("scroll", pick, { passive: true })
    window.addEventListener("resize", pick)
    return () => {
      window.removeEventListener("scroll", pick)
      window.removeEventListener("resize", pick)
    }
  }, [actions])

  const action = actions[index]
  if (!action) return null

  return (
    <div
      data-chrome-ignore
      className="pointer-events-none fixed inset-x-0 bottom-10 z-[80] flex justify-center px-5"
    >
      <Link
        href={action.href}
        className={cn(
          "rglass text-ink pointer-events-auto flex h-12 items-center gap-3 p-1 pr-6 transition-colors duration-500 [transition-timing-function:var(--e-expo-out)] hover:bg-white/40",
          tone === "light" && "rglass-on-light"
        )}
      >
        <span className="relative size-10 shrink-0 overflow-hidden rounded-[16px]">
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.span
              key={action.thumbnail}
              className="absolute inset-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
            >
              <Image
                src={action.thumbnail}
                alt=""
                fill
                sizes="40px"
                className="object-cover"
              />
            </motion.span>
          </AnimatePresence>
        </span>

        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span
            key={action.label}
            className="text-[15px] whitespace-nowrap"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          >
            {action.label}
          </motion.span>
        </AnimatePresence>
      </Link>
    </div>
  )
}
