<script setup lang="ts">
import type { NewsItem } from '#shared/types/api'

defineProps<{
  items: NewsItem[]
}>()
</script>

<template>
  <ul :class="$style.list" role="list">
    <li v-for="item in items" :key="item.id">
      <NewsFeedRow :item="item" />
    </li>
  </ul>
</template>

<style module lang="scss">
.list {
  margin: 0;
  padding: 0;
  list-style: none;
}
</style>
