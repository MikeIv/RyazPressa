import { describe, expect, it } from 'vitest'
import type { NewsItem } from '#shared/types/api'
import {
  filterNewsTodayAndYesterday,
  formatNewsDayLabel,
  getNewsDayKey,
  getNewsDayOffset,
  groupNewsByDay,
  isNewsTodayOrYesterday,
} from '#shared/utils/groupNewsByDay'

const NOW = new Date(2026, 5, 22, 12, 0, 0)

function item(publishedAt: string, slug: string): NewsItem {
  return {
    id: slug,
    slug,
    title: slug,
    lead: '',
    publishedAt,
  }
}

describe('groupNewsByDay helpers', () => {
  it('builds day key in local timezone', () => {
    expect(getNewsDayKey('2026-06-22T08:00:00')).toBe('2026-06-22')
  })

  it('calculates day offset from now', () => {
    expect(getNewsDayOffset('2026-06-22T08:00:00', NOW)).toBe(0)
    expect(getNewsDayOffset('2026-06-21T08:00:00', NOW)).toBe(1)
    expect(getNewsDayOffset('2026-06-19T08:00:00', NOW)).toBe(3)
  })

  it('detects today and yesterday', () => {
    expect(isNewsTodayOrYesterday('2026-06-22T08:00:00', NOW)).toBe(true)
    expect(isNewsTodayOrYesterday('2026-06-21T08:00:00', NOW)).toBe(true)
    expect(isNewsTodayOrYesterday('2026-06-19T08:00:00', NOW)).toBe(false)
  })

  it('formats labels for today, yesterday and older dates', () => {
    expect(formatNewsDayLabel('2026-06-22', NOW)).toBe('Сегодня')
    expect(formatNewsDayLabel('2026-06-21', NOW)).toBe('Вчера')
    expect(formatNewsDayLabel('2026-05-19', NOW)).toBe('19 мая')
  })
})

describe('filterNewsTodayAndYesterday', () => {
  it('keeps only today and yesterday items', () => {
    const items = [
      item('2026-06-22T10:00:00', 'today'),
      item('2026-06-21T10:00:00', 'yesterday'),
      item('2026-06-19T10:00:00', 'older'),
    ]

    expect(filterNewsTodayAndYesterday(items, NOW).map((entry) => entry.slug)).toEqual([
      'today',
      'yesterday',
    ])
  })
})

describe('groupNewsByDay', () => {
  it('groups consecutive items by calendar day', () => {
    const items = [
      item('2026-06-22T10:00:00', 'a'),
      item('2026-06-22T18:00:00', 'b'),
      item('2026-06-21T10:00:00', 'c'),
    ]

    const groups = groupNewsByDay(items, NOW)

    expect(groups).toHaveLength(2)
    expect(groups[0]?.dayKey).toBe('2026-06-22')
    expect(groups[0]?.label).toBe('Сегодня')
    expect(groups[0]?.items.map((entry) => entry.slug)).toEqual(['a', 'b'])
    expect(groups[1]?.dayKey).toBe('2026-06-21')
    expect(groups[1]?.label).toBe('Вчера')
    expect(groups[1]?.items.map((entry) => entry.slug)).toEqual(['c'])
  })
})
