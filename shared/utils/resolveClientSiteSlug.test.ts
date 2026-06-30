import { describe, expect, it } from 'vitest'
import { isRyazpressaClientHost, resolveClientSiteSlug } from '#shared/utils/resolveClientSiteSlug'

describe('resolveClientSiteSlug', () => {
  it('resolves localhost by dev slug', () => {
    expect(resolveClientSiteSlug('localhost:3000', 'nashevremya62')).toBe('nashevremya62')
  })

  it('resolves web.* host via apex domain', () => {
    expect(resolveClientSiteSlug('web.nashevremya62.ru')).toBe('nashevremya62')
  })

  it('resolves production apex domain', () => {
    expect(resolveClientSiteSlug('nesecretno.ru')).toBe('nesecretno')
  })

  it('returns undefined for unknown host', () => {
    expect(resolveClientSiteSlug('unknown.example')).toBeUndefined()
  })
})

describe('isRyazpressaClientHost', () => {
  it('detects ryazpressa hosts', () => {
    expect(isRyazpressaClientHost('web.ryazpressa.ru')).toBe(true)
    expect(isRyazpressaClientHost('localhost:3000', 'ryazpressa')).toBe(true)
  })

  it('returns false for other editions', () => {
    expect(isRyazpressaClientHost('web.nashevremya62.ru')).toBe(false)
    expect(isRyazpressaClientHost('localhost:3000', 'nashevremya62')).toBe(false)
  })
})
