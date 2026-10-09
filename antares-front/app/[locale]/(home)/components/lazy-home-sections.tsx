"use client"

import {
  lazy,
  Suspense,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react"

const StepperSection = lazy(() => import("./stepper"))
const FieldsSection = lazy(() => import("./fields"))
const MapSection = lazy(() => import("./map"))
const LineSection = lazy(() => import("./line"))

type DeferredSectionProps = {
  children: ReactNode
  minHeight: number
}

/**
 * Keeps below-the-fold sections out of the initial JS/render path. The generous
 * root margin starts loading before the section becomes visible, while the
 * reserved height prevents layout jumps on slower devices.
 */
function DeferredSection({ children, minHeight }: DeferredSectionProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const element = ref.current
    if (!element || !("IntersectionObserver" in window)) {
      setReady(true)
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        setReady(true)
        observer.disconnect()
      },
      { rootMargin: "500px 0px" }
    )

    observer.observe(element)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      style={{
        minHeight,
        contentVisibility: "auto",
        containIntrinsicSize: `1px ${minHeight}px`,
      }}
    >
      {ready && (
        <Suspense fallback={null}>
          {children}
        </Suspense>
      )}
    </div>
  )
}

export default function LazyHomeSections() {
  return (
    <>
      <DeferredSection minHeight={420}>
        <StepperSection />
      </DeferredSection>
      <DeferredSection minHeight={620}>
        <FieldsSection />
      </DeferredSection>
      <DeferredSection minHeight={520}>
        <MapSection />
      </DeferredSection>
      <DeferredSection minHeight={520}>
        <LineSection />
      </DeferredSection>
    </>
  )
}
