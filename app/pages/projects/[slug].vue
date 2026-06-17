<script setup lang="ts">
import { formatDate } from '#shared/utils/formatDate'
import type { Article } from '#shared/types/api'

definePageMeta({
  middleware: 'section',
  section: 'projects',
})

const route = useRoute()
const slug = computed(() => String(route.params.slug))

const { data: article, pending, error } = useApiFetch<Article>(() => `/api/news/${slug.value}`)

useHead({
  title: () => article.value?.title ?? 'Проект',
})
</script>

<template>
  <article :class="$style.page">
    <p v-if="pending" :class="$style.status" role="status">Загрузка…</p>
    <p v-else-if="error" :class="$style.status" role="alert">Проект не найден.</p>

    <template v-else-if="article">
      <header :class="$style.header">
        <h1 :class="$style.title">{{ article.title }}</h1>
        <p :class="$style.meta">
          <time :datetime="article.publishedAt">{{ formatDate(article.publishedAt) }}</time>
        </p>
        <p :class="$style.lead">{{ article.lead }}</p>
      </header>

      <img
        v-if="article.image"
        :src="article.image.url"
        :alt="article.image.alt"
        :class="$style.image"
        width="800"
        height="450"
      />

      <!-- eslint-disable-next-line vue/no-v-html -- HTML из CMS/API -->
      <div :class="$style.content" v-html="article.content" />

      <NuxtLink to="/projects" :class="$style.back">← Все проекты</NuxtLink>
    </template>
  </article>
</template>

<style module lang="scss">
.page {
  padding-block: var(--fs-space-4);
  max-width: 720px;
}

.status {
  color: var(--fs-color-text-muted);
}

.header {
  margin-bottom: var(--fs-space-3);
}

.title {
  font-size: var(--fs-text-3xl);
  font-weight: var(--fs-weight-bold);
  margin-bottom: var(--fs-space-1);
}

.meta {
  font-size: var(--fs-text-sm);
  color: var(--fs-color-text-muted);
  margin-bottom: var(--fs-space-2);
}

.lead {
  font-size: var(--fs-text-lg);
  color: var(--fs-color-text-muted);
}

.image {
  width: 100%;
  border-radius: var(--site-radius-md);
  margin-bottom: var(--fs-space-3);
}

.content {
  font-size: var(--fs-text-base);
  line-height: var(--fs-leading-relaxed);

  :global(p) {
    margin-bottom: var(--fs-space-2);
  }
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
