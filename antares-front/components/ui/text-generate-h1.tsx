"use client"

import { Children, isValidElement, ReactNode } from "react"
import { motion, useAnimate, useInView } from "framer-motion"

export const TextGenerateEffectH1 = ({
  children,

  filter = true,
  duration = 0.5,
}: {
  children: ReactNode
  className?: string
  filter?: boolean
  duration?: number
}) => {
  const [scope] = useAnimate()
  const isInView = useInView(scope, {
    once: true,
    margin: "0px 0px -100px 0px",
  })

  const renderChildren = (node: ReactNode, idx: number) => {
    if (typeof node === "string") {
      return node.split(" ").map((word, wordIdx) => (
        <motion.span
          key={`${word}-${idx}-${wordIdx}`}
          className="inline-block opacity-0"
          style={{ filter: filter ? "blur(10px)" : "none" }}
          initial={{ opacity: 0, filter: filter ? "blur(10px)" : "none" }}
          animate={isInView ? { opacity: 1, filter: "blur(0px)" } : {}}
          transition={{
            duration,
            delay: (idx + wordIdx) * 0.2,
          }}
        >
          {word}&nbsp;
        </motion.span>
      ))
    }

    if (isValidElement(node) && node.type === "br") {
      return <br key={`br-${idx}`} />
    }

    if (isValidElement(node)) {
      return (
        <motion.span
          key={`el-${idx}`}
          className="inline-block opacity-0"
          style={{ filter: filter ? "blur(10px)" : "none" }}
          initial={{ opacity: 0, filter: filter ? "blur(10px)" : "none" }}
          animate={isInView ? { opacity: 1, filter: "blur(0px)" } : {}}
          transition={{ duration, delay: idx * 0.2 }}
        >
          {node}
        </motion.span>
      )
    }

    return null
  }

  return (
    <h1
      ref={scope}
      className="mx-auto w-full bg-gradient-to-r from-black via-blue-700 to-black bg-clip-text text-center text-3xl leading-16 font-extrabold text-black/30 uppercase md:p-10 md:text-6xl 2xl:text-7xl"
    >
      {Children.toArray(children).map((child, idx) =>
        renderChildren(child, idx)
      )}
    </h1>
  )
}
