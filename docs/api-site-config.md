# Эндпоинт `GET /api/_site`

Это **самый важный** эндпоинт для фронтенда в статическом Variant 3.

SPA вызывает его самым первым (`useSiteConfig` + несколько middleware). От ответа зависят:

- название сайта и `<title>`
- вся цветовая тема, логотип, фавиконы
- основная навигация
- какие разделы доступны (остальные → 404)
- структура URL статей (`/slug` или `/news/slug`)

Бэкенд **обязан** определять сайт по заголовку `Host` / `X-Forwarded-Host` уже на этом запросе.

---

## Полный пример ответа (для ryazpressa)

```json
{
  "slug": "ryazpressa",
  "name": "Рязпресса",

  "apiBase": "",
  "apiSiteHost": "ryazpressa.ru",

  "articlePathPrefix": "",

  "sections": {
    "gallery": false,
    "documents": true,
    "contacts": true,
    "okruga": true,
    "ryadomSNami": true,
    "projects": true
  },

  "nav": [
    { "label": "Новости", "to": "/" },
    { "label": "Округа", "to": "/okruga" },
    { "label": "Рядом с нами", "to": "/ryadom-s-nami" },
    { "label": "Проекты", "to": "/projects" },
    { "label": "Контакты", "to": "/contacts" },
    { "label": "Документы", "to": "/documents" }
  ],

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

---

## Поля и их назначение

| Поле                        | За что отвечает                                    | Где используется на фронте                                  | Для ryazpressa (тест `web.ryazpressa.ru`)              | Для базовых изданий (nesecretno и др.)             |
| --------------------------- | -------------------------------------------------- | ----------------------------------------------------------- | ------------------------------------------------------ | -------------------------------------------------- |
| `slug`                      | Внутренний идентификатор                           | Логи, кэш, `X-Site-Slug` fallback                           | `"ryazpressa"`                                         | Слаг из реестра                                    |
| `name`                      | Название издания                                   | `<title>`, h1, футер, fallback логотипа                     | `"Рязпресса"`                                          | Название издания                                   |
| `apiBase`                   | База для не-контрактных вызовов (редко)            | `useApi`/`useApiFetch` для путей вне `/api/*`               | `""` или `"https://api.ryazpressa.ru"`                 | Обычно `""`                                        |
| `apiSiteHost`               | Основной домен для заголовка `X-Site-Slug`         | При прямых запросах к API                                   | `"ryazpressa.ru"` (или `web.ryazpressa.ru` на тесте)   | Основной домен издания                             |
| `articlePathPrefix`         | **Критично**. Префикс в URL статей                 | Middleware статей, ссылки, редиректы                        | `""` (статьи по `/:slug`)                              | `"/news"`                                          |
| `sections`                  | Какие разделы включены                             | `middleware/section.ts` (404 если выключен), построение nav | Расширенный набор (okruga/ryadomSNami/projects = true) | Только базовые (gallery/documents/contacts = true) |
| `nav`                       | Пункты основной навигации (в порядке показа)       | `AppHeader`, `AppFooter`                                    | Свой порядок (Округа, Рядом с нами, Проекты первыми)   | Стандартный порядок                                |
| `theme.color*`              | Основные цвета (primary, accent, text, background) | CSS-переменные `--site-color-*`                             | Цвета Рязпрессы                                        | Цвета издания                                      |
| `theme.radius*`             | Радиусы скруглений                                 | Глобальные стили                                            | `"4px"` / `"8px"`                                      | То же                                              |
| `theme.logoSrc` + размеры   | Логотип в шапке                                    | `AppHeaderLogo` (с размерами для CLS)                       | `/sites/ryazpressa/logo.svg` + `logoWidth/Height`      | `/sites/<slug>/logo.svg`                           |
| `theme.faviconSrc`          | Фавикон                                            | `<link rel="icon">`                                         | `/sites/ryazpressa/favicon.ico`                        | Соответствующий                                    |
| `theme.appleTouchIconSrc`   | Apple Touch Icon (опционально)                     | head                                                        | Опционально                                            | Опционально                                        |
| `theme.headerGradientStart` | Начало градиента шапки (опционально)               | Генерация градиента                                         | Обычно совпадает с фоном                               | То же                                              |

---

## Важные замечания

- **Разрешение по Host** — по умолчанию первый `/api/_site` приходит с Host контент-домена (`web.ryazpressa.ru` и т.д.). Бэкенд должен по нему отдать ryazpressa-конфиг.
- **Альтернативный режим** (когда бэкенд хочет всегда видеть `Host: api.ryazpressa.ru` для `_site`): задайте на сборке `NUXT_PUBLIC_SITE_CONFIG_API_BASE=https://api.ryazpressa.ru`. Тогда клиент сделает абсолютный запрос на api-поддомен, браузер пошлёт `Host: api.ryazpressa.ru`, а мы отправим стандартные заголовки:
  - `X-Forwarded-Host: <реальный контент-домен>`
  - `X-Forwarded-Proto: https`
    Бэкенд должен читать `X-Forwarded-Host` для определения сайта. Требуется CORS на `api.ryazpressa.ru`. См. `docs/deployment-static-spa.md`.
- `articlePathPrefix` — один из самых критичных флагов. Неправильное значение ломает все ссылки на статьи.
- `sections` управляют 404: если `sections.okruga === false`, фронтенд на `/okruga` отдаст 404.
- `nav` можно генерировать по тем же правилам, что у нас (`navFromSections`), или отдавать готовым массивом.
- Ассеты (`logoSrc`, `faviconSrc` и т.д.) — это статические файлы из билда фронтенда (`/sites/<slug>/...`). Их не нужно отдавать через API.

---

## Эталоны в коде фронтенда

- Расширенный сайт (ryazpressa): `shared/sites/ryazpressa.ts`
- Базовые издания: `shared/sites/createBaseSite.ts` + `shared/sites/manifest.json`
- Типы: `shared/types/site.ts` (`SiteConfig` / `PublicSiteConfig`)
- Логика навигации: `shared/sites/baseSections.ts`

---

**Текущий тест (на 9 июня 2026):**
Для `web.ryazpressa.ru` бэкенд должен отдавать именно ryazpressa-конфиг (расширенные разделы + `articlePathPrefix: ""`).

Полная инструкция по деплою и проверкам: `docs/deployment-static-spa.md`.
