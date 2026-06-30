<script setup lang="ts">
import { formatDate } from '#shared/utils/formatDate'
import type { GalleryItem, PaginatedResponse } from '#shared/types/api'

definePageMeta({
  middleware: 'section',
  section: 'gallery',
})

const { data, pending, error } = useApiFetch<PaginatedResponse<GalleryItem>>('/api/gallery', {
  query: { perPage: 24 },
})

const items = computed(() => data.value?.data ?? [])

useHead({ title: 'Фотогалерея' })

const breadcrumbs = useSectionPageBreadcrumbs('gallery')
</script>

<template>
  <div :class="$style.page">
    <UiBreadcrumbs :items="breadcrumbs" />
    <h1 :class="$style.title">Фотогалерея</h1>

    <p v-if="pending" :class="$style.status" role="status">Загрузка…</p>
    <p v-else-if="error" :class="$style.status" role="alert">Не удалось загрузить галерею.</p>

    <ul v-else-if="items.length" :class="$style.grid" role="list">
      <li v-for="item in items" :key="item.id" :class="$style.item">
        <figure :class="$style.figure">
          <img
            :src="item.image.url"
            :alt="item.image.alt"
            :class="$style.image"
            loading="lazy"
            width="400"
            height="300"
          />
          <figcaption :class="$style.caption">
            <span :class="$style.itemTitle">{{ item.title }}</span>
            <time :datetime="item.publishedAt">{{ formatDate(item.publishedAt) }}</time>
          </figcaption>
        </figure>
      </li>
    </ul>

    <p v-else :class="$style.status">Фотографий пока нет.</p>
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

.grid {
  display: grid;
  gap: var(--fs-space-3);
  list-style: none;
  padding: 0;
  margin: 0;
  grid-template-columns: repeat(2, 1fr);

  @include mx.from-tablet {
    grid-template-columns: repeat(3, 1fr);
  }

  @include mx.from-desktop {
    grid-template-columns: repeat(4, 1fr);
  }
}

.figure {
  margin: 0;
  border-radius: var(--site-radius-md);
  overflow: hidden;
  border: 1px solid var(--fs-color-border);
}

.image {
  width: 100%;
  aspect-ratio: 4 / 3;
  object-fit: cover;
}

.caption {
  padding: var(--fs-space-1) var(--fs-space-2);
  font-size: var(--fs-text-xs);
  color: var(--fs-color-text-muted);
}

.itemTitle {
  display: block;
  font-weight: var(--fs-weight-medium);
  color: var(--fs-color-text);
  margin-bottom: 2px;
}
</style>
