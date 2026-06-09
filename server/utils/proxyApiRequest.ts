import type { H3Event } from 'h3'
import { FetchError } from 'ofetch'
import { filterNewsTodayAndYesterday } from '#shared/utils/groupNewsByDay'
import {
  normalizePostDetailResponse,
  normalizePostsListResponse,
} from '#shared/utils/normalizePostsApi'
import { toBackendPath } from '#shared/utils/toBackendPath'
import { serverApi } from './serverApi'

function normalizeNewsProxyResponse(pathname: string, raw: unknown): unknown {
  if (pathname === '/api/news') {
    return normalizePostsListResponse(raw)
  }

  if (pathname.startsWith('/api/news/')) {
    return normalizePostDetailResponse(raw)
  }

  return raw
}

function backendQuery(event: H3Event): Record<string, unknown> {
  const query: Record<string, unknown> = { ...getQuery(event) }
  delete query.period
  return query
}

export async function proxyApiRequest(event: H3Event): Promise<unknown> {
  const { pathname } = getRequestURL(event)
  const api = serverApi(event)

  if (import.meta.dev) {
    console.log(
      `[proxyApiRequest] ${event.method} ${pathname} → real backend ` +
        `(NUXT_USE_MOCK_API=false + NUXT_PUBLIC_API_BASE or site.apiBase)`,
    )
  }

  try {
    const raw = await api(toBackendPath(pathname), {
      method: event.method,
      query: backendQuery(event),
    })

    let result = normalizeNewsProxyResponse(pathname, raw)

    if (pathname === '/api/news' && result && typeof result === 'object' && 'data' in result) {
      const query = getQuery(event)
      if (query.period === 'today-yesterday') {
        const list = result as ReturnType<typeof normalizePostsListResponse>
        const data = filterNewsTodayAndYesterday(list.data)
        result = {
          data,
          meta: { ...list.meta, total: data.length, totalPages: data.length > 0 ? 1 : 0 },
        }
      }
    }

    if (import.meta.dev) {
      console.log(`[proxyApiRequest] success for ${pathname} (proxied + normalized)`)
    }

    return result
  } catch (error) {
    if (error instanceof FetchError) {
      throw createError({
        statusCode: error.statusCode ?? 502,
        statusMessage: error.statusMessage ?? 'Upstream API error',
        data: error.data,
      })
    }
    if (error instanceof Error) {
      throw createError({
        statusCode: 502,
        statusMessage: error.message,
      })
    }
    throw error
  }
}
