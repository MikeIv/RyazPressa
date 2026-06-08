import type { NewsArticlePathPrefix } from '#shared/utils/newsArticlePath'

/** CSS-тема сайта (переменные `--site-*` на `<html>`). */
export interface SiteTheme {
  colorPrimary: string
  colorAccent: string
  colorText: string
  colorBackground: string
  radiusSm: string
  radiusMd: string
  logoSrc: string
  logoAlt: string
  /** Натуральная ширина SVG — для aspect-ratio и CLS в шапке. */
  logoWidth?: number
  /** Натуральная высота SVG — для aspect-ratio и CLS в шапке. */
  logoHeight?: number
  /** Favicon сайта (например `/sites/ryazpressa/favicon.ico`). */
  faviconSrc?: string
  /** Apple Touch Icon (например `/sites/ryazpressa/apple-touch-icon.png`). */
  appleTouchIconSrc?: string
  /** Левый край градиента header (по умолчанию — затемнённый primary). */
  headerGradientStart?: string
}

/** Включённые разделы (для route middleware и навигации). */
export interface SiteSections {
  gallery: boolean
  documents: boolean
  contacts: boolean
  okruga: boolean
  ryadomSNami: boolean
  projects: boolean
}

export interface SiteNavItem {
  label: string
  to: string
}

/** Полный конфиг сайта (сервер + shared/sites). */
export interface SiteConfig {
  slug: string
  name: string
  domains: readonly string[]
  /** База API для этого сайта. Если не задана (undefined), используется глобальный runtimeConfig.public.apiBase как fallback. */
  apiBase?: string
  theme: SiteTheme
  sections: SiteSections
  nav: readonly SiteNavItem[]
  /** `''` — статьи в корне (`/slug`), `'/news'` — `/news/slug`. */
  articlePathPrefix: NewsArticlePathPrefix
}

/** Конфиг, отдаваемый клиенту через `/api/_site`. */
export type PublicSiteConfig = Omit<SiteConfig, 'domains'> & {
  /** Основной домен сайта — для `X-Site-Slug` при прямых запросах к API. */
  apiSiteHost: string
}
