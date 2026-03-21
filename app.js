(function () {
  const tg = window.Telegram && window.Telegram.WebApp ? window.Telegram.WebApp : null;
  const config = window.VPN_APP_CONFIG || {};

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
    textDownloadUrl: ""
  };

  const IMPORT_GUIDES = {
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
    const platforms = state.platforms.length ? state.platforms : getFallbackPlatforms();
    const selected = getCurrentPlatform();
    return selected ? [selected] : platforms;
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
      return "Открыть установку";
    }

    return ["iphone", "ipad"].includes(platform.id)
      ? "Открыть инструкцию"
      : "Скачать приложение";
  }

  function getInstructionLinkLabel(platform) {
    if (!platform) {
      return "Открыть установку";
    }

    return ["iphone", "ipad"].includes(platform.id)
      ? `Открыть инструкцию для ${platform.title}`
      : `Открыть установку для ${platform.title}`;
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
    setLinkState(els.downloadLink, "", "Скачать .conf");
    setLinkState(els.downloadTextLink, "", "Скачать .txt");
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

    setLinkState(els.downloadLink, state.confDownloadUrl, "Скачать .conf", `${baseName}.conf`);
    setLinkState(els.downloadTextLink, state.textDownloadUrl, "Скачать .txt", `${baseName}.txt`);
  }

  function renderQrCanvas(canvas, size, onSuccess) {
    if (!state.configText || !window.QRCode || typeof window.QRCode.toCanvas !== "function") {
      setToast("Не удалось построить QR-код");
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
          setToast("Не удалось построить QR-код");
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
      ? "Если miniapp открыта на этом же телефоне, удобнее скачать .conf или .txt. QR полезен для второго экрана."
      : "Откройте QR на другом устройстве или используйте .conf / .txt для ручного импорта.";

    renderQrCanvas(els.qrModalCanvas, 320, function () {
      els.qrModalTitle.textContent = platform ? `QR для ${platform.title}` : "QR для импорта";
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
      ? "Если miniapp открыта на этом же телефоне, удобнее скачать .conf или .txt. QR лучше открыть на другом экране."
      : "QR удобно показать на большом экране и отсканировать с телефона. Для компьютера можно просто скачать .conf.";

    renderQrCanvas(els.qrCanvas, 240, function () {
      state.qrVisible = true;
      els.qrSection.classList.remove("hidden");
      els.qrHint.textContent = hint;
      els.qrButton.textContent = "Скрыть QR";
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
      return "Выберите тариф";
    }

    return plan.amountStars > 0 ? `${plan.amountStars} Stars` : "Бесплатно";
  }

  function getPurchaseLabel(plan) {
    if (!plan) {
      return "Выберите тариф";
    }

    return plan.amountStars > 0 ? `Купить за ${plan.amountStars} Stars` : "Получить бесплатно";
  }

  function renderImportGuide() {
    const platform = getCurrentPlatform();
    const hasConfig = Boolean(state.configText);

    if (!platform) {
      els.instructionTitle.textContent = "Как подключить";
      els.instructionBadge.textContent = "Выберите устройство выше — здесь появятся шаги установки и импорта.";
      els.instructionEmpty.classList.remove("hidden");
      els.instructionCard.classList.add("hidden");
      setLinkState(els.instructionLink, "", "Открыть установку");
      return;
    }

    const guide = getGuide(platform);
    const summary = hasConfig ? guide.readySummary : guide.waitingSummary;
    const steps = hasConfig ? guide.readySteps : guide.waitingSteps;
    const accessState = hasConfig
      ? "Конфиг выдан"
      : hasLockedAccess()
      ? "Ждём конфиг"
      : "Ещё не оформлено";

    els.instructionTitle.textContent = hasConfig ? `Как подключить ${platform.title}` : `Подготовка ${platform.title}`;
    els.instructionBadge.textContent = hasConfig
      ? "Конфиг готов: можно импортировать"
      : "Сначала поставьте приложение, потом оформляйте доступ";
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
      ? "Открыть QR"
      : state.qrVisible
      ? "Скрыть QR"
      : "Показать QR";

    if (telegramLocked) {
      els.buyButton.textContent = "Откройте в Telegram";
    } else if (purchaseLocked) {
      els.buyButton.textContent = "Подписка уже активна";
    } else if (!plan) {
      els.buyButton.textContent = "Выберите тариф";
    } else if (!platform) {
      els.buyButton.textContent = "Выберите устройство";
    } else {
      els.buyButton.textContent = getPurchaseLabel(plan);
    }

    if (purchaseLocked) {
      els.targetSummary.textContent = "Новый тариф можно оформить после завершения текущего доступа.";
    } else {
      els.targetSummary.textContent = platform
        ? `Установка: ${platform.title}. Перед оформлением всё готово.`
        : "Сначала выберите устройство для установки.";
    }

    if (!hasConfig) {
      els.configHelp.textContent = "После выдачи можно будет открыть QR, скачать .conf, скачать .txt и скопировать текст.";
      renderImportGuide();
      return;
    }

    if (isMobilePlatform(platform)) {
      els.configHelp.textContent = "Для телефона доступны .conf, .txt и полноэкранный QR. Если miniapp открыта на том же устройстве, удобнее использовать файл или текст.";
      renderImportGuide();
      return;
    }

    els.configHelp.textContent = "Для компьютера удобнее скачать .conf или .txt. QR-код тоже можно открыть на весь экран как запасной вариант.";
    renderImportGuide();
  }

  function applyUiState() {
    const purchaseLocked = hasLockedAccess();
    const hasPlanChoices = state.plans.length > 0;
    const hasPlatformChoices = getVisiblePlatforms().length > 0;

    els.plansSection.classList.toggle("hidden-section", purchaseLocked || !hasPlanChoices);
    els.platformsSection.classList.toggle("hidden-section", purchaseLocked || !hasPlatformChoices);
    els.actionsSection.classList.toggle("hidden-section", purchaseLocked);
  }

  function resetAccessView(message, meta, boxText) {
    state.configText = "";
    hideQr();
    closeQrModal();
    clearGeneratedDownloads();
    els.accessStatus.textContent = message || "Нет активного доступа";
    els.accessMeta.textContent = meta || "После оплаты доступ появится здесь.";
    els.configBox.textContent = boxText || "После оплаты здесь появится .conf.";
    els.configPreview.textContent = "";
    els.configPreview.classList.add("hidden");
    applyUiState();
    updateActionState();
  }

  function renderBase() {
    els.title.textContent = config.app && config.app.title ? config.app.title : "CreativeAnalytic VPN";
    els.subtitle.textContent = config.app && config.app.subtitle
      ? config.app.subtitle
      : "Telegram-only miniapp для оплаты и выдачи конфигурации.";

    if (tg) {
      tg.ready();
      tg.expand();
    }

    if (!hasTelegramContext()) {
      state.user = null;
      els.userName.textContent = "Только через Telegram";
      els.userMeta.textContent = "Откройте miniapp кнопкой из бота, иначе купить или получить конфиг нельзя.";
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

    state.platforms = list;
    const visiblePlatforms = getVisiblePlatforms().length ? getVisiblePlatforms() : list;
    els.downloads.innerHTML = "";

    visiblePlatforms.forEach(function (item) {
      const card = document.createElement("div");
      card.className = "download-item active";

      const title = document.createElement("strong");
      title.textContent = item.title || "Платформа";

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
    const platform = state.platforms.find(function (item) {
      return item.id === platformId;
    });

    if (!platform) {
      return;
    }

    state.selectedPlatformId = platform.id;
    state.platformRestored = false;
    els.platformHint.textContent = `Выбрано: ${platform.title}. Остальные устройства скрыты, ниже оставили только нужную установку.`;
    renderPlatforms(state.platforms);
    renderDownloads(state.platforms);
    updateActionState();
  }

  function renderPlatforms(items) {
    const platforms = (items && items.length ? items : getFallbackPlatforms())
      .map(normalizePlatform)
      .filter(Boolean);
    const hasSavedPlatform = state.selectedPlatformId && platforms.some(function (item) {
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

    els.platformHint.textContent = hasSavedPlatform
      ? `Устройство зафиксировано: ${getCurrentPlatform().title}.`
      : visiblePlatforms.length
      ? "Перед оформлением выберите устройство, чтобы мы показали нужную ссылку и шаги установки."
      : "Список устройств появится после загрузки каталога.";

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
      ? "Пробный тариф можно активировать только один раз."
      : `Срок доступа: ${plan.durationDays} дней.`;

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
      ? "Пробный доступ уже использован. Доступны только платные тарифы."
      : "3 дня — пробный доступ, 7 и 30 дней — платные планы.";

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
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
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
    const platform = getCurrentPlatform();

    state.configText = configText;
    els.accessStatus.textContent = "Доступ активен";
    els.accessMeta.textContent = expiresAt
      ? `Оплачен до ${expiresAt}${platform ? ` · ${platform.title}` : ""}`
      : `Доступ подтверждён${platform ? ` · ${platform.title}` : ""}`;
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
      setLinkState(els.downloadLink, configFileUrl, "Скачать .conf");
    }

    hideQr();
    closeQrModal();
    applyUiState();
    updateActionState();
  }

  function renderPendingAccess(data, expiresAt) {
    resetAccessView(
      data.statusLabel || "Оплата получена",
      expiresAt ? `Срок доступа уже рассчитан до ${expiresAt}` : "Ждём выдачу конфигурации новым VPN-сервером.",
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

    if (status === "awaiting_issue") {
      renderPendingAccess(data, expiresAt);
      return;
    }

    if (status === "pending_payment") {
      resetAccessView(
        data.statusLabel || "Счёт создан",
        "Откройте оплату и завершите покупку.",
        "После оплаты здесь появится статус доступа и конфигурация."
      );
      return;
    }

    if (status === "expired") {
      resetAccessView(
        data.statusLabel || "Доступ истёк",
        expiresAt ? `Срок закончился: ${expiresAt}` : "Нужна новая покупка.",
        "Оформите новый тариф, чтобы получить новый конфиг."
      );
      return;
    }

    resetAccessView(
      data.statusLabel || "Нет активного доступа",
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
      savePlatformId("");
      if (state.platformRestored) {
        state.selectedPlatformId = "";
      }
      state.platformRestored = false;
    }

    renderPlans(state.plans.length ? state.plans : getFallbackPlans(), state.selectedPlanId || (config.app && config.app.defaultPlanId));
    renderPlatforms(state.platforms.length ? state.platforms : getFallbackPlatforms());
    renderDownloads(state.platforms.length ? state.platforms : getFallbackPlatforms());
    renderAccess(data.access || data);
  }

  async function buyAccess() {
    if (!hasTelegramContext()) {
      setToast("Эта miniapp работает только внутри Telegram.");
      return;
    }

    if (!config.api || !config.api.createInvoiceUrl) {
      setToast("createInvoiceUrl не настроен");
      return;
    }

    const plan = getCurrentPlan();
    if (!plan) {
      setToast("Сначала выберите тариф");
      return;
    }

    const platform = getCurrentPlatform();
    if (!platform) {
      setToast("Сначала выберите устройство");
      return;
    }

    savePlatformId(platform.id);
    state.platformRestored = false;

    els.buyButton.disabled = true;
    els.buyButton.textContent = plan.isFree ? "Выдаём доступ..." : "Готовим оплату...";

    try {
      const data = await postJson(config.api.createInvoiceUrl, getUserPayload());

      if (data.access) {
        renderAccess(data.access);
        setToast(data.message || `Доступ готов для ${platform.title}`);
        return;
      }

      if (tg && typeof tg.openInvoice === "function" && (data.invoiceSlug || data.invoiceUrl)) {
        tg.openInvoice(data.invoiceSlug || data.invoiceUrl, function (status) {
          setToast(`Статус оплаты: ${status}`);
          if (status === "paid") {
            loadStatus().catch(function () {});
          }
        });
        return;
      }

      if (data.invoiceUrl) {
        window.open(data.invoiceUrl, "_blank", "noopener,noreferrer");
        return;
      }

      throw new Error("Сервис не вернул ссылку на оплату или готовый доступ");
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
    els.refreshButton.textContent = "Проверяем...";

    try {
      await loadStatus();
      setToast("Статус обновлён");
    } catch (error) {
      setToast(error.message || "Не удалось обновить статус");
    } finally {
      els.refreshButton.textContent = "Обновить статус";
      updateActionState();
    }
  }

  async function copyConfig() {
    if (!state.configText) {
      return;
    }

    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(state.configText);
      setToast("Конфиг скопирован");
      return;
    }

    const textarea = document.createElement("textarea");
    textarea.value = state.configText;
    textarea.setAttribute("readonly", "readonly");
    textarea.style.position = "absolute";
    textarea.style.left = "-9999px";
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand("copy");
    document.body.removeChild(textarea);
    setToast("Конфиг скопирован");
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
      if (event.target === els.qrModal || event.target.dataset.close === "true") {
        closeQrModal();
      }
    });
    els.copyButton.addEventListener("click", function () {
      copyConfig().catch(function () {
        setToast("Не удалось скопировать конфиг");
      });
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
      setToast(error.message || "Каталог пока не подключён");
    }

    try {
      await loadStatus();
    } catch (error) {
      setToast(error.message || "Статус пока не подключён");
    }
  }

  bootstrap().catch(function () {
    setToast("Ошибка запуска miniapp");
  });
})();
