/**
 * Приводит `NUXT_PUBLIC_API_BASE` / `runtimeConfig.public.apiBase` к виду для `ofetch` `baseURL`.
 * Пустая строка и пробелы → `undefined` (запросы пойдут на текущий origin без префикса).
 */
export function normalizeApiBaseUrl(value: unknown): string | undefined {
  if (typeof value !== 'string') return undefined
  const trimmed = value.trim()
  if (!trimmed) return undefined
  return trimmed.replace(/\/+$/, '')
}

/** База API сайта с fallback на `runtimeConfig.public.apiBase` (пустой `site.apiBase` не блокирует env). */
export function resolveApiBaseUrl(siteBase: unknown, fallbackBase: unknown): string | undefined {
  return normalizeApiBaseUrl(siteBase) ?? normalizeApiBaseUrl(fallbackBase)
}

/**
 * Склеивает базу API и сегмент пути в один URL (без двойных слэшей между базой и путём).
 * Без базы возвращает путь с ведущим `/`, если его не было.
 */
export function joinApiUrl(base: unknown, pathSegment: string): string {
  const b = normalizeApiBaseUrl(base)
  const trimmed = pathSegment.trim()
  const path = trimmed.startsWith('/') ? trimmed : `/${trimmed}`
  if (!b) return path
  return `${b}${path}`
}

/** Nitro mock/прокси — всегда same-origin, не прямой вызов бэкенда. */
export function isNitroApiPath(pathSegment: string): boolean {
  const path = pathSegment.trim()
  return path.startsWith('/api/') || path.startsWith('api/')
}

/**
 * URL для клиентского `useFetch` / `useApi`.
 * Пути `/api/*` — только Nitro; внешний `apiBase` — для прямых путей без Nitro-прокси.
 */
export function resolveClientApiUrl(
  pathSegment: string,
  siteBase: unknown,
  fallbackBase: unknown,
): string {
  const trimmed = pathSegment.trim()
  const path = trimmed.startsWith('/') ? trimmed : `/${trimmed}`
  if (isNitroApiPath(path)) return path
  return joinApiUrl(resolveApiBaseUrl(siteBase, fallbackBase), path)
}
