/**
 * Nitro `/api/*` → путь на бэкенде.
 * Новости: контракт фронта `/api/news`, бэкенд — `/api/posts`.
 * Остальные эндпоинты сохраняют префикс `/api` (`/api/districts`, `/api/gallery`, …).
 */
export function toBackendPath(nitroPathname: string): string {
  return nitroPathname.replace(/^\/api\/news(?=\/|$)/, '/api/posts')
}
