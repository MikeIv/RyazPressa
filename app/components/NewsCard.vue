<script setup lang="ts">
import { formatDate } from '#shared/utils/formatDate'
import type { NewsItem } from '#shared/types/api'

defineProps<{
  item: NewsItem
}>()

const { articlePath } = useNewsArticlePath()
</script>

<template>
  <article :class="$style.card">
    <NuxtLink :to="articlePath(item.slug)" :class="$style.link">
      <img
        v-if="item.image"
        :src="item.image.url"
        :alt="item.image.alt"
        :class="$style.image"
        loading="lazy"
        width="400"
        height="225"
      />
      <div :class="$style.body">
        <p v-if="item.category" :class="$style.category">{{ item.category }}</p>
        <h2 :class="$style.title">{{ item.title }}</h2>
        <p :class="$style.lead">{{ item.lead }}</p>
        <time :class="$style.date" :datetime="item.publishedAt">{{ formatDate(item.publishedAt) }}</time>
      </div>
    </NuxtLink>
  </article>
</template>

<style module lang="scss">
.card {
  border: 1px solid var(--fs-color-border);
  border-radius: var(--site-radius-md);
  overflow: hidden;
  background: var(--fs-color-bg);
  transition: box-shadow 0.2s ease;

  &:hover {
    box-shadow: 0 4px 16px rgb(0 0 0 / 8%);
  }
}

.link {
  display: block;
  color: inherit;

  &:focus-visible {
    outline-offset: -2px;
  }
}

.image {
  width: 100%;
  aspect-ratio: 16 / 9;
  object-fit: cover;
}

.body {
  padding: var(--fs-space-2);
}

.category {
  font-size: var(--fs-text-xs);
  font-weight: var(--fs-weight-semibold);
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: var(--site-color-primary);
  margin-bottom: var(--fs-space-1);
}

.title {
  font-size: var(--fs-text-lg);
  font-weight: var(--fs-weight-semibold);
  line-height: var(--fs-leading-snug);
  margin-bottom: var(--fs-space-1);
}

.lead {
  font-size: var(--fs-text-sm);
  color: var(--fs-color-text-muted);
  line-height: var(--fs-leading-normal);
  margin-bottom: var(--fs-space-1);
}

.date {
  font-size: var(--fs-text-xs);
  color: var(--fs-color-text-muted);
}
</style>
