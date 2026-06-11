import type { DocumentItem, PaginatedMeta, PaginatedResponse } from '#shared/types/api'

interface BackendDocumentItem {
  id: string | number
  title: string
  fileUrl?: string | null
  file_url?: string | null
  fileName?: string | null
  file_name?: string | null
  fileSize?: number | null
  file_size?: number | null
  publishedAt?: string | null
  createdAt?: string | null
  created_at?: string | null
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

function normalizeDocument(raw: BackendDocumentItem): DocumentItem | null {
  const fileUrl = raw.fileUrl ?? raw.file_url
  const publishedAt = raw.publishedAt ?? raw.createdAt ?? raw.created_at
  if (!raw.title?.trim() || !fileUrl || !publishedAt) return null

  const item: DocumentItem = {
    id: String(raw.id),
    title: raw.title.trim(),
    fileUrl,
    publishedAt,
  }

  const fileName = raw.fileName ?? raw.file_name
  if (fileName) item.fileName = fileName

  const fileSize = raw.fileSize ?? raw.file_size
  if (fileSize != null) item.fileSize = fileSize

  return item
}

function normalizeMeta(meta: BackendPaginatedMeta, totalItems: number): PaginatedMeta {
  const totalRaw = meta.total
  const total = Array.isArray(totalRaw) ? (totalRaw[0] ?? totalItems) : (totalRaw ?? totalItems)

  return {
    page: meta.page ?? meta.current_page ?? 1,
    perPage: meta.perPage ?? meta.per_page ?? (totalItems > 0 ? totalItems : 10),
    total,
    totalPages: meta.totalPages ?? meta.last_page ?? (totalItems > 0 ? 1 : 0),
  }
}

/** Список документов: бэкенд `{ data }` или `{ data, meta }` → `PaginatedResponse<DocumentItem>`. */
export function normalizeDocumentsListResponse(raw: unknown): PaginatedResponse<DocumentItem> {
  if (!raw || typeof raw !== 'object') {
    throw new Error('Invalid documents API response')
  }

  const body = raw as {
    data?: BackendDocumentItem[]
    meta?: BackendPaginatedMeta
    statusCode?: number
    message?: string
  }

  if (body.statusCode != null && body.message && !Array.isArray(body.data)) {
    throw new Error(body.message)
  }

  const data = Array.isArray(body.data)
    ? body.data
        .map((item) => normalizeDocument(item))
        .filter((item): item is DocumentItem => item != null)
    : []

  return {
    data,
    meta: normalizeMeta(body.meta ?? {}, data.length),
  }
}
