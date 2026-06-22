<script setup lang="ts">
import type { NewsItem, PaginatedResponse } from '#shared/types/api'

const { site } = useSiteConfig()

const { data, pending, error } = useApiFetch<PaginatedResponse<NewsItem>>('/api/news', {
  query: { perPage: 20 },
  key: 'news-home',
})

const HOME_FEED_LIST_COUNT = 3

const allNews = computed(() => data.value?.data ?? [])
const featured = computed(() => allNews.value[0] ?? null)
const feedRest = computed(() => allNews.value.slice(1, 1 + HOME_FEED_LIST_COUNT))
const hasError = computed(() => Boolean(error.value))
const isRyazpressa = computed(() => site.value?.slug === 'ryazpressa')
const popularNews = computed(() => (isRyazpressa.value ? feedRest.value.slice(-2) : []))

useHead({
  title: () => site.value?.name ?? 'Главная',
})
</script>

<template>
  <div :class="$style.page">
    <h1 class="visually-hidden">{{ site?.name ?? 'Главная' }}</h1>

    <section
      :class="[$style.homeGrid, isRyazpressa && $style.homeGridWithAside]"
      aria-labelledby="news-feed-heading"
      :aria-busy="pending"
    >
      <h2 id="news-feed-heading" class="visually-hidden">Лента новостей</h2>
      <p class="visually-hidden" role="status">{{ pending ? 'Загрузка ленты новостей' : '' }}</p>

      <template v-if="pending">
        <div :class="$style.featuredBlock">
          <NewsFeedNow />
          <NewsFeedFeaturedSkeleton />
        </div>
        <NewsFeedListSkeleton :class="$style.list" :count="HOME_FEED_LIST_COUNT" />
        <NewsAsideTodaySkeleton v-if="isRyazpressa" :class="$style.aside" />
      </template>

      <template v-else>
        <p v-if="hasError" :class="$style.status" role="alert">Не удалось загрузить ленту.</p>
        <p v-else-if="!allNews.length" :class="$style.status">Новостей в ленте пока нет.</p>

        <div v-if="featured" :class="$style.featuredBlock">
          <NewsFeedNow />
          <NewsFeedFeatured :item="featured" />
        </div>
        <NewsFeedList v-if="feedRest.length" :class="$style.list" :items="feedRest" />
        <NewsAsideToday
          v-if="isRyazpressa"
          :class="$style.aside"
          :items="popularNews"
          :error="hasError"
        />
      </template>
    </section>
  </div>
</template>

<style module lang="scss">
@use '~/assets/styles/tools/mixins' as mx;
@use '~/assets/styles/variables/resolutions' as bp;

.page {
  min-width: 0;
  padding-block: var(--fs-space-3) var(--fs-space-5);

  @media (min-width: 1024px) {
    padding-block: var(--fs-space-4) var(--fs-space-6);
  }
}

/* По умолчанию: featured + list на всю ширину; ryazpressa — колонка aside справа */
.homeGrid {
  display: grid;
  gap: var(--fs-space-3);
  min-width: 0;
  grid-template-areas:
    'featured'
    'list';

  @include mx.from-desktop {
    gap: var(--fs-space-4);
    align-items: start;
  }
}

.homeGridWithAside {
  grid-template-areas:
    'featured'
    'list'
    'aside';

  @include mx.from-desktop {
    grid-template-columns: minmax(0, 1fr) 300px;
    grid-template-areas:
      'featured featured'
      'list aside';

    @media (min-width: #{bp.$desktopMedium}) {
      grid-template-columns: minmax(0, 1fr) 340px;
    }
  }
}

.status {
  grid-column: 1 / -1;
  margin: 0;
  color: var(--fs-color-text-muted);
  font-size: var(--fs-text-base);
}

.featuredBlock,
.list,
.aside {
  min-width: 0;
}

.featuredBlock {
  display: flex;
  flex-direction: column;
  gap: var(--fs-space-2);
  grid-area: featured;
}

.aside {
  grid-area: aside;
}

.list {
  grid-area: list;
}
</style>
