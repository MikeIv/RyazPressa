<script setup lang="ts">
import { formatNewsDayMonth, formatNewsTime } from '#shared/utils/formatDate'
import type { NewsItem } from '#shared/types/api'

const props = defineProps<{
  item: NewsItem
}>()

const { articlePath } = useNewsArticlePath()
const { excerpt } = useNewsExcerpt(() => props.item)
</script>

<template>
  <article :class="$style.featured">
    <NuxtLink :to="articlePath(item.slug)" :class="$style.link">
      <div v-if="item.image" :class="$style.media">
        <img
          :src="item.image.url"
          :alt="item.image.alt"
          :class="$style.image"
          decoding="async"
          fetchpriority="high"
        />
      </div>
      <div :class="$style.body">
        <p v-if="item.category" :class="$style.category">{{ item.category }}</p>
        <h2 :class="$style.title">{{ item.title }}</h2>
        <p v-if="excerpt" :class="$style.lead">{{ excerpt }}</p>
        <time :class="$style.date" :datetime="item.publishedAt">
          {{ formatNewsDayMonth(item.publishedAt) }}, {{ formatNewsTime(item.publishedAt) }}
        </time>
      </div>
    </NuxtLink>
  </article>
</template>

<style module lang="scss">
@use '~/assets/styles/tools/mixins' as mx;

.featured {
  min-width: 0;
}

.link {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: var(--fs-space-2);
  min-width: 0;
  padding: var(--fs-space-2);
  color: inherit;
  background: var(--fs-color-surface);
  border-radius: var(--site-radius-md);

  &:focus-visible {
    outline-offset: 4px;
  }

  @include mx.from-tablet {
    grid-template-columns: minmax(0, 1.2fr) minmax(0, 1fr);
    gap: var(--fs-space-3);
    padding: var(--fs-space-3);
    align-items: stretch;
  }
}

.media {
  min-width: 0;
  max-width: 100%;
  overflow: hidden;
  border-radius: var(--site-radius-md);
  background: var(--fs-color-surface-alt);
}

.image {
  display: block;
  width: 100%;
  max-width: 100%;
  height: auto;
  aspect-ratio: 16 / 9;
  object-fit: cover;
  vertical-align: middle;
}

.body {
  display: flex;
  flex-direction: column;
  gap: var(--fs-space-1);
  min-width: 0;
  min-height: 100%;
}

.category {
  font-size: var(--fs-text-xs);
  font-weight: var(--fs-weight-semibold);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--site-color-primary);
}

.title {
  overflow-wrap: anywhere;
  font-family: var(--fs-font-display);
  font-size: var(--fs-text-2xl);
  font-weight: var(--fs-weight-bold);
  line-height: var(--fs-leading-tight);

  @include mx.from-tablet {
    font-size: var(--fs-text-3xl);
  }
}

.lead {
  display: -webkit-box;
  margin: 0;
  overflow: hidden;
  font-size: var(--fs-text-base);
  line-height: var(--fs-leading-normal);
  color: var(--fs-color-text-muted);
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 4;
}

.date {
  margin: auto 0 0;
  padding-top: var(--fs-space-2);
  font-size: var(--fs-text-sm);
  color: var(--fs-color-text-muted);
  text-transform: capitalize;
}
</style>
