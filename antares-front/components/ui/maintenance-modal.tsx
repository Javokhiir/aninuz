"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useTranslations } from "next-intl"

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
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: 40 }}
            transition={{ type: "spring", stiffness: 280, damping: 22 }}
            onClick={(e) => e.stopPropagation()}
            className="relative mx-4 w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-2xl"
          >
            {/* top color bar */}
            <div className="h-1.5 w-full bg-gradient-to-r from-blue-400 via-blue-600 to-blue-400 bg-[length:200%_100%] animate-[shimmer_2s_linear_infinite]" />

            <div className="flex flex-col items-center gap-6 px-8 py-10">
              {/* animated icon stack */}
              <div className="relative flex h-24 w-24 items-center justify-center">
                {/* outer ping ring */}
                <span className="absolute inline-flex h-24 w-24 animate-ping rounded-full bg-blue-100 opacity-60" />
                {/* middle ring */}
                <span className="absolute inline-flex h-16 w-16 animate-pulse rounded-full bg-blue-50" />
                {/* gear icon */}
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 8, ease: "linear" }}
                  className="relative z-10"
                >
                  <svg
                    className="h-10 w-10 text-blue-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                    />
                  </svg>
                </motion.div>
              </div>

              {/* text */}
              <div className="flex flex-col items-center gap-2 text-center">
                <h2 className="text-xl font-bold text-gray-900">{t("title")}</h2>
                <p className="text-sm leading-relaxed text-gray-500">{t("desc")}</p>
              </div>

              {/* status badge */}
              <div className="flex items-center gap-2 rounded-full bg-blue-50 px-5 py-2 text-xs font-semibold text-blue-600">
                <span className="h-2 w-2 animate-pulse rounded-full bg-blue-500" />
                {t("status")}
              </div>

              {/* close button */}
              <button
                onClick={() => setOpen(false)}
                className="mt-2 w-full rounded-xl bg-gray-100 py-3 text-sm font-medium text-gray-600 transition hover:bg-gray-200 active:scale-95"
              >
                {t("close")}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
