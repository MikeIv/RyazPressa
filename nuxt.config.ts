// https://nuxt.com/docs/api/configuration/nuxt-config
const isDev = process.env.NODE_ENV === 'development'

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',

  ssr: false,

  /** Исходники приложения в `app/`. Каталог `server/` — в корне репозитория. */
  srcDir: 'app/',

  css: ['~/assets/styles/main.scss'],

  modules: ['@nuxt/eslint'],

  eslint: {
    config: {
      stylistic: false,
    },
  },

  devtools: {
    enabled: isDev,
    timeline: { enabled: isDev },
  },

  typescript: {
    strict: true,
    typeCheck: 'build',
  },

  app: {
    head: {
      htmlAttrs: { lang: 'ru' },
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      ],
      link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
    },
  },

  /**
   * `siteSlug` — сайт на localhost (см. `NUXT_SITE_SLUG` в `.env`).
   * `public.apiBase` — запасной fallback; в проде база API задаётся в `shared/sites/*.ts` или
   * возвращается бэкендом в `PublicSiteConfig.apiBase` (ответ `/api/_site`).
   *
   * Variant 3 (SPA static deploy — бэкенд отдаёт и статику, и /api/* на контент-доменах):
   * - Для тестового/прод деплоя используйте `pnpm generate` (или `pnpm build` + берите только public-часть).
   * - Nitro-сервер для фронтенда не требуется.
   * - Все контрактные вызовы `/api/*` (в т.ч. критический `/api/_site`) идут относительными путями на текущий origin.
   * - Бэкенд на тех же доменах отвечает за мультитенантность (по Host), section gating, данные и конфиг сайта.
   * - Точная инструкция и чек-лист для DevOps (тест на двух сайтах): docs/deployment-static-spa.md (раздел Variant 3)
   */
  runtimeConfig: {
    siteSlug: process.env.NUXT_SITE_SLUG ?? 'ryazpressa',
    /** Mock / proxy только для dev. В чистом статическом Variant 3 не используется. */
    useMockApi: process.env.NUXT_USE_MOCK_API !== 'false',
    public: {
      // '' / undefined — относительные пути (рекомендуется для Variant 3 co-located static + API).
      // site-specific apiBase (из /api/_site) имеет приоритет, если для сайта API на отдельном origin.
      apiBase: process.env.NUXT_PUBLIC_API_BASE ?? undefined,
    },
  },

  features: {
    /** Логи Nuxt devtools в production не нужны */
    devLogs: isDev,
  },

  vite: {
    server: isDev
      ? {
          /** Smoke-тест и локальные домены в hosts (см. docs/dev-multi-site.md) */
          allowedHosts: true,
        }
      : undefined,
    build: {
      target: 'esnext',
      cssMinify: true,
    },
  },

  nitro: {
    compressPublicAssets: true,
    // В Variant 3 статического SPA (без Nitro в рантайме) для продакшена используется только
    // сгенерированная статика (public assets после generate/build). Серверная часть Nitro не запускается.
  },
})
