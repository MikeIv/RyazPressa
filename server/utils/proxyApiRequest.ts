import type { H3Event } from 'h3'
import { FetchError } from 'ofetch'
import { serverApi } from './serverApi'

/** Nitro `/api/news` → бэкенд `/news` (см. docs/api-contract.md). */
export function toBackendPath(nitroPathname: string): string {
  const path = nitroPathname.replace(/^\/api(?=\/|$)/, '')
  return path || '/'
}

export async function proxyApiRequest(event: H3Event): Promise<unknown> {
  const { pathname } = getRequestURL(event)
  const api = serverApi(event)

  try {
    return await api(toBackendPath(pathname), {
      method: event.method,
      query: getQuery(event),
    })
  } catch (error) {
    if (error instanceof FetchError) {
      throw createError({
        statusCode: error.statusCode ?? 502,
        statusMessage: error.statusMessage ?? 'Upstream API error',
        data: error.data,
      })
    }
    throw error
  }
}
