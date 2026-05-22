import type { IsoDateTime, NewsItem } from '#shared/types/api'

export interface NewsDayGroup {
  dayKey: string
  label: string
  items: NewsItem[]
}

function getDayKeyFromDate(date: Date): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

function parseDayKey(dayKey: string): { year: number; month: number; day: number } {
  const [yearPart, monthPart, dayPart] = dayKey.split('-').map(Number)
  return {
    year: yearPart ?? 0,
    month: monthPart ?? 1,
    day: dayPart ?? 1,
  }
}

function getDayOffsetFromKey(dayKey: string, now: Date): number {
  const { year, month, day } = parseDayKey(dayKey)
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const itemStart = new Date(year, month - 1, day)
  return Math.round((todayStart.getTime() - itemStart.getTime()) / 86_400_000)
}

/** Ключ календарного дня YYYY-MM-DD (локальная таймзона браузера). */
export function getNewsDayKey(iso: IsoDateTime): string {
  return getDayKeyFromDate(new Date(iso))
}

/** Смещение в днях от «сегодня»: 0 — сегодня, 1 — вчера. */
export function getNewsDayOffset(iso: IsoDateTime, now: Date = new Date()): number {
  return getDayOffsetFromKey(getNewsDayKey(iso), now)
}

/** Новость опубликована сегодня или вчера. */
export function isNewsTodayOrYesterday(iso: IsoDateTime, now: Date = new Date()): boolean {
  const offset = getNewsDayOffset(iso, now)
  return offset === 0 || offset === 1
}

/** Только материалы за сегодня и вчера (для блока «Главное сегодня»). */
export function filterNewsTodayAndYesterday(
  items: readonly NewsItem[],
  now: Date = new Date(),
): NewsItem[] {
  return items.filter((item) => isNewsTodayOrYesterday(item.publishedAt, now))
}

/** Подпись разделителя: «Сегодня», «Вчера» или «19 мая». */
export function formatNewsDayLabel(dayKey: string, now: Date = new Date()): string {
  const { year, month, day } = parseDayKey(dayKey)
  const diffDays = getDayOffsetFromKey(dayKey, now)

  if (diffDays === 0) return 'Сегодня'
  if (diffDays === 1) return 'Вчера'

  const itemStart = new Date(year, month - 1, day)
  return new Intl.DateTimeFormat('ru-RU', {
    day: 'numeric',
    month: 'long',
    ...(year !== now.getFullYear() ? { year: 'numeric' as const } : {}),
  }).format(itemStart)
}

/** Группирует новости по дням, сохраняя порядок внутри ленты. */
export function groupNewsByDay(items: readonly NewsItem[], now: Date = new Date()): NewsDayGroup[] {
  const groups: NewsDayGroup[] = []

  for (const item of items) {
    const dayKey = getNewsDayKey(item.publishedAt)
    const last = groups.at(-1)

    if (last?.dayKey === dayKey) {
      last.items.push(item)
    } else {
      groups.push({
        dayKey,
        label: formatNewsDayLabel(dayKey, now),
        items: [item],
      })
    }
  }

  return groups
}
