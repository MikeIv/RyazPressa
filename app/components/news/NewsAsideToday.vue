<script setup lang="ts">
import { formatNewsTime } from '#shared/utils/formatDate'
import type { NewsItem } from '#shared/types/api'

withDefaults(
  defineProps<{
    items: NewsItem[]
    heading?: string
    emptyText?: string
    pending?: boolean
    error?: boolean
  }>(),
  {
    heading: 'Популярные новости',
    emptyText: 'Нет новостей для блока.',
  },
)

const { articlePath } = useNewsArticlePath()
</script>

<template>
  <aside :class="$style.aside" aria-labelledby="news-aside-heading">
    <div :class="$style.panel">
      <h2 id="news-aside-heading" :class="$style.heading">{{ heading }}</h2>

      <p v-if="pending" :class="$style.status" role="status">Загрузка…</p>
      <p v-else-if="error" :class="$style.status" role="alert">Не удалось загрузить блок.</p>
      <p v-else-if="!items.length" :class="$style.status">{{ emptyText }}</p>

      <ul v-else :class="$style.list" role="list">
        <li v-for="item in items" :key="item.id" :class="$style.item">
          <NuxtLink :to="articlePath(item.slug)" :class="$style.link">
            <span :class="$style.title">{{ item.title }}</span>
            <time :class="$style.time" :datetime="item.publishedAt">
              {{ formatNewsTime(item.publishedAt) }}
            </time>
          </NuxtLink>
        </li>
      </ul>
    </div>
  </aside>
</template>

<style module lang="scss">
@use '~/assets/styles/tools/mixins' as mx;

.aside {
  min-width: 0;
  max-width: 100%;

  @include mx.from-desktop {
    position: sticky;
    top: 120px;
    align-self: start;
  }
}

.panel {
  padding: var(--fs-space-2);
  background: var(--fs-color-surface);
  border: 1px solid var(--fs-color-border);
  border-radius: var(--site-radius-md);
}

.heading {
  margin: 0 0 var(--fs-space-2);
  padding-bottom: var(--fs-space-2);
  border-bottom: 2px solid var(--site-color-primary);
  font-family: var(--fs-font-display);
  font-size: var(--fs-text-lg);
  font-weight: var(--fs-weight-bold);
  line-height: var(--fs-leading-tight);
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: var(--site-color-primary);
}

.status {
  margin: 0;
  font-size: var(--fs-text-sm);
  color: var(--fs-color-text-muted);
}

.list {
  margin: 0;
  padding: 0;
  list-style: none;
}

.item {
  position: relative;
  padding-left: 14px;
  border-bottom: 1px solid var(--fs-color-border);

  &::before {
    position: absolute;
    top: 10px;
    left: 0;
    color: var(--site-color-accent);
    font-size: var(--fs-text-lg);
    font-weight: var(--fs-weight-bold);
    line-height: 1;
    content: '•';
  }

  &:last-child {
    border-bottom: none;
  }
}

.link {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding-block: var(--fs-space-1);
  color: inherit;
  transition: color 0.15s ease;

  &:hover .title {
    color: var(--site-color-primary);
  }

  &:focus-visible {
    outline-offset: 2px;
  }
}

.time {
  font-size: var(--fs-text-xs);
  font-weight: var(--fs-weight-medium);
  line-height: var(--fs-leading-snug);
  color: var(--fs-color-text-muted);
  text-transform: capitalize;
}

.title {
  font-size: var(--fs-text-sm);
  font-weight: var(--fs-weight-medium);
  line-height: var(--fs-leading-snug);
  overflow-wrap: anywhere;
  transition: color 0.15s ease;

  @include mx.from-desktop {
    font-size: var(--fs-text-base);
  }
}
</style>
