import type { Article, NewsItem } from '#shared/types/api'
import { htmlToPlainText } from '#shared/utils/htmlToPlainText'

/** Анонс новости: `lead` из ленты или plain-text из `content` детальной статьи. */
export function useNewsExcerpt(item: MaybeRefOrGetter<NewsItem>) {
  const newsItem = computed(() => toValue(item))
  const detailExcerpt = ref('')
  const api = useApi()
  let requestId = 0

  watch(
    newsItem,
    async (current) => {
      const lead = current.lead?.trim()
      if (lead) {
        detailExcerpt.value = ''
        return
      }

      const id = ++requestId
      try {
        const article = await api<Article>(`/api/news/${current.slug}`)
        if (id !== requestId) return
        detailExcerpt.value = htmlToPlainText(article.content)
      } catch {
        if (id !== requestId) return
        detailExcerpt.value = ''
      }
    },
    { immediate: true },
  )

  const excerpt = computed(() => newsItem.value.lead?.trim() || detailExcerpt.value)

  return { excerpt }
}
