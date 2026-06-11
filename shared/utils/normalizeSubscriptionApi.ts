import type { ListResponse, Paper, Tariff } from '#shared/types/api'

interface BackendTariffItem {
  id: string | number
  name: string
  price: string | number
  created_at?: string | null
  updated_at?: string | null
  createdAt?: string | null
  updatedAt?: string | null
}

interface BackendPaperItem {
  id: string | number
  title: string
}

function normalizeTariff(raw: BackendTariffItem): Tariff {
  const tariff: Tariff = {
    id: String(raw.id),
    name: raw.name,
    price: String(raw.price),
  }

  const createdAt = raw.createdAt ?? raw.created_at
  const updatedAt = raw.updatedAt ?? raw.updated_at

  if (createdAt) tariff.createdAt = createdAt
  if (updatedAt) tariff.updatedAt = updatedAt

  return tariff
}

function normalizePaper(raw: BackendPaperItem): Paper {
  return {
    id: String(raw.id),
    title: raw.title,
  }
}

function assertListBody(raw: unknown): { data?: unknown[] } {
  if (!raw || typeof raw !== 'object') {
    throw new Error('Invalid API response')
  }

  return raw as { data?: unknown[] }
}

/** Список тарифов: Laravel `{ data }` → `ListResponse<Tariff>`. */
export function normalizeTariffsListResponse(raw: unknown): ListResponse<Tariff> {
  const body = assertListBody(raw)
  const data = Array.isArray(body.data)
    ? body.data
        .filter((item): item is BackendTariffItem => Boolean(item && typeof item === 'object'))
        .map((item) => normalizeTariff(item))
    : []

  return { data }
}

/** Список изданий: `{ data }` → `ListResponse<Paper>`. */
export function normalizePapersListResponse(raw: unknown): ListResponse<Paper> {
  const body = assertListBody(raw)
  const data = Array.isArray(body.data)
    ? body.data
        .filter((item): item is BackendPaperItem => Boolean(item && typeof item === 'object'))
        .map((item) => normalizePaper(item))
    : []

  return { data }
}
