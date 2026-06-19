import type { PaperOrderRequest, PaperOrderResponse } from '#shared/types/api'
import { normalizePaperOrderResponse } from '#shared/utils/normalizeSubscriptionApi'

/** Legacy WordPress endpoint (same-origin на ryazpressa.ru). */
export const LEGACY_PAPER_ORDER_PATH = '/ajax_paper_order.php'

/** Бесплатный тариф на legacy-сайте — без редиректа на оплату. */
export const LEGACY_FREE_TARIFF_ID = '2'

export type PaperOrderOutcome =
  | { kind: 'error'; message: string }
  | { kind: 'success'; message: string }
  | { kind: 'redirect'; url: string }

/** Тело запроса как `$('#order_form').serialize()` на ryazpressa.ru/price. */
function buildLegacyPaperOrderFormBody(order: PaperOrderRequest): URLSearchParams {
  const params = new URLSearchParams()

  params.set('fio', '')
  params.set('phone', '')
  params.set('email', order.email)
  params.set('type', order.type)
  params.set('dt', order.dt)

  for (const paperId of order.paper) {
    params.append('paper[]', paperId)
  }

  return params
}

export function resolvePaperOrderOutcome(
  order: PaperOrderRequest,
  response: PaperOrderResponse,
): PaperOrderOutcome {
  if (response.error) {
    return { kind: 'error', message: response.error }
  }

  const isFreeTariff = order.type === LEGACY_FREE_TARIFF_ID

  if (response.formUrl && !isFreeTariff) {
    return { kind: 'redirect', url: response.formUrl }
  }

  if (response.success) {
    return { kind: 'success', message: 'Вы успешно подписаны.' }
  }

  return { kind: 'error', message: 'Не удалось оформить подписку.' }
}

export function readPaperOrderSubmitError(error: unknown): string {
  if (error && typeof error === 'object' && 'data' in error) {
    const data = (error as { data?: unknown }).data
    if (data && typeof data === 'object') {
      if ('error' in data && typeof data.error === 'string' && data.error.trim()) {
        return data.error
      }
      if ('message' in data && typeof data.message === 'string' && data.message.trim()) {
        return data.message
      }
    }
  }

  return 'Не удалось оформить подписку. Попробуйте позже.'
}

export async function submitLegacyPaperOrder(
  order: PaperOrderRequest,
): Promise<PaperOrderResponse> {
  const raw = await $fetch(LEGACY_PAPER_ORDER_PATH, {
    method: 'POST',
    body: buildLegacyPaperOrderFormBody(order),
    headers: {
      Accept: 'application/json',
    },
  })

  return normalizePaperOrderResponse(raw)
}
