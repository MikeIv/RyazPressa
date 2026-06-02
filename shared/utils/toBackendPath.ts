/**
 * Nitro `/api/*` → путь на бэкенде.
 * Новости: контракт фронта `/api/news`, бэкенд — `/api/posts`.
 */
export function toBackendPath(nitroPathname: string): string {
  if (nitroPathname === '/api/news' || nitroPathname.startsWith('/api/news/')) {
    return nitroPathname.replace(/^\/api\/news/, '/api/posts')
  }

  const path = nitroPathname.replace(/^\/api(?=\/|$)/, '')
  return path || '/'
}
