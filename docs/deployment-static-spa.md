# Развёртывание статической SPA (без Nitro в рантайме)

**Два тестовых сайта для первого деплоя:**

- `ryazpressa.ru` / `www.ryazpressa.ru` (расширенный сайт: округа, проекты, «Рядом с нами» и т.д.)
- `nesecretno.ru` (базовый сайт: галерея + документы + контакты)

**Текущий тестовый хост (на момент актуализации инструкции):**
Для первого сайта (ryazpressa) статика разворачивается на `https://web.ryazpressa.ru/` (а не сразу на финальный ryazpressa.ru).
Бэкенд **должен** при `Host: web.ryazpressa.ru` (и `www.web.ryazpressa.ru`) возвращать полный конфиг ryazpressa (расширенные разделы, `articlePathPrefix: ""`, соответствующая тема/навигация).

Как только эти два сайта будут работать end-to-end (корректный конфиг сайта, тема, навигация, новости и хотя бы один закрытый раздел), начинаем подключать остальные.

**Статус (июнь 2026):** `web.ryazpressa.ru` работает с direct API на `api.ryazpressa.ru`. План дальнейших работ: [optimization-plan.md](./optimization-plan.md).

---

## 1. Архитектура верхнего уровня (согласовано с DevOps)

- Один SPA-бандл (`pnpm generate`) раздаётся **на всех** контент-доменах.
- На статическом хостинге **не требуется** Nitro/Node для фронтенда.
- Браузер загружает SPA с контент-домена (`web.ryazpressa.ru`), затем делает **cross-origin** запросы на общий API-хост `https://api.ryazpressa.ru`.
- Сайт идентифицируется заголовком **`X-Site-Slug`** (apex-домен, например `ryazpressa.ru`; префиксы `web.` / `www.` убираются на фронте).
- На API-хосте нужен **CORS** для всех контент-доменов.
- Прокси `location /api/` на контент-домене **не обязателен** при direct API (альтернативная схема — см. §3).

Результат: разные домены — разные названия, цвета, навигация и контент с одного статического деплоя.

---

## 2. Сборка статических ассетов (сторона фронтенда)

Выполнить на чистой машине / в CI:

```bash
pnpm install
pnpm generate          # рекомендуется для чистой статической SPA
# или
pnpm build             # затем берём только публичную/статическую часть
```

### NUXT_PUBLIC_API_BASE (обязательно для прода)

При сборке **обязательно** задайте единый API-хост для всех 26 сайтов:

```bash
NUXT_PUBLIC_API_BASE=https://api.ryazpressa.ru pnpm generate
```

Переменная встраивается в `runtimeConfig.public.apiBase` и используется клиентом (`shared/utils/clientApiBridge.ts`):

- Все `/api/*` → абсолютные URL на `api.ryazpressa.ru`
- Маппинг путей: `/api/news` → `/api/posts` (см. `shared/utils/toBackendPath.ts`)
- Заголовок **`X-Site-Slug`** на каждый запрос (apex-домен контент-хоста)
- Временно также `X-Forwarded-Host` / `X-Forwarded-Proto` (планируется убрать)

**CI:** `.gitlab-ci.yml` выполняет `lint` → `typecheck` → `generate` с этой переменной; артефакт — `.output/public/`.

**Режим без `NUXT_PUBLIC_API_BASE`:** относительные `/api/*` на контент-домен (dev mock или nginx-прокси `/api/`). Для текущего прода **не используется**.

**Проверка билда:** в Network на `web.ryazpressa.ru` запросы должны идти на `https://api.ryazpressa.ru/api/...`, не на `web.ryazpressa.ru/api/...`.

**Что брать на деплой:**

После `pnpm generate` (или `pnpm build`) статическое дерево находится в `.output/public/` (или в эквивалентной папке `dist/`, в зависимости от вывода Nuxt для generate).

Структура выглядит так (один бандл на все 26 сайтов):

```
index.html
_nuxt/                  ← хэшированные JS + CSS (SPA runtime + роутер + компоненты)
sites/
  ryazpressa/
    logo.svg
    logo-single.png
    favicon.ico
    favicon-16x16.png
    favicon-32x32.png
    apple-touch-icon.png
  nesecretno/
    logo.svg
  ... (все остальные папки с ассетами сайтов — они небольшие и общие)
favicon.ico
robots.txt
```

