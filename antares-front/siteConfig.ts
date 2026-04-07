export type LinkTab = {
  key: string
  label: string
  link: string
  section: HTMLElement | null
}

export const siteConfig = {
  name: "ANTARES INVESTMENT",
  url: "https://anin.uz",
  ogImage: "https://anin.uz/og.svg",
  description:
    "Мы поставляем высокотехнологичное оборудование и профессиональные инструменты для предприятий нефтегазовой, металлургической, энергетической и машиностроительной отраслей. Вся продукция проходит строгий отбор по качеству и соответствует отраслевым стандартам. Поставки осуществляются напрямую от проверенных производителей.",
  keywords: [
    "поставка технологического оборудования",
    "комплексные промышленные решения",
    "anin.uz",
    "antares.uz",
    "antares investment",
    "Antares Investments",
    "поставка промышленного оборудования",
    "оборудование для нефтехимии и газопереработки",
    "промышленные системы для машиностроения",
    "инженерные решения для производственных предприятий",
    "оборудование для модернизации заводов",
    "высокоточное промышленное оборудование",
    "техническое оснащение промышленных объектов",
    "автоматизация технологических процессов",
    "поставки промышленного инструмента и техники",
    "энергетическое оборудование под ключ",
    "оборудование и материалы для тяжёлой промышленности",
    "интеграция промышленных решений",
    "оборудование для добывающей промышленности",
    "поставка агрегатов и промышленных узлов",
    "оборудование для энергетических комплексов",
    "решения для повышения эффективности производства",
    "сервис и сопровождение промышленного оборудования",
    "инновационные технологии для производства",
    "комплексное оснащение производств",
  ],
}

export type SiteConfig = typeof siteConfig

export const siteTabs: Array<LinkTab> = [
  {
    key: "about",
    label: "About",
    link: "/about",
    section: null,
  },
  {
    key: "cart",
    label: "Cart",
    link: "/cart",
    section: null,
  },
  {
    key: "checkout",
    label: "Checkout",
    link: "/cart/checkout",
    section: null,
  },
  {
    key: "catalog",
    label: "Catalog",
    link: "/catalog",
    section: null,
  },
  {
    key: "certificates",
    label: "Certificates",
    link: "/certificates",
    section: null,
  },
  {
    key: "events",
    label: "Events",
    link: "/events",
    section: null,
  },
  {
    key: "contacts",
    label: "Contacts",
    link: "/contacts",
    section: null,
  },
  {
    key: "products",
    label: "Products",
    link: "/products",
    section: null,
  },
  {
    key: "services",
    label: "Services",
    link: "/services",
    section: null,
  },
]
