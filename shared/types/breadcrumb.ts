/** Элемент цепочки хлебных крошек. Последний пункт — текущая страница (`to` не задаётся). */
export interface BreadcrumbItem {
  label: string
  to?: string
}