**Важные наблюдения для DevOps:**

- На верхнем уровне **нет** отдельных папок `ryazpressa/`, `nesecretno/` и т.д. с собственным `index.html` или своим `_nuxt/`.
- Есть **один** `index.html` + один набор чанков `_nuxt/`.
- Папки `sites/<slug>/` содержат **только** брендовые ассеты (логотипы, фавиконы). Тема (цвета, какой логотип показывать, навигация, разделы) приходит с бэкенда в рантайме через `/api/_site`.
- Все 26 папок с ассетами сайтов включаются в один деплой (они очень маленькие).

Вы раскладываете **именно это дерево** (или его содержимое) в корни веб-серверов тестовых доменов (а потом и всех остальных).

---

## 3. Раздача статической SPA (требования к веб-серверу / CDN)

Для каждого контент-домена (начните с двух тестовых):

- Раздавать статические файлы из `.output/public/`.
- **SPA fallback** (критично): любой путь без реального файла → `index.html` (200).
  - `/`, `/slug-статьи`, `/gallery`, `/okruga/...` → `index.html`
  - `/_nuxt/*.js`, `/sites/*/logo.svg` → реальные файлы
- **Прокси `/api/` на контент-домене не нужен** при direct API (текущая схема). API вызывается с `api.ryazpressa.ru` из браузера.

Минимальный nginx (только статика):

