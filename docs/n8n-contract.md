# Контракт для n8n

Miniapp ожидает три публичных webhook URL.

## 1. Каталог

### Вход

```json
{
  "init_data": "query_id=...",
  "user_id": "123456789",
  "username": "roman72",
  "first_name": "Roman"
}
```

### Выход

```json
{
  "downloads": [
    {
      "title": "Windows",
      "description": "Клиент для Windows",
      "url": "https://..."
    }
  ]
}
```

## 2. Создание оплаты

### Вход

```json
{
  "init_data": "query_id=...",
  "user_id": "123456789",
  "username": "roman72",
  "first_name": "Roman"
}
```

### Выход

```json
{
  "invoiceUrl": "https://t.me/..."
}
```

или

```json
{
  "invoiceSlug": "ab12cd34"
}
```

## 3. Статус доступа

### Выход, если доступа нет

```json
{
  "isActive": false
}
```

### Выход, если доступ активен

```json
{
  "isActive": true,
  "expiresAt": "2026-04-21T12:00:00.000Z",
  "ipAddress": "10.20.30.40",
  "configText": "[Interface]\nPrivateKey = ...",
  "configFileUrl": "https://vpn-api.example.com/download/uuid"
}
```

## Рекомендуемые workflow в n8n

- `VPN MiniApp Catalog`
- `VPN MiniApp Create Invoice`
- `VPN MiniApp Status`
- `VPN Payment Handler`
