declare module 'nuxt/schema' {
  interface RuntimeConfig {
    /** Slug сайта для localhost (`NUXT_SITE_SLUG`). */
    siteSlug: string
  }

  interface PublicRuntimeConfig {
    /** Запасной base URL API, если не задан в конфиге сайта. */
    apiBase: string
  }
}

export {}
