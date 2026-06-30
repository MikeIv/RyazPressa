<script setup lang="ts">
import { useSectionDetailBreadcrumbs } from '~/composables/useBreadcrumbs'
import type { District, DistrictDetail, ListResponse } from '#shared/types/api'

definePageMeta({
  middleware: 'section',
  section: 'okruga',
})

const route = useRoute()
const slug = computed(() => String(route.params.slug))

const { data: districtsList } = useApiFetch<ListResponse<District>>('/api/districts', {
  key: 'districts-list',
})

const { data: districtRaw, pending, error } = useApiFetch<DistrictDetail>(
  () => `/api/districts/${slug.value}`,
  { key: () => `district-detail-${slug.value}` },
)

const catalogItem = computed(() =>
  districtsList.value?.data.find((item) => item.slug === slug.value),
)

const district = computed(() => {
  if (!districtRaw.value) return null

  const info = catalogItem.value
  if (!info) return districtRaw.value

  return {
    ...districtRaw.value,
    name: info.name,
    description: info.description ?? districtRaw.value.description,
  }
})

const isUnknownDistrict = computed(
  () => Boolean(districtsList.value && !catalogItem.value && !pending.value && !error.value),
)

useHead({
  title: () => district.value?.name ?? 'Округ',
})

const breadcrumbs = useSectionDetailBreadcrumbs('okruga', () => district.value?.name ?? 'Округ')
</script>

<template>
  <div :class="$style.page">
    <UiBreadcrumbs :items="breadcrumbs" />
    <p v-if="pending" :class="$style.status" role="status">Загрузка…</p>
    <p v-else-if="error || isUnknownDistrict" :class="$style.status" role="alert">Округ не найден.</p>

    <template v-else-if="district">
      <header :class="$style.header">
        <h1 :class="$style.title">{{ district.name }}</h1>
        <p v-if="district.description" :class="$style.desc">{{ district.description }}</p>
      </header>

      <section v-if="district.news.length" aria-labelledby="district-news-heading">
        <h2 id="district-news-heading" :class="$style.subtitle">Новости округа</h2>
        <ul :class="$style.newsList" role="list">
          <li v-for="item in district.news" :key="item.id" :class="$style.newsItem">
            <NewsCard :item="item" />
          </li>
        </ul>
      </section>
      <p v-else :class="$style.status">Новостей пока нет.</p>

      <NuxtLink to="/okruga" :class="$style.back">← Все округа</NuxtLink>
    </template>
  </div>
</template>

<style module lang="scss">
@use '~/assets/styles/tools/mixins' as mx;

.page {
  min-width: 0;
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
  grid-template-columns: minmax(0, 1fr);
  gap: var(--fs-space-3);
  list-style: none;
  padding: 0;
  margin: 0;

  @include mx.from-tablet {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @include mx.from-desktop {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}

.newsItem {
  min-width: 0;
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
