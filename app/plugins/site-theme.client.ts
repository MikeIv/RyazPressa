import { getSiteBySlug } from '#shared/sites'
import { resolveClientSiteSlug } from '#shared/utils/resolveClientSiteSlug'
import { applySiteThemeCss } from '~/utils/applySiteThemeCss'

function readDevSiteSlug(): string | undefined {
  const publicConfig = useRuntimeConfig().public
  return 'siteSlug' in publicConfig && typeof publicConfig.siteSlug === 'string'
    ? publicConfig.siteSlug
    : undefined
}

function applyEarlySiteTheme(): void {
  const devSiteSlug = readDevSiteSlug()
  const slug = resolveClientSiteSlug(window.location.hostname, devSiteSlug)
  if (!slug || slug === 'ryazpressa') return

  const registrySite = getSiteBySlug(slug)
  if (registrySite) applySiteThemeCss(registrySite.theme)
}

/** CSS-переменные темы по конфигу сайта; для не-ryazpressa — ранняя подстановка из реестра. */
export default defineNuxtPlugin(() => {
  applyEarlySiteTheme()

  const { site } = useSiteConfig()

  watch(
    () => site.value?.theme,
    (theme) => {
      if (theme) applySiteThemeCss(theme)
    },
    { immediate: true },
  )
})
