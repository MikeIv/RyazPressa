import type { DocumentItem } from '#shared/types/api'

const commonDocuments: DocumentItem[] = [
  {
    id: 'd1',
    title: 'Пользовательское соглашение',
    fileUrl: '/mock/documents/terms.pdf',
    fileSize: 245_760,
    publishedAt: '2026-01-10T10:00:00+03:00',
  },
  {
    id: 'd2',
    title: 'Политика конфиденциальности',
    fileUrl: '/mock/documents/privacy.pdf',
    fileSize: 198_432,
    publishedAt: '2026-01-10T10:00:00+03:00',
  },
]

export const mockDocumentsBySite: Record<string, DocumentItem[]> = {
  ryazpressa: commonDocuments,
  nesecretno: commonDocuments,
}
