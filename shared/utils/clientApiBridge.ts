import {
  districtDetailSlugFromPath,
  normalizeDistrictDetailResponse,
} from '#shared/utils/normalizeDistrictsApi'
import {
  normalizePostDetailResponse,
  normalizePostsListResponse,
} from '#shared/utils/normalizePostsApi'
import { joinApiUrl, normalizeApiBaseUrl } from '#shared/utils/normalizeApiBaseUrl'
import { toBackendPath } from '#shared/utils/toBackendPath'

/** Контрактный путь без query (`/api/news?perPage=4` → `/api/news`). */
export function contractApiPath(pathSegment: string): string {
  const trimmed = pathSegment.trim()
  const path = trimmed.startsWith('/') ? trimmed : `/${trimmed}`
  return path.split('?')[0] ?? path
}

/** Нормализация ответа бэкенда к контракту фронта (как Nitro `proxyApiRequest`). */
export function transformClientApiResponse(contractPath: string, raw: unknown): unknown {
  const pathname = contractApiPath(contractPath)

  if (pathname === '/api/news') {
    return normalizePostsListResponse(raw)
  }

  if (pathname.startsWith('/api/news/')) {
    return normalizePostDetailResponse(raw)
  }

  const districtSlug = districtDetailSlugFromPath(pathname)
  if (districtSlug) {
    return normalizeDistrictDetailResponse(districtSlug, raw)
  }

  return raw
}

/** Путь на бэкенде по контрактному пути фронта. */
export function resolveBackendApiPath(contractPath: string): string {
  return toBackendPath(contractApiPath(contractPath))
}

/**
 * Итоговый URL для клиентских вызовов.
 * С `apiBase` — абсолютный URL на общий API-хост; иначе — относительный путь (dev / co-located).
 */
export function resolveClientApiUrl(pathSegment: string, apiBase: unknown): string {
  const trimmed = pathSegment.trim()
  const path = trimmed.startsWith('/') ? trimmed : `/${trimmed}`
  const base = normalizeApiBaseUrl(apiBase)
  if (!base) return path
  return joinApiUrl(base, resolveBackendApiPath(path))
}

/** Обратный маппинг URL бэкенда → контракт фронта (для нормализации ответа). */
export function toContractPath(backendPathname: string): string {
  const path = contractApiPath(backendPathname)

  if (path === '/api/posts' || path.startsWith('/api/posts/')) {
    return path.replace(/^\/api\/posts/, '/api/news')
  }

  if (!path.startsWith('/api/') && path !== '/') {
    return `/api${path}`
  }

  return path
}

export function contractPathFromRequest(request: string): string {
  if (request.startsWith('/')) {
    return contractApiPath(request)
  }

  try {
    return toContractPath(new URL(request).pathname)
  } catch {
    return contractApiPath(request)
  }
}
