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
</script>

<template>
  <div :class="$style.page">
    <h1 :class="$style.title">Округа</h1>

    <p v-if="pending" :class="$style.status" role="status">Загрузка…</p>
    <p v-else-if="error" :class="$style.status" role="alert">Не удалось загрузить список округов.</p>

    <ul v-else-if="districts.length" :class="$style.list" role="list">
      <li v-for="district in districts" :key="district.slug">
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
.page {
  padding-block: var(--fs-space-4);
  max-width: 720px;
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
  list-style: none;
  padding: 0;
  margin: 0;
  border: 1px solid var(--fs-color-border);
  border-radius: var(--site-radius-md);
  overflow: hidden;
}

.link {
  display: block;
  padding: var(--fs-space-2) var(--fs-space-3);
  border-bottom: 1px solid var(--fs-color-border);
  transition: background 0.15s ease;

  &:last-child {
    border-bottom: none;
  }

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
