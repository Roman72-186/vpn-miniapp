window.VPN_APP_CONFIG = {
  app: {
    title: "CreativeAnalytic VPN",
    subtitle: "Telegram-only miniapp для выдачи VPN-конфигов через отдельный сервер.",
    defaultPlanId: "vpn_30d"
  },
  api: {
    catalogUrl: "https://n8n.creativeanalytic.ru/webhook/vpn-miniapp-catalog",
    createInvoiceUrl: "https://n8n.creativeanalytic.ru/webhook/vpn-miniapp-create-invoice",
    statusUrl: "https://n8n.creativeanalytic.ru/webhook/vpn-miniapp-status"
  },
  plans: [
    {
      planId: "vpn_free_3d",
      title: "Пробный доступ",
      description: "Один бесплатный конфиг на 3 дня для проверки сервиса.",
      amountStars: 0,
      durationDays: 3,
      badge: "Бесплатно",
      isFree: true
    },
    {
      planId: "vpn_7d",
      title: "VPN на 7 дней",
      description: "Короткий платный доступ на неделю.",
      amountStars: 70,
      durationDays: 7,
      badge: "70 Stars",
      isFree: false
    },
    {
      planId: "vpn_30d",
      title: "VPN на 30 дней",
      description: "Основной месячный доступ через отдельный VPN-сервер.",
      amountStars: 299,
      durationDays: 30,
      badge: "299 Stars",
      isFree: false
    }
  ],
  downloads: [
    {
      id: "windows",
      title: "Windows",
      description: "Официальная страница загрузки AmneziaVPN для Windows",
      url: "https://amnezia.org/ru/downloads"
    },
    {
      id: "android",
      title: "Android",
      description: "Официальная страница загрузки AmneziaVPN для Android",
      url: "https://amnezia.org/ru/downloads"
    },
    {
      id: "macos",
      title: "macOS",
      description: "Официальная страница загрузки AmneziaVPN для macOS",
      url: "https://amnezia.org/ru/downloads"
    },
    {
      id: "ios",
      title: "iPhone / iPad",
      description: "Инструкция Amnezia по установке на iOS",
      url: "https://docs.amnezia.org/documentation/instructions/installing-amneziavpn-on-ios/"
    }
  ]
};
