import type { SiteConfig } from '#shared/types/site'

/** Второй эталонный сайт платформы (4 базовых раздела + фотогалерея). */
export const nesecretnoSite: SiteConfig = {
  slug: 'nesecretno',
  name: 'Не секретно',
  domains: ['nesecretno.ru', 'www.nesecretno.ru'],
  apiBase: '',
  theme: {
    colorPrimary: '#1b5e20',
    colorAccent: '#ef6c00',
    colorText: '#1a1a1a',
    colorBackground: '#ffffff',
    radiusSm: '4px',
    radiusMd: '12px',
    logoSrc: '/sites/nesecretno/logo.svg',
    logoAlt: 'Не секретно — региональное издание',
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
