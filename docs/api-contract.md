# API Contract — Ryazpressa Platform

Документ для бэкенд-разработчика. Описывает REST API для мультиарендной новостной платформы (26 сайтов).

Типы TypeScript: [`shared/types/api.ts`](../shared/types/api.ts).

## Общие правила

### Multi-tenant

Сайт определяется по **домену запроса** (`Host`). Каждый сайт имеет свой `apiBase` (см. конфиги в `shared/sites/`).

Рекомендуемый заголовок для явной идентификации (опционально; бэкенд ожидает **домен** сайта):

```http
X-Site-Slug: ryazpressa.ru
```

### Формат

- `Content-Type: application/json; charset=utf-8`
- Даты: **ISO 8601** с таймзоной, например `2026-05-19T10:00:00+03:00`
- HTML в полях `content` — санитизированная разметка от CMS

### Пагинация (списки)

Query-параметры:

| Параметр  | Тип    | По умолчанию | Описание         |
| --------- | ------ | ------------ | ---------------- |
| `page`    | number | `1`          | Номер страницы   |
| `perPage` | number | `10`         | Записей (max 50) |

Ответ:

```json
{
  "data": [],
  "meta": {
    "page": 1,
    "perPage": 10,
    "total": 42,
    "totalPages": 5
  }
}
```

### Ошибки

```json
{
  "statusCode": 404,
  "message": "Article not found"
}
```

| Код | Когда                        |
| --- | ---------------------------- |
| 400 | Невалидные параметры         |
| 404 | Ресурс или раздел недоступен |
| 500 | Внутренняя ошибка            |

Раздел, отключённый для сайта (см. `sections` в конфиге), должен отдавать **404**.

---

## Эндпоинты

Базовый путь: `{apiBase}` сайта. В dev mock реализованы в Nitro как `/api/*`.

### Новости

> Бэкенд: `GET /api/posts` (вместо `/news`). Nitro проксирует `/api/news` → `/api/posts`.

#### `GET /news` (фронт) / `GET /api/posts` (бэкенд)

Лента новостей (главная, категории).

**Query:** `page`, `perPage`, `category?`, `district?` (slug округа)

**Response:** `PaginatedResponse<NewsItem>`

#### `GET /news/{slug}`

Полная статья.

**Response:** `Article`

---

### Фотогалерея

> Раздел доступен не на всех сайтах (`sections.gallery`).

#### `GET /gallery`

**Response:** `PaginatedResponse<GalleryItem>`

---

### Документы

> `sections.documents`

#### `GET /documents`

**Response:** `PaginatedResponse<DocumentItem>` (бэкенд может отдавать только `{ data }` без `meta` — фронт нормализует)

Поля элемента с бэкенда: `id`, `title`, `fileUrl`, `fileName?`, `fileSize?`, `createdAt` → `publishedAt`.

---

### Контакты

#### `GET /contacts`

**Response:** `ContactInfo`

---

### Округа (только ryazpressa.ru)

> `sections.okruga`

#### `GET /districts`

Список округов.

**Response:**

```json
{ "data": [District, ...] }
```

#### `GET /districts/{slug}`

Округ с лентой новостей.

**Response:** `DistrictDetail`

---

### Проекты (только ryazpressa.ru)

> `sections.projects`

#### `GET /projects`

**Response:**

```json
{ "data": [Project, ...] }
```

#### `GET /projects/{slug}`

**Response:** `ProjectDetail`

---

### Рядом с нами (только ryazpressa.ru)

> `sections.ryadomSNami`

#### `GET /near-us`

**Response:** `NearUsSection`

---

### Подписка на газеты

#### `GET /tariffs`

Список тарифов подписки.

**Response:** `ListResponse<Tariff>`

#### `GET /papers`

Список региональных изданий (газет).

**Response:** `ListResponse<Paper>`

---

## Сущности (кратко)

| Тип              | Назначение                    |
| ---------------- | ----------------------------- |
| `NewsItem`       | Карточка в ленте              |
| `Article`        | Полная статья (+ `content`)   |
| `GalleryItem`    | Фото в галерее                |
| `DocumentItem`   | Файл для скачивания           |
| `ContactInfo`    | Контакты редакции             |
| `District`       | Округ                         |
| `DistrictDetail` | Округ + новости               |
| `Project`        | Спецпроект (карточка)         |
| `ProjectDetail`  | Спецпроект (полная страница)  |
| `NearUsSection`  | Статичный раздел              |
| `Tariff`         | Тариф подписки на газету      |
| `Paper`          | Региональное издание          |
| `ImageAsset`     | Изображение (`url`, `alt`, …) |

---

## Mock API (разработка фронта)

Пока бэкенд не готов, Nitro отдаёт mock-данные по тем же путям (`NUXT_USE_MOCK_API` по умолчанию включён):

| Путь             | Mock handler                        |
| ---------------- | ----------------------------------- |
| `/api/news`      | `server/mock/handlers/news.ts`      |
| `/api/gallery`   | `server/mock/handlers/gallery.ts`   |
| `/api/documents` | `server/mock/handlers/documents.ts` |
| `/api/contacts`  | `server/mock/handlers/contacts.ts`  |
| `/api/districts` | `server/mock/handlers/districts.ts` |
| `/api/projects`  | `server/mock/handlers/projects.ts`  |
| `/api/near-us`   | `server/mock/handlers/near-us.ts`   |
| `/api/tariffs`   | `server/mock/handlers/tariffs.ts`   |
| `/api/papers`    | `server/mock/handlers/papers.ts`    |

### Переключение на реальный бэкенд

```env
NUXT_USE_MOCK_API=false
NUXT_PUBLIC_API_BASE=https://api.ryazpressa.ru
```

Или задайте `apiBase` в конфиге сайта (`shared/sites/`). Nitro проксирует `/api/news` → `{apiBase}/news` через `serverApi` с заголовком `X-Site-Slug`.

Проверка mock: `pnpm dev` → `http://localhost:3000/api/news`

Переключение сайта на localhost: `NUXT_SITE_SLUG=nesecretno` в `.env`.
