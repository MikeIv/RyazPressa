import type { SiteConfig } from '#shared/types/site'
import { EXTENDED_SITE_NAV_ORDER, navFromSections } from '#shared/sites/baseSections'

const ryazpressaSections = {
  gallery: false,
  documents: true,
  contacts: true,
  okruga: true,
  ryadomSNami: true,
  projects: true,
} as const

export const ryazpressaSite: SiteConfig = {
  slug: 'ryazpressa',
  name: 'Рязпресса',
  domains: ['ryazpressa.ru', 'www.ryazpressa.ru'],
  apiBase: 'https://api.ryazpressa.ru',
  theme: {
    colorPrimary: '#1a4b8c',
    colorAccent: '#c62828',
    colorText: '#1a1a1a',
    colorBackground: '#ffffff',
    headerGradientStart: '#ffffff',
    radiusSm: '4px',
    radiusMd: '8px',
    logoSrc: '/sites/ryazpressa/logo.svg',
    logoAlt: 'Рязпресса',
    logoWidth: 300,
    logoHeight: 28,
    faviconSrc: '/sites/ryazpressa/favicon.ico',
    appleTouchIconSrc: '/sites/ryazpressa/apple-touch-icon.png',
  },
  sections: { ...ryazpressaSections },
  nav: navFromSections(ryazpressaSections, EXTENDED_SITE_NAV_ORDER, { homeLabel: 'Новости' }),
  articlePathPrefix: '',
}
