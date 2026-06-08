export function normalizeApiBaseUrl(value: unknown): string | undefined {
  if (typeof value !== 'string') return undefined
  const trimmed = value.trim()
  if (!trimmed) return undefined
  return trimmed.replace(/\/+$/, '')
}

/** База API сайта с fallback на `runtimeConfig.public.apiBase`.
 *
 * Приоритет: site-specific `apiBase` (если задан и валиден) > глобальный `runtimeConfig.public.apiBase`.
 * Пустая строка / whitespace / отсутствие поля → undefined после normalize → берём fallback.
 *
 * normalize() гарантирует, что возвращается либо непустая строка (очищенная база), либо undefined.
 * Поэтому `normalize(site) ?? normalize(fallback)` безопасен и предпочтителен:
 *   - '' в исходном site.apiBase (legacy) или отсутствие поля — оба дают undefined;
 *   - реальное значение сайта всегда побеждает.
 */
export function resolveApiBaseUrl(siteBase: unknown, fallbackBase: unknown): string | undefined {
  return normalizeApiBaseUrl(siteBase) ?? normalizeApiBaseUrl(fallbackBase)
}

export function joinApiUrl(base: unknown, pathSegment: string): string {
  const b = normalizeApiBaseUrl(base)
  const trimmed = pathSegment.trim()
  const path = trimmed.startsWith('/') ? trimmed : `/${trimmed}`
  if (!b) return path
  return `${b}${path}`
}

export function isNitroApiPath(pathSegment: string): boolean {
  const path = pathSegment.trim()
  return path.startsWith('/api/') || path.startsWith('api/')
}

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
