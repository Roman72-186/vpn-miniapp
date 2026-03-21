(function () {
  const tg = window.Telegram && window.Telegram.WebApp ? window.Telegram.WebApp : null;
  const config = window.VPN_APP_CONFIG || {};

  const els = {
    title: document.getElementById("title"),
    subtitle: document.getElementById("subtitle"),
    price: document.getElementById("price"),
    planTitle: document.getElementById("plan-title"),
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
    user: null
  };

  function setToast(text) {
    els.toast.textContent = text;
  }

  function getUserPayload() {
    const user = tg && tg.initDataUnsafe && tg.initDataUnsafe.user
      ? tg.initDataUnsafe.user
      : { id: "preview-user", first_name: "Preview", username: "preview_user" };

    state.user = user;

    return {
      init_data: tg ? tg.initData || "" : "",
      user_id: String(user.id || ""),
      username: user.username || "",
      first_name: user.first_name || ""
    };
  }

  async function postJson(url, body) {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });

    const text = await response.text();
    const data = text ? JSON.parse(text) : {};

    if (!response.ok) {
      throw new Error(data.message || data.detail || "Ошибка запроса");
    }

    return data;
  }

  function renderBase() {
    els.title.textContent = config.app && config.app.title ? config.app.title : "CreativeAnalytic VPN";
    els.subtitle.textContent = config.app && config.app.subtitle
      ? config.app.subtitle
      : "Отдельная miniapp для оплаты и выдачи конфигурации.";
    els.planTitle.textContent = config.app && config.app.planTitle ? config.app.planTitle : "VPN на 30 дней";
    els.price.textContent = config.app && config.app.priceLabel ? config.app.priceLabel : "299 Stars";

    if (tg) {
      tg.ready();
      tg.expand();
    }

    const payload = getUserPayload();
    els.userName.textContent = payload.username ? `@${payload.username}` : payload.first_name || payload.user_id;
    els.userMeta.textContent = payload.user_id
      ? `Telegram ID: ${payload.user_id}`
      : "Откройте miniapp в Telegram.";
  }

  function renderDownloads(items) {
    const list = items && items.length ? items : config.downloads || [];
    els.downloads.innerHTML = "";

    list.forEach(function (item) {
      const card = document.createElement("div");
      card.className = "download-item";

      const title = document.createElement("strong");
      title.textContent = item.title || "Платформа";

      const desc = document.createElement("p");
      desc.className = "muted";
      desc.textContent = item.description || "";

      const link = document.createElement("a");
      link.href = item.url || "#";
      link.textContent = item.url ? "Открыть" : "Ссылка будет добавлена";
      link.target = "_blank";
      link.rel = "noreferrer";

      card.appendChild(title);
      card.appendChild(desc);
      card.appendChild(link);
      els.downloads.appendChild(card);
    });
  }

  function renderAccess(data) {
    if (!data || !data.isActive) {
      els.accessStatus.textContent = "Нет активного доступа";
      els.accessMeta.textContent = "После оплаты доступ появится здесь.";
      els.configBox.textContent = "После оплаты здесь появится `.conf`.";
      els.configPreview.classList.add("hidden");
      els.copyButton.disabled = true;
      els.downloadLink.classList.add("disabled-link");
      els.downloadLink.href = "#";
      state.configText = "";
      return;
    }

    const expiresAt = data.expiresAt || data.expires_at || "";
    const ip = data.ipAddress || data.ip_address || "IP не указан";
    state.configText = data.configText || data.config_text || "";

    els.accessStatus.textContent = "Доступ активен";
    els.accessMeta.textContent = expiresAt ? `Оплачен до ${expiresAt}` : "Доступ подтверждён";
    els.configBox.innerHTML = `<strong>IP:</strong> ${ip}<br><strong>Срок:</strong> ${expiresAt || "не указан"}`;

    if (state.configText) {
      els.configPreview.textContent = state.configText;
      els.configPreview.classList.remove("hidden");
      els.copyButton.disabled = false;
    }

    if (data.configFileUrl || data.config_file_url) {
      els.downloadLink.href = data.configFileUrl || data.config_file_url;
      els.downloadLink.classList.remove("disabled-link");
    }
  }

  async function loadCatalog() {
    if (!config.api || !config.api.catalogUrl) {
      renderDownloads();
      return;
    }

    const payload = getUserPayload();
    const data = await postJson(config.api.catalogUrl, payload);
    renderDownloads(data.downloads);
  }

  async function loadStatus() {
    if (!config.api || !config.api.statusUrl) {
      renderAccess(null);
      return;
    }

    const payload = getUserPayload();
    const data = await postJson(config.api.statusUrl, payload);
    renderAccess(data.access || data);
  }

  async function buyAccess() {
    if (!config.api || !config.api.createInvoiceUrl) {
      setToast("Сначала заполните createInvoiceUrl в config.js");
      return;
    }

    els.buyButton.disabled = true;
    els.buyButton.textContent = "Готовим оплату...";

    try {
      const payload = getUserPayload();
      const data = await postJson(config.api.createInvoiceUrl, payload);

      if (tg && typeof tg.openInvoice === "function" && (data.invoiceSlug || data.invoiceUrl)) {
        tg.openInvoice(data.invoiceSlug || data.invoiceUrl, function (status) {
          setToast(`Статус оплаты: ${status}`);
          if (status === "paid") {
            loadStatus().catch(function () {});
          }
        });
      } else if (data.invoiceUrl) {
        window.open(data.invoiceUrl, "_blank", "noopener,noreferrer");
      } else {
        throw new Error("n8n не вернул ссылку на оплату");
      }
    } catch (error) {
      setToast(error.message || "Не удалось создать оплату");
    } finally {
      els.buyButton.disabled = false;
      els.buyButton.textContent = "Купить";
    }
  }

  async function refreshStatus() {
    els.refreshButton.disabled = true;
    els.refreshButton.textContent = "Проверяем...";

    try {
      await loadStatus();
      setToast("Статус обновлён");
    } catch (error) {
      setToast(error.message || "Не удалось обновить статус");
    } finally {
      els.refreshButton.disabled = false;
      els.refreshButton.textContent = "Обновить статус";
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
    renderDownloads();
    renderAccess(null);

    els.buyButton.addEventListener("click", buyAccess);
    els.refreshButton.addEventListener("click", refreshStatus);
    els.copyButton.addEventListener("click", function () {
      copyConfig().catch(function () {
        setToast("Не удалось скопировать конфиг");
      });
    });

    try {
      await loadCatalog();
    } catch (error) {
      setToast("Каталог пока не подключён к n8n");
    }

    try {
      await loadStatus();
    } catch (error) {
      setToast("Статус пока не подключён к n8n");
    }
  }

  bootstrap().catch(function () {
    setToast("Ошибка запуска miniapp");
  });
})();
