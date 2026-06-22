import { describe, expect, it } from 'vitest'
import type { Article, NewsItem, PaginatedResponse } from '#shared/types/api'
import {
  contractApiPath,
  contractPathFromRequest,
  resolveBackendApiPath,
  resolveClientApiUrl,
  toContractPath,
  transformClientApiResponse,
} from '#shared/utils/clientApiBridge'

describe('contractApiPath', () => {
  it('normalizes path and strips query', () => {
    expect(contractApiPath('api/news?perPage=4')).toBe('/api/news')
    expect(contractApiPath('/api/news/foo')).toBe('/api/news/foo')
  })
})

describe('resolveBackendApiPath', () => {
  it('maps news contract to posts backend path', () => {
    expect(resolveBackendApiPath('/api/news')).toBe('/api/posts')
    expect(resolveBackendApiPath('/api/news/slug')).toBe('/api/posts/slug')
    expect(resolveBackendApiPath('/api/documents')).toBe('/api/documents')
  })
})

describe('toContractPath', () => {
  it('maps posts backend path back to news contract', () => {
    expect(toContractPath('/api/posts')).toBe('/api/news')
    expect(toContractPath('/api/posts/slug')).toBe('/api/news/slug')
  })

  it('adds /api prefix for non-prefixed backend paths', () => {
    expect(toContractPath('/documents')).toBe('/api/documents')
  })
})

describe('resolveClientApiUrl', () => {
  it('returns relative path without api base', () => {
    expect(resolveClientApiUrl('/api/news', undefined)).toBe('/api/news')
  })

  it('builds absolute backend URL with api base', () => {
    expect(resolveClientApiUrl('/api/news', 'https://api.example.com/')).toBe(
      'https://api.example.com/api/posts',
    )
  })
})

describe('contractPathFromRequest', () => {
  it('reads pathname from absolute request URL', () => {
    expect(contractPathFromRequest('https://api.example.com/api/posts/slug')).toBe('/api/news/slug')
  })

  it('falls back to contract path for relative input', () => {
    expect(contractPathFromRequest('/api/news?perPage=4')).toBe('/api/news')
  })
})

describe('transformClientApiResponse', () => {
  it('normalizes posts list response', () => {
    const raw = {
      data: [
        {
          id: 1,
          slug: 'post-1',
          title: 'Post',
          publishedAt: '2026-06-22T10:00:00+03:00',
          lead: 'Lead',
        },
      ],
      meta: { current_page: 1, per_page: 10, total: 1, last_page: 1 },
    }

    const result = transformClientApiResponse('/api/news', raw) as PaginatedResponse<NewsItem>

    expect(result.data[0]?.slug).toBe('post-1')
    expect(result.meta.page).toBe(1)
    expect(result.meta.perPage).toBe(10)
  })

  it('normalizes post detail and sanitizes HTML content', () => {
    const raw = {
      data: {
        id: 1,
        slug: 'post-1',
        title: 'Post',
        publishedAt: '2026-06-22T10:00:00+03:00',
        content: '<p>Safe</p><script>alert(1)</script>',
      },
    }

    const result = transformClientApiResponse('/api/news/post-1', raw) as Article

    expect(result.slug).toBe('post-1')
    expect(result.content).toBe('<p>Safe</p>')
    expect(result.content).not.toContain('script')
  })

  it('normalizes post tags to display names', () => {
    const raw = {
      data: {
        id: 1,
        slug: 'post-1',
        title: 'Post',
        publishedAt: '2026-06-22T10:00:00+03:00',
        content: '<p>Body</p>',
        tags: [
          { id: '2667', slug: 'zvonnicza', name: 'Звонница' },
          { id: '4388', slug: 'muzykanty', name: 'музыканты' },
        ],
      },
    }

    const result = transformClientApiResponse('/api/news/post-1', raw) as Article

    expect(result.tags).toEqual(['Звонница', 'музыканты'])
  })

  it('returns raw payload for unknown contract paths', () => {
    const raw = { ok: true }
    expect(transformClientApiResponse('/api/unknown', raw)).toEqual(raw)
  })
})
