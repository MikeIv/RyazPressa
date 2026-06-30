import type { PublicSiteConfig, SiteNavItem, SiteSections, SiteTheme } from '#shared/types/site'
import type { NewsArticlePathPrefix } from '#shared/utils/newsArticlePath'
import { SITE_BRAND_COLORS } from '#shared/sites/siteBrandColors'
import { enrichSiteTheme, type SiteThemeInput } from '#shared/utils/siteThemeAssets'

interface BackendSiteNavItem {
  label: string
  to?: string
  path?: string
}

const THEME_DEFAULTS: Pick<SiteTheme, 'colorText' | 'colorBackground' | 'radiusSm' | 'radiusMd'> = {
  colorText: '#1a1a1a',
  colorBackground: '#ffffff',
  radiusSm: '4px',
  radiusMd: '8px',
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

function unwrapSiteConfigBody(body: unknown): Record<string, unknown> {
  if (!isRecord(body)) {
    throw new Error('Invalid site config response: expected object')
  }

  if (isRecord(body.data) && typeof body.data.slug === 'string') {
    return body.data
  }

  return body
}

function normalizeNavItem(item: BackendSiteNavItem): SiteNavItem {
  return {
    label: item.label,
    to: item.to ?? item.path ?? '/',
  }
}

function readStringField(raw: Record<string, unknown>, key: string): string | undefined {
  const value = raw[key]
  return typeof value === 'string' && value.trim() ? value : undefined
}

function readTheme(value: unknown): SiteThemeInput {
  if (!isRecord(value)) {
    throw new Error('Invalid site config response: theme is required')
  }

  const colorPrimary = readStringField(value, 'colorPrimary')
  const colorAccent = readStringField(value, 'colorAccent')

  if (!colorPrimary || !colorAccent) {
    throw new Error(
      'Invalid site config response: theme.colorPrimary and theme.colorAccent are required',
    )
  }

  const theme: SiteThemeInput = {
    colorPrimary,
    colorAccent,
    colorText: readStringField(value, 'colorText') ?? THEME_DEFAULTS.colorText,
    colorBackground: readStringField(value, 'colorBackground') ?? THEME_DEFAULTS.colorBackground,
    radiusSm: readStringField(value, 'radiusSm') ?? THEME_DEFAULTS.radiusSm,
    radiusMd: readStringField(value, 'radiusMd') ?? THEME_DEFAULTS.radiusMd,
  }

  const headerGradientStart = readStringField(value, 'headerGradientStart')
  if (headerGradientStart) {
    theme.headerGradientStart = headerGradientStart
  }

  return theme
}

/** Цвета базовых изданий — из реестра фронта, не с бэкенда (как logoSrc). */
function applyFrontendBrandColors(slug: string, theme: SiteThemeInput): SiteThemeInput {
  const brand = SITE_BRAND_COLORS[slug]
  if (!brand) return theme
  return { ...theme, colorPrimary: brand.colorPrimary, colorAccent: brand.colorAccent }
}

function readSections(value: unknown): SiteSections {
  if (!isRecord(value)) {
    throw new Error('Invalid site config response: sections is required')
  }
  return value as unknown as SiteSections
}

/**
 * Приводит ответ бэкенда к `PublicSiteConfig`.
 * Поддерживает обёртку `{ data: … }`, поле `domain` вместо `apiSiteHost`, `nav[].path` вместо `to`.
 * Пути к бренд-ассетам (`/sites/{slug}/…`) собираются на фронте из `slug`.
 */
export function normalizePublicSiteConfig(body: unknown): PublicSiteConfig {
  const raw = unwrapSiteConfigBody(body)

  const slug = raw.slug
  if (typeof slug !== 'string' || !slug.trim()) {
    throw new Error('Invalid site config response: slug is required')
  }

  const name = typeof raw.name === 'string' ? raw.name : slug

  const apiSiteHost =
    (typeof raw.apiSiteHost === 'string' && raw.apiSiteHost.trim()) ||
    (typeof raw.domain === 'string' && raw.domain.trim()) ||
    slug

  const navRaw = Array.isArray(raw.nav) ? raw.nav : []
  const nav = navRaw.map((item) => normalizeNavItem(item as BackendSiteNavItem))

  return {
    slug,
    name,
    apiBase: typeof raw.apiBase === 'string' ? raw.apiBase : undefined,
    apiSiteHost,
    theme: enrichSiteTheme(slug, name, applyFrontendBrandColors(slug, readTheme(raw.theme))),
    sections: readSections(raw.sections),
    nav,
    articlePathPrefix: (raw.articlePathPrefix ?? '') as NewsArticlePathPrefix,
  }
}
