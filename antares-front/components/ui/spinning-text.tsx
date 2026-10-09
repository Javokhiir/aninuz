"use client"

import React, { CSSProperties } from "react"

import { cn } from "@/lib/utils"

type SpinningTextProps = {
  children: string
  style?: CSSProperties
  duration?: number
  className?: string
  reverse?: boolean
  fontSize?: number
  radius?: number
}

export function SpinningText({
  children,
  style,
  duration = 10,

  className,
  reverse = false,
  fontSize = 1,
  radius = 5,
}: SpinningTextProps) {
  const letters = children.split("")
  const totalLetters = letters.length

  return (
    <div
      className={cn(
        "relative motion-safe:animate-spin motion-reduce:transform-none",
        className
      )}
      style={{
        ...style,
        animationDuration: `${duration}s`,
        animationDirection: reverse ? "reverse" : "normal",
      }}
    >
      {letters.map((letter, index) => (
        <span
          aria-hidden="true"
          key={`${index}-${letter}`}
          className="absolute top-1/2 left-1/2 inline-block"
          style={
            {
              "--index": index,
              "--total": totalLetters,
              "--font-size": fontSize,
              "--radius": radius,
              fontSize: `calc(var(--font-size, 2) * 1rem)`,
              transform: `
                  translate(-50%, -50%)
                  rotate(calc(360deg / var(--total) * var(--index)))
                  translateY(calc(var(--radius, 5) * -1ch))
                `,
              transformOrigin: "center",
            } as React.CSSProperties
          }
        >
          {letter}
        </span>
      ))}
      <span className="sr-only">{children}</span>
    </div>
  )
}
