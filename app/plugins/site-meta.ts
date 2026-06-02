import type { SiteTheme } from '#shared/types/site'

function faviconMimeType(href: string): string {
  if (href.endsWith('.ico')) return 'image/x-icon'
  if (href.endsWith('.svg')) return 'image/svg+xml'
  return 'image/png'
}

function buildFaviconLinks(theme: SiteTheme | undefined) {
  if (!theme?.faviconSrc) return []

  const links: Array<{ rel: string; type?: string; sizes?: string; href: string }> = [
    { rel: 'icon', type: faviconMimeType(theme.faviconSrc), href: theme.faviconSrc },
  ]

  const slash = theme.faviconSrc.lastIndexOf('/')
  if (slash > 0) {
    const base = theme.faviconSrc.slice(0, slash)
    links.push(
      { rel: 'icon', type: 'image/png', sizes: '32x32', href: `${base}/favicon-32x32.png` },
      { rel: 'icon', type: 'image/png', sizes: '16x16', href: `${base}/favicon-16x16.png` },
    )
  }

  if (theme.appleTouchIconSrc) {
    links.push({ rel: 'apple-touch-icon', href: theme.appleTouchIconSrc })
  }

  return links
}

/** Favicon и touch-icon по конфигу текущего сайта. */
export default defineNuxtPlugin(() => {
  const { site } = useSiteConfig()

  useHead({
    link: computed(() => buildFaviconLinks(site.value?.theme)),
  })
})
