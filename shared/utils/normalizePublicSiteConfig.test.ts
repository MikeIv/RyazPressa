import { describe, expect, it } from 'vitest'
import { normalizePublicSiteConfig } from '#shared/utils/normalizePublicSiteConfig'

const baseTheme = {
  colorPrimary: '#1a4b8c',
  colorAccent: '#c62828',
  colorText: '#1a1a1a',
  colorBackground: '#ffffff',
  radiusSm: '4px',
  radiusMd: '8px',
}

const baseSections = {
  gallery: true,
  documents: true,
  contacts: true,
  okruga: false,
  ryadomSNami: false,
  projects: false,
}

describe('normalizePublicSiteConfig', () => {
  it('maps punycode backend slug to canonical slug for IDN sites', () => {
    const config = normalizePublicSiteConfig({
      slug: 'xn----dtbhacs4a5afeg4c2c',
      name: 'Честные вести',
      apiSiteHost: 'xn----dtbhacs4a5afeg4c2c.xn--p1ai',
      theme: baseTheme,
      sections: baseSections,
      nav: [{ label: 'Новости', path: '/' }],
    })

    expect(config.slug).toBe('chestnye-vesti')
    expect(config.theme.logoSrc).toBe('/sites/chestnye-vesti/logo.svg')
    expect(config.theme.faviconSrc).toBe('/sites/chestnye-vesti/favicon.ico')
    expect(config.theme.colorPrimary).toBe('#222222')
    expect(config.theme.colorAccent).toBe('#4db2ec')
  })

  it('keeps canonical slug from backend when already valid', () => {
    const config = normalizePublicSiteConfig({
      slug: 'nesecretno',
      name: 'Не секретно',
      apiSiteHost: 'nesecretno.ru',
      theme: baseTheme,
      sections: baseSections,
      nav: [],
    })

    expect(config.slug).toBe('nesecretno')
    expect(config.theme.logoSrc).toBe('/sites/nesecretno/logo.svg')
  })
})
