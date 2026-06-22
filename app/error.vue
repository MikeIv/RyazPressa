<script setup lang="ts">
import type { NuxtError } from '#app'

const props = defineProps<{
  error: NuxtError
}>()

const statusCode = computed(() => props.error.statusCode ?? 500)

const heading = computed(() => (statusCode.value === 404 ? 'Страница не найдена' : 'Что-то пошло не так'))

const message = computed(() => resolveErrorMessage(props.error))

const devHint = computed(() => {
  if (!import.meta.dev) return undefined
  const parts = [props.error.statusMessage, props.error.message].filter(Boolean)
  return parts.length ? parts.join(' · ') : undefined
})

useHead({
  title: heading,
})

function resolveErrorMessage(error: NuxtError): string {
  const raw = error.statusMessage?.trim()

  if (raw && isUserFacingMessage(raw)) {
    return raw
  }

  if (statusCode.value === 404) {
    return 'Запрошенная страница не существует или была удалена.'
  }

  return 'Попробуйте обновить страницу или вернитесь на главную.'
}

function isUserFacingMessage(text: string): boolean {
  if (text.includes('NUXT_') || text.includes('Known slugs') || text.includes('Site not found for host')) {
    return false
  }

  return text.length <= 160
}

function goHome() {
  clearError({ redirect: '/' })
}

function retry() {
  clearError()
}
</script>

<template>
  <NuxtLayout name="default">
    <div :class="$style.page">
      <p :class="$style.code" aria-hidden="true">{{ statusCode }}</p>
      <h1 :class="$style.title">{{ heading }}</h1>
      <p :class="$style.message" role="alert">{{ message }}</p>
      <p v-if="devHint" :class="$style.devHint">{{ devHint }}</p>

      <div :class="$style.actions">
        <button type="button" :class="$style.primary" @click="goHome">На главную</button>
        <button type="button" :class="$style.secondary" @click="retry">Повторить</button>
      </div>
    </div>
  </NuxtLayout>
</template>

<style module lang="scss">
.page {
  padding-block: var(--fs-space-6);
  max-width: 40rem;
}

.code {
  font-size: var(--fs-text-sm);
  font-weight: var(--fs-weight-semibold);
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--site-color-primary);
  margin-bottom: var(--fs-space-2);
}

.title {
  font-size: var(--fs-text-3xl);
  font-weight: var(--fs-weight-bold);
  line-height: var(--fs-leading-tight);
  margin-bottom: var(--fs-space-2);
}

.message {
  font-size: var(--fs-text-base);
  line-height: var(--fs-leading-relaxed);
  color: var(--fs-color-text-muted);
  margin-bottom: var(--fs-space-4);
}

.devHint {
  font-size: var(--fs-text-sm);
  line-height: var(--fs-leading-relaxed);
  color: var(--fs-color-text-muted);
  margin-bottom: var(--fs-space-4);
  padding: var(--fs-space-2);
  border-radius: var(--site-radius-sm);
  background: var(--fs-color-surface);
  word-break: break-word;
}

.actions {
  display: flex;
  flex-wrap: wrap;
  gap: var(--fs-space-2);
}

.primary,
.secondary {
  font-size: var(--fs-text-sm);
  font-weight: var(--fs-weight-medium);
  padding: 10px 18px;
  border-radius: var(--site-radius-sm);
  cursor: pointer;
  transition:
    background-color 0.2s ease,
    border-color 0.2s ease,
    color 0.2s ease;

  &:focus-visible {
    outline: 2px solid var(--site-color-primary);
    outline-offset: 2px;
  }
}

.primary {
  border: 1px solid var(--site-color-primary);
  background: var(--site-color-primary);
  color: var(--site-color-on-primary, #fff);

  &:hover {
    background: color-mix(in srgb, var(--site-color-primary) 88%, #000);
    border-color: color-mix(in srgb, var(--site-color-primary) 88%, #000);
  }
}

.secondary {
  border: 1px solid var(--fs-color-border);
  background: transparent;
  color: var(--fs-color-text);

  &:hover {
    border-color: color-mix(in srgb, var(--site-color-primary) 24%, var(--fs-color-border));
    color: var(--site-color-primary);
  }
}
</style>
