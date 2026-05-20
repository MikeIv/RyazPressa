# API Contract — Ryazpressa Platform

Документ для бэкенд-разработчика. Описывает REST API для мультиарендной новостной платформы (26 сайтов).

Типы TypeScript: [`shared/types/api.ts`](../shared/types/api.ts).

## Общие правила

### Multi-tenant

Сайт определяется по **домену запроса** (`Host`). Каждый сайт имеет свой `apiBase` (см. конфиги в `shared/sites/`).

Рекомендуемый заголовок для явной идентификации (опционально):

```http
X-Site-Slug: ryazpressa
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

#### `GET /news`

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

#### `GET /documents`

**Response:** `PaginatedResponse<DocumentItem>`

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
| `ImageAsset`     | Изображение (`url`, `alt`, …) |

---

## Mock API (разработка фронта)

Пока бэкенд не готов, Nitro отдаёт mock-данные по тем же путям:

| Путь             | Файл mock                  |
| ---------------- | -------------------------- |
| `/api/news`      | `shared/mock/news.ts`      |
| `/api/gallery`   | `shared/mock/gallery.ts`   |
| `/api/documents` | `shared/mock/documents.ts` |
| `/api/contacts`  | `shared/mock/contacts.ts`  |
| `/api/districts` | `shared/mock/districts.ts` |
| `/api/projects`  | `shared/mock/projects.ts`  |
| `/api/near-us`   | `shared/mock/near-us.ts`   |

Проверка: `pnpm dev` → `http://localhost:3000/api/news`

Переключение сайта на localhost: `NUXT_SITE_SLUG=nesecretno` в `.env`.
