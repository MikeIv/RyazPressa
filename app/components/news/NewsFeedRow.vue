<script setup lang="ts">
import { NEWS_PLACEHOLDER_ALT, NEWS_PLACEHOLDER_IMAGE } from '#shared/constants/newsMedia'
import { formatNewsDayMonth, formatNewsTime } from '#shared/utils/formatDate'
import type { NewsItem } from '#shared/types/api'

defineProps<{
  item: NewsItem
}>()

const { articlePath } = useNewsArticlePath()
</script>

<template>
  <article :class="$style.row">
    <NuxtLink :to="articlePath(item.slug)" :class="$style.link">
      <div :class="$style.media">
        <img
          :src="item.image?.url ?? NEWS_PLACEHOLDER_IMAGE"
          :alt="item.image?.alt?.trim() || NEWS_PLACEHOLDER_ALT"
          :class="$style.thumb"
          loading="lazy"
          decoding="async"
        />
      </div>

      <div :class="$style.content">
        <h3 :class="$style.title">{{ item.title }}</h3>
        <time :class="$style.date" :datetime="item.publishedAt">
          {{ formatNewsDayMonth(item.publishedAt) }}, {{ formatNewsTime(item.publishedAt) }}
        </time>
      </div>
    </NuxtLink>
  </article>
</template>

<style module lang="scss">
@use '~/assets/styles/tools/mixins' as mx;

$row-thumb-width-mobile: 96px;
$row-thumb-height-mobile: 64px;
$row-thumb-width-desktop: 168px;
$row-thumb-height-desktop: 112px;

.row {
  min-width: 0;
  border-bottom: 1px solid var(--fs-color-border);

  &:last-child {
    border-bottom: none;
  }

  @include mx.from-desktop {
    border-bottom: none;
  }
}

.link {
  display: grid;
  grid-template-columns: $row-thumb-width-mobile minmax(0, 1fr);
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
    grid-template-columns: $row-thumb-width-desktop minmax(0, 1fr);
    gap: var(--fs-space-3);
    padding-block: var(--fs-space-3);
  }
}

.media {
  flex-shrink: 0;
  width: $row-thumb-width-mobile;
  height: $row-thumb-height-mobile;
  overflow: hidden;
  border-radius: var(--site-radius-sm);
  background: var(--fs-color-surface-alt);

  @include mx.from-tablet {
    width: $row-thumb-width-desktop;
    height: $row-thumb-height-desktop;
  }
}

.thumb {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.content {
  display: flex;
  flex-direction: column;
  gap: var(--fs-space-1);
  min-width: 0;
}

.title {
  overflow-wrap: anywhere;
  margin: 0;
  font-size: var(--fs-text-base);
  font-weight: var(--fs-weight-semibold);
  line-height: var(--fs-leading-snug);
  transition: color 0.15s ease;
}

.date {
  font-size: var(--fs-text-sm);
  line-height: var(--fs-leading-snug);
  color: var(--fs-color-text-muted);
  text-transform: capitalize;
}
</style>
