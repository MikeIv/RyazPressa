import { mockPaperOrdersCreate } from '../../mock/handlers/paper-orders'

export default defineEventHandler((event) =>
  handleApiRequest(event, mockPaperOrdersCreate, {
    section: { key: 'price', label: 'Подписка' },
  }),
)
