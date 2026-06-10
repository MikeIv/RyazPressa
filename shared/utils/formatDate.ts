import type { IsoDateTime } from '#shared/types/api'

/** Дата для отображения в интерфейсе (ru-RU). */
export function formatDate(iso: IsoDateTime): string {
  return new Intl.DateTimeFormat('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(iso))
}

/** Время публикации (лента новостей). */
export function formatNewsTime(iso: IsoDateTime): string {
  return new Intl.DateTimeFormat('ru-RU', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(iso))
}

/** Текущая дата для шапки ленты (ru-RU). */
export function formatNowDate(date: Date): string {
  return new Intl.DateTimeFormat('ru-RU', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date)
}

/** Текущее время для шапки ленты (ru-RU). */
export function formatNowTime(date: Date): string {
  return new Intl.DateTimeFormat('ru-RU', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(date)
}

/** Краткая дата в ленте: «19 мая». */
export function formatNewsDateShort(iso: IsoDateTime): string {
  return new Intl.DateTimeFormat('ru-RU', {
    day: 'numeric',
    month: 'short',
  }).format(new Date(iso))
}

/** Дата публикации без года: «10 июня». */
export function formatNewsDayMonth(iso: IsoDateTime): string {
  return new Intl.DateTimeFormat('ru-RU', {
    day: 'numeric',
    month: 'long',
  }).format(new Date(iso))
}
