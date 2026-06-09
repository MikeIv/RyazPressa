# /api/\_site с X-Forwarded-Host (режим NUXT_PUBLIC_SITE_CONFIG_API_BASE)

Когда DevOps просят, чтобы запрос именно `/api/_site` **всегда** приходил с `Host: api.ryazpressa.ru`, мы используем специальный режим.

## Как включить

При сборке задайте переменную:

```bash
NUXT_PUBLIC_SITE_CONFIG_API_BASE=https://api.ryazpressa.ru pnpm generate
```

(или в `.env` / CI)

## Что происходит на клиенте

- Запрос `/api/_site` делается **абсолютным** URL: `https://api.ryazpressa.ru/api/_site`
- Браузер автоматически ставит заголовок:
  - `Host: api.ryazpressa.ru`
- Дополнительно фронтенд отправляет **стандартные прокси-заголовки**:
  - `X-Forwarded-Host: <реальный контент-домен>` (например `web.ryazpressa.ru` или `ryazpressa.ru`)
  - `X-Forwarded-Proto: https`

Это точно то поведение, которое даёт обычный reverse-proxy (nginx, caddy и т.д.).

Остальные запросы (`/api/news`, `/api/documents` и т.д.) по умолчанию остаются относительными (к текущему origin).

## Что должен делать бэкенд

На `api.ryazpressa.ru` в обработчике `/api/_site`:

1. Смотреть в первую очередь `X-Forwarded-Host`.
2. Если его нет — можно падать на `Host` (но в этом режиме `Host` будет `api.ryazpressa.ru`).
3. По значению из `X-Forwarded-Host` определять сайт и отдавать соответствующий `PublicSiteConfig`.

Пример псевдокода:

```ts
const forwardedHost = req.headers['x-forwarded-host'] || req.headers.host
const site = resolveSiteByHost(forwardedHost)
return getPublicSiteConfig(site)
```

## CORS

Поскольку запрос становится cross-origin, на `api.ryazpressa.ru` нужно:

- Разрешить CORS для всех контент-доменов (`web.ryazpressa.ru`, `ryazpressa.ru`, `nesecretno.ru`, `www.*` и т.д.).
- Разрешить заголовки `X-Forwarded-Host` и `X-Forwarded-Proto` (или просто `*` для заголовков на время теста).

## Когда использовать этот режим

- Когда на бэкенде проще/удобнее всегда видеть один и тот же `Host: api.ryazpressa.ru` именно для эндпоинта `_site`.
- Когда хочется отделить логику резолва сайта для конфига от остального API-трафика.

## Когда НЕ использовать (рекомендуемый путь)

- Прокси на веб-сервере каждого контент-домена (`location /api/`) с `proxy_set_header Host $host;` и `X-Forwarded-Host $host;`.
- Тогда все запросы (включая `_site`) приходят на бэкенд с правильным `Host` контент-домена без дополнительного режима и без CORS.

Этот режим — инструмент «на время», чтобы быстро закрыть требование DevOps про фиксированный Host для `_site`.

## Файлы, где это реализовано

- `app/composables/useSiteConfig.ts`
- `app/middleware/section.ts`
- `nuxt.config.ts` + `types/nuxt-public.d.ts`
- Документация: `docs/deployment-static-spa.md`, `docs/api-site-config.md`

---

**Текущий тест (9 июня 2026):**
Для `web.ryazpressa.ru` с включённым режимом запрос `_site` пойдёт на `api.ryazpressa.ru` с `Host: api.ryazpressa.ru` + `X-Forwarded-Host: web.ryazpressa.ru`.
