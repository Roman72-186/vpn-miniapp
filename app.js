(function () {
  const tg = window.Telegram && window.Telegram.WebApp ? window.Telegram.WebApp : null;
  const config = window.VPN_APP_CONFIG || {};

  const els = {
    title: document.getElementById("title"),
    subtitle: document.getElementById("subtitle"),
    price: document.getElementById("price"),
    plans: document.getElementById("plans"),
    planHint: document.getElementById("plan-hint"),
    platforms: document.getElementById("platforms"),
    platformHint: document.getElementById("platform-hint"),
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
    configPreview: document.getElementById("config-preview"),
    copyButton: document.getElementById("copy-button"),
    downloadLink: document.getElementById("download-link"),
    toast: document.getElementById("toast")
  };

  const state = {
    configText: "",
    plans: [],
    downloads: [],
    selectedPlanId: "",
    selectedPlatformId: "",
    user: null
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
    return state.downloads.find(function (item) {
      return item.id === state.selectedPlatformId;
    }) || null;
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

  function updateActionState() {
    const plan = getCurrentPlan();
    const platform = getCurrentPlatform();
    const telegramLocked = !hasTelegramContext();

    els.copyButton.disabled = !state.configText;
    els.refreshButton.disabled = telegramLocked;
    els.buyButton.disabled = telegramLocked || !plan || !platform;

    if (telegramLocked) {
      els.buyButton.textContent = "Откройте в Telegram";
    } else if (!plan) {
      els.buyButton.textContent = "Выберите тариф";
    } else if (!platform) {
      els.buyButton.textContent = "Выберите устройство";
    } else {
      els.buyButton.textContent = getPurchaseLabel(plan);
    }

    els.targetSummary.textContent = platform
      ? `Установка: ${platform.title}. Перед оформлением всё готово.`
      : "Сначала выберите устройство для установки.";
  }

  function setDownloadLink(url) {
    if (url) {
      els.downloadLink.href = url;
      els.downloadLink.classList.remove("disabled-link");
      return;
    }

    els.downloadLink.href = "#";
    els.downloadLink.classList.add("disabled-link");
  }

  function resetAccessView(message, meta, boxText) {
    state.configText = "";
    els.accessStatus.textContent = message || "Нет активного доступа";
    els.accessMeta.textContent = meta || "После оплаты доступ появится здесь.";
    els.configBox.textContent = boxText || "После оплаты здесь появится `.conf`.";
    els.configPreview.textContent = "";
    els.configPreview.classList.add("hidden");
    setDownloadLink("");
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
    els.userName.textContent = user.username ? `@${user.username}` : user.first_name || String(user.id);
    els.userMeta.textContent = `Telegram ID: ${user.id}`;
  }

  function renderDownloads(items) {
    const list = (items && items.length ? items : state.downloads.length ? state.downloads : getFallbackPlatforms())
      .map(normalizePlatform)
      .filter(Boolean);

    state.downloads = list;
    els.downloads.innerHTML = "";

    list.forEach(function (item) {
      const isActive = item.id === state.selectedPlatformId;
      const card = document.createElement("div");
      card.className = `download-item${isActive ? " active" : ""}`;

      const title = document.createElement("strong");
      title.textContent = item.title || "Платформа";

      const desc = document.createElement("p");
      desc.className = "muted";
      desc.textContent = item.description || "";

      const link = document.createElement("a");
      link.href = item.url || "#";
      link.textContent = isActive ? "Открыть выбранную установку" : (item.url ? "Открыть" : "Ссылка будет добавлена");
      link.target = "_blank";
      link.rel = "noreferrer";

      card.appendChild(title);
      card.appendChild(desc);
      card.appendChild(link);
      els.downloads.appendChild(card);
    });
  }

  function selectPlatform(platformId) {
    const platform = state.downloads.find(function (item) {
      return item.id === platformId;
    });

    if (!platform) {
      return;
    }

    state.selectedPlatformId = platform.id;

    Array.from(els.platforms.querySelectorAll(".platform-card")).forEach(function (card) {
      card.classList.toggle("active", card.dataset.platformId === platform.id);
    });

    els.platformHint.textContent = `Выбрано: ${platform.title}. Покажем нужную ссылку и шаги установки перед импортом конфига.`;
    renderDownloads(state.downloads);
    updateActionState();
  }

  function renderPlatforms(items) {
    const platforms = (items && items.length ? items : getFallbackPlatforms())
      .map(normalizePlatform)
      .filter(Boolean);

    state.downloads = platforms;
    els.platforms.innerHTML = "";

    platforms.forEach(function (platform) {
      const card = document.createElement("div");
      card.className = "platform-card";
      card.dataset.platformId = platform.id;
      card.tabIndex = 0;

      const title = document.createElement("strong");
      title.textContent = platform.title;

      const description = document.createElement("p");
      description.className = "muted";
      description.textContent = platform.description;

      const meta = document.createElement("div");
      meta.className = "platform-meta";
      meta.innerHTML = `<span>${platform.url ? "Есть ссылка" : "Ссылка скоро"}</span><span class="platform-cta">Выбрать</span>`;

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

    if (state.selectedPlatformId && platforms.some(function (item) { return item.id === state.selectedPlatformId; })) {
      selectPlatform(state.selectedPlatformId);
      return;
    }

    els.platformHint.textContent = platforms.length
      ? "Перед оформлением выберите устройство, чтобы мы показали нужную ссылку и шаги установки."
      : "Список устройств появится после загрузки каталога.";
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
      ? "Пробный тариф выдаётся один раз на Telegram-пользователя."
      : `Срок доступа: ${plan.durationDays} дней.`;

    updateActionState();
  }

  function renderPlans(items, defaultPlanId) {
    const plans = (items && items.length ? items : getFallbackPlans())
      .map(normalizePlan)
      .filter(Boolean);

    state.plans = plans;
    els.plans.innerHTML = "";

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

    const preferredPlanId = defaultPlanId || state.selectedPlanId || (config.app && config.app.defaultPlanId) || (plans[0] && plans[0].planId);
    if (preferredPlanId) {
      selectPlan(preferredPlanId);
    }
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

    setDownloadLink(configFileUrl);
    updateActionState();
  }

  function renderPendingAccess(data, expiresAt) {
    resetAccessView(
      data.statusLabel || "Оплата получена",
      expiresAt ? `Срок доступа уже рассчитан до ${expiresAt}` : "Ждём выдачу конфигурации новым VPN-сервером.",
      "Как только сервер выдаст `.conf`, он появится здесь."
    );
  }

  function renderAccess(data) {
    if (!data) {
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
      "После оплаты здесь появится `.conf`."
    );
  }

  async function loadCatalog() {
    if (!hasTelegramContext()) {
      renderPlans(getFallbackPlans(), config.app && config.app.defaultPlanId);
      renderPlatforms();
      renderDownloads();
      return;
    }

    if (!config.api || !config.api.catalogUrl) {
      renderPlans(getFallbackPlans(), config.app && config.app.defaultPlanId);
      renderPlatforms();
      renderDownloads();
      return;
    }

    const data = await postJson(config.api.catalogUrl, getUserPayload());
    const plans = data.plans || (data.plan ? [data.plan] : []);

    renderPlans(plans, data.defaultPlanId);
    renderPlatforms(data.downloads);
    renderDownloads(data.downloads);
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

    await navigator.clipboard.writeText(state.configText);
    setToast("Конфиг скопирован");
  }

  async function bootstrap() {
    renderBase();
    renderPlans(getFallbackPlans(), config.app && config.app.defaultPlanId);
    renderPlatforms();
    renderDownloads();
    renderAccess(null);

    els.buyButton.addEventListener("click", buyAccess);
    els.refreshButton.addEventListener("click", refreshStatus);
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
