<script setup lang="ts">
import { formatDate } from '#shared/utils/formatDate'
import type { Article } from '#shared/types/api'

const route = useRoute()
const slug = computed(() => String(route.params.slug))

const { data: article, pending, error } = useApiFetch<Article>(() => `/api/news/${slug.value}`)

const breadcrumbs = useArticleBreadcrumbs(
  () => article.value?.title ?? 'Статья',
  () => article.value?.category,
)

useHead({
  title: () => article.value?.title ?? 'Статья',
})
</script>

<template>
  <article :class="$style.page">
    <UiBreadcrumbs :items="breadcrumbs" />
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

      <!-- eslint-disable-next-line vue/no-v-html -- санитизировано в normalizePostDetailResponse -->
      <div :class="$style.content" v-html="article.content" />

      <ul v-if="article.tags?.length" :class="$style.tags" aria-label="Теги">
        <li v-for="(tag, index) in article.tags" :key="`${tag}-${index}`" :class="$style.tag">
          {{ tag }}
        </li>
      </ul>

      <NuxtLink to="/" :class="$style.back">← Все новости</NuxtLink>
    </template>
  </article>
</template>

<style module lang="scss">
@use '~/assets/styles/tools/cms-content' as cms;

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
  height: auto;
  object-fit: cover;
  border-radius: var(--site-radius-md);
  margin-bottom: var(--fs-space-3);
}

.content {
  font-size: var(--fs-text-base);
  line-height: var(--fs-leading-relaxed);

  @include cms.article-body-content;
}

.tags {
  display: flex;
  flex-wrap: wrap;
  gap: var(--fs-space-2);
  margin-top: var(--fs-space-4);
  padding-top: var(--fs-space-3);
  border-top: 1px solid var(--fs-color-border);
  list-style: none;
  padding-inline: 0;
}

.tag {
  font-size: var(--fs-text-xs);
  font-weight: var(--fs-weight-medium);
  line-height: 1.3;
  padding: 6px 14px;
  border-radius: 999px;
  color: var(--site-color-primary);
  background: color-mix(in srgb, var(--site-color-primary) 10%, var(--site-color-background));
  border: 1px solid color-mix(in srgb, var(--site-color-primary) 22%, var(--fs-color-border));
  transition:
    background-color 0.2s ease,
    border-color 0.2s ease;

  &:hover {
    background: color-mix(in srgb, var(--site-color-primary) 16%, var(--site-color-background));
    border-color: color-mix(in srgb, var(--site-color-primary) 36%, var(--fs-color-border));
  }
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
