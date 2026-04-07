import { useTranslations } from "next-intl"

import AnimatedBorderTrail from "@/components/ui/animated-trails"
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Icons } from "@/components/icons"

const OfferSection = () => {
  const t = useTranslations("about.offers")

  const cards = [
    {
      id: 1,
      icon: (
        <Icons.AboutCard1 className="bg-primary h-14 w-14 rounded-xl p-3 text-[#638EEA]" />
      ),
      title: t("card1Title"),
      text: t("card1Text"),
    },
    {
      id: 2,
      icon: (
        <Icons.AboutCard2 className="bg-primary h-14 w-14 rounded-lg p-3 text-[#638EEA]" />
      ),
      title: t("card2Title"),
      text: t("card2Text"),
    },
    {
      id: 3,
      icon: (
        <Icons.AboutCard3 className="bg-primary h-14 w-14 rounded-lg p-3 text-[#638EEA]" />
      ),
      title: t("card3Title"),
      text: t("card3Text"),
    },
    {
      id: 4,
      icon: (
        <Icons.AboutCard4 className="bg-primary h-14 w-14 rounded-lg p-3 text-[#638EEA]" />
      ),
      title: t("card4Title"),
      text: t("card4Text"),
    },
  ]

  return (
    <section className="layout-container space-y-10">
      <h2 className="mx-auto w-max bg-gradient-to-r from-black via-blue-700 to-black bg-clip-text font-extrabold text-transparent uppercase md:p-10">
        {t("title")}
      </h2>
      <div className="grid grid-cols-1 justify-between gap-14 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {cards.map((card) => (
          <div className="relative w-full" key={card.id}>
            <div className="bg-primary absolute top-5 left-0 z-10 h-[90px] w-[10px] -translate-x-full rounded-l-full" />
            <AnimatedBorderTrail
              key={card.id}
              className="relative z-[10] h-full w-full overflow-clip rounded-xl bg-white/20 md:max-w-[300px]"
              contentClassName="rounded-xl bg-white"
              trailColor="#638EEA"
              trailSize="lg"
            >
              <div className="bg-primary absolute top-4.5 left-0 z-10 h-[90px] w-[10px] rounded-r-full" />
              <Card className="relative z-10 h-full rounded-xl border-none bg-white/50 backdrop-blur-lg">
                <CardHeader className="space-y-10">
                  {card.icon}
                  <div className="space-y-4">
                    <CardTitle className="w-min text-xl">
                      {card.title}
                    </CardTitle>
                    <CardDescription className="text-base text-black">
                      {card.text}
                    </CardDescription>
                  </div>
                </CardHeader>
              </Card>
            </AnimatedBorderTrail>
          </div>
        ))}
      </div>
    </section>
  )
}

export default OfferSection
