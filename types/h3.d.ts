import type { SiteConfig } from '#shared/types/site'

declare module 'h3' {
  interface H3EventContext {
    site: SiteConfig
  }
}

export {}
