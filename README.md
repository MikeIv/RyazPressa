# Ryazpressa Platform

Мультиарендная новостная платформа на **Nuxt 4.4.x** (Vue 3, TypeScript, Nitro).
Один деплой обслуживает 26 новостных сайтов — сайт определяется по домену в runtime.

- Основной сайт: https://ryazpressa.ru/
- GitLab: https://gitlab.com/llcsavin/ryazpressa-front.git

## Новый проект на базе шаблона

1. Скопируйте каталог или сделайте fork, затем **`git remote`** на свой origin.
2. В **`package.json`**: поле **`name`** (и при желании `description` / приватность).
3. **`README.md`**: заголовок и описание под ваш продукт.
4. **`app/pages/index.vue`**: заголовок и текст приветствия.
5. **`cp .env.example .env`**: для прода задайте **`NUXT_PUBLIC_API_BASE=https://api.ryazpressa.ru`** (единый API для всех сайтов).
6. **`pnpm install`** → **`pnpm run build`** и **`pnpm run lint:all`** —
   убедитесь, что всё зелёное.

## Требования

- Node.js LTS (рекомендуется актуальная LTS)
- [pnpm](https://pnpm.io/) 11.x (в репозитории зафиксирована версия через поле `packageManager` и Corepack)

## Установка

```bash
pnpm install
```

После установки автоматически выполняются:

- `postinstall` → `nuxt prepare` (генерация `.nuxt`, в т.ч. база для ESLint)
- `prepare` → `husky` (подключение Git-хуков, если в каталоге уже есть `.git`)

### Новый `git init` в этом проекте

Если репозиторий Git создан **после** первого `pnpm install`, Husky мог не привязаться (сообщение `.git can't be found`). Тогда один раз выполните:

```bash
pnpm exec husky
```

Проверка: `git config --get core.hooksPath` должно выводить `.husky/_`.

### Сборки, заблокированные pnpm

При предупреждении про игнорируемые postinstall-скрипты зависимостей:

```bash
pnpm approve-builds --all
```

В `package.json` уже указан `pnpm.onlyBuiltDependencies` для `unrs-resolver` (см. блок `pnpm`).

## Скрипты

| Команда              | Назначение                                                               |
| -------------------- | ------------------------------------------------------------------------ |
| `pnpm dev`           | dev-сервер (по умолчанию [http://localhost:3000](http://localhost:3000)) |
| `pnpm build`         | production-сборка                                                        |
| `pnpm preview`       | локальный просмотр собранного приложения                                 |
| `pnpm generate`      | статическая генерация (при необходимости)                                |
| `pnpm lint`          | ESLint по проекту                                                        |
| `pnpm lint:fix`      | ESLint с автоисправлением                                                |
| `pnpm format`        | Prettier — запись                                                        |
| `pnpm format:check`  | Prettier — проверка без записи                                           |
| `pnpm stylelint`     | Stylelint для `*.vue` и `*.css`                                          |
| `pnpm stylelint:fix` | Stylelint с автоисправлением                                             |
| `pnpm lint:all`      | последовательно ESLint + Prettier (check) + Stylelint                    |

## Качество кода и pre-commit

- **ESLint**: `@nuxt/eslint`, конфиг [`eslint.config.mjs`](eslint.config.mjs).
- **Prettier**: [`prettier.config.mjs`](prettier.config.mjs); файлы `*.vue` в Prettier **не** форматируются (см. [`.prettierignore`](.prettierignore)).
- **Stylelint**: минимальная конфигурация для стилей в SFC — [`stylelint.config.mjs`](stylelint.config.mjs).
- **Husky**: хук [`.husky/pre-commit`](.husky/pre-commit) вызывает [`scripts/pre-commit.mjs`](scripts/pre-commit.mjs) — баннер с именем из `package.json`, lint-staged с флагом `--concurrent false`.
- **lint-staged**: [`lint-staged.config.mjs`](lint-staged.config.mjs). Если в коммите только файлы вне типов для линта, проверки **пропускаются** с пояснением.

Коммит без хуков: `git commit --no-verify` (использовать осознанно).

## Структура проекта (кратко)

Исходники приложения — в **`app/`** ([`nuxt.config.ts`](nuxt.config.ts), `srcDir`): страницы, компоненты, layouts, composables, плагины, middleware, утилиты, ассеты.

Общий код клиента и Nitro — в **`shared/types`** и **`shared/utils`**.

Сервер Nitro — в **`server/`** (`api/`, `routes/`, `middleware/`, `plugins/`, `utils/`).

## HTTP API

- Прод: **`NUXT_PUBLIC_API_BASE`** → все `/api/*` на общий хост; сайт — **`X-Site-Slug`**.
- Клиент: **`useApiFetch()`** — [`app/composables/useApi.ts`](app/composables/useApi.ts), маппинг путей — [`shared/utils/clientApiBridge.ts`](shared/utils/clientApiBridge.ts).
- Dev: Nitro mock / proxy — [`server/utils/serverApi.ts`](server/utils/serverApi.ts).

### Правила Cursor (Agent)

Каталог **`.cursor/`** и **`AGENTS.md`** — **локально**, в git не коммитятся (см. [`.gitignore`](.gitignore)).

Синхронизация из [`_NUXT4_Template`](d:_WEB_Work_NUXT4_Template) или [`Cursor-rules-template`](d:_WEB_Work_Cursor-rules-template) — [`INSTALL-NUXT-VUE.md`](d:_WEB_Work_Cursor-rules-template\INSTALL-NUXT-VUE.md).

| Назначение                   | Путь (локально)                                                           |
| ---------------------------- | ------------------------------------------------------------------------- |
| Workflow (GSD + Superpowers) | `.cursor/rules/00-workflow-core.mdc` … `06-fundamental-principles.mdc`    |
| Verify / code-review         | `.cursor/rules/04-verify-and-done.mdc`, `.cursor/commands/code-review.md` |
| Контекст проекта             | `.cursor/rules/90-project-context.mdc`                                    |
| Nuxt / Vue / SCSS / API      | `.cursor/rules/nuxt-template.mdc`                                         |
| Планирование                 | `.planning/PROJECT.md`                                                    |
| Справка                      | `AGENTS.md`                                                               |

### MCP (локально, опционально)

Создайте `.cursor/mcp.json` (весь каталог `.cursor/` в `.gitignore`):

```json
{
  "$schema": "https://json.schemastore.org/mcp.json",
  "mcpServers": {
    "nuxt": { "url": "https://mcp.nuxt.com/mcp" },
    "context7": {
      "command": "npx",
      "args": ["-y", "@context7/mcp-server"]
    }
  }
}
```

## Документация

| Документ                                                         | Назначение                             |
| ---------------------------------------------------------------- | -------------------------------------- |
| [docs/deployment-static-spa.md](docs/deployment-static-spa.md)   | Деплой статики + direct API для DevOps |
| [docs/optimization-plan.md](docs/optimization-plan.md)           | План волн, чек-листы, статус rollout   |
| [docs/api-contract.md](docs/api-contract.md)                     | Контракт REST API для бэкенда          |
| [Nuxt 4](https://nuxt.com/docs/4.x/getting-started/introduction) | Фреймворк                              |

### Production deploy

```bash
NUXT_PUBLIC_API_BASE=https://api.ryazpressa.ru pnpm generate
# артефакт: .output/public/
```

CI: [`.gitlab-ci.yml`](.gitlab-ci.yml) — lint, typecheck, generate. Один бандл на все 26 сайтов; идентификация через `X-Site-Slug`.
