<script setup lang="ts">
import { formatDate } from '#shared/utils/formatDate'
import { formatFileSize } from '#shared/utils/formatFileSize'
import type { DocumentItem, PaginatedResponse } from '#shared/types/api'

definePageMeta({
  middleware: 'section',
  section: 'documents',
})

const { data, pending, error } = useApiFetch<PaginatedResponse<DocumentItem>>('/api/documents')

const documents = computed(() => {
  const list = data.value?.data ?? []
  return list.map((doc) => {
    const size = formatFileSize(doc.fileSize)
    return { ...doc, sizeLabel: size ? ` · ${size}` : '' }
  })
})

useHead({ title: 'Документы' })
</script>

<template>
  <div :class="$style.page">
    <h1 :class="$style.title">Документы</h1>

    <p v-if="pending" :class="$style.status" role="status">Загрузка…</p>
    <p v-else-if="error" :class="$style.status" role="alert">Не удалось загрузить документы.</p>

    <ul v-else-if="documents.length" :class="$style.list" role="list">
      <li v-for="doc in documents" :key="doc.id">
        <a :href="doc.fileUrl" :class="$style.link" target="_blank" rel="noopener noreferrer">
          <span :class="$style.docTitle">{{ doc.title }}</span>
          <span :class="$style.meta">
            <time :datetime="doc.publishedAt">{{ formatDate(doc.publishedAt) }}</time>{{ doc.sizeLabel }}
          </span>
        </a>
      </li>
    </ul>

    <p v-else :class="$style.status">Документов пока нет.</p>
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

.docTitle {
  display: block;
  font-weight: var(--fs-weight-medium);
  margin-bottom: 4px;
  color: var(--site-color-primary);
}

.meta {
  font-size: var(--fs-text-sm);
  color: var(--fs-color-text-muted);
}
</style>
