declare module 'nuxt/schema' {
  interface RuntimeConfig {
    /** Slug сайта для localhost (`NUXT_SITE_SLUG`). */
    siteSlug: string
    /** Mock API в Nitro; `false` — прокси на бэкенд (`NUXT_USE_MOCK_API`). */
    useMockApi: boolean
  }

  interface PublicRuntimeConfig {
    /** Slug сайта на localhost (`NUXT_SITE_SLUG`) — для `X-Site-Slug` при `/api/_site` на api-хост. */
    siteSlug: string

    /** Запасной base URL API, если не задан в конфиге сайта ('' / undefined → нет внешней базы, только Nitro или относительные пути). */
    apiBase?: string
  }
}

export {}
