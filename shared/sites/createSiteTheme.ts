import type { SiteTheme } from '#shared/types/site'
import { getSiteBrandColors } from '#shared/sites/siteBrandColors'

const SITE_LOGO_SIZE: Readonly<Record<string, Pick<SiteTheme, 'logoWidth' | 'logoHeight'>>> = {
  nesecretno: { logoWidth: 360, logoHeight: 80 },
}

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
    ...(SITE_LOGO_SIZE[slug] ?? {}),
  }
}
