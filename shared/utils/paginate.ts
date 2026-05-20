import type { PaginatedMeta, PaginatedResponse } from '#shared/types/api'

export function paginate<T>(items: readonly T[], page = 1, perPage = 10): PaginatedResponse<T> {
  const safePerPage = Math.max(1, Math.min(perPage, 50))
  const total = items.length
  const totalPages = Math.max(1, Math.ceil(total / safePerPage))
  const safePage = Math.max(1, Math.min(page, totalPages))
  const start = (safePage - 1) * safePerPage

  const meta: PaginatedMeta = {
    page: safePage,
    perPage: safePerPage,
    total,
    totalPages,
  }

  return {
    data: items.slice(start, start + safePerPage),
    meta,
  }
}
