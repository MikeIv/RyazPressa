import type { SiteNavItem, SiteSections } from '#shared/types/site'

/** Разделы базового сайта (25 изданий + gallery). */
export const BASE_SITE_SECTIONS: SiteSections = {
  gallery: true,
  documents: true,
  contacts: true,
  okruga: false,
  ryadomSNami: false,
  projects: false,
}

const SECTION_NAV: Partial<Record<keyof SiteSections, SiteNavItem>> = {
  gallery: { label: 'Фотогалерея', to: '/gallery' },
  documents: { label: 'Документы', to: '/documents' },
  contacts: { label: 'Контакты', to: '/contacts' },
  okruga: { label: 'Округа', to: '/okruga' },
  ryadomSNami: { label: 'Рядом с нами', to: '/ryadom-s-nami' },
  projects: { label: 'Проекты', to: '/projects' },
}

const NAV_ORDER: (keyof SiteSections)[] = [
  'gallery',
  'documents',
  'contacts',
  'okruga',
  'ryadomSNami',
  'projects',
]

/** Порядок nav для расширенного сайта (ryazpressa). */
export const EXTENDED_SITE_NAV_ORDER: (keyof SiteSections)[] = [
  'okruga',
  'ryadomSNami',
  'projects',
  'contacts',
  'documents',
]

/** Навигация из включённых разделов (главная/новости всегда первая). */
export interface NavFromSectionsOptions {
  homeLabel?: string
}

export function navFromSections(
  sections: SiteSections,
  order: readonly (keyof SiteSections)[] = NAV_ORDER,
  options?: NavFromSectionsOptions,
): readonly SiteNavItem[] {
  const items: SiteNavItem[] = [{ label: options?.homeLabel ?? 'Главная', to: '/' }]

  for (const key of order) {
    if (sections[key]) {
      const navItem = SECTION_NAV[key]
      if (navItem) items.push(navItem)
    }
  }

  return items
}
