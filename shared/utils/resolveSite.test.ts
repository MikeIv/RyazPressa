import { describe, expect, it } from 'vitest'
import { isLocalDevHost, isPreviewDeployHost, resolveSite } from '#shared/utils/resolveSite'

describe('resolveSite', () => {
  it('resolves localhost by fallback slug', () => {
    const site = resolveSite('localhost:3000', 'ryazpressa')
    expect(site?.slug).toBe('ryazpressa')
  })

  it('resolves production domain', () => {
    const site = resolveSite('ryazpressa.ru', 'ryazpressa')
    expect(site?.slug).toBe('ryazpressa')
  })

  it('returns undefined for unknown domain', () => {
    expect(resolveSite('unknown.example', 'ryazpressa')).toBeUndefined()
  })

  it('returns undefined for unknown slug on localhost', () => {
    expect(resolveSite('127.0.0.1', 'no-such-site')).toBeUndefined()
  })
})

describe('isLocalDevHost', () => {
  it('detects localhost and loopback', () => {
    expect(isLocalDevHost('localhost')).toBe(true)
    expect(isLocalDevHost('localhost:3000')).toBe(true)
    expect(isLocalDevHost('127.0.0.1')).toBe(true)
    expect(isLocalDevHost('ryazpressa.ru')).toBe(false)
  })
})

describe('isPreviewDeployHost', () => {
  it('detects vercel preview hosts', () => {
    expect(isPreviewDeployHost('ryazpressa.vercel.app')).toBe(true)
    expect(isPreviewDeployHost('localhost')).toBe(false)
  })
})
