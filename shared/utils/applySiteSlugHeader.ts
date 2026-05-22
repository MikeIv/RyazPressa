/** Добавляет заголовок `X-Site-Slug` для multi-tenant API (см. docs/api-contract.md). */
export function applySiteSlugHeader(
  options: { headers?: HeadersInit },
  slug: string | undefined,
): void {
  if (!slug?.trim()) return

  const headers = new Headers(options.headers)
  headers.set('X-Site-Slug', slug.trim())
  options.headers = headers
}
