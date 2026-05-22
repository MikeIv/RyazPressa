<script setup lang="ts">
import type { DistrictDetail } from '#shared/types/api'

definePageMeta({
  middleware: 'section',
  section: 'okruga',
})

const route = useRoute()
const slug = computed(() => String(route.params.slug))

const { data: district, pending, error } = useApiFetch<DistrictDetail>(
  () => `/api/districts/${slug.value}`,
)

useHead({
  title: () => district.value?.name ?? 'Округ',
})
</script>

<template>
  <div :class="$style.page">
    <p v-if="pending" :class="$style.status" role="status">Загрузка…</p>
    <p v-else-if="error" :class="$style.status" role="alert">Округ не найден.</p>

    <template v-else-if="district">
      <header :class="$style.header">
        <h1 :class="$style.title">{{ district.name }}</h1>
        <p v-if="district.description" :class="$style.desc">{{ district.description }}</p>
      </header>

      <section v-if="district.news.length" aria-labelledby="district-news-heading">
        <h2 id="district-news-heading" :class="$style.subtitle">Новости округа</h2>
        <ul :class="$style.newsList" role="list">
          <li v-for="item in district.news" :key="item.id">
            <NewsCard :item="item" />
          </li>
        </ul>
      </section>

      <NuxtLink to="/okruga" :class="$style.back">← Все округа</NuxtLink>
    </template>
  </div>
</template>

<style module lang="scss">
.page {
  padding-block: var(--fs-space-4);
}

.status {
  color: var(--fs-color-text-muted);
}

.header {
  margin-bottom: var(--fs-space-4);
}

.title {
  font-size: var(--fs-text-3xl);
  font-weight: var(--fs-weight-bold);
  margin-bottom: var(--fs-space-1);
}

.desc {
  color: var(--fs-color-text-muted);
}

.subtitle {
  font-size: var(--fs-text-xl);
  font-weight: var(--fs-weight-semibold);
  margin-bottom: var(--fs-space-3);
}

.newsList {
  display: grid;
  gap: var(--fs-space-3);
  list-style: none;
  padding: 0;
  margin: 0;
}

.back {
  display: inline-block;
  margin-top: var(--fs-space-4);
  font-size: var(--fs-text-sm);
  color: var(--site-color-primary);

  &:hover {
    text-decoration: underline;
  }
}
</style>
