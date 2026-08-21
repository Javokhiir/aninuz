"use client"

import { useEffect, useRef, useState, type FC } from "react"
import { usePathname } from "@/i18n/routing"
import { AnimatePresence, motion } from "framer-motion"
import { Check, ChevronDown, Globe } from "lucide-react"
import { useLocale } from "next-intl"

import { cn } from "@/lib/utils"

/**
 * Language switcher.
 *
 * One component for both pieces of chrome: the landing page's glass pills want
 * white-on-translucent, the site bar wants the solid Antares blue, and nothing
 * else about the control differs — so the look is a `variant` rather than two
 * components drifting apart.
 *
 * The list shows each language in its own script (a reader looking for Uzbek is
 * looking for "O'zbekcha", not "UZ"), with the short code kept alongside as the
 * compact label for the trigger.
 */

const LOCALES = [
  { code: "ru", short: "RU", label: "Русский" },
  { code: "en", short: "EN", label: "English" },
  { code: "uz", short: "UZ", label: "O'zbekcha" },
] as const

type Variant = "glass" | "solid"

type LangSwitcherProps = {
  className?: string
  variant?: Variant
  /** Where the panel opens from; the site bar hangs it under the trigger. */
  align?: "start" | "end"
  /**
   * Tone of the surface behind the glass variant — "dark" surfaces get white
   * type, light ones get ink. Ignored by the solid variant, which brings its
   * own background.
   */
  tone?: "light" | "dark"
}

export const LangSwitcher: FC<LangSwitcherProps> = ({
  className,
  variant = "solid",
  align = "end",
  tone = "dark",
}) => {
  const locale = useLocale()
  const pathname = usePathname()

  const [open, setOpen] = useState(false)
  const [pending, setPending] = useState<string | null>(null)
  const rootRef = useRef<HTMLDivElement>(null)

  const current = LOCALES.find((l) => l.code === locale) ?? LOCALES[0]

  // Click-away and Escape, bound only while the panel is open.
  useEffect(() => {
    if (!open) return

    const onPointerDown = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false)
    }
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false)
    }

    document.addEventListener("pointerdown", onPointerDown)
    document.addEventListener("keydown", onKeyDown)
    return () => {
      document.removeEventListener("pointerdown", onPointerDown)
      document.removeEventListener("keydown", onKeyDown)
    }
  }, [open])

  function select(code: string) {
    setOpen(false)
    if (code === locale) return

    // A full navigation rather than a client push: the messages for the new
    // locale live in a different bundle, and this keeps whatever query string
    // the reader arrived with.
    setPending(code)
    const search = typeof window === "undefined" ? "" : window.location.search
    window.location.href = `/${code}${pathname === "/" ? "" : pathname}${search}`
  }

  const glass = variant === "glass"
  const onDark = tone === "dark"

  return (
    <div ref={rootRef} className={cn("relative", className)}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={current.label}
        className={cn(
          "flex cursor-pointer items-center gap-2 rounded-[15px] text-[15px] font-semibold transition-colors duration-300 [transition-timing-function:var(--e-expo-out)]",
          glass
            ? onDark
              ? "h-10 px-4 text-white/70 hover:text-white"
              : "text-ink/60 hover:text-ink h-10 px-4"
            : "text-primary-foreground bg-primary h-12 px-4 shadow-[inset_0px_1px_4px_5px_rgba(255,255,255,0.1),0px_15px_10px_-6px_hsla(227,72%,39%,0.3)] hover:brightness-110"
        )}
      >
        <Globe className="size-[18px] shrink-0" strokeWidth={2} />
        <span className="tabular-nums">{current.short}</span>
        <ChevronDown
          className={cn(
            "size-4 shrink-0 opacity-70 transition-transform duration-300",
            open && "rotate-180"
          )}
          strokeWidth={2.5}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            role="menu"
            initial={{ opacity: 0, y: -8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.96 }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            className={cn(
              "absolute top-[calc(100%+10px)] z-50 min-w-[188px] origin-top overflow-hidden rounded-[20px] p-[6px]",
              align === "end" ? "right-0" : "left-0",
              glass
                ? onDark
                  ? "rglass border border-white/15"
                  : "rglass rglass-on-light"
                : "border border-black/[0.06] bg-white shadow-[0px_20px_40px_-16px_rgba(28,60,173,0.35)]"
            )}
          >
            {LOCALES.map(({ code, short, label }) => {
              const active = code === locale
              return (
                <button
                  key={code}
                  type="button"
                  role="menuitemradio"
                  aria-checked={active}
                  onClick={() => select(code)}
                  className={cn(
                    "relative flex w-full cursor-pointer items-center gap-3 rounded-[15px] px-4 py-2.5 text-left text-[15px] transition-colors duration-300",
                    glass
                      ? onDark
                        ? active
                          ? "text-white"
                          : "text-white/60 hover:bg-white/10 hover:text-white"
                        : active
                          ? "text-ink"
                          : "text-ink/60 hover:bg-ink/5 hover:text-ink"
                      : active
                        ? "text-primary"
                        : "text-foreground/70 hover:bg-primary/5 hover:text-primary",
                    pending === code && "opacity-60"
                  )}
                >
                  {active && (
                    <motion.span
                      layoutId={`lang-active-${variant}`}
                      className={cn(
                        "absolute inset-0 -z-10 rounded-[15px]",
                        glass
                          ? onDark
                            ? "bg-white/15"
                            : "bg-ink/8"
                          : "bg-primary/8"
                      )}
                      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                    />
                  )}
                  <span
                    className={cn(
                      "w-[26px] shrink-0 text-[12px] font-bold tracking-wider tabular-nums",
                      glass
                        ? onDark
                          ? "text-white/50"
                          : "text-ink/40"
                        : "text-foreground/40",
                      active &&
                        (glass
                          ? onDark
                            ? "text-white/80"
                            : "text-ink/70"
                          : "text-primary/70")
                    )}
                  >
                    {short}
                  </span>
                  <span className="flex-1 font-medium whitespace-nowrap">
                    {label}
                  </span>
                  {active && (
                    <Check className="size-4 shrink-0" strokeWidth={3} />
                  )}
                </button>
              )
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
