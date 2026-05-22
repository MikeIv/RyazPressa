import type { H3Event } from 'h3'
import { getContactsForSite } from '#shared/mock/siteMockAccess'

export function mockContactsIndex(event: H3Event) {
  const slug = event.context.site.slug
  const contacts = getContactsForSite(slug)

  if (!contacts) {
    throw createError({ statusCode: 404, statusMessage: 'Contacts not found' })
  }

  return contacts
}
