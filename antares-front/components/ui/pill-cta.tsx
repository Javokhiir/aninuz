"use client"

import Image from "next/image"
import { Link } from "@/i18n/routing"
import { ArrowRight } from "lucide-react"

import { cn } from "@/lib/utils"

type PillCtaProps = {
  href: string
  label: string
  /** Optional square media that sits in the leading slot instead of the arrow. */
  thumbnail?: string
  /**
   * `glass` floats over media, `solid` sits on a flat surface, `ghost` is the
   * quieter second action that sits beside a `glass` primary.
   */
  variant?: "glass" | "solid" | "ghost"
  className?: string
}

/**
 * The landing page's single call-to-action shape: a pill with a round leading
 * slot. Over video it runs as frosted glass; on flat surfaces it goes solid so
 * the blur doesn't read as a smudge.
 */
export function PillCta({
  href,
  label,
  thumbnail,
  variant = "glass",
  className,
}: PillCtaProps) {
  return (
    <Link
      href={href}
      className={cn(
        "group inline-flex items-center gap-3 rounded-full p-1.5 pr-6 transition-colors duration-500",
        "[transition-timing-function:var(--e-expo-out)]",
        variant === "glass" &&
          "border border-white/20 bg-white/15 text-white backdrop-blur-md hover:bg-white/25",
        variant === "ghost" &&
          "border border-white/35 text-white hover:bg-white/10",
        variant === "solid" && "bg-ink hover:bg-ink-alt2 text-white",
        className
      )}
    >
      <span
        className={cn(
          "relative flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-full",
          thumbnail
            ? ""
            : variant === "ghost"
              ? "border border-white/35"
              : "bg-white"
        )}
      >
        {thumbnail ? (
          <Image
            src={thumbnail}
            alt=""
            fill
            sizes="36px"
            className="object-cover"
          />
        ) : (
          <ArrowRight
            className={cn(
              "size-4 transition-transform duration-500 [transition-timing-function:var(--e-expo-out)] group-hover:translate-x-0.5",
              variant === "ghost" ? "text-white" : "text-primary"
            )}
            strokeWidth={2.2}
          />
        )}
      </span>
      <span className="text-sm font-medium whitespace-nowrap md:text-base">
        {label}
      </span>
    </Link>
  )
}

export default PillCta
