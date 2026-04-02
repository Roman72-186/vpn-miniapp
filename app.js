(function () {
  const tg =
    window.Telegram && window.Telegram.WebApp ? window.Telegram.WebApp : null;
  const config = window.VPN_APP_CONFIG || {};

  // Словарь текстов для локализации (чтобы избежать проблем с кодировкой в Telegram WebView)
  const TEXTS = {
    // Hero section
    title: "CreativeAnalytic \uD83E\uDD8A",
    subtitle:
      "\u0421\u0435\u0440\u0432\u0438\u0441 \u0438\u0437 \u0442\u0440\u0451\u0445 \u0431\u0443\u043a\u0432 \uD83E\uDD8A \u2014 Telegram-only miniapp \u0434\u043b\u044f \u043f\u043e\u043b\u0443\u0447\u0435\u043d\u0438\u044f \u043a\u043e\u043d\u0444\u0438\u0433\u0430.",
    priceLabel:
      "\u0412\u044b\u0431\u0440\u0430\u043d\u043d\u044b\u0439 \u043f\u043b\u0430\u043d",

    // User section
    userLabel:
      "\u041f\u043e\u043b\u044c\u0437\u043e\u0432\u0430\u0442\u0435\u043b\u044c",
    userNameDefault:
      "\u041d\u0435\u0438\u0437\u0432\u0435\u0441\u0442\u043d\u043e",
    userMeta:
      "\u041e\u0442\u043a\u0440\u043e\u0439\u0442\u0435 miniapp \u0432\u043d\u0443\u0442\u0440\u0438 Telegram.",

    // Access section
    accessLabel: "\u0414\u043e\u0441\u0442\u0443\u043f",
    accessStatusDefault:
      "\u041d\u0435\u0442 \u0430\u043a\u0442\u0438\u0432\u043d\u043e\u0433\u043e \u0434\u043e\u0441\u0442\u0443\u043f\u0430",
    accessMeta:
      "\u0421\u0442\u0430\u0442\u0443\u0441 \u043f\u043e\u044f\u0432\u0438\u0442\u0441\u044f \u0437\u0434\u0435\u0441\u044c \u043f\u043e\u0441\u043b\u0435 \u043e\u043f\u043b\u0430\u0442\u044b.",

    // Plans section
    plansLabel: "\u0422\u0430\u0440\u0438\u0444\u044b",
    plansTitle:
      "\u0412\u044b\u0431\u0435\u0440\u0438\u0442\u0435 \u0434\u043e\u0441\u0442\u0443\u043f",
    planHint:
      "3 \u0434\u043d\u044f \u2014 \u043f\u0440\u043e\u0431\u043d\u044b\u0439, 7 \u0438 30 \u0434\u043d\u0435\u0439 \u2014 \u043f\u043b\u0430\u0442\u043d\u044b\u0435 \u043f\u043b\u0430\u043d\u044b.",

    // Platforms section
    platformsLabel:
      "\u0423\u0441\u0442\u0440\u043e\u0439\u0441\u0442\u0432\u043e",
    platformsTitle:
      "\u041a\u0443\u0434\u0430 \u0443\u0441\u0442\u0430\u043d\u043e\u0432\u0438\u0442\u044c?",
    platformHint:
      "\u0412\u044b\u0431\u0435\u0440\u0438\u0442\u0435 \u0443\u0441\u0442\u0440\u043e\u0439\u0441\u0442\u0432\u043e, \u0447\u0442\u043e\u0431\u044b \u043c\u044b \u043f\u043e\u043a\u0430\u0437\u0430\u043b\u0438 \u043d\u0443\u0436\u043d\u0443\u044e \u0441\u0441\u044b\u043b\u043a\u0443 \u0438 \u0448\u0430\u0433\u0438 \u0443\u0441\u0442\u0430\u043d\u043e\u0432\u043a\u0438.",

    // Actions section
    actionsLabel:
      "\u041e\u0444\u043e\u0440\u043c\u043b\u0435\u043d\u0438\u0435",
    planTitleDefault:
      "\u0421\u0435\u0440\u0432\u0438\u0441 \u0438\u0437 \u0442\u0440\u0451\u0445 \u0431\u0443\u043a\u0432 \uD83E\uDD8A \u043d\u0430 30 \u0434\u043d\u0435\u0439",
    planDescription:
      "\u0414\u0435\u0442\u0430\u043b\u0438 \u043f\u043b\u0430\u043d\u0430 \u043f\u043e\u044f\u0432\u044f\u0442\u0441\u044f \u043f\u043e\u0441\u043b\u0435 \u0432\u044b\u0431\u043e\u0440\u0430.",
    targetSummaryDefault:
      "\u0421\u043d\u0430\u0447\u0430\u043b\u0430 \u0432\u044b\u0431\u0435\u0440\u0438\u0442\u0435 \u0443\u0441\u0442\u0440\u043e\u0439\u0441\u0442\u0432\u043e.",
    buyButton: "\u041a\u0443\u043f\u0438\u0442\u044c",
    refreshButton:
      "\u041e\u0431\u043d\u043e\u0432\u0438\u0442\u044c \u0441\u0442\u0430\u0442\u0443\u0441",

    // Downloads section
    downloadsLabel: "\u0417\u0430\u0433\u0440\u0443\u0437\u043a\u0438",

    // Config section
    configLabel:
      "\u041a\u043e\u043d\u0444\u0438\u0433\u0443\u0440\u0430\u0446\u0438\u044f",
    configBoxDefault:
      "\u0412\u0430\u0448 .conf \u0444\u0430\u0439\u043b \u043f\u043e\u044f\u0432\u0438\u0442\u0441\u044f \u0437\u0434\u0435\u0441\u044c \u043f\u043e\u0441\u043b\u0435 \u043e\u043f\u043b\u0430\u0442\u044b.",
    configHelp:
      "\u041f\u043e\u0441\u043b\u0435 \u0432\u044b\u0434\u0430\u0447\u0438 \u043c\u043e\u0436\u043d\u043e \u043e\u0442\u043a\u0440\u044b\u0442\u044c QR, \u0441\u043a\u0430\u0447\u0430\u0442\u044c .conf, .txt \u0438\u043b\u0438 \u0441\u043a\u043e\u043f\u0438\u0440\u043e\u0432\u0430\u0442\u044c \u0442\u0435\u043a\u0441\u0442.",
    qrButton: "\u041f\u043e\u043a\u0430\u0437\u0430\u0442\u044c QR",
    copyButton:
      "\u0421\u043a\u043e\u043f\u0438\u0440\u043e\u0432\u0430\u0442\u044c",
    downloadConf: "\u0421\u043a\u0430\u0447\u0430\u0442\u044c .conf",
    downloadTxt: "\u0421\u043a\u0430\u0447\u0430\u0442\u044c .txt",
    qrHint:
      "QR \u0443\u0434\u043e\u0431\u043d\u043e \u0438\u0441\u043f\u043e\u043b\u044c\u0437\u043e\u0432\u0430\u0442\u044c \u0434\u043b\u044f \u0438\u043c\u043f\u043e\u0440\u0442\u0430 \u043d\u0430 \u0434\u0440\u0443\u0433\u043e\u043c \u0443\u0441\u0442\u0440\u043e\u0439\u0441\u0442\u0432\u0435.",

    // Import section
    importLabel: "\u0418\u043c\u043f\u043e\u0440\u0442",
    importTitle:
      "\u041a\u0430\u043a \u043f\u043e\u0434\u043a\u043b\u044e\u0447\u0438\u0442\u044c",
    importBadge:
      "\u0412\u044b\u0431\u0435\u0440\u0438\u0442\u0435 \u0443\u0441\u0442\u0440\u043e\u0439\u0441\u0442\u0432\u043e \u0432\u044b\u0448\u0435 \u2014 \u0437\u0434\u0435\u0441\u044c \u043f\u043e\u044f\u0432\u044f\u0442\u0441\u044f \u0448\u0430\u0433\u0438 \u0443\u0441\u0442\u0430\u043d\u043e\u0432\u043a\u0438 \u0438 \u0438\u043c\u043f\u043e\u0440\u0442\u0430.",
    instructionEmpty:
      "\u0421\u043d\u0430\u0447\u0430\u043b\u0430 \u0432\u044b\u0431\u0435\u0440\u0438\u0442\u0435 \u043f\u043b\u0430\u0442\u0444\u043e\u0440\u043c\u0443 \u2014 \u043c\u044b \u043e\u0441\u0442\u0430\u0432\u0438\u043c \u0442\u043e\u043b\u044c\u043a\u043e \u043d\u0443\u0436\u043d\u0443\u044e \u0441\u0441\u044b\u043b\u043a\u0443 \u0438 \u0448\u0430\u0433\u0438 \u0438\u043c\u043f\u043e\u0440\u0442\u0430.",
    instructionPlatformDefault: "Windows",
    instructionStateDefault:
      "\u0416\u0434\u0451\u043c \u043a\u043e\u043d\u0444\u0438\u0433",
    instructionSummary:
      "\u0421\u043d\u0430\u0447\u0430\u043b\u0430 \u0443\u0441\u0442\u0430\u043d\u043e\u0432\u0438\u0442\u0435 \u043f\u0440\u0438\u043b\u043e\u0436\u0435\u043d\u0438\u0435, \u0437\u0430\u0442\u0435\u043c \u0432\u0435\u0440\u0404\u043d\u0438\u0442\u0435\u0441\u044c \u0441\u044e\u0434\u0430 \u0437\u0430 \u043a\u043e\u043d\u0444\u0438\u0433\u043e\u043c.",
    instructionLink:
      "\u041e\u0442\u043a\u0440\u044b\u0442\u044c \u0438\u043d\u0441\u0442\u0440\u0443\u043a\u0446\u0438\u044e",

    // QR Modal
    qrModalTitle:
      "QR \u043d\u0430 \u0432\u0441\u044f \u044d\u043a\u0440\u0430\u043d",
    qrModalHint:
      "\u041e\u0442\u043a\u0440\u043e\u0439\u0442\u0435 QR \u043d\u0430 \u0434\u0440\u0443\u0433\u043e\u043c \u0443\u0441\u0442\u0440\u043e\u0439\u0441\u0442\u0432\u0435 \u0438\u043b\u0438 \u0441\u043a\u0430\u0447\u0430\u0439\u0442\u0435 .conf / .txt.",

    // Toast messages
    qrFailed:
      "\u041d\u0435 \u0443\u0434\u0430\u043b\u043e\u0441\u044c \u043f\u043e\u0441\u0442\u0440\u043e\u0438\u0442\u044c QR-\u043a\u043e\u0434",
    telegramOnly:
      "\u042d\u0442\u0430 miniapp \u0440\u0430\u0431\u043e\u0442\u0430\u0435\u0442 \u0442\u043e\u043b\u044c\u043a\u043e \u0432\u043d\u0443\u0442\u0440\u0438 Telegram.",
    noInvoiceUrl:
      "createInvoiceUrl \u043d\u0435 \u043d\u0430\u0441\u0442\u0440\u043e\u0435\u043d",
    selectPlan:
      "\u0421\u043d\u0430\u0447\u0430\u043b\u0430 \u0432\u044b\u0431\u0435\u0440\u0438\u0442\u0435 \u0442\u0430\u0440\u0438\u0444",
    selectPlatform:
      "\u0421\u043d\u0430\u0447\u0430\u043b\u0430 \u0432\u044b\u0431\u0435\u0440\u0438\u0442\u0435 \u0443\u0441\u0442\u0440\u043e\u0439\u0441\u0442\u0432\u043e",
    paymentPreparing:
      "\u0413\u043e\u0442\u043e\u0432\u0438\u043c \u043e\u043f\u043b\u0430\u0442\u0443...",
    issuingAccess:
      "\u0412\u044b\u0434\u0430\u0451\u043c \u0434\u043e\u0441\u0442\u0443\u043f...",
    statusUpdating: "\u041f\u0440\u043e\u0432\u0435\u0440\u044f\u0435\u043c...",
    statusUpdated:
      "\u0421\u0442\u0430\u0442\u0443\u0441 \u043e\u0431\u043d\u043e\u0432\u0451\u043d",
    configCopied:
      "\u041a\u043e\u043d\u0444\u0438\u0433 \u0441\u043a\u043e\u043f\u0438\u0440\u043e\u0432\u0430\u043d",
    configCopyFailed:
      "\u041d\u0435 \u0443\u0434\u0430\u043b\u043e\u0441\u044c \u0441\u043a\u043e\u043f\u0438\u0440\u043e\u0432\u0430\u0442\u044c \u043a\u043e\u043d\u0444\u0438\u0433",
    noCatalog:
      "\u041a\u0430\u0442\u0430\u043b\u043e\u0433 \u043f\u043e\u043a\u0430 \u043d\u0435 \u043f\u043e\u0434\u043a\u043b\u044e\u0447\u0451\u043d",
    noStatus:
      "\u0421\u0442\u0430\u0442\u0443\u0441 \u043f\u043e\u043a\u0430 \u043d\u0435 \u043f\u043e\u0434\u043a\u043b\u044e\u0447\u0451\u043d",
    loadError:
      "\u041e\u0448\u0438\u0431\u043a\u0430 \u0437\u0430\u043f\u0443\u0441\u043a\u0430 miniapp",

    // Dynamic texts
    platformDownload: (title) => `Скачать приложение`,
    platformInstruction: (title) => `Открыть инструкцию для ${title}`,
    platformWaiting: (title) => `Подготовка ${title}`,
    platformReady: (title) => `Как подключить ${title}`,
    accessExpires: (date, platform) =>
      `Оплачен до ${date}${platform ? ` \u00b7 ${platform}` : ""}`,
    accessConfirmed: (platform) =>
      `Доступ подтверждён${platform ? ` \u00b7 ${platform}` : ""}`,
    accessActive: "Доступ активен",
    accessExpired: "Доступ истёк",
    accessAwaiting: "Ждём выдачу конфигурации.",
    accessPendingPayment: "Счёт создан",
    accessPaid: "Оплата получена",
    accessNoActive: "Нет активного доступа",
    trialUsed:
      "Пробный доступ уже использован. Доступны только платные тарифы.",
    trialOnce: "Пробный тариф можно активировать только один раз.",
    durationDays: (days) => `Срок доступа: ${days} дней.`,
    newTariffAfter:
      "Новый тариф можно оформить после завершения текущего доступа.",
    selectPlatformInstall: "Сначала выберите устройство для установки.",
    platformInstall: (title) =>
      `Установка: ${title}. Перед оформлением всё готово.`,
    mobileHelp:
      "Для телефона доступны .conf, .txt и полноэкранный QR. Если miniapp открыта на том же устройстве, удобнее использовать файл или текст.",
    desktopHelp:
      "Для компьютера удобнее скачать .conf или .txt. QR-код тоже можно открыть на весь экран как запасной вариант.",
    noConfigYet:
      "После выдачи можно будет открыть QR, скачать .conf, скачать .txt и скопировать текст.",
    mobileQr:
      "Если miniapp открыта на этом же телефоне, удобнее скачать .conf или .txt. QR полезен для второго экрана.",
    desktopQr:
      "Откройте QR на другом устройстве или используйте .conf / .txt для ручного импорта.",
    mobileQrShow:
      "Если miniapp открыта на этом же телефоне, удобнее скачать .conf или .txt. QR лучше открыть на другом экране.",
    desktopQrShow:
      "QR удобно показать на большом экране и отсканировать с телефона. Для компьютера можно просто скачать .conf.",
    qrFor: (title) => `QR для ${title}`,
    qrImport: "QR для импорта",
    selectTariff: "Выберите тариф",
    purchaseLabel: (stars) => `Купить за ${stars} Stars`,
    getFree: "Получить бесплатно",
    alreadyActive: "Подписка уже активна",
    openInTelegram: "Откройте в Telegram",
    noPlan: "Выберите тариф",
    noPlatform: "Выберите устройство",
    platformSelected: (title) =>
      `Выбрано: ${title}. Остальные устройства скрыты, ниже оставили только нужную установку.`,
    platformFixed: (title) => `Устройство зафиксировано: ${title}.`,
    selectPlatformToInstall:
      "Перед оформлением выберите устройство, чтобы мы показали нужную ссылку и шаги установки.",
    platformsLoading: "Список устройств появится после загрузки каталога.",
    configReady: "Конфиг готов: можно импортировать",
    installFirst: "Сначала поставьте приложение, потом оформляйте доступ",
    configIssued: "Конфиг выдан",
    awaitingConfig: "Ждём конфиг",
    notOrdered: "Ещё не оформлено",
    windows: {
      waitingSummary:
        "Сначала установите Amnezia на Windows, затем вернитесь сюда и получите конфиг.",
      readySummary:
        "На Windows удобнее всего скачать .conf или .txt и импортировать конфигурацию прямо в приложении.",
      waitingSteps: [
        "Откройте страницу установки и поставьте Amnezia на компьютер.",
        "Вернитесь в miniapp и выберите тариф, когда приложение уже установлено.",
        "После выдачи конфигурации скачайте .conf или .txt из блока «Конфиг».",
      ],
      readySteps: [
        "Скачайте .conf или .txt из блока «Конфиг».",
        "Откройте Amnezia и выберите импорт существующей конфигурации.",
        "Укажите файл .conf или вставьте текст вручную.",
        "Сохраните профиль и нажмите «Подключить».",
      ],
    },
    macos: {
      waitingSummary:
        "Установите Amnezia на macOS заранее — после этого конфиг можно будет сразу импортировать.",
      readySummary:
        "На macOS тоже лучше использовать .conf или .txt, а QR оставить как запасной путь.",
      waitingSteps: [
        "Скачайте и установите Amnezia для macOS.",
        "Вернитесь в miniapp и оформите нужный тариф.",
        "Когда конфиг появится, сохраните файл .conf или .txt.",
      ],
      readySteps: [
        "Скачайте .conf или .txt из miniapp.",
        "В Amnezia откройте импорт конфигурации.",
        "Выберите файл или вставьте текст вручную.",
        "Сохраните профиль и подключитесь.",
      ],
    },
    android: {
      waitingSummary:
        "На Android можно подключаться и по файлу, и по тексту, и по QR — сначала поставьте приложение.",
      readySummary:
        "Когда конфиг уже выдан, на Android можно использовать любой из трёх способов: QR, .conf или .txt.",
      waitingSteps: [
        "Установите Amnezia на Android по ссылке ниже.",
        "Вернитесь в miniapp и оформите доступ.",
        "Когда конфиг будет готов, выберите удобный способ импорта: QR, .conf или .txt.",
      ],
      readySteps: [
        "Нажмите «Открыть QR» или скачайте .conf / .txt.",
        "В Amnezia выберите добавление или импорт конфигурации.",
        "Отсканируйте QR либо выберите файл / вставьте текст.",
        "Сохраните профиль и включите сервис.",
      ],
    },
    iphone: {
      waitingSummary:
        "\u0414\u043b\u044f iPhone \u0443\u0441\u0442\u0430\u043d\u043e\u0432\u0438\u0442\u0435 DefaultVPN \u0438\u0437 App Store, \u0437\u0430\u0442\u0435\u043c \u0432\u0435\u0440\u043d\u0438\u0442\u0435\u0441\u044c \u0441\u044e\u0434\u0430 \u0437\u0430 \u043a\u043e\u043d\u0444\u0438\u0433\u043e\u043c.",
      readySummary:
        "\u041a\u043e\u043d\u0444\u0438\u0433 \u0433\u043e\u0442\u043e\u0432! \u041d\u0430\u0436\u043c\u0438\u0442\u0435 \u00ab\u041e\u0442\u043a\u0440\u044b\u0442\u044c \u0432 DefaultVPN\u00bb \u2014 \u043d\u0430\u0441\u0442\u0440\u043e\u0439\u043a\u0438 \u0437\u0430\u0433\u0440\u0443\u0437\u044f\u0442\u0441\u044f \u0430\u0432\u0442\u043e\u043c\u0430\u0442\u0438\u0447\u0435\u0441\u043a\u0438.",
      waitingSteps: [
        "\u0423\u0441\u0442\u0430\u043d\u043e\u0432\u0438\u0442\u0435 DefaultVPN \u0438\u0437 App Store \u043f\u043e \u0441\u0441\u044b\u043b\u043a\u0435 \u043d\u0438\u0436\u0435.",
        "\u0412\u0435\u0440\u043d\u0438\u0442\u0435\u0441\u044c \u0432 miniapp \u0438 \u043e\u0444\u043e\u0440\u043c\u0438\u0442\u0435 \u0434\u043e\u0441\u0442\u0443\u043f.",
        "\u041d\u0430\u0436\u043c\u0438\u0442\u0435 \u00ab\u041e\u0442\u043a\u0440\u044b\u0442\u044c \u0432 DefaultVPN\u00bb \u2014 \u043a\u043e\u043d\u0444\u0438\u0433 \u0437\u0430\u0433\u0440\u0443\u0437\u0438\u0442\u0441\u044f \u043e\u0434\u043d\u0438\u043c \u043d\u0430\u0436\u0430\u0442\u0438\u0435\u043c.",
      ],
      readySteps: [
        "\u041d\u0430\u0436\u043c\u0438\u0442\u0435 \u00ab\u041e\u0442\u043a\u0440\u044b\u0442\u044c \u0432 DefaultVPN\u00bb \u043d\u0438\u0436\u0435.",
        "\u041f\u043e\u0434\u0442\u0432\u0435\u0440\u0434\u0438\u0442\u0435 \u0438\u043c\u043f\u043e\u0440\u0442 \u0432 \u043f\u0440\u0438\u043b\u043e\u0436\u0435\u043d\u0438\u0438 DefaultVPN.",
        "\u0412\u043a\u043b\u044e\u0447\u0438\u0442\u0435 \u043f\u043e\u0434\u043a\u043b\u044e\u0447\u0435\u043d\u0438\u0435 \u0432 DefaultVPN.",
      ],
    },
    ipad: {
      waitingSummary:
        "Для iPad сначала установите Amnezia по инструкции, затем вернитесь сюда за конфигом.",
      readySummary:
        "На iPad подойдут и файл, и текст, а QR удобнее показывать на отдельном экране.",
      waitingSteps: [
        "Откройте инструкцию ниже и установите Amnezia на iPad.",
        "Вернитесь в miniapp и оформите доступ.",
        "После выдачи конфига скачайте .conf или .txt — QR тоже останется доступен.",
      ],
      readySteps: [
        "Скачайте .conf или .txt в miniapp.",
        "В Amnezia выберите импорт конфигурации.",
        "Выберите файл из «Файлов» или вставьте текст вручную.",
        "Сохраните профиль и включите подключение.",
      ],
    },
    default: {
      waitingSummary:
        "Сначала установите Amnezia, затем вернитесь сюда за конфигом.",
      readySummary:
        "Когда конфиг готов, можно импортировать его файлом, текстом или по QR.",
      waitingSteps: [
        "Установите Amnezia на выбранное устройство.",
        "Вернитесь в miniapp и оформите доступ.",
        "После выдачи используйте QR, .conf или .txt.",
      ],
      readySteps: [
        "Получите конфиг в miniapp.",
        "Импортируйте его в Amnezia любым удобным способом.",
        "Сохраните профиль и подключитесь.",
      ],
    },
  };

  const els = {
    title: document.getElementById("title"),
    subtitle: document.getElementById("subtitle"),
    price: document.getElementById("price"),
    plansSection: document.getElementById("plans-section"),
    plans: document.getElementById("plans"),
    planHint: document.getElementById("plan-hint"),
    platformsSection: document.getElementById("platforms-section"),
    platforms: document.getElementById("platforms"),
    platformHint: document.getElementById("platform-hint"),
    actionsSection: document.getElementById("actions-section"),
    planTitle: document.getElementById("plan-title"),
    planDescription: document.getElementById("plan-description"),
    targetSummary: document.getElementById("target-summary"),
    userName: document.getElementById("user-name"),
    userMeta: document.getElementById("user-meta"),
    accessStatus: document.getElementById("access-status"),
    accessMeta: document.getElementById("access-meta"),
    downloads: document.getElementById("downloads"),
    buyButton: document.getElementById("buy-button"),
    refreshButton: document.getElementById("refresh-button"),
    configBox: document.getElementById("config-box"),
    configHelp: document.getElementById("config-help"),
    configPreview: document.getElementById("config-preview"),
    qrButton: document.getElementById("qr-button"),
    qrSection: document.getElementById("qr-section"),
    qrCanvas: document.getElementById("qr-canvas"),
    qrHint: document.getElementById("qr-hint"),
    copyButton: document.getElementById("copy-button"),
    downloadLink: document.getElementById("download-link"),
    downloadTextLink: document.getElementById("download-text-link"),
    instructionTitle: document.getElementById("instruction-title"),
    instructionBadge: document.getElementById("instruction-badge"),
    instructionEmpty: document.getElementById("instruction-empty"),
    instructionCard: document.getElementById("instruction-card"),
    instructionPlatform: document.getElementById("instruction-platform"),
    instructionState: document.getElementById("instruction-state"),
    instructionSummary: document.getElementById("instruction-summary"),
    instructionSteps: document.getElementById("instruction-steps"),
    instructionLink: document.getElementById("instruction-link"),
    qrModal: document.getElementById("qr-modal"),
    qrModalCanvas: document.getElementById("qr-modal-canvas"),
    qrModalHint: document.getElementById("qr-modal-hint"),
    qrModalTitle: document.getElementById("qr-modal-title"),
    qrModalClose: document.getElementById("qr-modal-close"),
    toast: document.getElementById("toast"),
    // Admin
    adminPasswordModal: document.getElementById("admin-password-modal"),
    adminPasswordInput: document.getElementById("admin-password-input"),
    adminPasswordError: document.getElementById("admin-password-error"),
    adminPasswordSubmit: document.getElementById("admin-password-submit"),
    adminPasswordCancel: document.getElementById("admin-password-cancel"),
    adminPwdBackdrop: document.getElementById("admin-pwd-backdrop"),
    adminPanelModal: document.getElementById("admin-panel-modal"),
    adminPanelClose: document.getElementById("admin-panel-close"),
    adminPanelBackdrop: document.getElementById("admin-panel-backdrop"),
    adminPricesList: document.getElementById("admin-prices-list"),
    adminSave: document.getElementById("admin-save"),
    adminReset: document.getElementById("admin-reset"),
  };

  const state = {
    configText: "",
    iphoneConfigUri: "",
    plans: [],
    platforms: [],
    selectedPlanId: "",
    selectedPlatformId: "",
    user: null,
    access: null,
    trialUsed: false,
    platformRestored: false,
    qrVisible: false,
    confDownloadUrl: "",
    textDownloadUrl: "",
  };

  const IMPORT_GUIDES = TEXTS;

  function setToast(text) {
    els.toast.textContent = text || "";
  }

  function hasTelegramContext() {
    return Boolean(
      tg &&
      typeof tg.initData === "string" &&
      tg.initData.length > 0 &&
      tg.initDataUnsafe &&
      tg.initDataUnsafe.user &&
      tg.initDataUnsafe.user.id,
    );
  }

  function getStorageKey() {
    const userId =
      state.user && state.user.id ? String(state.user.id) : "guest";
    return `vpn-miniapp-platform:${userId}`;
  }

  function loadSavedPlatformId() {
    try {
      return window.localStorage
        ? window.localStorage.getItem(getStorageKey()) || ""
        : "";
    } catch (error) {
      return "";
    }
  }

  function savePlatformId(platformId) {
    try {
      if (!window.localStorage) {
        return;
      }

      if (platformId) {
        window.localStorage.setItem(getStorageKey(), platformId);
      } else {
        window.localStorage.removeItem(getStorageKey());
      }
    } catch (error) {
      // Ignore storage failures inside Telegram WebView.
    }
  }

  // ── Admin: price overrides ────────────────────────────────

  var ADMIN_PRICES_KEY = "ca-admin-prices";
  var ADMIN_PASSWORD = "123456";

  function getAdminPriceOverrides() {
    try {
      var saved =
        window.localStorage && window.localStorage.getItem(ADMIN_PRICES_KEY);
      return saved ? JSON.parse(saved) : {};
    } catch (e) {
      return {};
    }
  }

  function applyAdminPriceOverrides(plans) {
    var overrides = getAdminPriceOverrides();
    if (!Object.keys(overrides).length) return plans;
    return plans.map(function (p) {
      if (overrides[p.planId] === undefined) return p;
      var stars = Number(overrides[p.planId]);
      return Object.assign({}, p, {
        amountStars: stars,
        isFree: stars === 0,
        badge:
          stars === 0
            ? "\u0411\u0435\u0441\u043f\u043b\u0430\u0442\u043d\u043e"
            : stars + " Stars",
      });
    });
  }

  function openAdminPassword() {
    els.adminPasswordInput.value = "";
    els.adminPasswordError.classList.add("hidden");
    els.adminPasswordModal.classList.remove("hidden");
    document.body.classList.add("modal-open");
    setTimeout(function () {
      els.adminPasswordInput.focus();
    }, 100);
  }

  function closeAdminPassword() {
    els.adminPasswordModal.classList.add("hidden");
    document.body.classList.remove("modal-open");
  }

  function openAdminPanel() {
    var overrides = getAdminPriceOverrides();
    var allPlans = (config.plans || [])
      .map(normalizePlan)
      .filter(Boolean)
      .filter(function (p) {
        return !p.isFree;
      });
    els.adminPricesList.innerHTML = "";
    allPlans.forEach(function (plan) {
      var row = document.createElement("div");
      row.className = "admin-price-row";
      var label = document.createElement("div");
      label.className = "admin-price-label";
      label.innerHTML =
        "<strong>" +
        plan.title +
        "</strong><small>" +
        plan.durationDays +
        " \u0434\u043d\u0435\u0439</small>";
      var input = document.createElement("input");
      input.type = "number";
      input.min = "1";
      input.max = "10000";
      input.className = "admin-price-input";
      input.dataset.planId = plan.planId;
      input.value =
        overrides[plan.planId] !== undefined
          ? overrides[plan.planId]
          : plan.amountStars;
      row.appendChild(label);
      row.appendChild(input);
      els.adminPricesList.appendChild(row);
    });
    els.adminPanelModal.classList.remove("hidden");
    document.body.classList.add("modal-open");
  }

  function closeAdminPanel() {
    els.adminPanelModal.classList.add("hidden");
    document.body.classList.remove("modal-open");
  }

  function saveAdminPrices() {
    var inputs = els.adminPricesList.querySelectorAll(".admin-price-input");
    var overrides = {};
    inputs.forEach(function (input) {
      var val = parseInt(input.value, 10);
      if (!isNaN(val) && val >= 0) {
        overrides[input.dataset.planId] = val;
      }
    });
    try {
      window.localStorage &&
        window.localStorage.setItem(
          ADMIN_PRICES_KEY,
          JSON.stringify(overrides),
        );
    } catch (e) {}
    closeAdminPanel();
    // Перерисовать планы с новыми ценами
    var raw = (config.plans || []).map(normalizePlan).filter(Boolean);
    var updated = applyAdminPriceOverrides(raw);
    renderPlans(
      updated,
      state.selectedPlanId || (config.app && config.app.defaultPlanId),
    );
    setToast(
      "\u0426\u0435\u043d\u044b \u0441\u043e\u0445\u0440\u0430\u043d\u0435\u043d\u044b",
    );
  }

  function resetAdminPrices() {
    try {
      window.localStorage && window.localStorage.removeItem(ADMIN_PRICES_KEY);
    } catch (e) {}
    closeAdminPanel();
    var raw = (config.plans || []).map(normalizePlan).filter(Boolean);
    renderPlans(
      raw,
      state.selectedPlanId || (config.app && config.app.defaultPlanId),
    );
    setToast(
      "\u0426\u0435\u043d\u044b \u0441\u0431\u0440\u043e\u0448\u0435\u043d\u044b",
    );
  }

  // ─────────────────────────────────────────────────────────

  function normalizePlan(plan) {
    if (!plan || !plan.planId) {
      return null;
    }

    const amountStars = Number(plan.amountStars || 0);
    const durationDays = Number(plan.durationDays || 0);

    return {
      planId: String(plan.planId),
      title: String(
        plan.title || "\u0414\u043e\u0441\u0442\u0443\u043f \uD83E\uDD8A",
      ),
      description: String(plan.description || ""),
      amountStars,
      durationDays,
      badge: String(
        plan.badge || (amountStars > 0 ? `${amountStars} Stars` : "Бесплатно"),
      ),
      isFree: Boolean(plan.isFree || amountStars === 0),
    };
  }

  function getFallbackPlans() {
    var raw = (config.plans || []).map(normalizePlan).filter(Boolean);
    return applyAdminPriceOverrides(raw);
  }

  function getCurrentPlan() {
    return (
      state.plans.find(function (plan) {
        return plan.planId === state.selectedPlanId;
      }) ||
      state.plans[0] ||
      null
    );
  }

  function normalizePlatform(item) {
    if (!item || !item.id) {
      return null;
    }

    return {
      id: String(item.id),
      title: String(item.title || "Устройство"),
      description: String(item.description || ""),
      url: String(item.url || ""),
    };
  }

  function getFallbackPlatforms() {
    return (config.downloads || []).map(normalizePlatform).filter(Boolean);
  }

  function getCurrentPlatform() {
    return (
      state.platforms.find(function (item) {
        return item.id === state.selectedPlatformId;
      }) || null
    );
  }

  function getVisiblePlatforms() {
    const platforms = state.platforms.length
      ? state.platforms
      : getFallbackPlatforms();
    const selected = getCurrentPlatform();
    return selected ? [selected] : platforms;
  }

  function hasLockedAccess() {
    const access = state.access || {};
    return Boolean(
      access.isActive || access.is_active || access.status === "awaiting_issue",
    );
  }

  function isMobilePlatform(platform) {
    return Boolean(
      platform && ["android", "iphone", "ipad"].includes(platform.id),
    );
  }

  function isCompactViewport() {
    return window.matchMedia("(max-width: 640px)").matches;
  }

  function getDownloadLabel(platform) {
    if (!platform) {
      return TEXTS.platformDownload("");
    }

    // Для мобильных устройств показываем инструкцию, для десктопа - скачивание приложения
    return ["android", "iphone", "ipad"].includes(platform.id)
      ? TEXTS.platformInstruction(platform.title)
      : TEXTS.platformDownload(platform.title);
  }

  function getInstructionLinkLabel(platform) {
    if (!platform) {
      return TEXTS.platformDownload("");
    }

    // Для мобильных устройств показываем инструкцию, для десктопа - скачивание приложения
    return ["android", "iphone", "ipad"].includes(platform.id)
      ? TEXTS.platformInstruction(platform.title)
      : TEXTS.platformDownload(platform.title);
  }

  function getGuide(platform) {
    if (!platform) {
      return IMPORT_GUIDES.default;
    }

    return IMPORT_GUIDES[platform.id] || IMPORT_GUIDES.default;
  }

  function revokeDownloadUrl(key) {
    const currentUrl = state[key];
    if (currentUrl && currentUrl.startsWith("blob:")) {
      window.URL.revokeObjectURL(currentUrl);
    }
    state[key] = "";
  }

  function setLinkState(element, url, label, filename) {
    if (!url) {
      element.href = "#";
      element.classList.add("disabled-link");
      if (label) {
        element.textContent = label;
      }
      element.removeAttribute("download");
      return;
    }

    element.href = url;
    element.classList.remove("disabled-link");
    if (label) {
      element.textContent = label;
    }
    if (filename) {
      element.setAttribute("download", filename);
    } else {
      element.removeAttribute("download");
    }
  }

  function clearGeneratedDownloads() {
    revokeDownloadUrl("confDownloadUrl");
    revokeDownloadUrl("textDownloadUrl");
    setLinkState(els.downloadLink, "", TEXTS.downloadConf);
    setLinkState(els.downloadTextLink, "", TEXTS.downloadTxt);
  }

  function buildFileBaseName() {
    const platform = getCurrentPlatform();
    const plan = getCurrentPlan();
    const platformSuffix = platform ? `-${platform.id}` : "";
    const planSuffix = plan ? `-${plan.planId}` : "";
    return `creativeanalytic${planSuffix}${platformSuffix}`;
  }

  function setGeneratedDownloads(configText) {
    clearGeneratedDownloads();

    if (!configText) {
      return;
    }

    const baseName = buildFileBaseName();

    if (state.iphoneConfigUri) {
      setLinkState(
        els.downloadLink,
        state.iphoneConfigUri,
        "\u041e\u0442\u043a\u0440\u044b\u0442\u044c \u0432 DefaultVPN",
      );
      const txtBlob = new Blob([configText], { type: "text/plain;charset=utf-8" });
      state.textDownloadUrl = window.URL.createObjectURL(txtBlob);
      setLinkState(
        els.downloadTextLink,
        state.textDownloadUrl,
        TEXTS.downloadTxt,
        `${baseName}.txt`,
      );
      return;
    }

    const confBlob = new Blob([configText], {
      type: "text/plain;charset=utf-8",
    });
    const txtBlob = new Blob([configText], {
      type: "text/plain;charset=utf-8",
    });

    state.confDownloadUrl = window.URL.createObjectURL(confBlob);
    state.textDownloadUrl = window.URL.createObjectURL(txtBlob);

    setLinkState(
      els.downloadLink,
      state.confDownloadUrl,
      TEXTS.downloadConf,
      `${baseName}.conf`,
    );
    setLinkState(
      els.downloadTextLink,
      state.textDownloadUrl,
      TEXTS.downloadTxt,
      `${baseName}.txt`,
    );
  }

  function renderQrCanvas(canvas, size, onSuccess) {
    const platform = getCurrentPlatform();
    const qrData = state.iphoneConfigUri || state.configText;
    if (
      !qrData ||
      !window.QRCode ||
      typeof window.QRCode.toCanvas !== "function"
    ) {
      setToast(TEXTS.qrFailed);
      return;
    }

    window.QRCode.toCanvas(
      canvas,
      qrData,
      {
        width: size,
        margin: 1,
        color: {
          dark: "#08223a",
          light: "#f4f7fb",
        },
      },
      function (error) {
        if (error) {
          setToast(TEXTS.qrFailed);
          return;
        }

        if (typeof onSuccess === "function") {
          onSuccess();
        }
      },
    );
  }

  function closeQrModal() {
    els.qrModal.classList.add("hidden");
    document.body.classList.remove("modal-open");
  }

  function openQrModal() {
    const platform = getCurrentPlatform();
    const modalHint = isMobilePlatform(platform)
      ? TEXTS.mobileQr
      : TEXTS.desktopQr;

    renderQrCanvas(els.qrModalCanvas, 320, function () {
      els.qrModalTitle.textContent = platform
        ? TEXTS.qrFor(platform.title)
        : TEXTS.qrImport;
      els.qrModalHint.textContent = modalHint;
      els.qrModal.classList.remove("hidden");
      document.body.classList.add("modal-open");
    });
  }

  function hideQr() {
    state.qrVisible = false;
    els.qrSection.classList.add("hidden");
  }

  function showQr() {
    const platform = getCurrentPlatform();
    const hint = isMobilePlatform(platform)
      ? TEXTS.mobileQrShow
      : TEXTS.desktopQrShow;

    renderQrCanvas(els.qrCanvas, 240, function () {
      state.qrVisible = true;
      els.qrSection.classList.remove("hidden");
      els.qrHint.textContent = hint;
      els.qrButton.textContent = TEXTS.qrButton;
    });
  }

  function toggleQr() {
    if (!state.configText) {
      return;
    }

    if (isCompactViewport()) {
      openQrModal();
      return;
    }

    if (state.qrVisible) {
      hideQr();
      updateActionState();
      return;
    }

    showQr();
  }

  function getPriceLabel(plan) {
    if (!plan) {
      return TEXTS.selectTariff;
    }

    return plan.amountStars > 0 ? `${plan.amountStars} Stars` : TEXTS.getFree;
  }

  function getPurchaseLabel(plan) {
    if (!plan) {
      return TEXTS.selectTariff;
    }

    return plan.amountStars > 0
      ? TEXTS.purchaseLabel(plan.amountStars)
      : TEXTS.getFree;
  }

  function renderImportGuide() {
    const platform = getCurrentPlatform();
    const hasConfig = Boolean(state.configText);

    if (!platform) {
      els.instructionTitle.textContent = TEXTS.importTitle;
      els.instructionBadge.textContent = TEXTS.importBadge;
      els.instructionEmpty.classList.remove("hidden");
      els.instructionCard.classList.add("hidden");
      setLinkState(els.instructionLink, "", TEXTS.instructionLink);
      return;
    }

    const guide = getGuide(platform);
    const summary = hasConfig ? guide.readySummary : guide.waitingSummary;
    const steps = hasConfig ? guide.readySteps : guide.waitingSteps;
    const accessState = hasConfig
      ? TEXTS.configIssued
      : hasLockedAccess()
        ? TEXTS.awaitingConfig
        : TEXTS.notOrdered;

    els.instructionTitle.textContent = hasConfig
      ? TEXTS.platformReady(platform.title)
      : TEXTS.platformWaiting(platform.title);
    els.instructionBadge.textContent = hasConfig
      ? TEXTS.configReady
      : TEXTS.installFirst;
    els.instructionPlatform.textContent = platform.title;
    els.instructionState.textContent = accessState;
    els.instructionSummary.textContent = summary;
    els.instructionSteps.innerHTML = "";

    steps.forEach(function (stepText) {
      const item = document.createElement("li");
      item.textContent = stepText;
      els.instructionSteps.appendChild(item);
    });

    els.instructionEmpty.classList.add("hidden");
    els.instructionCard.classList.remove("hidden");
    setLinkState(
      els.instructionLink,
      platform.url,
      getInstructionLinkLabel(platform),
    );
    if (platform.url) {
      els.instructionLink.setAttribute("target", "_blank");
      els.instructionLink.setAttribute("rel", "noreferrer");
    }
  }

  function updateActionState() {
    const plan = getCurrentPlan();
    const platform = getCurrentPlatform();
    const telegramLocked = !hasTelegramContext();
    const purchaseLocked = hasLockedAccess();
    const hasConfig = Boolean(state.configText);

    els.copyButton.disabled = !hasConfig;
    els.qrButton.disabled = !hasConfig;
    els.refreshButton.disabled = telegramLocked;
    els.buyButton.disabled =
      telegramLocked || purchaseLocked || !plan || !platform;
    els.qrButton.textContent = isCompactViewport()
      ? TEXTS.qrButton
      : state.qrVisible
        ? TEXTS.qrButton
        : TEXTS.qrButton;

    if (telegramLocked) {
      els.buyButton.textContent = TEXTS.openInTelegram;
    } else if (purchaseLocked) {
      els.buyButton.textContent = TEXTS.alreadyActive;
    } else if (!plan) {
      els.buyButton.textContent = TEXTS.noPlan;
    } else if (!platform) {
      els.buyButton.textContent = TEXTS.noPlatform;
    } else {
      els.buyButton.textContent = getPurchaseLabel(plan);
    }

    if (purchaseLocked) {
      els.targetSummary.textContent = TEXTS.newTariffAfter;
    } else {
      els.targetSummary.textContent = platform
        ? TEXTS.platformInstall(platform.title)
        : TEXTS.selectPlatformInstall;
    }

    if (!hasConfig) {
      els.configHelp.textContent = TEXTS.noConfigYet;
      renderImportGuide();
      return;
    }

    if (isMobilePlatform(platform)) {
      els.configHelp.textContent = TEXTS.mobileHelp;
      renderImportGuide();
      return;
    }

    els.configHelp.textContent = TEXTS.desktopHelp;
    renderImportGuide();
  }

  function applyUiState() {
    const purchaseLocked = hasLockedAccess();
    const hasPlanChoices = state.plans.length > 0;
    const hasPlatformChoices = getVisiblePlatforms().length > 0;

    els.plansSection.classList.toggle(
      "hidden-section",
      purchaseLocked || !hasPlanChoices,
    );
    els.platformsSection.classList.toggle(
      "hidden-section",
      purchaseLocked || !hasPlatformChoices,
    );
    els.actionsSection.classList.toggle("hidden-section", purchaseLocked);
  }

  function resetAccessView(message, meta, boxText) {
    state.configText = "";
    state.iphoneConfigUri = "";
    hideQr();
    closeQrModal();
    clearGeneratedDownloads();
    els.accessStatus.textContent = message || TEXTS.accessStatusDefault;
    els.accessMeta.textContent = meta || TEXTS.accessMeta;
    els.configBox.textContent = boxText || TEXTS.configBoxDefault;
    els.configPreview.textContent = "";
    els.configPreview.classList.add("hidden");
    applyUiState();
    updateActionState();
  }

  function renderBase() {
    els.title.textContent =
      config.app && config.app.title ? config.app.title : TEXTS.title;
    els.subtitle.textContent =
      config.app && config.app.subtitle ? config.app.subtitle : TEXTS.subtitle;

    if (tg) {
      tg.ready();
      tg.expand();
    }

    if (!hasTelegramContext()) {
      state.user = null;
      els.userName.textContent = TEXTS.userNameDefault;
      els.userMeta.textContent = TEXTS.userMeta;
      return;
    }

    const user = tg.initDataUnsafe.user || {};
    state.user = user;
    if (!state.selectedPlatformId) {
      state.selectedPlatformId = loadSavedPlatformId();
      state.platformRestored = Boolean(state.selectedPlatformId);
    }
    els.userName.textContent = user.username
      ? `@${user.username}`
      : user.first_name || String(user.id);
    els.userMeta.textContent = `Telegram ID: ${user.id}`;
  }

  function renderDownloads(items) {
    const list = (
      items && items.length
        ? items
        : state.platforms.length
          ? state.platforms
          : getFallbackPlatforms()
    )
      .map(normalizePlatform)
      .filter(Boolean);

    state.platforms = list;
    const visiblePlatforms = getVisiblePlatforms().length
      ? getVisiblePlatforms()
      : list;
    els.downloads.innerHTML = "";

    visiblePlatforms.forEach(function (item) {
      const card = document.createElement("div");
      card.className = "download-item active";

      const title = document.createElement("strong");
      title.textContent = item.title || TEXTS.platformDownload("");

      const desc = document.createElement("p");
      desc.className = "muted";
      desc.textContent = item.description || "";

      const link = document.createElement("a");
      link.href = item.url || "#";
      link.textContent = item.url
        ? getDownloadLabel(item)
        : "Ссылка будет добавлена";
      link.target = "_blank";
      link.rel = "noreferrer";

      card.appendChild(title);
      card.appendChild(desc);
      card.appendChild(link);
      els.downloads.appendChild(card);
    });
  }

  function selectPlatform(platformId) {
    const platform = state.platforms.find(function (item) {
      return item.id === platformId;
    });

    if (!platform) {
      return;
    }

    state.selectedPlatformId = platform.id;
    state.platformRestored = false;
    els.platformHint.textContent = TEXTS.platformSelected(platform.title);
    renderPlatforms(state.platforms);
    renderDownloads(state.platforms);
    updateActionState();
  }

  function renderPlatforms(items) {
    const platforms = (items && items.length ? items : getFallbackPlatforms())
      .map(normalizePlatform)
      .filter(Boolean);
    const hasSavedPlatform =
      state.selectedPlatformId &&
      platforms.some(function (item) {
        return item.id === state.selectedPlatformId;
      });
    const visiblePlatforms = hasSavedPlatform
      ? platforms.filter(function (item) {
          return item.id === state.selectedPlatformId;
        })
      : platforms;

    state.platforms = platforms;
    els.platforms.innerHTML = "";

    visiblePlatforms.forEach(function (platform) {
      const card = document.createElement("div");
      card.className = `platform-card${platform.id === state.selectedPlatformId ? " active" : ""}`;
      card.dataset.platformId = platform.id;
      card.tabIndex = 0;

      const title = document.createElement("strong");
      title.textContent = platform.title;

      const description = document.createElement("p");
      description.className = "muted";
      description.textContent = platform.description;

      const meta = document.createElement("div");
      meta.className = "platform-meta";
      meta.innerHTML = `<span>${platform.url ? "Есть ссылка" : "Ссылка скоро"}</span><span class="platform-cta">${platform.id === state.selectedPlatformId ? "Выбрано" : "Выбрать"}</span>`;

      card.appendChild(title);
      card.appendChild(description);
      card.appendChild(meta);

      card.addEventListener("click", function () {
        selectPlatform(platform.id);
      });
      card.addEventListener("keydown", function (event) {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          selectPlatform(platform.id);
        }
      });

      els.platforms.appendChild(card);
    });

    if (hasSavedPlatform) {
      const resetBtn = document.createElement("button");
      resetBtn.type = "button";
      resetBtn.className = "button secondary platform-reset";
      resetBtn.textContent = "Сменить устройство";
      resetBtn.addEventListener("click", function () {
        resetPlatform();
      });
      els.platforms.appendChild(resetBtn);
    }

    els.platformHint.textContent = hasSavedPlatform
      ? TEXTS.platformFixed(getCurrentPlatform().title)
      : visiblePlatforms.length
        ? TEXTS.selectPlatformToInstall
        : TEXTS.platformsLoading;

    applyUiState();
    updateActionState();
  }

  function resetPlatform() {
    state.selectedPlatformId = "";
    state.platformRestored = false;
    savePlatformId("");
    renderPlatforms(state.platforms);
  }

  function selectPlan(planId) {
    const plan = state.plans.find(function (item) {
      return item.planId === planId;
    });

    if (!plan) {
      return;
    }

    state.selectedPlanId = plan.planId;

    Array.from(els.plans.querySelectorAll(".plan-card")).forEach(
      function (card) {
        card.classList.toggle("active", card.dataset.planId === plan.planId);
      },
    );

    els.price.textContent = getPriceLabel(plan);
    els.planTitle.textContent = plan.title;
    els.planDescription.textContent = plan.description;
    els.planHint.textContent = plan.isFree
      ? TEXTS.trialOnce
      : TEXTS.durationDays(plan.durationDays);

    updateActionState();
  }

  function renderPlans(items, defaultPlanId) {
    const plans = (items && items.length ? items : getFallbackPlans())
      .map(normalizePlan)
      .filter(Boolean)
      .filter(function (plan) {
        return !(state.trialUsed && plan.isFree);
      });

    state.plans = plans;
    els.plans.innerHTML = "";
    els.planHint.textContent = state.trialUsed
      ? TEXTS.trialUsed
      : TEXTS.planHint;

    plans.forEach(function (plan) {
      const card = document.createElement("div");
      card.className = "plan-card";
      card.dataset.planId = plan.planId;
      card.tabIndex = 0;

      const titleRow = document.createElement("div");
      titleRow.className = "plan-card-title";

      const titleWrap = document.createElement("div");
      const title = document.createElement("strong");
      title.textContent = plan.title;
      const description = document.createElement("p");
      description.className = "muted";
      description.textContent = plan.description;

      const badge = document.createElement("span");
      badge.className = `plan-badge${plan.isFree ? " free" : ""}`;
      badge.textContent = plan.badge;

      const meta = document.createElement("div");
      meta.className = "plan-meta";
      meta.innerHTML = `<span>${plan.durationDays} дн.</span><span>${getPriceLabel(plan)}</span>`;

      titleWrap.appendChild(title);
      titleWrap.appendChild(description);
      titleRow.appendChild(titleWrap);
      titleRow.appendChild(badge);

      card.appendChild(titleRow);
      card.appendChild(meta);

      card.addEventListener("click", function () {
        selectPlan(plan.planId);
      });
      card.addEventListener("keydown", function (event) {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          selectPlan(plan.planId);
        }
      });

      els.plans.appendChild(card);
    });

    const preferredPlanId =
      state.selectedPlanId &&
      plans.some(function (plan) {
        return plan.planId === state.selectedPlanId;
      })
        ? state.selectedPlanId
        : defaultPlanId ||
          (config.app && config.app.defaultPlanId) ||
          (plans[0] && plans[0].planId);

    if (preferredPlanId) {
      selectPlan(preferredPlanId);
    } else {
      els.price.textContent = "Недоступно";
      updateActionState();
    }

    applyUiState();
  }

  function getUserPayload() {
    if (!hasTelegramContext()) {
      throw new Error("Miniapp работает только внутри Telegram");
    }

    const user = tg.initDataUnsafe.user || {};
    const platform = getCurrentPlatform();
    state.user = user;

    return {
      init_data: tg.initData || "",
      user_id: String(user.id || ""),
      username: user.username || "",
      first_name: user.first_name || "",
      plan_id: state.selectedPlanId || "",
      platform_id: platform ? platform.id : "",
      platform_title: platform ? platform.title : "",
      platform_url: platform ? platform.url : "",
    };
  }

  async function postJson(url, body) {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const text = await response.text();
    let data = {};

    if (text) {
      try {
        data = JSON.parse(text);
      } catch (error) {
        throw new Error("Сервер вернул непонятный ответ");
      }
    }

    if (!response.ok) {
      throw new Error(data.message || data.detail || "Ошибка запроса");
    }

    return data;
  }

  function renderActiveAccess(data, expiresAt) {
    const ip = data.ipAddress || data.ip_address || "IP не указан";
    const configText = data.configText || data.config_text || "";
    const configFileUrl = data.configFileUrl || data.config_file_url || "";
    const iphoneConfigUri = data.iphoneConfigUri || data.iphone_config_uri || "";
    const platform = getCurrentPlatform();

    state.configText = configText;
    state.iphoneConfigUri = iphoneConfigUri;
    els.accessStatus.textContent = TEXTS.accessActive;
    els.accessMeta.textContent = expiresAt
      ? TEXTS.accessExpires(expiresAt, platform ? platform.title : "")
      : TEXTS.accessConfirmed(platform ? platform.title : "");
    els.configBox.innerHTML = `<strong>IP:</strong> ${ip}<br><strong>Срок:</strong> ${expiresAt || "не указан"}${platform ? `<br><strong>Устройство:</strong> ${platform.title}` : ""}`;

    if (configText) {
      els.configPreview.textContent = configText;
      els.configPreview.classList.remove("hidden");
    } else {
      els.configPreview.textContent = "";
      els.configPreview.classList.add("hidden");
    }

    setGeneratedDownloads(configText);
    if (configFileUrl) {
      setLinkState(els.downloadLink, configFileUrl, TEXTS.downloadConf);
    }

    hideQr();
    closeQrModal();
    applyUiState();
    updateActionState();
  }

  function renderPendingAccess(data, expiresAt) {
    resetAccessView(
      data.statusLabel || TEXTS.accessPaid,
      expiresAt
        ? `Срок доступа уже рассчитан до ${expiresAt}`
        : TEXTS.accessAwaiting,
      "Как только сервер выдаст .conf, он появится здесь.",
    );
  }

  function renderAccess(data) {
    state.access = data || null;
    if (data && data.planId) {
      state.selectedPlanId = String(data.planId);
    }

    if (!data) {
      applyUiState();
      resetAccessView();
      return;
    }

    const expiresAt = data.expiresAt || data.expires_at || "";
    const status = data.status || "";

    if (data.isActive || data.is_active) {
      renderActiveAccess(data, expiresAt);
      return;
    }

    if (status === "awaiting_issue") {
      renderPendingAccess(data, expiresAt);
      return;
    }

    if (status === "pending_payment") {
      resetAccessView(
        data.statusLabel || TEXTS.accessPendingPayment,
        "Откройте оплату и завершите покупку.",
        "После оплаты здесь появится статус доступа и конфигурация.",
      );
      return;
    }

    if (status === "expired") {
      resetAccessView(
        data.statusLabel || TEXTS.accessExpired,
        expiresAt ? `Срок закончился: ${expiresAt}` : "Нужна новая покупка.",
        "Оформите новый тариф, чтобы получить новый конфиг.",
      );
      return;
    }

    resetAccessView(
      data.statusLabel || TEXTS.accessNoActive,
      "После оплаты доступ появится здесь.",
      "После оплаты здесь появится .conf.",
    );
  }

  async function loadCatalog() {
    if (!hasTelegramContext() || !config.api || !config.api.catalogUrl) {
      renderPlans(getFallbackPlans(), config.app && config.app.defaultPlanId);
      renderPlatforms();
      renderDownloads();
      return;
    }

    const data = await postJson(config.api.catalogUrl, getUserPayload());
    const rawPlans = (data.plans || (data.plan ? [data.plan] : []))
      .map(normalizePlan)
      .filter(Boolean);
    const plans = applyAdminPriceOverrides(rawPlans);
    const downloads = data.downloads || [];

    renderPlans(plans, data.defaultPlanId);
    renderPlatforms(downloads);
    renderDownloads(downloads);
  }

  async function loadStatus() {
    if (!hasTelegramContext()) {
      resetAccessView(
        "Открывайте miniapp через Telegram",
        "Без Telegram initData получить счёт или конфиг нельзя.",
        "Откройте miniapp кнопкой из бота.",
      );
      return;
    }

    if (!config.api || !config.api.statusUrl) {
      renderAccess(null);
      return;
    }

    const data = await postJson(config.api.statusUrl, getUserPayload());
    state.trialUsed = Boolean(data.trialUsed);

    if (
      data.access &&
      (data.access.isActive ||
        data.access.is_active ||
        data.access.status === "awaiting_issue" ||
        data.access.status === "pending_payment")
    ) {
      if (state.selectedPlatformId) {
        savePlatformId(state.selectedPlatformId);
      }
    } else {
      savePlatformId("");
      if (state.platformRestored) {
        state.selectedPlatformId = "";
      }
      state.platformRestored = false;
    }

    renderPlans(
      state.plans.length ? state.plans : getFallbackPlans(),
      state.selectedPlanId || (config.app && config.app.defaultPlanId),
    );
    renderPlatforms(
      state.platforms.length ? state.platforms : getFallbackPlatforms(),
    );
    renderDownloads(
      state.platforms.length ? state.platforms : getFallbackPlatforms(),
    );
    renderAccess(data.access || data);
  }

  async function buyAccess() {
    if (!hasTelegramContext()) {
      setToast(TEXTS.telegramOnly);
      return;
    }

    if (!config.api || !config.api.createInvoiceUrl) {
      setToast(TEXTS.noInvoiceUrl);
      return;
    }

    const plan = getCurrentPlan();
    if (!plan) {
      setToast(TEXTS.selectPlan);
      return;
    }

    const platform = getCurrentPlatform();
    if (!platform) {
      setToast(TEXTS.selectPlatform);
      return;
    }

    savePlatformId(platform.id);
    state.platformRestored = false;

    els.buyButton.disabled = true;
    els.buyButton.textContent = plan.isFree
      ? TEXTS.issuingAccess
      : TEXTS.paymentPreparing;

    try {
      const data = await postJson(
        config.api.createInvoiceUrl,
        getUserPayload(),
      );

      if (data.error === "active_access_exists") {
        setToast("\u0414\u043e\u0441\u0442\u0443\u043f \u0443\u0436\u0435 \u0435\u0441\u0442\u044c \u2014 \u043e\u0431\u043d\u043e\u0432\u0438\u0442\u0435 \u0441\u0442\u0430\u0442\u0443\u0441");
        loadStatus().catch(function () {});
        return;
      }

      if (data.access) {
        renderAccess(data.access);
        setToast(data.message || "\u0414\u043e\u0441\u0442\u0443\u043f \u0433\u043e\u0442\u043e\u0432");
        return;
      }

      // Бесплатный тариф: конфиг выдан сразу (ok: true, configText: "...")
      if (data.ok && data.configText) {
        setToast("\u0414\u043e\u0441\u0442\u0443\u043f \u0432\u044b\u0434\u0430\u043d \u2014 \u0437\u0430\u0433\u0440\u0443\u0436\u0430\u0435\u043c...");
        var attempts = 0;
        function pollFreeStatus() {
          loadStatus().catch(function () {}).finally(function () {
            attempts++;
            if (attempts < 10 && !state.configText) {
              setTimeout(pollFreeStatus, 2000);
            }
          });
        }
        pollFreeStatus();
        return;
      }

      const invoiceLink =
        data.invoiceSlug ||
        data.invoiceUrl ||
        data.invoice_slug ||
        data.invoice_url;

      if (tg && typeof tg.openInvoice === "function" && invoiceLink) {
        tg.openInvoice(invoiceLink, function (status) {
          if (status === "paid") {
            setToast("\u041e\u043f\u043b\u0430\u0447\u0435\u043d\u043e \u2014 \u043f\u043e\u043b\u0443\u0447\u0430\u0435\u043c \u043a\u043e\u043d\u0444\u0438\u0433...");
            var attempts = 0;
            function pollStatus() {
              loadStatus().catch(function () {}).finally(function () {
                attempts++;
                if (attempts < 10 && !state.configText) {
                  setTimeout(pollStatus, 3000);
                }
              });
            }
            pollStatus();
          } else if (status === "cancelled") {
            setToast("\u041e\u043f\u043b\u0430\u0442\u0430 \u043e\u0442\u043c\u0435\u043d\u0435\u043d\u0430");
          } else if (status === "failed") {
            setToast("\u041e\u0448\u0438\u0431\u043a\u0430 \u043e\u043f\u043b\u0430\u0442\u044b \u2014 \u043f\u043e\u043f\u0440\u043e\u0431\u0443\u0439\u0442\u0435 \u0435\u0449\u0451 \u0440\u0430\u0437");
          }
        });
        return;
      }

      if (data.invoiceUrl || data.invoice_url) {
        window.open(
          data.invoiceUrl || data.invoice_url,
          "_blank",
          "noopener,noreferrer",
        );
        return;
      }

      throw new Error("\u0421\u0435\u0440\u0432\u0438\u0441 \u043d\u0435 \u0432\u0435\u0440\u043d\u0443\u043b \u0441\u0441\u044b\u043b\u043a\u0443 \u043d\u0430 \u043e\u043f\u043b\u0430\u0442\u0443");
    } catch (error) {
      setToast(error.message || "Не удалось создать доступ");
    } finally {
      updateActionState();
    }
  }

  async function refreshStatus() {
    if (!hasTelegramContext()) {
      setToast("Откройте miniapp через Telegram.");
      return;
    }

    els.refreshButton.disabled = true;
    els.refreshButton.textContent = TEXTS.statusUpdating;

    try {
      await loadStatus();
      setToast(TEXTS.statusUpdated);
    } catch (error) {
      setToast(error.message || "Не удалось обновить статус");
    } finally {
      els.refreshButton.textContent = TEXTS.refreshButton;
      updateActionState();
    }
  }

  async function copyConfig() {
    if (!state.configText) {
      return;
    }

    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(state.configText);
        setToast(TEXTS.configCopied);
      } else {
        // Fallback для старых браузеров или небезопасных контекстов
        const textarea = document.createElement("textarea");
        textarea.value = state.configText;
        textarea.setAttribute("readonly", "readonly");
        textarea.style.position = "absolute";
        textarea.style.left = "-9999px";
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
        setToast(TEXTS.configCopied);
      }
    } catch (error) {
      setToast(TEXTS.configCopyFailed);
    }
  }

  async function bootstrap() {
    renderBase();
    renderPlans(getFallbackPlans(), config.app && config.app.defaultPlanId);
    renderPlatforms();
    renderDownloads();
    renderAccess(null);

    window.addEventListener("beforeunload", function () {
      clearGeneratedDownloads();
      closeQrModal();
    });

    window.addEventListener("resize", function () {
      if (isCompactViewport()) {
        hideQr();
      }
      updateActionState();
    });

    window.addEventListener("keydown", function (event) {
      if (event.key === "Escape") {
        closeQrModal();
      }
    });

    els.buyButton.addEventListener("click", buyAccess);
    els.refreshButton.addEventListener("click", refreshStatus);
    els.qrButton.addEventListener("click", function () {
      toggleQr();
    });
    els.qrModalClose.addEventListener("click", function () {
      closeQrModal();
    });
    els.qrModal.addEventListener("click", function (event) {
      if (
        event.target === els.qrModal ||
        event.target.dataset.close === "true"
      ) {
        closeQrModal();
      }
    });
    els.copyButton.addEventListener("click", function () {
      copyConfig().catch(function () {
        setToast(TEXTS.configCopyFailed);
      });
    });

    // Admin: triple-tap on title
    var titleTapCount = 0;
    var titleTapTimer = null;
    els.title.addEventListener("click", function () {
      titleTapCount++;
      clearTimeout(titleTapTimer);
      if (titleTapCount >= 3) {
        titleTapCount = 0;
        openAdminPassword();
      } else {
        titleTapTimer = setTimeout(function () {
          titleTapCount = 0;
        }, 600);
      }
    });

    // Admin: password modal
    els.adminPasswordSubmit.addEventListener("click", function () {
      if (els.adminPasswordInput.value === ADMIN_PASSWORD) {
        closeAdminPassword();
        openAdminPanel();
      } else {
        els.adminPasswordError.classList.remove("hidden");
        els.adminPasswordInput.value = "";
        els.adminPasswordInput.focus();
      }
    });
    els.adminPasswordInput.addEventListener("keydown", function (e) {
      if (e.key === "Enter") els.adminPasswordSubmit.click();
    });
    els.adminPasswordCancel.addEventListener("click", closeAdminPassword);
    els.adminPwdBackdrop.addEventListener("click", closeAdminPassword);

    // Admin: panel
    els.adminPanelClose.addEventListener("click", closeAdminPanel);
    els.adminPanelBackdrop.addEventListener("click", closeAdminPanel);
    els.adminSave.addEventListener("click", saveAdminPrices);
    els.adminReset.addEventListener("click", resetAdminPrices);

    if (!hasTelegramContext()) {
      resetAccessView(
        "Открывайте miniapp через Telegram",
        "Без Telegram initData оплатить или получить конфиг нельзя.",
        "Откройте miniapp кнопкой из бота, чтобы тарифы стали активными.",
      );
      setToast(
        "Публичную ссылку можно открыть, но рабочий сценарий доступен только из Telegram.",
      );
      return;
    }

    try {
      await loadCatalog();
    } catch (error) {
      setToast(error.message || TEXTS.noCatalog);
    }

    try {
      await loadStatus();
    } catch (error) {
      setToast(error.message || TEXTS.noStatus);
    }
  }

  bootstrap().catch(function () {
    setToast(TEXTS.loadError);
  });
})();
