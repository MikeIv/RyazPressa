import { mockNearUsIndex } from '../../mock/handlers/near-us'

export default defineEventHandler((event) =>
  handleApiRequest(event, mockNearUsIndex, {
    section: { key: 'ryadomSNami', label: 'near-us' },
  }),
)
