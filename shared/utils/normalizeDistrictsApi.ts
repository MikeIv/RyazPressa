import type { DistrictDetail } from '#shared/types/api'
import { normalizePostsListResponse } from '#shared/utils/normalizePostsApi'

export function districtDetailSlugFromPath(pathname: string): string | undefined {
  const prefix = '/api/districts/'
  if (!pathname.startsWith(prefix)) return undefined

  const slug = pathname.slice(prefix.length)
  return slug.length > 0 ? slug : undefined
}

function isDistrictDetail(raw: unknown): raw is DistrictDetail {
  if (!raw || typeof raw !== 'object') return false

  const body = raw as Partial<DistrictDetail>
  return typeof body.slug === 'string' && typeof body.name === 'string' && Array.isArray(body.news)
}

function nameFromPostCategories(slug: string, raw: unknown): string | undefined {
  if (!raw || typeof raw !== 'object' || !('data' in raw)) return undefined

  const data = (raw as { data?: unknown[] }).data
  if (!Array.isArray(data)) return undefined

  for (const item of data) {
    if (!item || typeof item !== 'object') continue

    const categories = (item as { categories?: { slug?: string; name?: string }[] }).categories
    const match = categories?.find((category) => category.slug === slug)
    if (match?.name) return match.name
  }

  return undefined
}

/**
 * Деталь округа: mock `DistrictDetail` или бэкенд `{ data: posts[], meta }` → контракт фронта.
 */
export function normalizeDistrictDetailResponse(slug: string, raw: unknown): DistrictDetail {
  if (isDistrictDetail(raw)) {
    return raw
  }

  const { data: news } = normalizePostsListResponse(raw)

  return {
    slug,
    name: nameFromPostCategories(slug, raw) ?? slug,
    news,
  }
}
