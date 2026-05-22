import type { SiteTheme } from '#shared/types/site'
import { getSiteBrandColors } from '#shared/sites/siteBrandColors'

export function createSiteTheme(slug: string, name: string, logoSrc: string): SiteTheme {
  const { colorPrimary, colorAccent } = getSiteBrandColors(slug)

  return {
    colorPrimary,
    colorAccent,
    colorText: '#1a1a1a',
    colorBackground: '#ffffff',
    radiusSm: '4px',
    radiusMd: '12px',
    logoSrc,
    logoAlt: name,
  }
}
