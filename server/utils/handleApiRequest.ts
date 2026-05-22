import type { H3Event } from 'h3'
import type { SiteSections } from '#shared/types/site'
import { proxyApiRequest } from './proxyApiRequest'
import { shouldUseMockApi } from './shouldUseMockApi'

type ApiHandler<T> = (event: H3Event) => T | Promise<T>

interface HandleApiRequestOptions {
  /** Проверка `sections` до mock и до прокси на бэкенд. */
  section?: { key: keyof SiteSections; label: string }
}

/** Mock или прокси на `serverApi` в зависимости от `NUXT_USE_MOCK_API`. */
export async function handleApiRequest<T>(
  event: H3Event,
  mockHandler: ApiHandler<T>,
  options?: HandleApiRequestOptions,
): Promise<T> {
  if (options?.section) {
    assertSection(event, options.section.key, options.section.label)
  }

  if (shouldUseMockApi(event)) {
    return mockHandler(event)
  }

  return proxyApiRequest(event) as Promise<T>
}
