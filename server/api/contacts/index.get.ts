import { getContactsForSite } from '#shared/mock/siteMockAccess'

export default defineEventHandler((event) => {
  assertSection(event, 'contacts', 'contacts')
  const slug = event.context.site.slug
  const contacts = getContactsForSite(slug)

  if (!contacts) {
    throw createError({ statusCode: 404, statusMessage: 'Contacts not found' })
  }

  return contacts
})
