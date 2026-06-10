import type { SiteTheme } from '#shared/types/site'
import { getSiteBrandColors } from '#shared/sites/siteBrandColors'
import { enrichSiteTheme } from '#shared/utils/siteThemeAssets'

export function createSiteTheme(slug: string, name: string): SiteTheme {
  const { colorPrimary, colorAccent } = getSiteBrandColors(slug)

  return enrichSiteTheme(slug, name, {
    colorPrimary,
    colorAccent,
    colorText: '#1a1a1a',
    colorBackground: '#ffffff',
    radiusSm: '4px',
    radiusMd: '12px',
  })
}
