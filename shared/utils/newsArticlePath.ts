/** Префикс URL статьи: `''` — корень (`/slug`), `'/news'` — `/news/slug`. */
export type NewsArticlePathPrefix = '' | '/news'

export const RESERVED_ROOT_SEGMENTS = new Set([
  'gallery',
  'documents',
  'contacts',
  'okruga',
  'projects',
  'ryadom-s-nami',
  'news',
  'price',
])

export function newsArticlePath(prefix: NewsArticlePathPrefix, slug: string): string {
  const trimmed = slug.trim()
  if (!prefix) return `/${trimmed}`
  return `${prefix}/${trimmed}`
}

/** Статья в корне (`/slug`) на сайтах с `articlePathPrefix: ''`. */
export function isRootNewsArticlePath(path: string, prefix: NewsArticlePathPrefix): boolean {
  if (prefix !== '') return false

  const match = path.match(/^\/([^/]+)\/?$/)
  const segment = match?.[1]
  if (!segment) return false

  return !RESERVED_ROOT_SEGMENTS.has(segment)
}
