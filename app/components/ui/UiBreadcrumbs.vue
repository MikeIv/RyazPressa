<script setup lang="ts">
import type { BreadcrumbItem } from '#shared/types/breadcrumb'

defineProps<{
  items: readonly BreadcrumbItem[]
}>()
</script>

<template>
  <nav v-if="items.length > 1" :class="$style.root" aria-label="Хлебные крошки">
    <ol :class="$style.list">
      <li v-for="(item, index) in items" :key="`${item.label}-${index}`" :class="$style.item">
        <span v-if="index > 0" :class="$style.sep" aria-hidden="true">/</span>
        <NuxtLink v-if="item.to" :to="item.to" :class="$style.link">{{ item.label }}</NuxtLink>
        <span v-else :class="$style.current" aria-current="page">{{ item.label }}</span>
      </li>
    </ol>
  </nav>
</template>

<style module lang="scss">
.root {
  margin-bottom: var(--fs-space-3);
}

.list {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.35em;
  margin: 0;
  padding: 0;
  list-style: none;
  font-size: var(--fs-text-sm);
  line-height: var(--fs-leading-normal);
}

.item {
  display: inline-flex;
  align-items: center;
  gap: 0.35em;
  min-width: 0;
}

.sep {
  color: var(--fs-color-text-muted);
  user-select: none;
}

.link {
  color: var(--site-color-primary);
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }

  &:focus-visible {
    outline: 2px solid var(--site-color-primary);
    outline-offset: 2px;
    border-radius: 2px;
  }
}

.current {
  color: var(--fs-color-text-muted);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: min(100%, 48ch);
}
</style>