```nginx
server {
    server_name web.ryazpressa.ru www.web.ryazpressa.ru ryazpressa.ru www.ryazpressa.ru;
    root /var/www/ryazpressa-static;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

**Альтернатива (co-location):** если когда-либо соберёте без `NUXT_PUBLIC_API_BASE`, добавьте `location /api/` с прокси на бэкенд и `proxy_set_header Host $host`.

**CORS на `api.ryazpressa.ru`:** разрешить origin контент-доменов и заголовки `X-Site-Slug`, `Content-Type`.

---

## 4. Требования к бэкенду для двух тестовых сайтов (минимальный набор, при котором SPA заработает)

Фронтенд ожидает, что бэкенд реализует **фронтенд-контракт** на контент-доменах.

Для запроса с `Host: web.ryazpressa.ru` (текущий тест) / `www.web.ryazpressa.ru` / `ryazpressa.ru` / `www.ryazpressa.ru` (или через `X-Forwarded-Host`) бэкенд должен вести себя как «сайт ryazpressa» и возвращать соответствующий ryazpressa-конфиг.

### 4.1 Обязательно: `GET /api/_site`

Это самый важный эндпоинт. SPA вызывает его сразу же (и от него зависят многие компоненты и middleware).

Ответ должен быть полным `PublicSiteConfig` для определённого сайта:

```json
{
  "slug": "ryazpressa",
  "name": "Рязпресса",
  "apiBase": "",                     // или origin API, если он отдельный
  "apiSiteHost": "ryazpressa.ru",
  "articlePathPrefix": "",           // "" для ryazpressa (статьи в корне), "/news" для базовых сайтов

  "sections": {
    "gallery": false,
    "documents": true,
    "contacts": true,
    "okruga": true,
    "ryadomSNami": true,
    "projects": true
  },

  "nav": [ { "label": "Новости", "to": "/" }, ... ],

  "theme": {
    "colorPrimary": "#1a4b8c",
    "colorAccent": "#c62828",
    "colorText": "#1a1a1a",
    "colorBackground": "#ffffff",
    "radiusSm": "4px",
    "radiusMd": "8px",
    "logoSrc": "/sites/ryazpressa/logo.svg",
    "logoAlt": "Рязпресса",
    "logoWidth": 300,
    "logoHeight": 28,
    "faviconSrc": "/sites/ryazpressa/favicon.ico",
    "appleTouchIconSrc": "/sites/ryazpressa/apple-touch-icon.png",
    "headerGradientStart": "#ffffff"
  }
}
```

Для `nesecretno.ru` ответ должен содержать:

- `slug: "nesecretno"`
- `articlePathPrefix: "/news"`
- `sections.gallery: true`, `documents: true`, `contacts: true`, а три расширенных раздела — `false`
- Соответствующую тему (другие основные/акцентные цвета, логотип `/sites/nesecretno/logo.svg` и т.д.)

Фронтенд будет использовать это для:

- Установки заголовка страницы и названия сайта
- Применения CSS-переменных темы (цвета, радиусы, градиент шапки)
- Отрисовки правильного логотипа + ссылок на favicon
- Построения основной навигации
- Показа/скрытия разделов и возврата клиентского 404 для отключённых разделов (через middleware)

**Бэкенд определяет сайт по заголовку `X-Site-Slug`** (apex-домен, например `ryazpressa.ru`). Фронт отправляет его на **каждый** API-запрос, в том числе до загрузки конфига (значение выводится из hostname: `web.ryazpressa.ru` → `ryazpressa.ru`).

`X-Forwarded-Host` — временно, планируется убрать; достаточно `X-Site-Slug`.

### 4.2 Эндпоинты данных (минимум, чтобы два тестовых сайта «ожили»)

Все ответы используют формы из фронтенд-контракта (см. также `shared/types/api.ts` и существующий `docs/api-contract.md`).

Общие правила:

- Пагинация: `{ "data": [...], "meta": { "page": 1, "perPage": 10, "total": 42, "totalPages": 5 } }`
- Ошибки: `{ "statusCode": 404, "message": "..." }`
- Если раздел отключён для сайта (`sections.xxx === false` в ответе `/api/_site` для этого домена) → соответствующий эндпоинт должен возвращать **404** (а не пустой список).

**Для обоих сайтов (новости всегда включены):**

- `GET /api/news` (с `?page=...&perPage=...&category=...&district=...`)
- `GET /api/news/{slug}` → полная `Article` (с полем `content`)

**Для nesecretno (базовый сайт, включены галерея + документы + контакты):**

- `GET /api/gallery`
- `GET /api/documents`
- `GET /api/contacts` (одиночный объект, без пагинации)

**Для ryazpressa (включены расширенные разделы):**

- `GET /api/districts`
- `GET /api/districts/{slug}` (округ + его новости)
- `GET /api/projects`
- `GET /api/projects/{slug}`
- `GET /api/near-us`

**Новости с «period=today-yesterday» (блок «Главное сегодня» на главной):**

- SPA отправляет `?period=today-yesterday` в одном из вызовов `/api/news`.
- На первом этапе вы можете игнорировать этот параметр на бэкенде и возвращать обычный список недавних новостей.
- Фронтенд сам клиентски отфильтрует полученные элементы — только те, что опубликованы сегодня или вчера (используется та же логика, которая раньше жила в Nitro-прокси).
- Позже можно добавить серверную поддержку параметра для эффективности (убрать его из запроса к внутреннему хранилищу, отфильтровать и скорректировать `meta.total` / `meta.totalPages`).

**Формы ответов (верхний уровень — точные поля смотрите в `shared/types/api.ts`):**

- `NewsItem`, `Article`, `PaginatedResponse<T>`, `ListResponse<T>`, `GalleryItem`, `DocumentItem`, `ContactInfo`, `District`, `DistrictDetail`, `Project`, `ProjectDetail`, `NearUsSection`, `ImageAsset`.

Даты: ISO 8601 с таймзоной (например `2026-05-19T10:00:00+03:00`).

HTML в полях `content` — санитизированный.

### 4.3 Заголовки и CORS

- **`X-Site-Slug`** — основной идентификатор сайта (обязателен для бэкенда).
- **CORS** на `api.ryazpressa.ru` — обязателен для cross-origin вызовов из браузера.
- Разрешить origin: `web.ryazpressa.ru`, `ryazpressa.ru`, `nesecretno.ru`, … (все контент-домены).
- Бэкенд news: фронт вызывает **`GET /api/posts`**, не `/api/news` (маппинг на клиенте).

---

## 5. Чек-лист верификации (после деплоя двух сайтов)

1. Статические файлы:
   - `https://web.ryazpressa.ru/` (текущий тест) или `https://ryazpressa.ru/` загружает оболочку SPA.
   - Соответствующие пути `_nuxt/...js`, `/sites/ryazpressa/logo.svg` и т.д. возвращают реальные ассеты (200 + правильный Content-Type).
   - То же самое для `nesecretno.ru`.

