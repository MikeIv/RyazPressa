import type { Article, NewsItem } from '#shared/types/api'

/** Анонс новости: `lead` из ленты или из детальной статьи, если лид пустой. */
export function useNewsExcerpt(item: MaybeRefOrGetter<NewsItem>) {
  const newsItem = computed(() => toValue(item))
  const lead = computed(() => newsItem.value.lead.trim())
  const detailExcerpt = ref('')
  const api = useApi()
  let requestId = 0

  watch(
    () => [newsItem.value.slug, lead.value] as const,
    async ([slug, currentLead]) => {
      if (currentLead) {
        detailExcerpt.value = ''
        return
      }

      const id = ++requestId
      try {
        const article = await api<Article>(`/api/news/${slug}`)
        if (id !== requestId) return
        detailExcerpt.value = article.lead.trim()
      } catch {
        if (id !== requestId) return
        detailExcerpt.value = ''
      }
    },
    { immediate: true },
  )

  const excerpt = computed(() => lead.value || detailExcerpt.value)

  return { excerpt }
}
