/** Единственная инициализация `useFetch` для `/api/_site` до `site-meta` и `site-theme`. */
export default defineNuxtPlugin(() => {
  initSiteConfig()
})
