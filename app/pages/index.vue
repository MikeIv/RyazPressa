<script setup lang="ts">
import type { NewsItem, PaginatedResponse } from '#shared/types/api'

const { site } = useSiteConfig()

const { data, pending, error } = useApiFetch<PaginatedResponse<NewsItem>>('/api/news', {
  query: { perPage: 4 },
  key: 'news-feed',
})

const {
  data: asideData,
  pending: asidePending,
  error: asideError,
} = useApiFetch<PaginatedResponse<NewsItem>>('/api/news', {
  query: { perPage: 20, period: 'today-yesterday' },
  key: 'news-aside-today',
})

const feedNews = computed(() => data.value?.data ?? [])
const asideNews = computed(() => asideData.value?.data ?? [])
const featured = computed(() => feedNews.value[0] ?? null)
const feedRest = computed(() => feedNews.value.slice(1))
const hasError = computed(() => Boolean(error.value))
const hasAsideError = computed(() => Boolean(asideError.value))

useHead({
  title: () => site.value?.name ?? 'Главная',
})
</script>

<template>
  <div :class="$style.page">
    <h1 class="visually-hidden">{{ site?.name ?? 'Главная' }}</h1>

    <section :class="$style.homeGrid" aria-labelledby="news-feed-heading">
      <h2 id="news-feed-heading" class="visually-hidden">Лента новостей</h2>

      <p v-if="pending" :class="$style.status" role="status">Загрузка ленты…</p>
      <p v-else-if="hasError" :class="$style.status" role="alert">Не удалось загрузить ленту.</p>
      <p v-else-if="!feedNews.length" :class="$style.status">Новостей в ленте пока нет.</p>

      <div :class="$style.feedColumn">
        <NewsFeedFeatured v-if="featured" :class="$style.featured" :item="featured" />
        <NewsFeedList v-if="feedRest.length" :class="$style.list" :items="feedRest" />
      </div>
      <NewsAsideToday
        :class="$style.aside"
        :items="asideNews"
        :pending="asidePending"
        :error="hasAsideError"
      />
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

/* Мобильный порядок: featured → aside → list (display: contents на feedColumn) */
.homeGrid {
  display: grid;
  gap: var(--fs-space-3);
  min-width: 0;
  grid-template-areas:
    'featured'
    'aside'
    'list';

  @include mx.from-desktop {
    grid-template-columns: minmax(0, 1fr) 300px;
    grid-template-areas: 'feedColumn aside';
    gap: var(--fs-space-4);
    align-items: start;

    @media (min-width: #{bp.$desktopMedium}) {
      grid-template-columns: minmax(0, 1fr) 340px;
    }
  }
}

.feedColumn {
  display: contents;

  @include mx.from-desktop {
    display: flex;
    flex-direction: column;
    gap: var(--fs-space-4);
    grid-area: feedColumn;
    min-width: 0;
  }
}

.status {
  grid-column: 1 / -1;
  margin: 0;
  color: var(--fs-color-text-muted);
  font-size: var(--fs-text-base);
}

.featured,
.list,
.aside {
  min-width: 0;
}

.featured {
  grid-area: featured;
}

.aside {
  grid-area: aside;
}

.list {
  grid-area: list;
}
</style>
