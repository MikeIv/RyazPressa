<script setup lang="ts">
import type { District, ListResponse } from '#shared/types/api'

definePageMeta({
  middleware: 'section',
  section: 'okruga',
})

const { data, pending, error } = useApiFetch<ListResponse<District>>('/api/districts', {
  key: 'districts-list',
})
const districts = computed(() => data.value?.data ?? [])

useHead({ title: 'Округа' })

const breadcrumbs = useSectionPageBreadcrumbs('okruga')
</script>

<template>
  <div :class="$style.page">
    <UiBreadcrumbs :items="breadcrumbs" />
    <h1 :class="$style.title">Округа</h1>

    <p v-if="pending" :class="$style.status" role="status">Загрузка…</p>
    <p v-else-if="error" :class="$style.status" role="alert">Не удалось загрузить список округов.</p>

    <ul v-else-if="districts.length" :class="$style.list" role="list">
      <li v-for="district in districts" :key="district.slug" :class="$style.item">
        <NuxtLink :to="`/okruga/${district.slug}`" :class="$style.link">
          <span :class="$style.name">{{ district.name }}</span>
          <span v-if="district.description" :class="$style.desc">{{ district.description }}</span>
        </NuxtLink>
      </li>
    </ul>

    <p v-else :class="$style.status">Округов пока нет.</p>
  </div>
</template>

<style module lang="scss">
@use '~/assets/styles/tools/mixins' as mx;

.page {
  min-width: 0;
  padding-block: var(--fs-space-4);
}

.title {
  font-size: var(--fs-text-3xl);
  font-weight: var(--fs-weight-bold);
  margin-bottom: var(--fs-space-4);
}

.status {
  color: var(--fs-color-text-muted);
}

.list {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: 1px;
  list-style: none;
  padding: 0;
  margin: 0;
  overflow: hidden;
  background: var(--fs-color-border);
  border: 1px solid var(--fs-color-border);
  border-radius: var(--site-radius-md);

  @include mx.from-tablet {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @include mx.from-desktop {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}

.item {
  min-width: 0;
  background: var(--site-color-background);
}

.link {
  display: block;
  height: 100%;
  padding: var(--fs-space-2) var(--fs-space-3);
  transition: background 0.15s ease;

  &:hover {
    background: var(--fs-color-surface);
  }
}

.name {
  display: block;
  font-weight: var(--fs-weight-semibold);
  color: var(--site-color-primary);
  margin-bottom: 4px;
}

.desc {
  font-size: var(--fs-text-sm);
  color: var(--fs-color-text-muted);
}
</style>
