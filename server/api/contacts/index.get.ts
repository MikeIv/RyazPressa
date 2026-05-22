import { mockContactsIndex } from '../../mock/handlers/contacts'

export default defineEventHandler((event) =>
  handleApiRequest(event, mockContactsIndex, { section: { key: 'contacts', label: 'contacts' } }),
)
