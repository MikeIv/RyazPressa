<script setup lang="ts">
import { useSectionPageBreadcrumbs } from '~/composables/useBreadcrumbs'
import { formatDate } from '#shared/utils/formatDate'
import { formatFileSize } from '#shared/utils/formatFileSize'
import type { DocumentItem, PaginatedResponse } from '#shared/types/api'

definePageMeta({
  middleware: 'section',
  section: 'documents',
})

const { data, pending, error } = useApiFetch<PaginatedResponse<DocumentItem>>('/api/documents')

const documents = computed(() =>
  (data.value?.data ?? []).map((doc) => ({
    ...doc,
    sizeLabel: formatFileSize(doc.fileSize),
  })),
)

useHead({ title: 'Документы' })

const breadcrumbs = useSectionPageBreadcrumbs('documents')
</script>

<template>
  <div :class="$style.page">
    <UiBreadcrumbs :items="breadcrumbs" />
    <h1 :class="$style.title">Документы</h1>

    <p v-if="pending" :class="$style.status" role="status">Загрузка…</p>
    <p v-else-if="error" :class="$style.status" role="alert">Не удалось загрузить документы.</p>

    <ul v-else-if="documents.length" :class="$style.grid" role="list">
      <li v-for="doc in documents" :key="doc.id" :class="$style.item">
        <article :class="$style.card">
          <div :class="$style.cardTop">
            <div :class="$style.docIcon" aria-hidden="true">
              <svg :class="$style.docIconSvg" viewBox="0 0 24 24" focusable="false">
                <path
                  fill="currentColor"
                  d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zm-1 2 5 5h-5V4zM8 12h8v2H8v-2zm0 4h5v2H8v-2z"
                />
              </svg>
            </div>

            <a
              :href="doc.fileUrl"
              :class="$style.downloadBtn"
              :download="doc.fileName"
              target="_blank"
              rel="noopener noreferrer"
              :aria-label="`Скачать «${doc.title}»`"
            >
              <svg :class="$style.downloadIcon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                <path
                  fill="currentColor"
                  d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"
                />
              </svg>
            </a>
          </div>

          <h2 :class="$style.cardTitle">{{ doc.title }}</h2>

          <p :class="$style.meta">
            <time :datetime="doc.publishedAt">{{ formatDate(doc.publishedAt) }}</time>
            <template v-if="doc.sizeLabel">
              <span :class="$style.metaDivider" aria-hidden="true">·</span>
              <span>{{ doc.sizeLabel }}</span>
            </template>
          </p>
        </article>
      </li>
    </ul>

    <p v-else :class="$style.status">Документов пока нет.</p>
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

.grid {
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

.item {
  min-width: 0;
}

.card {
  display: flex;
  flex-direction: column;
  gap: var(--fs-space-2);
  height: 100%;
  padding: var(--fs-space-3);
  background: var(--site-color-background);
  border: 1px solid var(--fs-color-border);
  border-radius: var(--site-radius-md);
  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease;

  &:hover {
    border-color: color-mix(in srgb, var(--site-color-primary) 28%, var(--fs-color-border));
    box-shadow: 0 8px 24px rgb(0 0 0 / 7%);
  }
}

.cardTop {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: var(--fs-space-2);
}

.docIcon {
  display: grid;
  place-items: center;
  flex-shrink: 0;
  width: 48px;
  height: 48px;
  border-radius: var(--site-radius-sm);
  color: var(--site-color-primary);
  background: color-mix(in srgb, var(--site-color-primary) 12%, var(--fs-color-surface-alt));
}

.docIconSvg {
  width: 26px;
  height: 26px;
}

.downloadBtn {
  display: grid;
  place-items: center;
  flex-shrink: 0;
  width: 40px;
  height: 40px;
  border-radius: 999px;
  color: var(--site-color-background);
  background: var(--site-color-primary);
  transition:
    background 0.2s ease,
    transform 0.2s ease;

  &:hover {
    background: color-mix(in srgb, var(--site-color-primary) 88%, #000);
    transform: translateY(-1px);
  }

  &:focus-visible {
    outline: 2px solid var(--site-color-primary);
    outline-offset: 2px;
  }
}

.downloadIcon {
  width: 20px;
  height: 20px;
}

.cardTitle {
  margin: 0;
  font-size: var(--fs-text-lg);
  font-weight: var(--fs-weight-semibold);
  line-height: 1.35;
  color: var(--site-color-text);
}

.meta {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.35em;
  margin: 0;
  margin-top: auto;
  font-size: var(--fs-text-sm);
  color: var(--fs-color-text-muted);
}

.metaDivider {
  opacity: 0.65;
}

@media (prefers-reduced-motion: reduce) {
  .card,
  .downloadBtn {
    transition: none;
  }

  .downloadBtn:hover {
    transform: none;
  }
}
</style>