2. Конфиг сайта (самое важное):
   - **Текущий тест (web.ryazpressa.ru):**
     `curl -s -H "X-Site-Slug: ryazpressa.ru" https://api.ryazpressa.ru/api/_site`
     Должен вернуть 200 + JSON с `slug: "ryazpressa"`, `articlePathPrefix: ""`, расширенными разделами, правильной темой.
   - **Финальный прод (когда переедем):**
     `curl -i -H "Host: ryazpressa.ru" https://ryazpressa.ru/api/_site` → тот же ryazpressa-конфиг.
   - Для nesecretno (`web.nesecretno.ru` / `nesecretno.ru`): `curl -s -H "X-Site-Slug: nesecretno.ru" https://api.ryazpressa.ru/api/_site` → `slug: "nesecretno"`, `articlePathPrefix: "/news"`, только базовые разделы. Детальный статус: [checklist-web-nesecretno.md](./checklist-web-nesecretno.md).

3. Поведение SPA:
   - На текущем тестовом домене `web.ryazpressa.ru` (и позже на ryazpressa.ru): название, цвета, логотип и навигация — как у ryazpressa. Видны расширенные разделы (Округа, Проекты, Рядом с нами).
   - На nesecretno.ru: другой брендинг, только базовые разделы (Галерея, Документы, Контакты).
   - Открытие URL отключённого раздела на «чужом» сайте даёт 404 (клиентский или от бэкенда).

4. Данные:
   - На главной обоих доменов загружается лента новостей (идеально — разный контент, но хотя бы без падений).
   - Блок «Главное сегодня» показывает только материалы за сегодня/вчера (клиентская фильтрация).
   - Детальная статья работает (`/slug` на ryazpressa, `/news/slug` на nesecretno).
   - Для nesecretno: страницы Галереи, Документов, Контактов работают (если есть данные).
   - Для ryazpressa: страницы Округа, Проекты, Рядом с нами работают (если есть данные).

5. Отсутствие зависимости от Nitro на статическом хосте:
   - Не требуется запускать `node server/index.mjs` или аналогичный процесс только для того, чтобы отдавать фронтенд и маршрутизировать `/api/*`.

Если на двух доменах отображается корректная идентичность, тема, навигация и хотя бы новости + один-два раздела загружаются без ошибок — мультисайтовая SPA работает.

---

## 6. План rollout'а после того, как два сайта станут зелёными

- Добавляете следующий базовый сайт (обновляете бэкенд, чтобы он возвращал корректный `/api/_site` + реализуете включённые для него разделы).
- Разворачиваете **тот же самый** статический бандл (менять фронтенд не нужно) на новый домен + настраиваете прокси/fallback.
- Повторяете.
- Для сайтов уровня ryazpressa достаточно убедиться, что бэкенд знает их `sections` и есть данные по округам/проектам/«Рядом с нами».

Фронтенд-бандл и контракт Variant 3 спроектированы так, чтобы поддерживать все 26 сайтов из одного деплоя.

---

## 7. Дальнейшие работы

Полный план волн, чек-листы и статус задач: **[optimization-plan.md](./optimization-plan.md)**.

Кратко:

- `web.nesecretno.ru` подключён (статика); бэкенд-контракт — [checklist-web-nesecretno.md](./checklist-web-nesecretno.md).
- Прогнать все разделы ryazpressa (okruga, projects, documents, …).
- Убрать `X-Forwarded-*` с фронта (достаточно `X-Site-Slug`).
- Серверный `period=today-yesterday` для блока «Главное сегодня».
- Rollout на остальные 24 сайта.

---

**Этот документ + изменения фронтенда + реализация бэкендом минимального контракта выше — это то, что гарантирует работающую мультисайтовую SPA для первых двух тестовых сайтов.**

Когда два домена будут подняты и пройдут чек-лист верификации, у нас будет прочная база, чтобы добавлять оставшиеся 24 сайта по одному, не трогая фронтенд-бандл.
