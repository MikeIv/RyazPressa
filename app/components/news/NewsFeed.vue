<script setup lang="ts">
import type { NewsItem } from '#shared/types/api'

const props = defineProps<{
  items: NewsItem[]
  pending?: boolean
  error?: boolean
}>()

const featured = computed(() => props.items[0] ?? null)
const rest = computed(() => props.items.slice(1))
</script>

<template>
  <section :class="$style.feed" aria-labelledby="news-feed-heading">
    <h2 id="news-feed-heading" class="visually-hidden">Лента новостей</h2>

    <p v-if="pending" :class="$style.status" role="status">Загрузка новостей…</p>
    <p v-else-if="error" :class="$style.status" role="alert">Не удалось загрузить новости.</p>
    <p v-else-if="!items.length" :class="$style.status">Новостей пока нет.</p>

    <template v-else>
      <NewsFeedFeatured v-if="featured" :item="featured" />
      <NewsFeedList v-if="rest.length" :items="rest" />
    </template>
  </section>
</template>

<style module lang="scss">
.feed {
  width: 100%;
  min-width: 0;
  max-width: 100%;
}

.status {
  padding-block: var(--fs-space-4);
  color: var(--fs-color-text-muted);
  font-size: var(--fs-text-base);
}
</style>
