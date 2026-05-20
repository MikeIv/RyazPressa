import type { SiteSections } from '#shared/types/site'

declare module '#app' {
  interface PageMeta {
    /** Ключ раздела из `SiteSections` для middleware `section`. */
    section?: keyof SiteSections
  }
}

export {}
