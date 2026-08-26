"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { Link, usePathname } from "@/i18n/routing"
import { useCartDrawer } from "@/states/cart-drawer"
import { useCartStore } from "@/states/store"
import { AnimatePresence, motion } from "framer-motion"
import { ChevronDown } from "lucide-react"
import { useTranslations } from "next-intl"

import { cn } from "@/lib/utils"
import { useMounted } from "@/hooks/useMouted"
import { useSurfaceTone } from "@/hooks/useSurfaceTone"
import { Icons } from "@/components/icons"
import { LangSwitcher } from "@/components/langSwitcher"
import SearchModal from "@/components/navbar/searchModal"

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

/** Kept short so the pill stays near the reference's proportions; everything
 *  else hangs off the "more" panel and the mobile sheet. */
const TOP_LINKS = [
  { key: "home", href: "/" },
  { key: "products", href: "/products" },
  { key: "childServices", href: "/services" },
  { key: "about", href: "/about" },
  { key: "contact", href: "/contacts" },
] as const

const MORE_LINKS = [
  { key: "catalog", href: "/catalog" },
  { key: "certificates", href: "/certificates" },
  { key: "events", href: "/events" },
  { key: "gallery", href: "/gallery" },
] as const

export function FloatingHeader() {
  const t = useTranslations("nav")
  const pathname = usePathname()
  const mounted = useMounted()
  const totalItems = useCartStore((state) => state.totalItems())
  const openCart = useCartDrawer((state) => state.openCart)

  const [moreOpen, setMoreOpen] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  // 17px of padding plus half the 52px pill: the point the bar actually covers.
  const tone = useSurfaceTone(43)
  const onDark = tone === "dark" && !mobileOpen

  const more = MORE_LINKS.map(({ key, href }) => ({ key, href }))
  const moreActive = more.some(({ href }) => pathname.startsWith(href))

  // The mobile sheet covers the page, so lock the scroll behind it.
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : ""
    return () => {
      document.body.style.overflow = ""
    }
  }, [mobileOpen])

  useEffect(() => {
    setMobileOpen(false)
    setMoreOpen(false)
  }, [pathname])

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href)

  return (
    <header
      data-chrome-ignore
      className="pointer-events-none fixed inset-x-0 top-0 z-[80] py-[17px]"
    >
      <div className="flex justify-center gap-[10px] px-5">
        <nav
          className={cn(
            "rglass pointer-events-auto flex h-[52px] min-w-0 items-center p-[6px] transition-[background-color,box-shadow] duration-500 [transition-timing-function:var(--e-expo-out)]",
            !onDark && "rglass-on-light"
          )}
        >
          <Link
            href="/"
            aria-label="Antares Investments"
            className="flex h-10 shrink-0 items-center rounded-[8px] pr-5 pl-4"
          >
            {/* The only logo asset is dark navy on transparent, and over a dark
                section the pill is just 20% white — the mark disappears into it.
                So it follows the tone like the nav labels do: `brightness-0`
                flattens it to black, `invert` takes that to white. On a light
                surface it stays the black mark, untouched. */}
            <Image
              src="/logos/logo-with-text.png"
              alt="Antares Investments"
              width={340}
              height={34}
              priority
              className={cn(
                "h-[30px] w-auto transition-[filter] duration-500 [transition-timing-function:var(--e-expo-out)]",
                onDark && "brightness-0 invert"
              )}
            />
          </Link>

          <ul className="hidden items-center lg:flex">
            {TOP_LINKS.map(({ key, href }) => {
              const active = isActive(href)
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
                      "relative flex h-10 items-center px-4 text-[15px] leading-10 whitespace-nowrap transition-[opacity,color] duration-300 xl:px-6",
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

            {/* Everything the four primary tabs don't carry. A hover panel
                rather than a fifth and sixth tab, which would push the pill
                past the width the proportions depend on. */}
            <li
              className="relative"
              onMouseEnter={() => setMoreOpen(true)}
              onMouseLeave={() => setMoreOpen(false)}
            >
              <button
                type="button"
                onClick={() => setMoreOpen((v) => !v)}
                aria-expanded={moreOpen}
                className={cn(
                  "relative flex h-10 cursor-pointer items-center gap-1.5 px-4 text-[15px] whitespace-nowrap transition-[opacity,color] duration-300 xl:px-6",
                  moreActive || moreOpen ? "opacity-100" : "opacity-60 hover:opacity-100",
                  onDark ? "text-white" : "text-ink"
                )}
              >
                {t("services")}
                <ChevronDown
                  className={cn(
                    "size-4 transition-transform duration-300",
                    moreOpen && "rotate-180"
                  )}
                />
              </button>

              <AnimatePresence>
                {moreOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                    className="absolute top-[calc(100%+10px)] left-1/2 w-max -translate-x-1/2 overflow-hidden rounded-[20px] bg-white/90 p-[6px] shadow-[0_20px_50px_-24px_rgba(28,28,28,0.5)] backdrop-blur-[20px]"
                  >
                    {more.map(({ key, href }) => (
                      <Link
                        key={key}
                        href={href}
                        className={cn(
                          "text-ink flex h-10 items-center rounded-[15px] px-5 text-[15px] whitespace-nowrap transition-colors duration-200",
                          pathname.startsWith(href)
                            ? "bg-ink text-white"
                            : "hover:bg-ink/5"
                        )}
                      >
                        {t(key)}
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </li>
          </ul>

          {/* Below the tab breakpoint the pill keeps only the logo, and the
              routes move into the sheet. */}
          <button
            type="button"
            aria-label="Menu"
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((v) => !v)}
            className="relative ml-1 flex size-10 shrink-0 cursor-pointer items-center justify-center lg:hidden"
          >
            <span
              className={cn(
                "absolute h-[2px] w-5 rounded-full transition-all duration-300",
                onDark ? "bg-white" : "bg-ink",
                mobileOpen ? "rotate-45" : "-translate-y-[4px]"
              )}
            />
            <span
              className={cn(
                "absolute h-[2px] w-5 rounded-full transition-all duration-300",
                onDark ? "bg-white" : "bg-ink",
                mobileOpen ? "-rotate-45" : "translate-y-[4px]"
              )}
            />
          </button>
        </nav>

        {/* Its own pill rather than a slot in the nav: the tabs are the page's
            navigation and search, cart and language are tools, and keeping them
            apart reads that way at a glance. */}
        <div
          className={cn(
            "rglass pointer-events-auto flex h-[52px] shrink-0 items-center gap-1 p-[6px] transition-[background-color,box-shadow] duration-500 [transition-timing-function:var(--e-expo-out)]",
            !onDark && "rglass-on-light"
          )}
        >
          <div className="hidden sm:block">
            <SearchModal
              triggerClassName={cn(
                "flex size-10 cursor-pointer items-center justify-center rounded-[15px] transition-colors duration-300",
                onDark ? "hover:bg-white/15" : "hover:bg-ink/5"
              )}
              iconClassName={cn(
                "size-[18px] transition-colors duration-300",
                onDark ? "text-white" : "text-ink"
              )}
            />
          </div>

          {/* Opens the cart drawer rather than navigating: the cart is a
              running total you adjust while browsing, so leaving the page to
              look at it loses your place. Checkout is still a route. */}
          <button
            type="button"
            onClick={openCart}
            aria-label="Cart"
            className={cn(
              "relative flex size-10 cursor-pointer items-center justify-center rounded-[15px] transition-colors duration-300",
              onDark ? "hover:bg-white/15" : "hover:bg-ink/5"
            )}
          >
            <Icons.ShoppingCart
              className={cn(
                "size-[18px] transition-colors duration-300",
                onDark ? "text-white" : "text-ink"
              )}
            />
            {mounted && totalItems > 0 && (
              <span className="bg-primary absolute top-0 right-0 flex size-[18px] items-center justify-center rounded-full text-[10px] font-semibold text-white">
                {totalItems > 99 ? "99+" : totalItems}
              </span>
            )}
          </button>

          <LangSwitcher variant="glass" align="end" tone={tone} />
        </div>
      </div>

      {/* Mobile sheet. One glass plate under the pills carrying every route the
          desktop bar shows, primary tabs and the rest alike. */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="pointer-events-auto fixed inset-x-5 top-[86px] bottom-5 z-[79] overflow-y-auto rounded-[24px] bg-white/85 p-5 backdrop-blur-[20px] lg:hidden"
          >
            <ul className="flex flex-col">
              {[...TOP_LINKS, ...MORE_LINKS].map(({ key, href }) => (
                <li key={key}>
                  <Link
                    href={href}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      "flex h-12 items-center rounded-[15px] px-4 text-lg transition-colors duration-200",
                      isActive(href) ? "bg-ink text-white" : "text-ink"
                    )}
                  >
                    {t(key)}
                  </Link>
                </li>
              ))}
            </ul>

            <div className="border-t-[var(--border-dark-2)] mt-4 flex items-center gap-3 border-t pt-4 sm:hidden">
              <SearchModal
                setIsMobileOpen={setMobileOpen}
                triggerClassName="hover:bg-ink/5 flex size-10 cursor-pointer items-center justify-center rounded-[15px]"
                iconClassName="text-ink size-[18px]"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
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
