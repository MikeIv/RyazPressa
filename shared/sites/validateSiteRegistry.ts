import type { SiteConfig, SiteSections } from '#shared/types/site'

/** Маршрут страницы → ключ раздела в `SiteSections`. */
export const SECTION_ROUTE_MAP: Readonly<Record<string, keyof SiteSections>> = {
  '/gallery': 'gallery',
  '/documents': 'documents',
  '/contacts': 'contacts',
  '/okruga': 'okruga',
  '/ryadom-s-nami': 'ryadomSNami',
  '/projects': 'projects',
}

export function validateSiteNav(site: SiteConfig): string[] {
  const errors: string[] = []

  for (const item of site.nav) {
    if (item.to === '/') continue

    const section = SECTION_ROUTE_MAP[item.to]
    if (!section) {
      errors.push(`[${site.slug}] nav "${item.to}" is not a known section route`)
      continue
    }

    if (!site.sections[section]) {
      errors.push(`[${site.slug}] nav "${item.to}" points to disabled section "${String(section)}"`)
    }
  }

  return errors
}

export function validateSiteRegistry(sites: readonly SiteConfig[]): string[] {
  const errors: string[] = []
  const slugSet = new Set<string>()
  const domainMap = new Map<string, string>()

  for (const site of sites) {
    if (slugSet.has(site.slug)) {
      errors.push(`Duplicate slug: ${site.slug}`)
    }
    slugSet.add(site.slug)

    for (const domain of site.domains) {
      const normalized = domain.toLowerCase()
      const owner = domainMap.get(normalized)
      if (owner) {
        errors.push(`Duplicate domain "${normalized}" (${site.slug} vs ${owner})`)
      }
      domainMap.set(normalized, site.slug)
    }

    errors.push(...validateSiteNav(site))
  }

  return errors
}

/** Fail-fast при некорректном реестре (дубликаты доменов, nav → disabled section). */
export function assertValidSiteRegistry(sites: readonly SiteConfig[]): void {
  const errors = validateSiteRegistry(sites)
  if (errors.length === 0) return

  throw new Error(`Invalid site registry:\n${errors.map((message) => `  - ${message}`).join('\n')}`)
}
