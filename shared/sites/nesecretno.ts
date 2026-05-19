import type { SiteConfig } from '#shared/types/site'

export const nesecretnoSite: SiteConfig = {
  slug: 'nesecretno',
  name: 'Не секретно',
  domains: ['nesecretno.ru', 'www.nesecretno.ru'],
  apiBase: '',
  theme: {
    colorPrimary: '#2e7d32',
    colorAccent: '#f57c00',
    colorText: '#1a1a1a',
    colorBackground: '#ffffff',
    radiusSm: '4px',
    radiusMd: '12px',
    logoSrc: '/sites/nesecretno/logo.svg',
    logoAlt: 'Не секретно',
  },
  sections: {
    gallery: true,
    documents: true,
    contacts: true,
    okruga: false,
    ryadomSNami: false,
    projects: false,
  },
  nav: [
    { label: 'Главная', to: '/' },
    { label: 'Фотогалерея', to: '/gallery' },
    { label: 'Документы', to: '/documents' },
    { label: 'Контакты', to: '/contacts' },
  ],
}
