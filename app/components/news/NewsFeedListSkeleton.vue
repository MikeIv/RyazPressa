<script setup lang="ts">
withDefaults(
  defineProps<{
    count?: number
  }>(),
  {
    count: 3,
  },
)
</script>

<template>
  <ul :class="$style.list" aria-hidden="true">
    <li v-for="index in count" :key="index" :class="$style.item">
      <NewsFeedRowSkeleton />
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
