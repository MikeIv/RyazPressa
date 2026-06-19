import type {
  ListResponse,
  Paper,
  PaperOrderRequest,
  PaperOrderResponse,
  Tariff,
} from '#shared/types/api'
import { formatIsoDateRu } from '#shared/utils/subscriptionStartDate'

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

export function buildPaperOrderRequest(params: {
  email: string
  tariffId: string
  startDateIso: string
  paperIds: string[]
}): PaperOrderRequest {
  return {
    email: params.email.trim(),
    type: params.tariffId,
    dt: formatIsoDateRu(params.startDateIso),
    paper: params.paperIds,
  }
}

function readPaperIds(raw: unknown): string[] {
  if (!Array.isArray(raw)) return []

  return raw.map((item) => (item == null ? '' : String(item))).filter((item) => item.length > 0)
}

/** Ответ оформления подписки (legacy `/ajax_paper_order.php`, будущий `/api/paper-orders`). */
export function normalizePaperOrderResponse(raw: unknown): PaperOrderResponse {
  if (!raw || typeof raw !== 'object') {
    throw new Error('Invalid API response')
  }

  const body = raw as Record<string, unknown>
  const orderId = body.orderId ?? body.order_id
  const formUrl = body.formUrl ?? body.form_url
  const error = body.error

  return {
    success: Boolean(body.success),
    orderId: orderId == null ? '' : String(orderId),
    error: typeof error === 'string' && error.trim() ? error : undefined,
    formUrl: typeof formUrl === 'string' && formUrl.trim() ? formUrl : undefined,
  }
}

export function parsePaperOrderRequestBody(raw: unknown): PaperOrderRequest | null {
  if (!raw || typeof raw !== 'object') return null

  const body = raw as Record<string, unknown>
  const email = typeof body.email === 'string' ? body.email.trim() : ''
  const type = body.type == null ? '' : String(body.type)
  const dt = typeof body.dt === 'string' ? body.dt.trim() : ''
  const paper = readPaperIds(body.paper ?? body['paper[]'])

  if (!email || !type || !dt || !paper.length) return null

  return { email, type, dt, paper }
}
