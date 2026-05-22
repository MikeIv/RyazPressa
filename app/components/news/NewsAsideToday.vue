<script setup lang="ts">
import { formatNewsTime } from '#shared/utils/formatDate'
import { groupNewsByDay } from '#shared/utils/groupNewsByDay'
import type { NewsItem } from '#shared/types/api'

const props = defineProps<{
  items: NewsItem[]
  pending?: boolean
  error?: boolean
}>()

const dayGroups = computed(() => groupNewsByDay(props.items))
</script>

<template>
  <aside :class="$style.aside" aria-labelledby="news-aside-heading">
    <div :class="$style.panel">
      <h2 id="news-aside-heading" :class="$style.heading">Главное сегодня</h2>

      <p v-if="pending" :class="$style.status" role="status">Загрузка…</p>
      <p v-else-if="error" :class="$style.status" role="alert">Не удалось загрузить блок.</p>
      <p v-else-if="!items.length" :class="$style.status">Нет новостей за сегодня и вчера.</p>

      <div v-else :class="$style.groups">
        <section
          v-for="group in dayGroups"
          :key="group.dayKey"
          :class="$style.dayGroup"
          :aria-label="`Новости за ${group.label}`"
        >
          <h3 :class="$style.dayHeading">{{ group.label }}</h3>
          <ul :class="$style.list" role="list">
            <li v-for="item in group.items" :key="item.id" :class="$style.item">
              <NuxtLink :to="`/news/${item.slug}`" :class="$style.link">
                <time :class="$style.time" :datetime="item.publishedAt">
                  {{ formatNewsTime(item.publishedAt) }}
                </time>
                <span :class="$style.title">{{ item.title }}</span>
              </NuxtLink>
            </li>
          </ul>
        </section>
      </div>
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

.groups {
  display: flex;
  flex-direction: column;
  gap: var(--fs-space-2);
}

.dayGroup {
  padding-top: var(--fs-space-2);
  border-top: 1px solid var(--fs-color-border);

  &:first-child {
    padding-top: 0;
    border-top: none;
  }
}

.dayHeading {
  margin: 0 0 var(--fs-space-1);
  font-size: var(--fs-text-sm);
  font-weight: var(--fs-weight-semibold);
  line-height: var(--fs-leading-snug);
  color: var(--fs-color-text-muted);
  text-transform: capitalize;
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
    top: 12px;
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
  display: grid;
  grid-template-columns: 52px minmax(0, 1fr);
  gap: var(--fs-space-1);
  padding-block: 10px;
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
  font-size: var(--fs-text-sm);
  font-weight: var(--fs-weight-bold);
  line-height: var(--fs-leading-snug);
  color: var(--site-color-primary);
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
