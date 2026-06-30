<script setup lang="ts">
import { useSectionPageBreadcrumbs } from '~/composables/useBreadcrumbs'
import { formatDate } from '#shared/utils/formatDate'
import type { ListResponse, Project } from '#shared/types/api'

definePageMeta({
  middleware: 'section',
  section: 'projects',
})

const { data, pending, error } = useApiFetch<ListResponse<Project>>('/api/projects')
const projects = computed(() => data.value?.data ?? [])

useHead({ title: 'Проекты' })

const breadcrumbs = useSectionPageBreadcrumbs('projects')
</script>

<template>
  <div :class="$style.page">
    <UiBreadcrumbs :items="breadcrumbs" />
    <h1 :class="$style.title">Проекты</h1>

    <p v-if="pending" :class="$style.status" role="status">Загрузка…</p>
    <p v-else-if="error" :class="$style.status" role="alert">Не удалось загрузить проекты.</p>

    <ul v-else-if="projects.length" :class="$style.list" role="list">
      <li v-for="project in projects" :key="project.slug">
        <NuxtLink :to="`/projects/${project.slug}`" :class="$style.card">
          <img
            v-if="project.image"
            :src="project.image.url"
            :alt="project.image.alt"
            :class="$style.image"
            loading="lazy"
            width="400"
            height="225"
          />
          <div :class="$style.body">
            <h2 :class="$style.cardTitle">{{ project.title }}</h2>
            <p :class="$style.lead">{{ project.lead }}</p>
            <time :datetime="project.publishedAt">{{ formatDate(project.publishedAt) }}</time>
          </div>
        </NuxtLink>
      </li>
    </ul>

    <p v-else :class="$style.status">Проектов пока нет.</p>
  </div>
</template>

<style module lang="scss">
@use '~/assets/styles/tools/mixins' as mx;

.page {
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
  gap: var(--fs-space-3);
  list-style: none;
  padding: 0;
  margin: 0;

  @include mx.from-tablet {
    grid-template-columns: repeat(2, 1fr);
  }
}

.card {
  display: block;
  border: 1px solid var(--fs-color-border);
  border-radius: var(--site-radius-md);
  overflow: hidden;
  color: inherit;
  transition: box-shadow 0.2s ease;

  &:hover {
    box-shadow: 0 4px 16px rgb(0 0 0 / 8%);
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

.cardTitle {
  font-size: var(--fs-text-lg);
  font-weight: var(--fs-weight-semibold);
  margin-bottom: var(--fs-space-1);
}

.lead {
  font-size: var(--fs-text-sm);
  color: var(--fs-color-text-muted);
  margin-bottom: var(--fs-space-1);
}

time {
  font-size: var(--fs-text-xs);
  color: var(--fs-color-text-muted);
}
</style>
