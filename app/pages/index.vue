<script setup lang="ts">
import type { NewsItem, PaginatedMeta, PaginatedResponse } from '#shared/types/api'

const { site } = useSiteConfig()
const api = useApi()

/** Главная новость + блок «Популярные» (ryazpressa) не входят в основную сетку. */
const HOME_ASIDE_COUNT = 2
const HOME_LIST_BATCH = 8
const HOME_FEED_PAGE_SIZE = 20

const { data, pending, error } = useApiFetch<PaginatedResponse<NewsItem>>('/api/news', {
  query: { perPage: HOME_FEED_PAGE_SIZE },
  key: 'news-home',
})

const allNews = computed(() => data.value?.data ?? [])
const hasError = computed(() => Boolean(error.value))
const isRyazpressa = computed(() => site.value?.slug === 'ryazpressa')
const featured = computed(() => allNews.value[0] ?? null)
const popularNews = computed(() =>
  isRyazpressa.value ? allNews.value.slice(1, 1 + HOME_ASIDE_COUNT) : [],
)

const listNews = ref<NewsItem[]>([])
const listMeta = ref<PaginatedMeta | null>(null)
const visibleCount = ref(HOME_LIST_BATCH)
const nextPage = ref(2)
const loadingMore = ref(false)

const listStartIndex = computed(() => 1 + (isRyazpressa.value ? HOME_ASIDE_COUNT : 0))

watch(
  [data, listStartIndex],
  () => {
    const response = data.value
    if (!response) {
      listNews.value = []
      listMeta.value = null
      visibleCount.value = HOME_LIST_BATCH
      nextPage.value = 2
      return
    }

    listNews.value = response.data.slice(listStartIndex.value)
    listMeta.value = response.meta
    visibleCount.value = HOME_LIST_BATCH
    nextPage.value = 2
  },
  { immediate: true },
)

const displayedList = computed(() => listNews.value.slice(0, visibleCount.value))

const hasMore = computed(() => {
  if (visibleCount.value < listNews.value.length) return true
  if (!listMeta.value) return false
  return nextPage.value <= listMeta.value.totalPages
})

async function loadMore(): Promise<void> {
  visibleCount.value += HOME_LIST_BATCH

  if (visibleCount.value <= listNews.value.length) return
  if (!listMeta.value || nextPage.value > listMeta.value.totalPages) return

  loadingMore.value = true
  try {
    const response = await api<PaginatedResponse<NewsItem>>('/api/news', {
      query: { page: nextPage.value, perPage: HOME_FEED_PAGE_SIZE },
    })
    listNews.value = [...listNews.value, ...response.data]
    listMeta.value = response.meta
    nextPage.value += 1
  } catch {
    visibleCount.value -= HOME_LIST_BATCH
  } finally {
    loadingMore.value = false
  }
}

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
        <div :class="$style.listBlock">
          <NewsFeedListSkeleton :count="HOME_LIST_BATCH" />
        </div>
        <NewsAsideTodaySkeleton v-if="isRyazpressa" :class="$style.aside" />
      </template>

      <template v-else>
        <p v-if="hasError" :class="$style.status" role="alert">Не удалось загрузить ленту.</p>
        <p v-else-if="!allNews.length" :class="$style.status">Новостей в ленте пока нет.</p>

        <div v-if="featured" :class="$style.featuredBlock">
          <NewsFeedNow />
          <NewsFeedFeatured :item="featured" />
        </div>
        <div v-if="displayedList.length" :class="$style.listBlock">
          <NewsFeedList :items="displayedList" />
          <button
            v-if="hasMore"
            type="button"
            :class="$style.loadMore"
            :disabled="loadingMore"
            @click="loadMore"
          >
            {{ loadingMore ? 'Загрузка…' : 'Показать еще' }}
          </button>
        </div>
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
.listBlock,
.aside {
  min-width: 0;
}

.listBlock {
  display: flex;
  flex-direction: column;
  gap: var(--fs-space-3);
  grid-area: list;
}

.loadMore {
  align-self: center;
  min-width: min(100%, 280px);
  padding: 12px var(--fs-space-4);
  font-size: var(--fs-text-base);
  font-weight: var(--fs-weight-semibold);
  line-height: 1.2;
  color: var(--site-color-primary);
  background: var(--site-color-background);
  border: 1px solid color-mix(in srgb, var(--site-color-primary) 35%, var(--fs-color-border));
  border-radius: var(--site-radius-md);
  cursor: pointer;
  transition:
    background-color 0.2s ease,
    border-color 0.2s ease;

  &:hover:not(:disabled) {
    background: color-mix(in srgb, var(--site-color-primary) 8%, var(--site-color-background));
    border-color: color-mix(in srgb, var(--site-color-primary) 55%, var(--fs-color-border));
  }

  &:focus-visible {
    outline: 2px solid var(--site-color-primary);
    outline-offset: 2px;
  }

  &:disabled {
    opacity: 0.65;
    cursor: wait;
  }
}

@media (prefers-reduced-motion: reduce) {
  .loadMore {
    transition: none;
  }
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
</style>
