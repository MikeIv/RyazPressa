<script setup lang="ts">
import { formatNewsDateShort, formatNewsTime } from '#shared/utils/formatDate'
import type { NewsItem } from '#shared/types/api'

defineProps<{
  item: NewsItem
}>()
</script>

<template>
  <article :class="$style.row">
    <NuxtLink :to="`/news/${item.slug}`" :class="$style.link">
      <div :class="$style.meta">
        <time :class="$style.time" :datetime="item.publishedAt">{{ formatNewsTime(item.publishedAt) }}</time>
        <span :class="$style.date">{{ formatNewsDateShort(item.publishedAt) }}</span>
      </div>

      <div :class="$style.content">
        <p v-if="item.category" :class="$style.category">{{ item.category }}</p>
        <h3 :class="$style.title">{{ item.title }}</h3>
        <p :class="$style.lead">{{ item.lead }}</p>
      </div>

      <div v-if="item.image" :class="$style.media">
        <img
          :src="item.image.url"
          :alt="item.image.alt"
          :class="$style.thumb"
          loading="lazy"
          decoding="async"
        />
      </div>
    </NuxtLink>
  </article>
</template>

<style module lang="scss">
@use '~/assets/styles/tools/mixins' as mx;

.row {
  min-width: 0;
  border-bottom: 1px solid var(--fs-color-border);

  &:last-child {
    border-bottom: none;
  }
}

.link {
  display: grid;
  grid-template-columns: 64px minmax(0, 1fr);
  gap: var(--fs-space-2);
  min-width: 0;
  padding-block: var(--fs-space-2);
  color: inherit;

  &:hover .title {
    color: var(--site-color-primary);
  }

  &:focus-visible {
    outline-offset: 2px;
  }

  @include mx.from-tablet {
    grid-template-columns: 72px minmax(0, 1fr) 140px;
    align-items: start;
    padding-block: var(--fs-space-3);
  }
}

.meta {
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding-top: 2px;
}

.time {
  font-size: var(--fs-text-sm);
  font-weight: var(--fs-weight-bold);
  line-height: 1.2;
  color: var(--site-color-primary);
}

.date {
  font-size: var(--fs-text-xs);
  color: var(--fs-color-text-muted);
  line-height: 1.2;
}

.content {
  min-width: 0;
}

.category {
  margin-bottom: 4px;
  font-size: var(--fs-text-xs);
  font-weight: var(--fs-weight-semibold);
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: var(--fs-color-text-muted);
}

.title {
  overflow-wrap: anywhere;
  font-size: var(--fs-text-base);
  font-weight: var(--fs-weight-semibold);
  line-height: var(--fs-leading-snug);
  transition: color 0.15s ease;

  @include mx.from-tablet {
    font-size: var(--fs-text-lg);
  }
}

.lead {
  display: none;
  margin-top: var(--fs-space-1);
  font-size: var(--fs-text-sm);
  line-height: var(--fs-leading-normal);
  color: var(--fs-color-text-muted);

  @include mx.from-tablet {
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow: hidden;
  }
}

.media {
  display: none;
  min-width: 0;
  overflow: hidden;
  border-radius: var(--site-radius-sm);
  background: var(--fs-color-surface-alt);

  @include mx.from-tablet {
    display: block;
    grid-column: 3;
    grid-row: 1;
    width: 140px;
    max-width: 100%;
  }
}

.thumb {
  display: block;
  width: 100%;
  max-width: 140px;
  height: auto;
  aspect-ratio: 5 / 3;
  object-fit: cover;
}
</style>
