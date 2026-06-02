<script setup lang="ts">
import { formatDate } from '#shared/utils/formatDate'
import type { Article } from '#shared/types/api'

const route = useRoute()
const slug = computed(() => String(route.params.slug))

const { data: article, pending, error } = useApiFetch<Article>(() => `/api/news/${slug.value}`)

useHead({
  title: () => article.value?.title ?? 'Статья',
})
</script>

<template>
  <article :class="$style.page">
    <p v-if="pending" :class="$style.status" role="status">Загрузка статьи…</p>
    <p v-else-if="error" :class="$style.status" role="alert">Статья не найдена.</p>

    <template v-else-if="article">
      <header :class="$style.header">
        <p v-if="article.category" :class="$style.category">{{ article.category }}</p>
        <h1 :class="$style.title">{{ article.title }}</h1>
        <p :class="$style.meta">
          <time :datetime="article.publishedAt">{{ formatDate(article.publishedAt) }}</time>
          <span v-if="article.author"> · {{ article.author }}</span>
        </p>
      </header>

      <img
        v-if="article.image"
        :src="article.image.url"
        :alt="article.image.alt"
        :class="$style.image"
        width="800"
        height="450"
      />

      <!-- eslint-disable-next-line vue/no-v-html -- HTML приходит из CMS/API бэкенда -->
      <div :class="$style.content" v-html="article.content" />

      <ul v-if="article.tags?.length" :class="$style.tags" aria-label="Теги">
        <li v-for="tag in article.tags" :key="tag" :class="$style.tag">{{ tag }}</li>
      </ul>

      <NuxtLink to="/" :class="$style.back">← Все новости</NuxtLink>
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

.category {
  font-size: var(--fs-text-sm);
  font-weight: var(--fs-weight-semibold);
  text-transform: uppercase;
  color: var(--site-color-primary);
  margin-bottom: var(--fs-space-1);
}

.title {
  font-size: var(--fs-text-3xl);
  font-weight: var(--fs-weight-bold);
  line-height: var(--fs-leading-tight);
  margin-bottom: var(--fs-space-2);
}

.meta {
  font-size: var(--fs-text-sm);
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

.tags {
  display: flex;
  flex-wrap: wrap;
  gap: var(--fs-space-1);
  margin-top: var(--fs-space-4);
  list-style: none;
  padding: 0;
}

.tag {
  font-size: var(--fs-text-xs);
  padding: 4px 10px;
  background: var(--fs-color-surface);
  border-radius: var(--site-radius-sm);
  color: var(--fs-color-text-muted);
}

.back {
  display: inline-block;
  margin-top: var(--fs-space-4);
  font-size: var(--fs-text-sm);
  font-weight: var(--fs-weight-medium);
  color: var(--site-color-primary);

  &:hover {
    text-decoration: underline;
  }
}
</style>
