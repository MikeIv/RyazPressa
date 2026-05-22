# Локальная разработка: несколько сайтов

## Реестр сайтов

Конфиги базовых изданий — `shared/sites/manifest.json` (25 сайтов + `ryazpressa` отдельно).
Генерация placeholder-логотипов:

```bash
pnpm generate:logos
```

Проверка уникальности доменов и согласованности nav/sections:

```bash
pnpm validate:sites
```

Входит в `pnpm lint:all` и pre-commit (Husky).

## Переключение сайта на localhost

В `.env`:

```env
NUXT_SITE_SLUG=ryazpressa
# или
NUXT_SITE_SLUG=nesecretno
```

После смены перезапустите `pnpm dev`.

## Эмуляция домена (без смены .env)

Запросы с заголовком `Host` (как в production behind proxy):

```bash
curl -H "Host: nesecretno.ru" http://localhost:3000/api/_site
curl -H "Host: ryazpressa.ru" http://localhost:3000/api/_site
```

За прокси также поддерживается `X-Forwarded-Host`.

## Smoke-тест изоляции

При запущенном `pnpm dev`:

```bash
pnpm smoke:sites
```

Проверяет: конфиг по домену, `gallery` только на nesecretno, новости на обоих сайтах.
