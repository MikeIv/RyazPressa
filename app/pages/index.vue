<script setup lang="ts">
import type { NewsItem, PaginatedResponse } from '#shared/types/api'

const { site } = useSiteConfig()

const { data, pending, error } = useApiFetch<PaginatedResponse<NewsItem>>('/api/news', {
  query: { perPage: 12 },
})

const news = computed(() => data.value?.data ?? [])

useHead({
  title: () => site.value?.name ?? 'Главная',
})
</script>

<template>
  <div :class="[$style.page, 'container']">
    <h1 :class="$style.title">Новости</h1>

    <p v-if="pending" :class="$style.status" role="status">Загрузка новостей…</p>
    <p v-else-if="error" :class="$style.status" role="alert">Не удалось загрузить новости.</p>

    <ul v-else-if="news.length" :class="$style.list" role="list">
      <li v-for="item in news" :key="item.id">
        <NewsCard :item="item" />
      </li>
    </ul>

    <p v-else :class="$style.status">Новостей пока нет.</p>
  </div>
</template>

<style module lang="scss">
@use '~/assets/styles/tools/mixins' as mx;

.page {
  padding-block: var(--fs-space-4);
}

.title {
  font-size: var(--fs-text-3xl);
  font-weight: var(--fs-weight-bold);
  line-height: var(--fs-leading-tight);
  margin-bottom: var(--fs-space-4);
}

.status {
  color: var(--fs-color-text-muted);
  font-size: var(--fs-text-base);
}

.list {
  display: grid;
  gap: var(--fs-space-3);
  list-style: none;
  padding: 0;
  margin: 0;

  @include mx.from-tablet {
    grid-template-columns: repeat(2, 1fr);
  }

  @include mx.from-desktop {
    grid-template-columns: repeat(3, 1fr);
  }
}
</style>
