window.VPN_APP_CONFIG = {
  app: {
    title: "CreativeAnalytic 🦊",
    subtitle:
      "Сервис из трёх букв 🦊 — Telegram-only miniapp для получения конфига.",
    defaultPlanId: "vpn_30d",
  },
  api: {
    catalogUrl: "https://n8n.creativeanalytic.ru/webhook/vpn-miniapp-catalog",
    createInvoiceUrl:
      "https://n8n.creativeanalytic.ru/webhook/vpn-miniapp-create-invoice",
    statusUrl: "https://n8n.creativeanalytic.ru/webhook/vpn-miniapp-status",
  },
  plans: [
    {
      planId: "vpn_free_3d",
      title: "Пробный доступ",
      description: "Один бесплатный конфиг на 3 дня для проверки сервиса.",
      amountStars: 0,
      durationDays: 3,
      badge: "Бесплатно",
      isFree: true,
    },
    {
      planId: "vpn_7d",
      title: "Сервис из трёх букв 🦊 на 7 дней",
      description: "Короткий платный доступ на неделю.",
      amountStars: 1,
      durationDays: 7,
      badge: "1 Star",
      isFree: false,
    },
    {
      planId: "vpn_30d",
      title: "Сервис из трёх букв 🦊 на 30 дней",
      description: "Основной месячный доступ.",
      amountStars: 299,
      durationDays: 30,
      badge: "299 Stars",
      isFree: false,
    },
  ],
  downloads: [
    {
      id: "windows",
      title: "Windows",
      description: "Официальная страница загрузки Amnezia для Windows",
      url: "https://amnezia.org/ru/downloads",
    },
    {
      id: "android",
      title: "Android",
      description: "Официальная страница загрузки Amnezia для Android",
      url: "https://amnezia.org/ru/downloads",
    },
    {
      id: "macos",
      title: "macOS",
      description: "Официальная страница загрузки Amnezia для macOS",
      url: "https://amnezia.org/ru/downloads",
    },
    {
      id: "iphone",
      title: "iPhone",
      description: "Инструкция Amnezia по установке на iPhone",
      url: "https://docs.amnezia.org/documentation/instructions/installing-amneziavpn-on-ios/",
    },
    {
      id: "ipad",
      title: "iPad",
      description: "Инструкция Amnezia по установке на iPad",
      url: "https://docs.amnezia.org/documentation/instructions/installing-amneziavpn-on-ios/",
    },
  ],
};
