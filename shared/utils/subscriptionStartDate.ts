/** Следующая дата начала подписки: 1 июля или 1 января (как на ryazpressa.ru/price). */
export function nextSubscriptionStartIsoDate(reference = new Date()): string {
  const year = reference.getFullYear()
  const month = reference.getMonth()

  if (month < 6) {
    return `${year}-07-01`
  }

  return `${year + 1}-01-01`
}

/** `YYYY-MM-DD` → `DD.MM.YYYY` для API подписки. */
export function formatIsoDateRu(isoDate: string): string {
  const [year, month, day] = isoDate.split('-')
  if (!year || !month || !day) return isoDate
  return `${day}.${month}.${year}`
}
