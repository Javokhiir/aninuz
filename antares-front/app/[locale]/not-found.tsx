import { useTranslations } from "next-intl"

const NotFoundPage = () => {
  const t = useTranslations("notFound")
  return (
    <div className="bg-secondary-pink flex h-screen w-screen flex-col items-center justify-center p-4">
      <div className="flex w-full max-w-[600px] flex-col items-center space-y-6 rounded-[24px] bg-white/30 px-6 py-10 lg:max-w-[800px] lg:p-14">
        <h1>404</h1>

        <h1 className="text-center text-4xl font-bold uppercase">
          {t("title")}
        </h1>

        <p className="text-center">{t("subtitle")}</p>
      </div>
    </div>
  )
}

export default NotFoundPage
