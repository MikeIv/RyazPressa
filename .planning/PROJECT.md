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

## Не трогать без согласования

- `srcDir`, ESLint/Husky pipeline
- Токены `--fs-*` — массовые изменения без задачи
- `.env` в git
