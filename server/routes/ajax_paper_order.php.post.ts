/**
 * Dev-прокси legacy-оплаты на ryazpressa.ru.
 * На проде `ryazpressa.ru` nginx отдаёт `/ajax_paper_order.php` с WordPress-бэкенда.
 */
const LEGACY_PAPER_ORDER_UPSTREAM = 'https://ryazpressa.ru/ajax_paper_order.php'

export default defineEventHandler(async (event) => {
  const body = await readRawBody(event, false)

  return $fetch(LEGACY_PAPER_ORDER_UPSTREAM, {
    method: 'POST',
    body: body ?? undefined,
    headers: {
      'content-type':
        getRequestHeader(event, 'content-type') ?? 'application/x-www-form-urlencoded',
      accept: 'application/json',
    },
  })
})
