# Nuxt 4 Template — PROJECT

Постоянный контекст для Cursor Agent. **Обновите после копирования шаблона в продуктовый репозиторий.**

## Назначение

Универсальный стартовый каркас Grand: Nuxt 4.4, Vue 3, TypeScript, Nitro, ESLint + Prettier + Stylelint, Husky, SCSS-токены (`--fs-*`), HTTP API (`useApi`, `useApiFetch`, `serverApi`).

## Стек

| Слой | Технология |
|------|------------|
| Frontend | Nuxt 4.4, Vue 3 |
| Lint | ESLint (@nuxt/eslint), Prettier, Stylelint |
| Стили | SCSS, CSS Modules в SFC |
| API | `runtimeConfig.public.apiBase` |
| PM | pnpm 11.x |

## Ключевые пути

| Путь | Назначение |
|------|------------|
| `app/pages/` | Маршруты |
| `app/layouts/default.vue` | Layout |
| `app/composables/useApi.ts` | HTTP клиент |
| `server/utils/serverApi.ts` | API с Nitro |
| `shared/utils/normalizeApiBaseUrl.ts` | URL API |
| `app/assets/styles/` | Глобальные стили и токены |

## Команды

```bash
pnpm install
pnpm dev
pnpm build
pnpm lint:all
```

## Новый проект из шаблона

1. Скопировать репозиторий / fork
2. Переименовать `package.json`, README, главную страницу
3. Обновить `90-project-context.mdc` и этот файл
4. `cp .env.example .env`

## Cursor rules

- Workflow: `.cursor/rules/00` … `06`
- Nuxt: `nuxt-template.mdc`
- Контекст: `90-project-context.mdc`
- Справка: `AGENTS.md`

## Ограничения для агента

- API только через обёртки шаблона
- Не коммитить `.env`
- Минимальный diff, без лишнего рефакторинга
