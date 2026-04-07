import { useTranslations } from "next-intl"

const UserAgreementPage = () => {
  const t = useTranslations("userAgreement")

  return (
    <div className="layout-container space-y-5 py-10">
      <h1 className="mx-auto w-full max-w-[1000px] bg-gradient-to-r from-black via-blue-700 to-black bg-clip-text text-center text-2xl font-extrabold text-transparent uppercase md:text-5xl md:leading-[80px] 2xl:text-6xl">
        {t("title")}
      </h1>
      <p>
        <strong>{t("revision")}</strong>
      </p>

      <h3 className="text-base font-bold md:text-lg">{t("section1Title")}</h3>
      <p>{t("section1-1")}</p>
      <p>{t("section1-2")}</p>
      <p>{t("section1-3")}</p>

      <h3 className="text-base font-bold md:text-lg">{t("section2Title")}</h3>
      <p>{t("section2-1")}</p>
      <p>{t("section2-2")}</p>
      <p>{t("section2-3")}</p>

      <h3 className="text-base font-bold md:text-lg">{t("section3Title")}</h3>
      <p>{t("section3-1")}</p>
      <p>{t("section3-2")}</p>

      <h3 className="text-base font-bold md:text-lg">{t("section4Title")}</h3>
      <p>{t("section4-1")}</p>
      <p>{t("section4-2")}</p>
      <p>{t("section4-3")}</p>

      <h3 className="text-base font-bold md:text-lg">{t("section5Title")}</h3>
      <p>{t("section5-1")}</p>
      <p>{t("section5-2")}</p>

      <h3 className="text-base font-bold md:text-lg">{t("section6Title")}</h3>
      <p>{t("section6-1")}</p>
      <ul>
        <li>{t("section6-1-list1")}</li>
        <li>{t("section6-1-list2")}</li>
      </ul>
      <p>{t("section6-2")}</p>
      <ul>
        <li>{t("section6-2-list1")}</li>
        <li>{t("section6-2-list2")}</li>
      </ul>
      <p>{t("section6-3")}</p>

      <h3 className="text-base font-bold md:text-lg">{t("section7Title")}</h3>
      <p>{t("section7-1")}</p>
      <p>{t("section7-2")}</p>
      <p>{t("section7-3")}</p>
      <p>{t("section7-4")}</p>
    </div>
  )
}

export default UserAgreementPage
