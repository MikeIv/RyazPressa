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
  apiBase: string
  theme: SiteTheme
  sections: SiteSections
  nav: readonly SiteNavItem[]
}

/** Конфиг, отдаваемый клиенту через `/api/_site`. */
export type PublicSiteConfig = Omit<SiteConfig, 'domains'>
