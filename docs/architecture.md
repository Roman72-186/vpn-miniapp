# Архитектура

## Фронт

- Хостинг: `Vercel`
- Тип: статическая miniapp
- Назначение:
  - показать тариф;
  - открыть оплату;
  - отобразить статус доступа;
  - выдать ссылки на приложения и `.conf`.

## Оркестрация

- Сервис: `n8n`
- Отдельные workflow:
  - `vpn-miniapp-catalog`
  - `vpn-miniapp-create-invoice`
  - `vpn-miniapp-status`
  - `vpn-payment-handler`

## VPN сервер

- Хост: `72.56.28.245`
- Сервисы:
  - `AmneziaWG`
  - `vpn-api`
- Назначение:
  - выпуск новых конфигов;
  - хранение сроков действия;
  - отключение просроченных доступов.

## Рекомендуемые адреса

- `vpn.creativeanalytic.ru` -> miniapp на Vercel
- `vpn-api.creativeanalytic.ru` -> API на новом сервере
