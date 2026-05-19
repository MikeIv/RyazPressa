import type { SiteConfig } from '#shared/types/site'

export const ryazpressaSite: SiteConfig = {
  slug: 'ryazpressa',
  name: 'Рязпресса',
  domains: ['ryazpressa.ru', 'www.ryazpressa.ru'],
  apiBase: '',
  theme: {
    colorPrimary: '#1a4b8c',
    colorAccent: '#c62828',
    colorText: '#1a1a1a',
    colorBackground: '#ffffff',
    radiusSm: '4px',
    radiusMd: '8px',
    logoSrc: '/sites/ryazpressa/logo.svg',
    logoAlt: 'Рязпресса',
  },
  sections: {
    gallery: false,
    documents: true,
    contacts: true,
    okruga: true,
    ryadomSNami: true,
    projects: true,
  },
  nav: [
    { label: 'Главная', to: '/' },
    { label: 'Округа', to: '/okruga' },
    { label: 'Рядом с нами', to: '/ryadom-s-nami' },
    { label: 'Проекты', to: '/projects' },
    { label: 'Контакты', to: '/contacts' },
    { label: 'Документы', to: '/documents' },
  ],
}
