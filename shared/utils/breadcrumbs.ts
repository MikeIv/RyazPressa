import type { BreadcrumbItem } from '#shared/types/breadcrumb'
import type { SiteSections } from '#shared/types/site'
import { getSectionNavItem } from '#shared/sites/baseSections'
import { RYADOM_S_NAMI_SEGMENT } from '#shared/utils/newsArticlePath'

export const HOME_BREADCRUMB: BreadcrumbItem = { label: 'Главная', to: '/' }

const CATEGORY_SECTION_MAP: Partial<Record<string, keyof SiteSections>> = {
  [RYADOM_S_NAMI_SEGMENT]: 'ryadomSNami',
}

export function sectionBreadcrumb(section: keyof SiteSections): BreadcrumbItem | null {
  const nav = getSectionNavItem(section)
  if (!nav) return null
  return { label: nav.label, to: nav.to }
}

/** Известные slug категории статьи → ссылка на раздел. */
export function articleCategoryBreadcrumb(
  category?: string | number | null,
): BreadcrumbItem | null {
  if (category == null || category === '') return null

  const section = CATEGORY_SECTION_MAP[String(category)]
  if (!section) return null

  return sectionBreadcrumb(section)
}

export function buildBreadcrumbs(...tail: BreadcrumbItem[]): BreadcrumbItem[] {
  return [HOME_BREADCRUMB, ...tail]
}
