/** Фирменные цвета базовых изданий (с live-сайтов, май 2026). */
export interface SiteBrandColors {
  colorPrimary: string
  colorAccent: string
}

export const SITE_BRAND_COLORS: Readonly<Record<string, SiteBrandColors>> = {
  nesecretno: { colorPrimary: '#1e73be', colorAccent: '#008ca8' },
  rodnoykray62: { colorPrimary: '#dd3333', colorAccent: '#a31717' },
  denzadnem: { colorPrimary: '#dd9933', colorAccent: '#dd3333' },
  rodnieistoki: { colorPrimary: '#00846b', colorAccent: '#4db2ec' },
  nashibudni: { colorPrimary: '#f5b000', colorAccent: '#000000' },
  vteme62: { colorPrimary: '#1e73be', colorAccent: '#008ca8' },
  ezhednevnik62: { colorPrimary: '#351699', colorAccent: '#5e35b1' },
  nashazhizn: { colorPrimary: '#02787c', colorAccent: '#008d7f' },
  zvezda62: { colorPrimary: '#dd3333', colorAccent: '#a31717' },
  'po-sushchestvu': { colorPrimary: '#592491', colorAccent: '#7e57c2' },
  vseputem62: { colorPrimary: '#0d42a2', colorAccent: '#116ace' },
  naslukhu: { colorPrimary: '#d64646', colorAccent: '#af0c0c' },
  rbninfo: { colorPrimary: '#1d7534', colorAccent: '#2e7d32' },
  'chestnye-vesti': { colorPrimary: '#222222', colorAccent: '#4db2ec' },
  'prigorodnoe-soobshchenie': { colorPrimary: '#222222', colorAccent: '#4db2ec' },
  vokruge62: { colorPrimary: '#dd9933', colorAccent: '#85a1b2' },
  zemlyaki: { colorPrimary: '#af0c0c', colorAccent: '#dd3333' },
  'nedelya-novostey': { colorPrimary: '#222222', colorAccent: '#4db2ec' },
  'mezhdu-strok': { colorPrimary: '#3f3f3f', colorAccent: '#666666' },
  vkursedela: { colorPrimary: '#007ed3', colorAccent: '#003859' },
  pulseoflife: { colorPrimary: '#a00000', colorAccent: '#7a002c' },
  bezvariantov62: { colorPrimary: '#ad005c', colorAccent: '#880e4f' },
  iskra: { colorPrimary: '#004777', colorAccent: '#007ed3' },
  nashevremya62: { colorPrimary: '#222222', colorAccent: '#4db2ec' },
  storonka62: { colorPrimary: '#5e0019', colorAccent: '#8b0025' },
}

export function getSiteBrandColors(slug: string): SiteBrandColors {
  const colors = SITE_BRAND_COLORS[slug]
  if (!colors) {
    throw new Error(`Missing brand colors for site slug: ${slug}`)
  }
  return colors
}
