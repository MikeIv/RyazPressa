# Agent workflow — Nuxt 4 Template

Правила Cursor уже в репозитории — при копировании шаблона в новый проект **ничего подключать не нужно**, только обновить контекст под продукт.

## Правила (`.cursor/rules/`)

| Файл                        | Назначение                                                          |
| --------------------------- | ------------------------------------------------------------------- |
| `00-workflow-core`          | S/M/L/XL, фазы GSD + Superpowers                                    |
| `01-discuss-before-code`    | Уточнение до кода                                                   |
| `02-planning-gsd`           | `.planning/`, волны                                                 |
| `03-execution-discipline`   | Минимальный diff, `useApi`                                          |
| `04-verify-and-done`        | Lint, «готово»                                                      |
| `05-context-hygiene`        | Узкий контекст                                                      |
| `06-fundamental-principles` | Мета-принципы: причина vs симптом, типы, эталоны, минимализм правил |
| `90-project-context`        | Контекст шаблона / продукта                                         |
| `nuxt-template`             | Nuxt 4, Vue, SCSS, линты                                            |

## После копирования в новый репозиторий

1. `package.json` → `name`
2. [`.cursor/rules/90-project-context.mdc`](.cursor/rules/90-project-context.mdc)
3. [`.planning/PROJECT.md`](.planning/PROJECT.md)
4. README, `app/pages/index.vue`

## Задача агенту

```text
Класс M. Задача: …
Done when: …
```

```bash
cp .planning/brief-template.md .planning/brief.md
```

## Внешний шаблон правил

Расширенная инструкция и синхронизация: `d:\_WEB\_Work\_Cursor-rules-template\INSTALL-NUXT-VUE.md`
