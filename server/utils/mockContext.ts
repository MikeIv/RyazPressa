import type { H3Event } from 'h3'
import type { SiteSections } from '#shared/types/site'

export function parsePageQuery(event: H3Event): { page: number; perPage: number } {
  const query = getQuery(event)
  const page = Number(query.page ?? 1)
  const perPage = Number(query.perPage ?? 10)

  return {
    page: Number.isFinite(page) ? page : 1,
    perPage: Number.isFinite(perPage) ? perPage : 10,
  }
}

export function assertSection(event: H3Event, section: keyof SiteSections, label: string): void {
  if (!event.context.site.sections[section]) {
    throw createError({
      statusCode: 404,
      statusMessage: `Section "${label}" is not available for this site`,
    })
  }
}
