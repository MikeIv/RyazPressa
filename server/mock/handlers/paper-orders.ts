import type { H3Event } from 'h3'
import {
  normalizePaperOrderResponse,
  parsePaperOrderRequestBody,
} from '#shared/utils/normalizeSubscriptionApi'
import { LEGACY_FREE_TARIFF_ID } from '#shared/utils/submitLegacyPaperOrder'

export async function mockPaperOrdersCreate(event: H3Event) {
  const payload = parsePaperOrderRequestBody(await readBody(event))

  if (!payload) {
    throw createError({
      statusCode: 422,
      statusMessage: 'Invalid subscription order payload',
      data: { error: 'Заполните все поля формы подписки.' },
    })
  }

  return normalizePaperOrderResponse({
    success: true,
    order_id: `mock-${Date.now()}`,
    ...(payload.type === LEGACY_FREE_TARIFF_ID
      ? {}
      : {
          formUrl:
            'https://securepayments.sberbank.ru/payment/merchants/sbersafe/payment_ru.html?mock=1',
        }),
  })
}
