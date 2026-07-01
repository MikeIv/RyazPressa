import type { SiteTheme } from '#shared/types/site'

function siteAssetPath(slug: string, filename: string): string {
  return `/sites/${slug}/${filename}`
}

/** Натуральные размеры логотипа (CLS) — только на фронте, не с бэкенда. */
const SITE_LOGO_SIZE: Readonly<Record<string, Pick<SiteTheme, 'logoWidth' | 'logoHeight'>>> = {
  'chestnye-vesti': { logoWidth: 400, logoHeight: 197 },
  nesecretno: { logoWidth: 360, logoHeight: 80 },
  ryazpressa: { logoWidth: 300, logoHeight: 28 },
}

/** Цвета и радиусы темы с бэкенда (без путей к статике фронта). */
export type SiteThemeInput = Pick<
  SiteTheme,
  'colorPrimary' | 'colorAccent' | 'colorText' | 'colorBackground' | 'radiusSm' | 'radiusMd'
> &
  Partial<Pick<SiteTheme, 'headerGradientStart'>>

/**
 * Дополняет тему путями к ассетам по конвенции `/sites/{slug}/…`.
 * `logoAlt` берётся из `name` сайта.
 */
export function enrichSiteTheme(slug: string, name: string, input: SiteThemeInput): SiteTheme {
  const theme: SiteTheme = {
    ...input,
    ...(SITE_LOGO_SIZE[slug] ?? {}),
    logoSrc: siteAssetPath(slug, 'logo.svg'),
    logoAlt: name,
    faviconSrc: siteAssetPath(slug, 'favicon.ico'),
    appleTouchIconSrc: siteAssetPath(slug, 'apple-touch-icon.png'),
  }

  return theme
}
