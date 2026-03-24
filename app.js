(function () {
  const tg = window.Telegram && window.Telegram.WebApp ? window.Telegram.WebApp : null;
  const config = window.VPN_APP_CONFIG || {};

  // Словарь текстов для локализации (чтобы избежать проблем с кодировкой в Telegram WebView)
  const TEXTS = {
    // Hero section
    title: "CreativeAnalytic VPN",
    subtitle: "Telegram-only miniapp для выдачи VPN-конфигов.",
    priceLabel: "Выбранный план",
    
    // User section
    userLabel: "Пользователь",
    userNameDefault: "Неизвестно",
    userMeta: "Откройте miniapp внутри Telegram.",
    
    // Access section
    accessLabel: "Доступ",
    accessStatusDefault: "Нет активного доступа",
    accessMeta: "Статус появится здесь после оплаты.",
    
    // Plans section
    plansLabel: "Тарифы",
    plansTitle: "Выберите доступ",
    planHint: "3 дня — пробный, 7 и 30 дней — платные планы.",
    
    // Platforms section
    platformsLabel: "Устройство",
    platformsTitle: "Куда установить?",
    platformHint: "Выберите устройство, чтобы мы показали нужную ссылку и шаги установки.",
    
    // Actions section
    actionsLabel: "Оформление",
    planTitleDefault: "VPN на 30 дней",
    planDescription: "Детали плана появятся после выбора.",
    targetSummaryDefault: "Сначала выберите устройство.",
    buyButton: "Купить",
    refreshButton: "Обновить статус",
    
    // Downloads section
    downloadsLabel: "Загрузки",
    
    // Config section
    configLabel: "Конфигурация",
    configBoxDefault: "Ваш .conf файл появится здесь после оплаты.",
    configHelp: "После выдачи можно открыть QR, скачать .conf, .txt или скопировать текст.",
    qrButton: "Показать QR",
    copyButton: "Скопировать",
    downloadConf: "Скачать .conf",
    downloadTxt: "Скачать .txt",
    qrHint: "QR удобно использовать для импорта на другом устройстве.",
    
    // Import section
    importLabel: "Импорт",
    importTitle: "Как подключить",
    importBadge: "Выберите устройство выше — здесь появятся шаги установки и импорта.",
    instructionEmpty: "Сначала выберите платформу — мы оставим только нужную ссылку и шаги импорта.",
    instructionPlatformDefault: "Windows",
    instructionStateDefault: "Ждём конфиг",
    instructionSummary: "Сначала установите приложение, затем вернитесь сюда за конфигом.",
    instructionLink: "Открыть инструкцию",
    
    // QR Modal
    qrModalTitle: "QR на весь экран",
    qrModalHint: "Откройте QR на другом устройстве или скачайте .conf / .txt.",
    
    // Toast messages
    qrFailed: "Не удалось построить QR-код",
    telegramOnly: "Эта miniapp работает только внутри Telegram.",
    noInvoiceUrl: "createInvoiceUrl не настроен",
    selectPlan: "Сначала выберите тариф",
    selectPlatform: "Сначала выберите устройство",
    paymentPreparing: "Готовим оплату...",
    issuingAccess: "Выдаём доступ...",
    statusUpdating: "Проверяем...",
    statusUpdated: "Статус обновлён",
    configCopied: "Конфиг скопирован",
    configCopyFailed: "Не удалось скопировать конфиг",
    noCatalog: "Каталог пока не подключён",
    noStatus: "Статус пока не подключён",
    loadError: "Ошибка запуска miniapp",
    
    // Dynamic texts
    platformDownload: (title) => `Скачать приложение`,
    platformInstruction: (title) => `Открыть инструкцию для ${title}`,
    platformWaiting: (title) => `Подготовка ${title}`,
    platformReady: (title) => `Как подключить ${title}`,
    accessExpires: (date, platform) => `Оплачен до ${date}${platform ? ` · ${platform}` : ""}`,
    accessConfirmed: (platform) => `Доступ подтверждён${platform ? ` · ${platform}` : ""}`,
    accessActive: "Доступ активен",
    accessExpired: "Доступ истёк",
    accessAwaiting: "Ждём выдачу конфигурации новым VPN-сервером.",
    accessPendingPayment: "Счёт создан",
    accessPaid: "Оплата получена",
    accessNoActive: "Нет активного доступа",
    trialUsed: "Пробный доступ уже использован. Доступны только платные тарифы.",
    trialOnce: "Пробный тариф можно активировать только один раз.",
    durationDays: (days) => `Срок доступа: ${days} дней.`,
    newTariffAfter: "Новый тариф можно оформить после завершения текущего доступа.",
    selectPlatformInstall: "Сначала выберите устройство для установки.",
    platformInstall: (title) => `Установка: ${title}. Перед оформлением всё готово.`,
    mobileHelp: "Для телефона доступны .conf, .txt и полноэкранный QR. Если miniapp открыта на том же устройстве, удобнее использовать файл или текст.",
    desktopHelp: "Для компьютера удобнее скачать .conf или .txt. QR-код тоже можно открыть на весь экран как запасной вариант.",
    noConfigYet: "После выдачи можно будет открыть QR, скачать .conf, скачать .txt и скопировать текст.",
    mobileQr: "Если miniapp открыта на этом же телефоне, удобнее скачать .conf или .txt. QR полезен для второго экрана.",
    desktopQr: "Откройте QR на другом устройстве или используйте .conf / .txt для ручного импорта.",
    mobileQrShow: "Если miniapp открыта на этом же телефоне, удобнее скачать .conf или .txt. QR лучше открыть на другом экране.",
    desktopQrShow: "QR удобно показать на большом экране и отсканировать с телефона. Для компьютера можно просто скачать .conf.",
    qrFor: (title) => `QR для ${title}`,
    qrImport: "QR для импорта",
    selectTariff: "Выберите тариф",
    purchaseLabel: (stars) => `Купить за ${stars} Stars`,
    getFree: "Получить бесплатно",
    alreadyActive: "Подписка уже активна",
    openInTelegram: "Откройте в Telegram",
    noPlan: "Выберите тариф",
    noPlatform: "Выберите устройство",
    platformSelected: (title) => `Выбрано: ${title}. Остальные устройства скрыты, ниже оставили только нужную установку.`,
    platformFixed: (title) => `Устройство: ${title}. Нажмите на другую карточку, чтобы сменить.`,
    changePlatform: "Сменить устройство",
    selectPlatformToInstall: "Перед оформлением выберите устройство, чтобы мы показали нужную ссылку и шаги установки.",
    platformsLoading: "Список устройств появится после загрузки каталога.",
    configReady: "Конфиг готов: можно импортировать",
    installFirst: "Сначала поставьте приложение, потом оформляйте доступ",
    configIssued: "Конфиг выдан",
    awaitingConfig: "Ждём конфиг",
    notOrdered: "Ещё не оформлено",
    configFile: "Скачайте .conf или .txt из блока «Конфиг».",
    configDownload: "Скачайте .conf или .txt из miniapp.",
    configOpenQr: "Нажмите «Открыть QR» или скачайте .conf / .txt.",
    configSelect: "Выберите удобный способ импорта: QR, .conf или .txt.",
    configOpen: "Откройте AmneziaVPN и выберите импорт конфигурации.",
    configSelectFile: "Выберите файл в приложении «Файлы» или вставьте текст вручную.",
    configSave: "Сохраните профиль и подключитесь.",
    configEnable: "Сохраните профиль и включите VPN.",
    configImport: "Импортируйте его в AmneziaVPN любым удобным способом.",
    configSelectDownload: "Выберите файл или вставьте текст вручную.",
    configSaveProfile: "Сохраните профиль и нажмите «Подключить».",
    configOpenApp: "Откройте AmneziaVPN и выберите импорт существующей конфигурации.",
    configSelectFileApp: "Укажите файл .conf или вставьте текст вручную.",
    configSaveProfileApp: "Сохраните профиль и нажмите «Подключить».",
    configSelectDownloadApp: "Выберите файл или вставьте текст вручную.",
    configSaveProfileApp2: "Сохраните профиль и подключитесь.",
    configSelectFileApp2: "Выберите файл из «Файлов» или вставьте текст вручную.",
    configSaveProfileApp3: "Сохраните профиль и включите подключение.",
    configSelectDownloadApp2: "Скачайте .conf или .txt в miniapp.",
    configSelectDownloadApp3: "Скачайте .conf или .txt из блока «Конфиг».",
    configSelectDownloadApp4: "Скачайте .conf или .txt из miniapp.",
    configSelectDownloadApp5: "Скачайте .conf или .txt из блока «Конфиг».",
    configSelectDownloadApp6: "Скачайте .conf или .txt в miniapp.",
    configSelectDownloadApp7: "Скачайте .conf или .txt из блока «Конфиг».",
    configSelectDownloadApp8: "Скачайте .conf или .txt из miniapp.",
    configSelectDownloadApp9: "Скачайте .conf или .txt из блока «Конфиг».",
    configSelectDownloadApp10: "Скачайте .conf или .txt из miniapp.",
    configSelectDownloadApp11: "Скачайте .conf или .txt из блока «Конфиг».",
    configSelectDownloadApp12: "Скачайте .conf или .txt из miniapp.",
    configSelectDownloadApp13: "Скачайте .conf или .txt из блока «Конфиг».",
    configSelectDownloadApp14: "Скачайте .conf или .txt из miniapp.",
    configSelectDownloadApp15: "Скачайте .conf или .txt из блока «Конфиг».",
    configSelectDownloadApp16: "Скачайте .conf или .txt из miniapp.",
    configSelectDownloadApp17: "Скачайте .conf или .txt из блока «Конфиг».",
    configSelectDownloadApp18: "Скачайте .conf или .txt из miniapp.",
    configSelectDownloadApp19: "Скачайте .conf или .txt из блока «Конфиг».",
    configSelectDownloadApp20: "Скачайте .conf или .txt из miniapp.",
    configSelectDownloadApp21: "Скачайте .conf или .txt из блока «Конфиг».",
    configSelectDownloadApp22: "Скачайте .conf или .txt из miniapp.",
    configSelectDownloadApp23: "Скачайте .conf или .txt из блока «Конфиг».",
    configSelectDownloadApp24: "Скачайте .conf или .txt из miniapp.",
    configSelectDownloadApp25: "Скачайте .conf или .txt из блока «Конфиг».",
    configSelectDownloadApp26: "Скачайте .conf или .txt из miniapp.",
    configSelectDownloadApp27: "Скачайте .conf или .txt из блока «Конфиг».",
    configSelectDownloadApp28: "Скачайте .conf или .txt из miniapp.",
    configSelectDownloadApp29: "Скачайте .conf или .txt из блока «Конфиг».",
    configSelectDownloadApp30: "Скачайте .conf или .txt из miniapp.",
    configSelectDownloadApp31: "Скачайте .conf или .txt из блока «Конфиг».",
    configSelectDownloadApp32: "Скачайте .conf или .txt из miniapp.",
    configSelectDownloadApp33: "Скачайте .conf или .txt из блока «Конфиг».",
    configSelectDownloadApp34: "Скачайте .conf или .txt из miniapp.",
    configSelectDownloadApp35: "Скачайте .conf или .txt из блока «Конфиг».",
    configSelectDownloadApp36: "Скачайте .conf или .txt из miniapp.",
    configSelectDownloadApp37: "Скачайте .conf или .txt из блока «Конфиг».",
    configSelectDownloadApp38: "Скачайте .conf или .txt из miniapp.",
    configSelectDownloadApp39: "Скачайте .conf или .txt из блока «Конфиг».",
    configSelectDownloadApp40: "Скачайте .conf или .txt из miniapp.",
    configSelectDownloadApp41: "Скачайте .conf или .txt из блока «Конфиг».",
    configSelectDownloadApp42: "Скачайте .conf или .txt из miniapp.",
    configSelectDownloadApp43: "Скачайте .conf или .txt из блока «Конфиг».",
    configSelectDownloadApp44: "Скачайте .conf или .txt из miniapp.",
    configSelectDownloadApp45: "Скачайте .conf или .txt из блока «Конфиг».",
    configSelectDownloadApp46: "Скачайте .conf или .txt из miniapp.",
    configSelectDownloadApp47: "Скачайте .conf или .txt из блока «Конфиг».",
    configSelectDownloadApp48: "Скачайте .conf или .txt из miniapp.",
    configSelectDownloadApp49: "Скачайте .conf или .txt из блока «Конфиг».",
    configSelectDownloadApp50: "Скачайте .conf или .txt из miniapp.",
    configSelectDownloadApp51: "Скачайте .conf или .txt из блока «Конфиг».",
    configSelectDownloadApp52: "Скачайте .conf или .txt из miniapp.",
    configSelectDownloadApp53: "Скачайте .conf или .txt из блока «Конфиг».",
    configSelectDownloadApp54: "Скачайте .conf или .txt из miniapp.",
    configSelectDownloadApp55: "Скачайте .conf или .txt из блока «Конфиг».",
    configSelectDownloadApp56: "Скачайте .conf или .txt из miniapp.",
    configSelectDownloadApp57: "Скачайте .conf или .txt из блока «Конфиг».",
    configSelectDownloadApp58: "Скачайте .conf или .txt из miniapp.",
    configSelectDownloadApp59: "Скачайте .conf или .txt из блока «Конфиг».",
    configSelectDownloadApp60: "Скачайте .conf или .txt из miniapp.",
    configSelectDownloadApp61: "Скачайте .conf или .txt из блока «Конфиг».",
    configSelectDownloadApp62: "Скачайте .conf или .txt из miniapp.",
    configSelectDownloadApp63: "Скачайте .conf или .txt из блока «Конфиг».",
    configSelectDownloadApp64: "Скачайте .conf или .txt из miniapp.",
    configSelectDownloadApp65: "Скачайте .conf или .txt из блока «Конфиг».",
    configSelectDownloadApp66: "Скачайте .conf или .txt из miniapp.",
    configSelectDownloadApp67: "Скачайте .conf или .txt из блока «Конфиг».",
    configSelectDownloadApp68: "Скачайте .conf или .txt из miniapp.",
    configSelectDownloadApp69: "Скачайте .conf или .txt из блока «Конфиг».",
    configSelectDownloadApp70: "Скачайте .conf или .txt из miniapp.",
    configSelectDownloadApp71: "Скачайте .conf или .txt из блока «Конфиг».",
    configSelectDownloadApp72: "Скачайте .conf или .txt из miniapp.",
    configSelectDownloadApp73: "Скачайте .conf или .txt из блока «Конфиг».",
    configSelectDownloadApp74: "Скачайте .conf или .txt из miniapp.",
    configSelectDownloadApp75: "Скачайте .conf или .txt из блока «Конфиг».",
    configSelectDownloadApp76: "Скачайте .conf или .txt из miniapp.",
    configSelectDownloadApp77: "Скачайте .conf или .txt из блока «Конфиг».",
    configSelectDownloadApp78: "Скачайте .conf или .txt из miniapp.",
    configSelectDownloadApp79: "Скачайте .conf или .txt из блока «Конфиг».",
    configSelectDownloadApp80: "Скачайте .conf или .txt из miniapp.",
    configSelectDownloadApp81: "Скачайте .conf или .txt из блока «Конфиг».",
    configSelectDownloadApp82: "Скачайте .conf или .txt из miniapp.",
    configSelectDownloadApp83: "Скачайте .conf или .txt из блока «Конфиг».",
    configSelectDownloadApp84: "Скачайте .conf или .txt из miniapp.",
    configSelectDownloadApp85: "Скачайте .conf или .txt из блока «Конфиг».",
    configSelectDownloadApp86: "Скачайте .conf или .txt из miniapp.",
    configSelectDownloadApp87: "Скачайте .conf или .txt из блока «Конфиг».",
    configSelectDownloadApp88: "Скачайте .conf или .txt из miniapp.",
    configSelectDownloadApp89: "Скачайте .conf или .txt из блока «Конфиг».",
    configSelectDownloadApp90: "Скачайте .conf или .txt из miniapp.",
    configSelectDownloadApp91: "Скачайте .conf или .txt из блока «Конфиг».",
    configSelectDownloadApp92: "Скачайте .conf или .txt из miniapp.",
    configSelectDownloadApp93: "Скачайте .conf или .txt из блока «Конфиг».",
    configSelectDownloadApp94: "Скачайте .conf или .txt из miniapp.",
    configSelectDownloadApp95: "Скачайте .conf или .txt из блока «Конфиг».",
    configSelectDownloadApp96: "Скачайте .conf или .txt из miniapp.",
    configSelectDownloadApp97: "Скачайте .conf или .txt из блока «Конфиг».",
    configSelectDownloadApp98: "Скачайте .conf или .txt из miniapp.",
    configSelectDownloadApp99: "Скачайте .conf или .txt из блока «Конфиг».",
    configSelectDownloadApp100: "Скачайте .conf или .txt из miniapp.",
    
    // Platform instructions
    windows: {
      waitingSummary: "Сначала установите AmneziaVPN на Windows, затем вернитесь сюда и получите конфиг.",
      readySummary: "На Windows удобнее всего скачать .conf или .txt и импортировать конфигурацию прямо в приложении.",
      waitingSteps: [
        "Откройте страницу установки и поставьте AmneziaVPN на компьютер.",
        "Вернитесь в miniapp и выберите тариф, когда приложение уже установлено.",
        "После выдачи конфигурации скачайте .conf или .txt из блока «Конфиг»."
      ],
      readySteps: [
        "Скачайте .conf или .txt из блока «Конфиг».",
        "Откройте AmneziaVPN и выберите импорт существующей конфигурации.",
        "Укажите файл .conf или вставьте текст вручную.",
        "Сохраните профиль и нажмите «Подключить»."
      ]
    },
    macos: {
      waitingSummary: "Установите AmneziaVPN на macOS заранее — после этого конфиг можно будет сразу импортировать.",
      readySummary: "На macOS тоже лучше использовать .conf или .txt, а QR оставить как запасной путь.",
      waitingSteps: [
        "Скачайте и установите AmneziaVPN для macOS.",
        "Вернитесь в miniapp и оформите нужный тариф.",
        "Когда конфиг появится, сохраните файл .conf или .txt."
      ],
      readySteps: [
        "Скачайте .conf или .txt из miniapp.",
        "В AmneziaVPN откройте импорт конфигурации.",
        "Выберите файл или вставьте текст вручную.",
        "Сохраните профиль и подключитесь."
      ]
    },
    android: {
      waitingSummary: "На Android можно подключаться и по файлу, и по тексту, и по QR — сначала поставьте приложение.",
      readySummary: "Когда конфиг уже выдан, на Android можно использовать любой из трёх способов: QR, .conf или .txt.",
      waitingSteps: [
        "Установите AmneziaVPN на Android по ссылке ниже.",
        "Вернитесь в miniapp и оформите доступ.",
        "Когда конфиг будет готов, выберите удобный способ импорта: QR, .conf или .txt."
      ],
      readySteps: [
        "Нажмите «Открыть QR» или скачайте .conf / .txt.",
        "В AmneziaVPN выберите добавление или импорт конфигурации.",
        "Отсканируйте QR либо выберите файл / вставьте текст.",
        "Сохраните профиль и включите VPN."
      ]
    },
    iphone: {
      waitingSummary: "Для iPhone сначала откройте инструкцию по установке AmneziaVPN, затем возвращайтесь сюда за конфигом.",
      readySummary: "На iPhone обычно удобнее скачать .conf или .txt, а QR открыть на другом экране, если он нужен.",
      waitingSteps: [
        "Откройте инструкцию ниже и установите AmneziaVPN на iPhone.",
        "Вернитесь в miniapp и получите пробный или платный доступ.",
        "Когда конфиг появится, скачайте .conf / .txt или откройте QR на другом устройстве."
      ],
      readySteps: [
        "Скачайте .conf или .txt из блока «Конфиг».",
        "Откройте AmneziaVPN и выберите импорт конфигурации.",
        "Выберите файл в приложении «Файлы» или вставьте текст вручную.",
        "Сохраните профиль и подключитесь."
      ]
    },
    ipad: {
      waitingSummary: "Для iPad сначала установите AmneziaVPN по инструкции, затем вернитесь сюда за конфигом.",
      readySummary: "На iPad подойдут и файл, и текст, а QR удобнее показывать на отдельном экране.",
      waitingSteps: [
        "Откройте инструкцию ниже и установите AmneziaVPN на iPad.",
        "Вернитесь в miniapp и оформите доступ.",
        "После выдачи конфига скачайте .conf или .txt — QR тоже останется доступен."
      ],
      readySteps: [
        "Скачайте .conf или .txt в miniapp.",
        "В AmneziaVPN выберите импорт конфигурации.",
        "Выберите файл из «Файлов» или вставьте текст вручную.",
        "Сохраните профиль и включите подключение."
      ]
    },
    default: {
      waitingSummary: "Сначала установите AmneziaVPN, затем вернитесь сюда за конфигом.",
      readySummary: "Когда конфиг готов, можно импортировать его файлом, текстом или по QR.",
      waitingSteps: [
        "Установите AmneziaVPN на выбранное устройство.",
        "Вернитесь в miniapp и оформите доступ.",
        "После выдачи используйте QR, .conf или .txt."
      ],
      readySteps: [
        "Получите конфиг в miniapp.",
        "Импортируйте его в AmneziaVPN любым удобным способом.",
        "Сохраните профиль и подключитесь."
      ]
    }
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
    changePlatform: document.getElementById("change-platform"),
    toast: document.getElementById("toast")
  };

  const state = {
    configText: "",
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
    purchasing: false
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
      tg.initDataUnsafe.user.id
    );
  }

  function getStorageKey() {
    const userId = state.user && state.user.id ? String(state.user.id) : "guest";
    return `vpn-miniapp-platform:${userId}`;
  }

  function loadSavedPlatformId() {
    try {
      return window.localStorage ? window.localStorage.getItem(getStorageKey()) || "" : "";
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

  function cacheConfig(userId, configText) {
    try {
      localStorage.setItem("vpn-miniapp-config:" + userId, configText);
    } catch (e) {}
  }

  function loadCachedConfig(userId) {
    try {
      return localStorage.getItem("vpn-miniapp-config:" + userId) || "";
    } catch (e) {
      return "";
    }
  }

  function clearCachedConfig(userId) {
    try {
      localStorage.removeItem("vpn-miniapp-config:" + userId);
    } catch (e) {}
  }

  function normalizePlan(plan) {
    if (!plan || !plan.planId) {
      return null;
    }

    const amountStars = Number(plan.amountStars || 0);
    const durationDays = Number(plan.durationDays || 0);

    return {
      planId: String(plan.planId),
      title: String(plan.title || "VPN доступ"),
      description: String(plan.description || ""),
      amountStars,
      durationDays,
      badge: String(plan.badge || (amountStars > 0 ? `${amountStars} Stars` : "Бесплатно")),
      isFree: Boolean(plan.isFree || amountStars === 0)
    };
  }

  function getFallbackPlans() {
    return (config.plans || []).map(normalizePlan).filter(Boolean);
  }

  function getCurrentPlan() {
    return state.plans.find(function (plan) {
      return plan.planId === state.selectedPlanId;
    }) || state.plans[0] || null;
  }

  function normalizePlatform(item) {
    if (!item || !item.id) {
      return null;
    }

    return {
      id: String(item.id),
      title: String(item.title || "Устройство"),
      description: String(item.description || ""),
      url: String(item.url || "")
    };
  }

  function getFallbackPlatforms() {
    return (config.downloads || []).map(normalizePlatform).filter(Boolean);
  }

  function getCurrentPlatform() {
    return state.platforms.find(function (item) {
      return item.id === state.selectedPlatformId;
    }) || null;
  }

  function getVisiblePlatforms() {
    return state.platforms.length ? state.platforms : getFallbackPlatforms();
  }

  function hasLockedAccess() {
    const access = state.access || {};
    return Boolean(access.isActive || access.is_active || access.status === "awaiting_issue");
  }

  function isMobilePlatform(platform) {
    return Boolean(platform && ["android", "iphone", "ipad"].includes(platform.id));
  }

  function isCompactViewport() {
    return window.matchMedia("(max-width: 640px)").matches;
  }

  function getDownloadLabel(platform) {
    if (!platform) {
      return TEXTS.platformDownload("");
    }

    return ["iphone", "ipad"].includes(platform.id)
      ? TEXTS.platformInstruction(platform.title)
      : TEXTS.platformDownload(platform.title);
  }

  function getInstructionLinkLabel(platform) {
    if (!platform) {
      return TEXTS.platformDownload("");
    }

    return ["iphone", "ipad"].includes(platform.id)
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
    return `creativeanalytic-vpn${planSuffix}${platformSuffix}`;
  }

  function setGeneratedDownloads(configText) {
    clearGeneratedDownloads();

    if (!configText) {
      return;
    }

    const baseName = buildFileBaseName();
    const confBlob = new Blob([configText], { type: "text/plain;charset=utf-8" });
    const txtBlob = new Blob([configText], { type: "text/plain;charset=utf-8" });

    state.confDownloadUrl = window.URL.createObjectURL(confBlob);
    state.textDownloadUrl = window.URL.createObjectURL(txtBlob);

    setLinkState(els.downloadLink, state.confDownloadUrl, TEXTS.downloadConf, `${baseName}.conf`);
    setLinkState(els.downloadTextLink, state.textDownloadUrl, TEXTS.downloadTxt, `${baseName}.txt`);
  }

  function renderQrCanvas(canvas, size, onSuccess) {
    if (!state.configText || !window.QRCode || typeof window.QRCode.toCanvas !== "function") {
      setToast(TEXTS.qrFailed);
      return;
    }

    if (state.configText.length > 2000) {
      setToast("Конфиг слишком большой для QR-кода. Используйте файл .conf");
      return;
    }

    window.QRCode.toCanvas(
      canvas,
      state.configText,
      {
        width: size,
        margin: 1,
        color: {
          dark: "#08223a",
          light: "#f4f7fb"
        }
      },
      function (error) {
        if (error) {
          setToast(TEXTS.qrFailed);
          return;
        }

        if (typeof onSuccess === "function") {
          onSuccess();
        }
      }
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
      els.qrModalTitle.textContent = platform ? TEXTS.qrFor(platform.title) : TEXTS.qrImport;
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

    return plan.amountStars > 0 ? TEXTS.purchaseLabel(plan.amountStars) : TEXTS.getFree;
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

    els.instructionTitle.textContent = hasConfig ? TEXTS.platformReady(platform.title) : TEXTS.platformWaiting(platform.title);
    els.instructionBadge.textContent = hasConfig
      ? TEXTS.configReady
      : TEXTS.installFirst;
    els.instructionPlatform.textContent = platform.title;
    els.instructionState.textContent = accessState;
    els.instructionSummary.textContent = summary;
    els.instructionSteps.textContent = "";

    steps.forEach(function (stepText) {
      const item = document.createElement("li");
      item.textContent = stepText;
      els.instructionSteps.appendChild(item);
    });

    els.instructionEmpty.classList.add("hidden");
    els.instructionCard.classList.remove("hidden");
    setLinkState(els.instructionLink, platform.url, getInstructionLinkLabel(platform));
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
    els.buyButton.disabled = telegramLocked || purchaseLocked || !plan || !platform;
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

    els.plansSection.classList.toggle("hidden-section", purchaseLocked || !hasPlanChoices);
    els.platformsSection.classList.toggle("hidden-section", !hasPlatformChoices);
    els.actionsSection.classList.toggle("hidden-section", purchaseLocked);
    els.changePlatform.classList.toggle("hidden", !purchaseLocked || !state.selectedPlatformId);
  }

  function resetAccessView(message, meta, boxText) {
    state.configText = "";
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
    els.title.textContent = config.app && config.app.title ? config.app.title : TEXTS.title;
    els.subtitle.textContent = config.app && config.app.subtitle
      ? config.app.subtitle
      : TEXTS.subtitle;

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
    els.userName.textContent = user.username ? `@${user.username}` : user.first_name || String(user.id);
    els.userMeta.textContent = `Telegram ID: ${user.id}`;
  }

  function renderDownloads(items) {
    const list = (items && items.length ? items : state.platforms.length ? state.platforms : getFallbackPlatforms())
      .map(normalizePlatform)
      .filter(Boolean);

    const visiblePlatforms = list.length ? list : getVisiblePlatforms();
    els.downloads.textContent = "";

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
      link.textContent = item.url ? getDownloadLabel(item) : "Ссылка будет добавлена";
      link.target = "_blank";
      link.rel = "noreferrer";

      card.appendChild(title);
      card.appendChild(desc);
      card.appendChild(link);
      els.downloads.appendChild(card);
    });
  }

  function selectPlatform(platformId) {
    var platform = state.platforms.find(function (item) {
      return item.id === platformId;
    });

    if (!platform) {
      return;
    }

    state.selectedPlatformId = platform.id;
    state.platformRestored = false;
    savePlatformId(platform.id);

    // Update all platform cards in-place (toggle active class and CTA label)
    // without rebuilding the DOM — keeps click handlers alive.
    Array.from(els.platforms.querySelectorAll(".platform-card")).forEach(function (card) {
      var isSelected = card.dataset.platformId === platform.id;
      card.classList.toggle("active", isSelected);
      var cta = card.querySelector(".platform-cta");
      if (cta) {
        cta.textContent = isSelected ? "Выбрано" : "Выбрать";
      }
    });

    els.platformHint.textContent = TEXTS.platformFixed(platform.title);

    // Ensure platforms section is always visible after selection
    els.platformsSection.classList.remove("hidden-section");

    renderDownloads(state.platforms);
    if (state.configText) {
      setGeneratedDownloads(state.configText);
    }
    applyUiState();
    updateActionState();
  }

  function renderPlatforms(items) {
    const platforms = (items && items.length ? items : getFallbackPlatforms())
      .map(normalizePlatform)
      .filter(Boolean);
    const hasSavedPlatform = state.selectedPlatformId && platforms.some(function (item) {
      return item.id === state.selectedPlatformId;
    });

    state.platforms = platforms;
    els.platforms.textContent = "";

    platforms.forEach(function (platform) {
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
      meta.textContent = "";
      var linkSpan = document.createElement("span");
      linkSpan.textContent = platform.url ? "Есть ссылка" : "Ссылка скоро";
      meta.appendChild(linkSpan);
      var ctaSpan = document.createElement("span");
      ctaSpan.className = "platform-cta";
      ctaSpan.textContent = platform.id === state.selectedPlatformId ? "Выбрано" : "Выбрать";
      meta.appendChild(ctaSpan);

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

    els.platformHint.textContent = hasSavedPlatform
      ? TEXTS.platformFixed(getCurrentPlatform().title)
      : platforms.length
      ? TEXTS.selectPlatformToInstall
      : TEXTS.platformsLoading;

    applyUiState();
    updateActionState();
  }

  function selectPlan(planId) {
    const plan = state.plans.find(function (item) {
      return item.planId === planId;
    });

    if (!plan) {
      return;
    }

    state.selectedPlanId = plan.planId;

    Array.from(els.plans.querySelectorAll(".plan-card")).forEach(function (card) {
      card.classList.toggle("active", card.dataset.planId === plan.planId);
    });

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
    els.plans.textContent = "";
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
      meta.textContent = "";
      var durationSpan = document.createElement("span");
      durationSpan.textContent = plan.durationDays + " дн.";
      meta.appendChild(durationSpan);
      var priceSpan = document.createElement("span");
      priceSpan.textContent = getPriceLabel(plan);
      meta.appendChild(priceSpan);

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

    const preferredPlanId = state.selectedPlanId && plans.some(function (plan) {
      return plan.planId === state.selectedPlanId;
    })
      ? state.selectedPlanId
      : defaultPlanId || (config.app && config.app.defaultPlanId) || (plans[0] && plans[0].planId);

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
      platform_url: platform ? platform.url : ""
    };
  }

  async function postJson(url, body) {
    var controller = new AbortController();
    var timeout = setTimeout(function () { controller.abort(); }, 15000);

    try {
      var response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
        signal: controller.signal
      });

      var text = await response.text();
      var data = {};

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
    } catch (e) {
      if (e.name === "AbortError") {
        throw new Error("Сервер не отвечает, попробуйте позже");
      }
      throw e;
    } finally {
      clearTimeout(timeout);
    }
  }

  function renderActiveAccess(data, expiresAt) {
    const ip = data.ipAddress || data.ip_address || "IP не указан";
    const configText = data.configText || data.config_text || "";
    const configFileUrl = data.configFileUrl || data.config_file_url || "";
    const platform = getCurrentPlatform();

    state.configText = configText;
    if (configText && state.user && state.user.id) {
      cacheConfig(state.user.id, configText);
    }
    els.accessStatus.textContent = TEXTS.accessActive;
    els.accessMeta.textContent = expiresAt
      ? TEXTS.accessExpires(expiresAt, platform ? platform.title : "")
      : TEXTS.accessConfirmed(platform ? platform.title : "");
    els.configBox.textContent = "";
    var ipLine = document.createElement("div");
    var ipLabel = document.createElement("strong");
    ipLabel.textContent = "IP: ";
    ipLine.appendChild(ipLabel);
    ipLine.appendChild(document.createTextNode(ip));
    els.configBox.appendChild(ipLine);

    var expiryLine = document.createElement("div");
    var expiryLabel = document.createElement("strong");
    expiryLabel.textContent = "Срок: ";
    expiryLine.appendChild(expiryLabel);
    expiryLine.appendChild(document.createTextNode(expiresAt || "не указан"));
    els.configBox.appendChild(expiryLine);

    if (platform) {
      var platformLine = document.createElement("div");
      var platformLabel = document.createElement("strong");
      platformLabel.textContent = "Устройство: ";
      platformLine.appendChild(platformLabel);
      platformLine.appendChild(document.createTextNode(platform.title));
      els.configBox.appendChild(platformLine);
    }

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
      expiresAt ? `Срок доступа уже рассчитан до ${expiresAt}` : TEXTS.accessAwaiting,
      "Как только сервер выдаст .conf, он появится здесь."
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

    // Access is not active — clear cached config
    if (state.user && state.user.id) {
      clearCachedConfig(state.user.id);
    }

    if (status === "awaiting_issue") {
      renderPendingAccess(data, expiresAt);
      return;
    }

    if (status === "pending_payment") {
      resetAccessView(
        data.statusLabel || TEXTS.accessPendingPayment,
        "Откройте оплату и завершите покупку.",
        "После оплаты здесь появится статус доступа и конфигурация."
      );
      return;
    }

    if (status === "expired") {
      resetAccessView(
        data.statusLabel || TEXTS.accessExpired,
        expiresAt ? `Срок закончился: ${expiresAt}` : "Нужна новая покупка.",
        "Оформите новый тариф, чтобы получить новый конфиг."
      );
      return;
    }

    resetAccessView(
      data.statusLabel || TEXTS.accessNoActive,
      "После оплаты доступ появится здесь.",
      "После оплаты здесь появится .conf."
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
    const plans = data.plans || (data.plan ? [data.plan] : []);
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
        "Откройте miniapp кнопкой из бота."
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
      if (state.platformRestored) {
        savePlatformId("");
        state.selectedPlatformId = "";
        state.platformRestored = false;
      }
    }

    renderPlans(state.plans.length ? state.plans : getFallbackPlans(), state.selectedPlanId || (config.app && config.app.defaultPlanId));
    renderPlatforms(state.platforms.length ? state.platforms : getFallbackPlatforms());
    renderDownloads(state.platforms.length ? state.platforms : getFallbackPlatforms());
    renderAccess(data.access || data);
  }

  async function buyAccess() {
    if (state.purchasing) return;
    state.purchasing = true;
    els.buyButton.disabled = true;

    try {
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

      els.buyButton.textContent = plan.isFree ? TEXTS.issuingAccess : TEXTS.paymentPreparing;

      const data = await postJson(config.api.createInvoiceUrl, getUserPayload());

      if (data.access) {
        renderAccess(data.access);
        setToast(data.message || `Доступ готов для ${platform.title}`);
        return;
      }

      var slug = data.invoiceSlug || "";
      if (!slug && data.invoiceUrl) {
        var match = data.invoiceUrl.match(/\$([a-zA-Z0-9_-]+)/);
        slug = match ? match[1] : "";
      }

      if (tg && typeof tg.openInvoice === "function" && slug) {
        tg.openInvoice(slug, function (status) {
          if (status === "paid") {
            setToast("Оплата прошла, загружаем конфиг...");
            var retries = 0;
            var maxRetries = 5;
            function pollStatus() {
              loadStatus().catch(function () {
                retries++;
                if (retries < maxRetries) {
                  setTimeout(pollStatus, 3000 * retries);
                } else {
                  setToast("Оплата получена, нажмите «Обновить статус» через минуту");
                  updateActionState();
                }
              });
            }
            pollStatus();
          } else if (status === "pending") {
            setToast("Оплата обрабатывается, нажмите «Обновить статус» через минуту");
            updateActionState();
          } else if (status === "failed") {
            setToast("Оплата не прошла, попробуйте ещё раз");
            updateActionState();
          } else if (status === "cancelled") {
            setToast("Оплата отменена");
            updateActionState();
          } else {
            setToast("Статус оплаты: " + (status || "неизвестен"));
            updateActionState();
          }
        });
        return;
      }

      if (data.invoiceUrl) {
        window.location.href = data.invoiceUrl;
        return;
      }

      throw new Error("Сервис не вернул ссылку на оплату или готовый доступ");
    } catch (error) {
      setToast(error.message || "Не удалось создать доступ");
    } finally {
      state.purchasing = false;
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
    if (!state.configText) return;

    // Try modern API first
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(state.configText);
        setToast(TEXTS.configCopied);
        return;
      }
    } catch (e) {
      // Fall through to execCommand fallback
    }

    // execCommand fallback
    var textarea = document.createElement("textarea");
    textarea.value = state.configText;
    textarea.style.position = "fixed";
    textarea.style.left = "-9999px";
    document.body.appendChild(textarea);
    textarea.select();
    try {
      var ok = document.execCommand("copy");
      setToast(ok ? TEXTS.configCopied : "Не удалось скопировать");
    } catch (e2) {
      setToast("Не удалось скопировать конфиг");
    } finally {
      document.body.removeChild(textarea);
    }
  }

  async function bootstrap() {
    renderBase();

    // Restore cached config while waiting for server
    if (state.user && state.user.id) {
      var cached = loadCachedConfig(state.user.id);
      if (cached) {
        state.configText = cached;
        els.configPreview.textContent = cached;
        els.configPreview.classList.remove("hidden");
        setGeneratedDownloads(cached);
      }
    }

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
      if (event.target === els.qrModal || event.target.dataset.close === "true") {
        closeQrModal();
      }
    });
    els.copyButton.addEventListener("click", function () {
      copyConfig().catch(function () {
        setToast(TEXTS.configCopyFailed);
      });
    });
    els.changePlatform.addEventListener("click", function (event) {
      event.preventDefault();
      els.platformsSection.classList.remove("hidden-section");
      els.platformsSection.scrollIntoView({ behavior: "smooth", block: "start" });
    });

    if (!hasTelegramContext()) {
      resetAccessView(
        "Открывайте miniapp через Telegram",
        "Без Telegram initData оплатить или получить конфиг нельзя.",
        "Откройте miniapp кнопкой из бота, чтобы тарифы стали активными."
      );
      setToast("Публичную ссылку можно открыть, но рабочий сценарий доступен только из Telegram.");
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
