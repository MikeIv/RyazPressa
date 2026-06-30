import type { BreadcrumbItem } from '#shared/types/breadcrumb'
import type { SiteSections } from '#shared/types/site'
import {
  articleCategoryBreadcrumb,
  buildBreadcrumbs,
  sectionBreadcrumb,
} from '#shared/utils/breadcrumbs'

/** Страница раздела: «Главная → {раздел}». */
export function useSectionPageBreadcrumbs(
  section: keyof SiteSections,
  currentLabel?: MaybeRefOrGetter<string | undefined>,
): ComputedRef<BreadcrumbItem[]> {
  return computed(() => {
    const sectionItem = sectionBreadcrumb(section)
    const label = toValue(currentLabel) ?? sectionItem?.label ?? ''
    return buildBreadcrumbs({ label })
  })
}

/** Детальная страница раздела: «Главная → {раздел} → {текущая}». */
export function useSectionDetailBreadcrumbs(
  section: keyof SiteSections,
  currentLabel: MaybeRefOrGetter<string>,
): ComputedRef<BreadcrumbItem[]> {
  return computed(() => {
    const sectionItem = sectionBreadcrumb(section)
    const label = toValue(currentLabel)
    if (!sectionItem) return buildBreadcrumbs({ label })
    return buildBreadcrumbs({ label: sectionItem.label, to: sectionItem.to }, { label })
  })
}

/** Статья: «Главная → {раздел?} → {заголовок}». */
export function useArticleBreadcrumbs(
  title: MaybeRefOrGetter<string>,
  category?: MaybeRefOrGetter<string | number | null | undefined>,
): ComputedRef<BreadcrumbItem[]> {
  return computed(() => {
    const tail: BreadcrumbItem[] = []
    const categoryCrumb = articleCategoryBreadcrumb(toValue(category))
    if (categoryCrumb) tail.push(categoryCrumb)
    tail.push({ label: toValue(title) })
    return buildBreadcrumbs(...tail)
  })
}
