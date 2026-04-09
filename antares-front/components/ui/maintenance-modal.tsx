"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useTranslations } from "next-intl"
import BorderGlow from "@/components/ui/BorderGlow"

export function MaintenanceModal() {
  const t = useTranslations("maintenance")
  const [open, setOpen] = useState(false)

  useEffect(() => {
    setOpen(true)
  }, [])

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed left-0 top-0 z-[9999] flex h-screen w-screen items-center justify-center bg-black/75 backdrop-blur-lg"
          onClick={() => setOpen(false)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8, rotateX: 15 }}
            animate={{ opacity: 1, scale: 1, rotateX: 0 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            onClick={(e) => e.stopPropagation()}
            className="mx-4 w-full max-w-sm"
            style={{ perspective: "1000px" }}
          >
            <BorderGlow
              borderRadius={32}
              backgroundColor="#050c1a"
              glowColor="227 72 65"
              colors={['#1e40af', '#3b82f6', '#60a5fa']}
              glowRadius={60}
              glowIntensity={1.5}
              coneSpread={35}
              fillOpacity={0.6}
              animated
            >
              <div className="relative flex flex-col items-center gap-0 overflow-hidden">
                {/* hero image area */}
                <div className="relative flex h-48 w-full items-center justify-center overflow-hidden">
                  {/* grid lines */}
                  <div
                    className="absolute inset-0 opacity-20"
                    style={{
                      backgroundImage: `
                        linear-gradient(rgba(30,64,175,0.4) 1px, transparent 1px),
                        linear-gradient(90deg, rgba(30,64,175,0.4) 1px, transparent 1px)
                      `,
                      backgroundSize: "32px 32px",
                      maskImage: "radial-gradient(ellipse at center, black 30%, transparent 80%)",
                    }}
                  />

                  {/* center glow blob */}
                  <div className="absolute h-40 w-40 rounded-full bg-blue-700/20 blur-3xl" />
                  <div className="absolute h-24 w-24 rounded-full bg-blue-400/15 blur-2xl" />

                  {/* big icon */}
                  <motion.div
                    animate={{ y: [-6, 6, -6] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    className="relative z-10 flex h-24 w-24 items-center justify-center rounded-3xl"
                    style={{
                      background: "linear-gradient(135deg, rgba(30,64,175,0.2), rgba(59,130,246,0.2))",
                      border: "1px solid rgba(30,64,175,0.3)",
                      boxShadow: "0 0 40px rgba(30,64,175,0.25), inset 0 0 20px rgba(30,64,175,0.1)",
                    }}
                  >
                    <svg className="h-12 w-12" viewBox="0 0 48 48" fill="none">
                      <motion.path
                        d="M24 4L44 14V34L24 44L4 34V14L24 4Z"
                        stroke="url(#hexGrad)"
                        strokeWidth="1.5"
                        strokeLinejoin="round"
                        fill="none"
                        animate={{ pathLength: [0, 1, 0] }}
                        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                      />
                      <motion.circle
                        cx="24"
                        cy="24"
                        r="8"
                        fill="url(#circleGrad)"
                        animate={{ scale: [0.8, 1.1, 0.8], opacity: [0.6, 1, 0.6] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                      />
                      <defs>
                        <linearGradient id="hexGrad" x1="4" y1="4" x2="44" y2="44">
                          <stop offset="0%" stopColor="#3b82f6" />
                          <stop offset="100%" stopColor="#60a5fa" />
                        </linearGradient>
                        <radialGradient id="circleGrad">
                          <stop offset="0%" stopColor="#60a5fa" />
                          <stop offset="100%" stopColor="#3b82f6" />
                        </radialGradient>
                      </defs>
                    </svg>
                  </motion.div>

                  {/* orbiting dots */}
                  {[0, 120, 240].map((deg, i) => (
                    <motion.div
                      key={i}
                      className="absolute h-2 w-2 rounded-full bg-blue-400"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 6 + i, repeat: Infinity, ease: "linear" }}
                      style={{
                        transformOrigin: "50% 50%",
                        transform: `rotate(${deg}deg) translateX(52px)`,
                        opacity: 0.6,
                        boxShadow: "0 0 6px rgba(30,64,175,0.8)",
                      }}
                    />
                  ))}
                </div>

                {/* content */}
                <div className="flex w-full flex-col items-center gap-5 px-8 pb-8">
                  <div className="h-px w-full bg-gradient-to-r from-transparent via-blue-500/30 to-transparent" />

                  <div className="flex flex-col items-center gap-2 text-center">
                    <h2
                      className="text-2xl font-black text-transparent"
                      style={{
                        backgroundImage: "linear-gradient(135deg, #93c5fd, #3b82f6, #1d4ed8)",
                        WebkitBackgroundClip: "text",
                        backgroundClip: "text",
                      }}
                    >
                      {t("title")}
                    </h2>
                    <p className="text-sm leading-relaxed text-white/40">{t("desc")}</p>
                  </div>

                  <div
                    className="flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold text-blue-300"
                    style={{
                      background: "rgba(30,64,175,0.08)",
                      border: "1px solid rgba(30,64,175,0.2)",
                    }}
                  >
                    <motion.span
                      className="h-1.5 w-1.5 rounded-full bg-blue-400"
                      animate={{ opacity: [1, 0.2, 1] }}
                      transition={{ duration: 1.2, repeat: Infinity }}
                    />
                    {t("status")}
                  </div>

                  <button
                    onClick={() => setOpen(false)}
                    className="w-full rounded-2xl py-3.5 text-sm font-bold text-white transition-all duration-200 active:scale-95"
                    style={{
                      background: "linear-gradient(135deg, rgba(30,64,175,0.25), rgba(59,130,246,0.25))",
                      border: "1px solid rgba(30,64,175,0.3)",
                      boxShadow: "0 0 30px rgba(30,64,175,0.1)",
                    }}
                  >
                    {t("close")}
                  </button>
                </div>
              </div>
            </BorderGlow>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
