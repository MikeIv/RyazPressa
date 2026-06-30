<script setup lang="ts">
import { useSectionPageBreadcrumbs } from '~/composables/useBreadcrumbs'
import type { NewsItem, PaginatedResponse } from '#shared/types/api'
import { RYADOM_S_NAMI_SEGMENT } from '#shared/utils/newsArticlePath'

definePageMeta({
  middleware: 'section',
  section: 'ryadomSNami',
})

const { data, pending, error } = useApiFetch<PaginatedResponse<NewsItem>>('/api/news', {
  query: { category: RYADOM_S_NAMI_SEGMENT, perPage: 24 },
  key: 'ryadom-s-nami-news',
})

const articles = computed(() => data.value?.data ?? [])

useHead({ title: 'Рядом с нами' })

const breadcrumbs = useSectionPageBreadcrumbs('ryadomSNami')
</script>

<template>
  <div :class="$style.page">
    <UiBreadcrumbs :items="breadcrumbs" />
    <h1 :class="$style.title">Рядом с нами</h1>

    <p v-if="pending" :class="$style.status" role="status">Загрузка…</p>
    <p v-else-if="error" :class="$style.status" role="alert">Не удалось загрузить материалы.</p>

    <ul v-else-if="articles.length" :class="$style.list" role="list">
      <li v-for="item in articles" :key="item.id">
        <NewsCard :item="item" />
      </li>
    </ul>

    <p v-else :class="$style.status">Материалов в разделе пока нет.</p>
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
  margin-bottom: var(--fs-space-4);
}

.status {
  color: var(--fs-color-text-muted);
}

.list {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: var(--fs-space-3);
  list-style: none;
  padding: 0;
  margin: 0;

  @include mx.from-tablet {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @include mx.from-desktop {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  > li {
    min-width: 0;
  }
}
</style>
