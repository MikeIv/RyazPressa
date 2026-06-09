import type { PublicSiteConfig, SiteNavItem, SiteSections, SiteTheme } from '#shared/types/site'
import type { NewsArticlePathPrefix } from '#shared/utils/newsArticlePath'

interface BackendSiteNavItem {
  label: string
  to?: string
  path?: string
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

function readTheme(value: unknown): SiteTheme {
  if (!isRecord(value)) {
    throw new Error('Invalid site config response: theme is required')
  }
  return value as SiteTheme
}

function readSections(value: unknown): SiteSections {
  if (!isRecord(value)) {
    throw new Error('Invalid site config response: sections is required')
  }
  return value as SiteSections
}

/**
 * Приводит ответ бэкенда к `PublicSiteConfig`.
 * Поддерживает обёртку `{ data: … }`, поле `domain` вместо `apiSiteHost`, `nav[].path` вместо `to`.
 */
export function normalizePublicSiteConfig(body: unknown): PublicSiteConfig {
  const raw = unwrapSiteConfigBody(body)

  const slug = raw.slug
  if (typeof slug !== 'string' || !slug.trim()) {
    throw new Error('Invalid site config response: slug is required')
  }

  const apiSiteHost =
    (typeof raw.apiSiteHost === 'string' && raw.apiSiteHost.trim()) ||
    (typeof raw.domain === 'string' && raw.domain.trim()) ||
    slug

  const navRaw = Array.isArray(raw.nav) ? raw.nav : []
  const nav = navRaw.map((item) => normalizeNavItem(item as BackendSiteNavItem))

  return {
    slug,
    name: typeof raw.name === 'string' ? raw.name : slug,
    apiBase: typeof raw.apiBase === 'string' ? raw.apiBase : undefined,
    apiSiteHost,
    theme: readTheme(raw.theme),
    sections: readSections(raw.sections),
    nav,
    articlePathPrefix: (raw.articlePathPrefix ?? '') as NewsArticlePathPrefix,
  }
}
