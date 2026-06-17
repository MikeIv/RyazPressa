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
   * `public.apiBase` — единый API-хост для всех сайтов (`NUXT_PUBLIC_API_BASE`, напр. https://api.ryazpressa.ru).
   * Сайт передаётся заголовком `X-Site-Slug` (apex-домен контент-хоста).
   *
   * Static SPA (pnpm generate): без `apiBase` — относительные `/api/*` на контент-домен (Nitro mock в dev).
   * С `apiBase` — все `/api/*` на общий API; на бэкенде нужен CORS + чтение `X-Site-Slug`.
   * Инструкция DevOps: docs/deployment-static-spa.md
   */
  runtimeConfig: {
    siteSlug: process.env.NUXT_SITE_SLUG ?? 'ryazpressa',
    /** Mock / proxy только для dev. В чистом статическом Variant 3 не используется. */
    useMockApi: process.env.NUXT_USE_MOCK_API !== 'false',
    public: {
      /** Slug сайта на localhost — для `X-Site-Slug` при cross-origin `/api/_site`. */
      siteSlug: process.env.NUXT_SITE_SLUG ?? 'ryazpressa',

      // Единый API для всех сайтов. Пусто — относительные /api/* (dev mock / прокси на контент-домене).
      apiBase: process.env.NUXT_PUBLIC_API_BASE ?? undefined,

      /** @deprecated Используйте `NUXT_PUBLIC_API_BASE`. Оставлено для обратной совместимости CI. */
      siteConfigApiBase: process.env.NUXT_PUBLIC_SITE_CONFIG_API_BASE ?? undefined,
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
    routeRules: {
      '/api/**': {
        cors: true,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Site-Slug, *',
          'Access-Control-Max-Age': '7200',
        },
      },
    },
  },
})
