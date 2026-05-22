# Локальная разработка: несколько сайтов

## Реестр сайтов

Конфиги базовых изданий — `shared/sites/manifest.json` (25 сайтов + `ryazpressa` отдельно).
Генерация placeholder-логотипов:

```bash
pnpm generate:logos
```

Проверка уникальности доменов и согласованности nav/sections:

```bash
pnpm validate:sites
```

Входит в `pnpm lint:all` и pre-commit (Husky).

## Как добавить сайт

### Базовое издание (gallery, documents, contacts)

1. Запись в [`shared/sites/manifest.json`](../shared/sites/manifest.json):

   ```json
   { "slug": "example", "name": "Название", "domain": "example.ru" }
   ```

2. Цвета бренда в [`shared/sites/siteBrandColors.ts`](../shared/sites/siteBrandColors.ts).
3. Логотип: `pnpm generate:logos` или положите `public/sites/{slug}/logo.svg`.
4. Проверка: `pnpm validate:sites`.

Конфиг, домены (apex + www + punycode для IDN), `sections` и `nav` собираются через `createBaseSiteConfig()`.

### Расширенный сайт (округа, проекты, «Рядом с нами»)

1. Файл `shared/sites/{slug}.ts` — см. [`shared/sites/_template.ts`](../shared/sites/_template.ts) и эталон [`ryazpressa.ts`](../shared/sites/ryazpressa.ts).
2. Подключите в [`shared/sites/index.ts`](../shared/sites/index.ts) **перед** `...baseSiteConfigs`.
3. Логотип в `public/sites/{slug}/logo.svg`, затем `pnpm validate:sites`.

Mock-данные для новых базовых сайтов подтягиваются автоматически (fallback на `nesecretno`).

## Переключение сайта на localhost

В `.env`:

```env
NUXT_SITE_SLUG=ryazpressa
# или
NUXT_SITE_SLUG=nesecretno
```

После смены значения перезапустите `pnpm dev`.

Если slug указан с опечаткой, API вернёт **404** с текстом `Unknown NUXT_SITE_SLUG "…"` и списком известных slug.

## Эмуляция домена (без смены .env)

Запросы с заголовком `Host` (как в production behind proxy):

```bash
curl -H "Host: nesecretno.ru" http://localhost:3000/api/_site
curl -H "Host: ryazpressa.ru" http://localhost:3000/api/_site
```

За прокси также поддерживается `X-Forwarded-Host`.

## Smoke-тест изоляции

При запущенном `pnpm dev`:

```bash
pnpm smoke:sites
```

Проверяет все **26 сайтов** из реестра:

- `GET /api/_site` по домену каждого сайта → корректный `slug` и `sections`
- `ryazpressa.ru` — `gallery` выключена; базовый сайт — `gallery` включена
- `ryazpressa.ru /api/gallery` → 404; базовый сайт `/api/gallery` → 200
- `denzadnem.su /api/news` → непустой ответ
- неизвестный host → 404

## Реальный бэкенд вместо mock

```env
NUXT_USE_MOCK_API=false
NUXT_PUBLIC_API_BASE=https://api.example.com
```

Nitro проксирует `/api/*` на `{apiBase}/*` через `serverApi` (заголовок `X-Site-Slug`). Подробнее: [`docs/api-contract.md`](api-contract.md).
