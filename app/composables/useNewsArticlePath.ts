import { newsArticlePath, type NewsArticlePathPrefix } from '#shared/utils/newsArticlePath'

export function useNewsArticlePath() {
  const { site } = useSiteConfig()

  const prefix = computed((): NewsArticlePathPrefix => site.value?.articlePathPrefix ?? '/news')

  function articlePath(slug: string): string {
    return newsArticlePath(prefix.value, slug)
  }

  return { articlePath, prefix }
}
