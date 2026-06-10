import type {
  Article,
  ImageAsset,
  NewsItem,
  PaginatedMeta,
  PaginatedResponse,
} from '#shared/types/api'
import { htmlToPlainText } from '#shared/utils/htmlToPlainText'

interface BackendImageAsset {
  url: string
  alt?: string | null
  width?: number | null
  height?: number | null
}

interface BackendPostItem {
  id: string | number
  slug: string
  title: string
  lead?: string | null
  image?: BackendImageAsset | null
  category?: string | number | null
  publishedAt: string
  content?: string | null
  author?: string | null
  tags?: string[] | null
}

interface BackendPaginatedMeta {
  page?: number
  perPage?: number
  total?: number | number[]
  totalPages?: number
  current_page?: number
  per_page?: number
  last_page?: number
}

function normalizeImage(image: BackendImageAsset | null | undefined): ImageAsset | undefined {
  if (!image?.url) return undefined

  const normalized: ImageAsset = {
    url: image.url,
    alt: image.alt?.trim() || '',
  }

  if (image.width != null) normalized.width = image.width
  if (image.height != null) normalized.height = image.height

  return normalized
}

function resolveLead(raw: BackendPostItem): string {
  const lead = raw.lead?.trim()
  if (lead) return lead

  const content = raw.content?.trim()
  if (content) return htmlToPlainText(content)

  return ''
}

function normalizeNewsItem(raw: BackendPostItem): NewsItem {
  const item: NewsItem = {
    id: String(raw.id),
    slug: raw.slug,
    title: raw.title,
    lead: resolveLead(raw),
    publishedAt: raw.publishedAt,
  }

  const image = normalizeImage(raw.image ?? undefined)
  if (image) item.image = image

  if (raw.category != null && raw.category !== '') {
    item.category = raw.category
  }

  return item
}

function normalizeMeta(meta: BackendPaginatedMeta): PaginatedMeta {
  const totalRaw = meta.total
  const total = Array.isArray(totalRaw) ? (totalRaw[0] ?? 0) : (totalRaw ?? 0)

  return {
    page: meta.page ?? meta.current_page ?? 1,
    perPage: meta.perPage ?? meta.per_page ?? 10,
    total,
    totalPages: meta.totalPages ?? meta.last_page ?? 1,
  }
}

/** Список постов: `{ data, meta }` с Laravel-полями → контракт `PaginatedResponse<NewsItem>`. */
export function normalizePostsListResponse(raw: unknown): PaginatedResponse<NewsItem> {
  if (typeof raw === 'string') {
    throw new Error('Invalid posts API response (expected JSON, got HTML or text)')
  }

  if (!raw || typeof raw !== 'object') {
    throw new Error('Invalid posts API response')
  }

  const body = raw as {
    data?: BackendPostItem[]
    meta?: BackendPaginatedMeta
    statusCode?: number
    message?: string
  }

  if (body.statusCode != null && body.message && !Array.isArray(body.data)) {
    throw new Error(body.message)
  }

  const data = Array.isArray(body.data) ? body.data.map(normalizeNewsItem) : []

  return {
    data,
    meta: normalizeMeta(body.meta ?? {}),
  }
}

/** Одна статья: бэкенд оборачивает в `{ data }` → `Article`. */
export function normalizePostDetailResponse(raw: unknown): Article {
  if (!raw || typeof raw !== 'object') {
    throw new Error('Invalid posts API response')
  }

  const body = raw as { data?: BackendPostItem } | BackendPostItem
  const item = 'data' in body && body.data ? body.data : (body as BackendPostItem)

  if (!item.slug || !item.title) {
    throw new Error('Invalid posts API response')
  }

  const article: Article = {
    ...normalizeNewsItem(item),
    content: item.content ?? '',
  }

  if (item.author?.trim()) article.author = item.author.trim()
  if (item.tags?.length) article.tags = item.tags

  return article
}
