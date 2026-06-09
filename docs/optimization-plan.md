# План оптимизации и rollout — Ryazpressa Platform

Документ для сверки процесса между фронтендом, DevOps и бэкендом.

**Статус на 9 июня 2026:** первый прод-тест на [https://web.ryazpressa.ru/](https://web.ryazpressa.ru/) — **работает** (статика + direct API `api.ryazpressa.ru`).

Связанные документы:

- [deployment-static-spa.md](./deployment-static-spa.md) — инструкция DevOps
- [api-contract.md](./api-contract.md) — контракт API
- [api-site-config.md](./api-site-config.md) — `/api/_site`

---

## Текущая архитектура (согласовано)

```
┌─────────────────────┐     статика      ┌──────────────────────────┐
│ web.ryazpressa.ru   │ ◄─────────────── │ nginx / CDN (.output/    │
│ (контент-домен)     │                  │ public после generate)   │
└─────────┬───────────┘                  └──────────────────────────┘
          │
          │  JS: cross-origin fetch
          ▼
┌─────────────────────┐
│ api.ryazpressa.ru   │  ← единый API для всех 26 сайтов
└─────────────────────┘
          ▲
          │  X-Site-Slug: ryazpressa.ru  (apex-домен)
          │  X-Forwarded-Host / Proto    (временно, уберём позже)
```

**Сборка для прода (обязательно):**

```bash
NUXT_PUBLIC_API_BASE=https://api.ryazpressa.ru pnpm generate
```

**Клиентский слой:** `shared/utils/clientApiBridge.ts`, `app/composables/useApi.ts`

| Контракт фронта                     | URL на API-хосте                                       |
| ----------------------------------- | ------------------------------------------------------ |
| `/api/_site`                        | `/api/_site`                                           |
| `/api/news`, `/api/news/:slug`      | `/api/posts`, `/api/posts/:slug`                       |
| `/api/documents`, `/api/gallery`, … | `/documents`, `/gallery`, … (префикс `/api` снимается) |

Идентификация сайта: **`X-Site-Slug`** (основной путь). CORS на `api.ryazpressa.ru` для всех контент-доменов.

---

## Волны работ

### Волна A — Стабилизация ✅ частично

| #   | Задача                                                  | Статус |
| --- | ------------------------------------------------------- | ------ |
| A1  | Обновить `deployment-static-spa.md` под direct API      | ✅     |
| A2  | GitLab CI: lint + typecheck + generate                  | ✅     |
| A3  | Smoke-скрипт curl для `_site` + `posts`                 | ⬜     |
| A4  | UI ошибки загрузки `_site`                              | ⬜     |
| A5  | Прогон всех разделов ryazpressa на `web.*`              | ⬜     |
| A6  | Сверка путей бэкенда (`/documents` vs `/api/documents`) | ⬜     |

### Волна B — Производительность и чистка

| #   | Задача                                                 | Статус |
| --- | ------------------------------------------------------ | ------ |
| B1  | Один `useApiFetch('/api/news')` на главной             | ✅     |
| B2  | Удалить `NewsFeed.vue`, deprecated `siteConfigApiBase` | ⬜     |
| B3  | Убрать `X-Forwarded-*` (после бэкенда)                 | ⬜     |
| B4  | `nuxi analyze`, lazy для тяжёлых страниц               | ⬜     |
| B5  | Кэш `useFetch` для списков                             | ⬜     |

### Волна C — Второй тестовый сайт

| #   | Задача                                       | Статус |
| --- | -------------------------------------------- | ------ |
| C1  | Деплой того же бандла на `nesecretno.ru`     | ⬜     |
| C2  | `X-Site-Slug: nesecretno.ru` → другой конфиг | ⬜     |
| C3  | Gallery — тест маппинга не-news путей        | ⬜     |
| C4  | Section middleware (okruga/projects → 404)   | ⬜     |

### Волна D — Продукт и UX

| #   | Задача                                                    | Приоритет |
| --- | --------------------------------------------------------- | --------- |
| D1  | Aside «Главное сегодня»: `period` на бэкенде или fallback | Высокий   |
| D2  | Пагинация списков                                         | Средний   |
| D3  | Поиск в шапке                                             | Средний   |
| D4  | `app/error.vue`                                           | Средний   |
| D5  | SEO: OG, canonical, description                           | Низкий    |

### Волна E — 26 сайтов

| #   | Задача                                           |
| --- | ------------------------------------------------ |
| E1  | Wildcard/nginx для всех контент-доменов          |
| E2  | CORS для всех origin                             |
| E3  | Мониторинг `_site` + `posts`                     |
| E4  | Актуализировать `.planning/` или ссылки в README |

---

## Порядок выполнения

```
A (стабилизация) ──► C (nesecretno) ──► E (26 сайтов)
        │
        └──► B (perf) ──► D (продукт)
```

---

## Чек-лист «два сайта зелёные»

См. [deployment-static-spa.md §5](./deployment-static-spa.md#5-чек-лист-верификации-после-деплоя-двух-сайтов).

**Ryazpressa (`web.ryazpressa.ru`) — на 9.06.2026:**

- [x] SPA загружается
- [x] `_site` → конфиг ryazpressa
- [x] Лента новостей
- [ ] Округа, проекты, документы, контакты, «Рядом с нами»
- [ ] Статья по slug

**Nesecretno (`web.nesecretno.ru`) — на 9.06.2026:**

Полный чек-лист: **[checklist-web-nesecretno.md](./checklist-web-nesecretno.md)**

- [x] SPA / статика / CORS
- [~] `_site` → slug верный, конфиг неполный (тема, разделы, prefix)
- [ ] `/api/posts` (500 на бэкенде)
- [ ] Галерея, документы, контакты
- [ ] Статья `/news/{slug}`

---

## Открытые вопросы

| Вопрос                                                       | Ответственный                                                   |
| ------------------------------------------------------------ | --------------------------------------------------------------- |
| Убрать `X-Forwarded-*` с фронта?                             | Бэкенд подтвердил: достаточно `X-Site-Slug` — убрать в волне B3 |
| Пути API кроме news/posts — с `/api` или без?                | Сверить A6 с бэкендом                                           |
| Aside пустой при старых новостях — норма или нужен `period`? | Продукт / D1                                                    |

---

## История изменений документа

| Дата       | Изменение                                                                                               |
| ---------- | ------------------------------------------------------------------------------------------------------- |
| 2026-06-09 | Первая версия после запуска `web.ryazpressa.ru`; быстрые победы A1, A2, B1                              |
| 2026-06-09 | Чек-лист верификации `web.nesecretno.ru` — [checklist-web-nesecretno.md](./checklist-web-nesecretno.md) |
