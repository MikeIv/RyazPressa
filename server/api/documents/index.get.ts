import { mockDocumentsIndex } from '../../mock/handlers/documents'

export default defineEventHandler((event) =>
  handleApiRequest(event, mockDocumentsIndex, {
    section: { key: 'documents', label: 'documents' },
  }),
)
