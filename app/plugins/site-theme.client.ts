import type { SiteTheme } from '#shared/types/site'
import { buildHeaderGradient } from '#shared/utils/buildHeaderGradient'

function applySiteTheme(theme: SiteTheme): void {
  const root = document.documentElement
  root.style.setProperty('--site-color-primary', theme.colorPrimary)
  root.style.setProperty('--site-color-accent', theme.colorAccent)
  root.style.setProperty('--site-color-text', theme.colorText)
  root.style.setProperty('--site-color-background', theme.colorBackground)
  root.style.setProperty('--site-radius-sm', theme.radiusSm)
  root.style.setProperty('--site-radius-md', theme.radiusMd)
  root.style.setProperty(
    '--site-header-gradient',
    buildHeaderGradient(theme.colorPrimary, theme.colorAccent, theme.headerGradientStart),
  )
}

export default defineNuxtPlugin(() => {
  const { site } = useSiteConfig()

  watch(
    () => site.value?.theme,
    (theme) => {
      if (theme) applySiteTheme(theme)
    },
    { immediate: true },
  )
})
