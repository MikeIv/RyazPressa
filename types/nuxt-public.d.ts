declare module 'nuxt/schema' {
  interface RuntimeConfig {
    /** Slug сайта для localhost (`NUXT_SITE_SLUG`). */
    siteSlug: string
    /** Mock API в Nitro; `false` — прокси на бэкенд (`NUXT_USE_MOCK_API`). */
    useMockApi: boolean
  }

  interface PublicRuntimeConfig {
    /** Запасной base URL API, если не задан в конфиге сайта. */
    apiBase: string
  }
}

export {}
