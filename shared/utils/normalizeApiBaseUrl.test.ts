import { describe, expect, it } from 'vitest'
import {
  isNitroApiPath,
  joinApiUrl,
  normalizeApiBaseUrl,
  resolveApiBaseUrl,
} from '#shared/utils/normalizeApiBaseUrl'

describe('normalizeApiBaseUrl', () => {
  it('trims and removes trailing slashes', () => {
    expect(normalizeApiBaseUrl('  https://api.example.com/  ')).toBe('https://api.example.com')
  })

  it('returns undefined for empty or non-string values', () => {
    expect(normalizeApiBaseUrl('')).toBeUndefined()
    expect(normalizeApiBaseUrl('   ')).toBeUndefined()
    expect(normalizeApiBaseUrl(undefined)).toBeUndefined()
    expect(normalizeApiBaseUrl(42)).toBeUndefined()
  })
})

describe('resolveApiBaseUrl', () => {
  it('prefers site base over fallback', () => {
    expect(resolveApiBaseUrl('https://site.api/', 'https://global.api/')).toBe('https://site.api')
  })

  it('falls back when site base is empty', () => {
    expect(resolveApiBaseUrl('', 'https://global.api/')).toBe('https://global.api')
    expect(resolveApiBaseUrl(undefined, 'https://global.api/')).toBe('https://global.api')
  })
})

describe('joinApiUrl', () => {
  it('joins base and path', () => {
    expect(joinApiUrl('https://api.example.com', '/api/news')).toBe(
      'https://api.example.com/api/news',
    )
  })

  it('returns relative path when base is missing', () => {
    expect(joinApiUrl(undefined, 'api/news')).toBe('/api/news')
  })
})

describe('isNitroApiPath', () => {
  it('detects contract API paths', () => {
    expect(isNitroApiPath('/api/news')).toBe(true)
    expect(isNitroApiPath('api/news')).toBe(true)
    expect(isNitroApiPath('/gallery')).toBe(false)
  })
})
