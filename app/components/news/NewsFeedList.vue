<script setup lang="ts">
import type { NewsItem } from '#shared/types/api'

defineProps<{
  items: NewsItem[]
}>()
</script>

<template>
  <ul :class="$style.list" role="list">
    <li v-for="item in items" :key="item.id" :class="$style.item">
      <NewsFeedRow :item="item" />
    </li>
  </ul>
</template>

<style module lang="scss">
@use '~/assets/styles/tools/mixins' as mx;

.list {
  margin: 0;
  padding: 0;
  list-style: none;

  @include mx.from-desktop {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: var(--fs-space-4) var(--fs-space-3);
  }
}

.item {
  min-width: 0;
}
</style>
