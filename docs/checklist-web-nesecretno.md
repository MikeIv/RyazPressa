# Чек-лист: `web.nesecretno.ru`

**Проверка:** 9 июня 2026 · **Домен:** `https://web.nesecretno.ru` (тот же SPA-бандл, что `web.ryazpressa.ru`)

См. также: [deployment-static-spa.md](./deployment-static-spa.md), [api-site-config.md](./api-site-config.md), [optimization-plan.md](./optimization-plan.md)

**Легенда:** `[x]` готово · `[ ]` не готово · `[~]` частично

**Вердикт 9.06:** DevOps и фронт OK; приёмка заблокирована бэкендом (`_site`, `/api/posts`, разделы).

| Слой             | Готово |
| ---------------- | ------ |
| DevOps / статика | 6/6    |
| `_site`          | 5/16   |
| API данные       | 0/6    |
| Браузер          | 2/11   |

---

## 1. DevOps / статика

| #   | Проверка                                                | Статус |
| --- | ------------------------------------------------------- | ------ |
| D1  | `https://web.nesecretno.ru/` → 200                      | [x]    |
| D2  | Чанки `_nuxt/*` без 404                                 | [x]    |
| D3  | `/sites/nesecretno/logo.svg` → 200                      | [x]    |
| D4  | SPA fallback (маршруты отдаёт JS, не nginx 404)         | [x]    |
| D5  | CORS: `Origin: https://web.nesecretno.ru` → 204         | [x]    |
| D6  | API-запросы на `api.ryazpressa.ru`, не на контент-домен | [x]    |

```bash
curl -sS -o /dev/null -w "spa:%{http_code}\n" https://web.nesecretno.ru/
curl -sS -o /dev/null -w "logo:%{http_code}\n" https://web.nesecretno.ru/sites/nesecretno/logo.svg
```

---

## 2. Бэкенд: `GET /api/_site`

```bash
curl -sS -H "X-Site-Slug: nesecretno.ru" https://api.ryazpressa.ru/api/_site
```

| #       | Поле                                      | Ожидание                     | Факт 9.06             | OK  |
| ------- | ----------------------------------------- | ---------------------------- | --------------------- | --- |
| S1      | HTTP                                      | 200                          | 200                   | [x] |
| S2      | `slug`                                    | `nesecretno`                 | `nesecretno`          | [x] |
| S3      | `name`                                    | «Не секретно»                | «Александро-Невский»  | [ ] |
| S4      | `apiSiteHost`                             | `nesecretno.ru`              | `nesecretno.ru`       | [x] |
| S5      | `articlePathPrefix`                       | `/news`                      | `""`                  | [ ] |
| S6–S8   | `sections` gallery / documents / contacts | `true`                       | `false`               | [ ] |
| S9–S11  | okruga / ryadomSNami / projects           | `false`                      | `false`               | [x] |
| S12     | `nav`                                     | Галерея, Документы, Контакты | только «Новости»      | [ ] |
| S13–S14 | цвета темы                                | `#1e73be` / `#008ca8`        | `#1a4b8c` / `#c62828` | [ ] |
| S15     | `theme.logoSrc`                           | `/sites/nesecretno/logo.svg` | `/logo.svg`           | [ ] |

---

## 3. Бэкенд: данные

| #   | Эндпоинт                    | Ожидание        | Факт 9.06                   | OK  |
| --- | --------------------------- | --------------- | --------------------------- | --- |
| A1  | `GET /api/posts?perPage=20` | 200 + `data[]`  | 500 (`PostResource.php:27`) | [ ] |
| A2  | `image.url` в постах        | URL картинки    | ID вместо URL               | [ ] |
| A3  | `GET /api/gallery`          | 200             | 404                         | [ ] |
| A4  | `GET /api/documents`        | 200             | не проверено                | [ ] |
| A5  | `GET /api/contacts`         | 200             | не проверено                | [ ] |
| A6  | `GET /api/posts/{slug}`     | 200 + `content` | блокируется A1              | [ ] |

Эталон: `X-Site-Slug: ryazpressa.ru` → `/api/posts` = 200.

```bash
curl -sS -o /dev/null -w "posts:%{http_code}\n" \
  -H "X-Site-Slug: nesecretno.ru" \
  "https://api.ryazpressa.ru/api/posts?perPage=20"
```

---

## 4. Браузер

| #     | Проверка                                 | OK                 |
| ----- | ---------------------------------------- | ------------------ |
| F1    | `<title>` из `_site`                     | [~]                |
| F2    | CSS-переменные темы (`--site-color-*`)   | [x] цвета неверные |
| F3    | Логотип `/sites/nesecretno/logo.svg`     | [ ]                |
| F4    | Nav: Галерея, Документы, Контакты        | [ ]                |
| F5    | Лента новостей                           | [~] кэш при 500    |
| F6    | «Главное сегодня»                        | [ ]                |
| F7–F9 | `/gallery/`, `/documents/`, `/contacts/` | [ ]                |
| F10   | `/news/{slug}`                           | [ ]                |
| F11   | `/okruga/`, `/projects/` → 404           | [x]                |

---

## 5. Порядок исправлений

1. `/api/posts` для `nesecretno.ru` (A1)
2. Полный `/api/_site`: `sections`, `articlePathPrefix`, `theme`, `nav` (S3–S15)
3. Эндпоинты gallery / documents / contacts (A3–A5)
4. `image.url` в постах (A2)
5. Повторный прогон §1–§4

Пересборка фронта **не нужна**.

---

## 6. Критерий «зелёный»

Все пункты §1–§4 — `[x]`. Быстрый smoke после фикса:

```bash
curl -sS -H "X-Site-Slug: nesecretno.ru" https://api.ryazpressa.ru/api/_site
curl -sS -o /dev/null -w "posts:%{http_code}\n" -H "X-Site-Slug: nesecretno.ru" \
  "https://api.ryazpressa.ru/api/posts?perPage=20"
curl -sS -o /dev/null -w "gallery:%{http_code}\n" -H "X-Site-Slug: nesecretno.ru" \
  https://api.ryazpressa.ru/api/gallery
```
