# Ryazpressa Platform — PROJECT

Постоянный контекст проекта для Cursor Agent.

## Назначение

Мультиарендная новостная платформа на Nuxt 4.4.
Единое приложение обслуживает 26 новостных сайтов — сайт определяется по домену в runtime,
каждый получает свой API и CSS-тему.

## Репозиторий

- GitLab: https://gitlab.com/llcsavin/ryazpressa-front.git
- Основной сайт: https://ryazpressa.ru/
- Второй сайт: https://nesecretno.ru/

## Стек

| Слой     | Технология                                                 |
| -------- | ---------------------------------------------------------- |
| Frontend | Nuxt 4.4, Vue 3.5                                          |
| Модули   | `@nuxt/eslint`                                             |
| Стили    | SCSS, CSS Modules в SFC (`$style`) + CSS-переменные темы   |
| Язык     | TypeScript strict, `typeCheck: 'build'`                    |
| Пакеты   | pnpm 11.x                                                  |
| API      | Per-site `apiBase` через `useSiteConfig()` → `useApiFetch` |

## Архитектура

**Runtime multi-tenant**: один деплой, сайт определяется по домену.

```
shared/sites/          # конфиги всех сайтов (slug, domain, apiBase, theme, sections)
server/middleware/     # определение сайта по домену, event.context.site
app/plugins/           # CSS-переменные темы в <html> через useHead
app/composables/useSiteConfig.ts  # доступ к конфигу текущего сайта
```

## Структура

```
app/                   # srcDir: pages, layouts, components, composables, assets
server/                # api/, routes/, utils/serverApi.ts, middleware/
shared/
  types/               # типы сущностей + API-контракт
  utils/               # normalizeApiBaseUrl + helpers
  sites/               # per-site конфиги
types/                 # nuxt-public.d.ts
scripts/               # pre-commit.mjs
.planning/             # артефакты планирования
```

## Разделы сайтов

**Базовый сайт (ryazpressa.ru):**

- `/` — главная, лента новостей
- `/news/[slug]` — страница статьи
- `/okruga` + `/okruga/[slug]` — округа (уникально для ryazpressa)
- `/ryadom-s-nami` — рядом с нами (уникально)
- `/projects` + `/projects/[slug]` — проекты (уникально)
- `/documents` — документы
- `/contacts` — контакты

**Остальные 25 сайтов (пример — nesecretno.ru, denzadnem.su):**

- `/` — главная
- `/gallery` — фотогалерея
- `/documents` — документы
- `/contacts` — контакты

Разделы управляются конфигом сайта (`sections: { gallery: true, okruga: false, ...}`).

## Команды

```bash
pnpm install
pnpm dev
pnpm build
pnpm lint:all
pnpm lint:fix
```

## Требования доступности (a11y) — приоритет

Обязательное соответствие WCAG 2.1 AA. Сайты должны читаться скринридерами.

**Обязательно по всему проекту:**

- Семантические теги: `<header>`, `<nav>`, `<main>`, `<article>`, `<section>`, `<footer>`
- Логичная иерархия заголовков `h1` → `h2` → `h3` (один `h1` на страницу)
- `alt` для всех изображений (пустой `alt=""` для декоративных)
- `<a>` только для навигации, `<button>` для действий
- ARIA-метки там, где смысл не очевиден из контекста (`aria-label`, `aria-labelledby`)
- ARIA landmarks: `role="navigation"`, `role="main"`, `role="banner"` и т.д.
- Skip-link «Перейти к содержимому» первым элементом `<body>`
- Контраст текста ≥ 4.5:1 (AA), крупный текст ≥ 3:1
- Фокус-стили видимы (не убирать `outline: none` без замены)
- Клавиатурная навигация: Tab, Enter, Space, Escape работают корректно
- `lang="ru"` на `<html>`

## Не трогать без согласования

- `srcDir`, ESLint/Husky pipeline
- Токены `--fs-*` — массовые изменения без задачи
- `.env` в git
