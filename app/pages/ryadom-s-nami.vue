<script setup lang="ts">
import type { NearUsSection } from '#shared/types/api'

definePageMeta({
  middleware: 'section',
  section: 'ryadomSNami',
})

const { data: section, pending, error } = useApiFetch<NearUsSection>('/api/near-us')

useHead({
  title: () => section.value?.title ?? 'Рядом с нами',
})
</script>

<template>
  <div :class="[$style.page, 'container']">
    <p v-if="pending" :class="$style.status" role="status">Загрузка…</p>
    <p v-else-if="error" :class="$style.status" role="alert">Не удалось загрузить раздел.</p>

    <article v-else-if="section">
      <h1 :class="$style.title">{{ section.title }}</h1>
      <!-- eslint-disable-next-line vue/no-v-html -- HTML из CMS/API -->
      <div :class="$style.content" v-html="section.content" />
    </article>
  </div>
</template>

<style module lang="scss">
.page {
  padding-block: var(--fs-space-4);
  max-width: 720px;
}

.status {
  color: var(--fs-color-text-muted);
}

.title {
  font-size: var(--fs-text-3xl);
  font-weight: var(--fs-weight-bold);
  margin-bottom: var(--fs-space-3);
}

.content {
  font-size: var(--fs-text-base);
  line-height: var(--fs-leading-relaxed);

  :global(p) {
    margin-bottom: var(--fs-space-2);
  }
}
</style>
