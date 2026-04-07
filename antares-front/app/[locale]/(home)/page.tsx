import FieldsSection from "./components/fields"
import HeroSection from "./components/hero"
import LineSection from "./components/line"
import MapSection from "./components/map"
import Partners from "./components/partners"
import StepperSection from "./components/stepper"

export default function Home() {
  return (
    <div className="space-y-10 md:space-y-20">
      <HeroSection />
      <div className="mx-auto max-w-[1400px] space-y-10 px-5 md:space-y-20">
        <Partners />
        <StepperSection />
        <FieldsSection />
        <MapSection />
        <LineSection />
      </div>
    </div>
  )
}
