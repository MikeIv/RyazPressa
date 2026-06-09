declare module 'nuxt/schema' {
  interface RuntimeConfig {
    /** Slug сайта для localhost (`NUXT_SITE_SLUG`). */
    siteSlug: string
    /** Mock API в Nitro; `false` — прокси на бэкенд (`NUXT_USE_MOCK_API`). */
    useMockApi: boolean
  }

  interface PublicRuntimeConfig {
    /** Запасной base URL API, если не задан в конфиге сайта ('' / undefined → нет внешней базы, только Nitro или относительные пути). */
    apiBase?: string

    /**
     * Специальный base для начального запроса конфига сайта (`/api/_site`).
     * Если задан — клиент делает абсолютный запрос на этот хост (например https://api.ryazpressa.ru),
     * чтобы бэкенд всегда видел Host: api.ryazpressa.ru.
     * В заголовке X-Original-Host при этом передаётся реальный контент-домен.
     */
    siteConfigApiBase?: string
  }
}

export {}
