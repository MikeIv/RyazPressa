import type { IsoDateTime } from '#shared/types/api'

/** Дата для отображения в интерфейсе (ru-RU). */
export function formatDate(iso: IsoDateTime): string {
  return new Intl.DateTimeFormat('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(iso))
}
