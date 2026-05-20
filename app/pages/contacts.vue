<script setup lang="ts">
import type { ContactInfo } from '#shared/types/api'

definePageMeta({
  middleware: 'section',
  section: 'contacts',
})

const { data: contacts, pending, error } = useApiFetch<ContactInfo>('/api/contacts')

useHead({ title: 'Контакты' })
</script>

<template>
  <div :class="[$style.page, 'container']">
    <h1 :class="$style.title">Контакты</h1>

    <p v-if="pending" :class="$style.status" role="status">Загрузка…</p>
    <p v-else-if="error" :class="$style.status" role="alert">Не удалось загрузить контакты.</p>

    <section v-else-if="contacts" :class="$style.card" aria-labelledby="contacts-heading">
      <h2 id="contacts-heading" class="visually-hidden">{{ contacts.title }}</h2>
      <p :class="$style.org">{{ contacts.title }}</p>

      <dl :class="$style.list">
        <template v-if="contacts.address">
          <dt>Адрес</dt>
          <dd>{{ contacts.address }}</dd>
        </template>
        <template v-if="contacts.phone">
          <dt>Телефон</dt>
          <dd>
            <a :href="`tel:${contacts.phone.replace(/\s/g, '')}`">{{ contacts.phone }}</a>
          </dd>
        </template>
        <template v-if="contacts.email">
          <dt>Email</dt>
          <dd>
            <a :href="`mailto:${contacts.email}`">{{ contacts.email }}</a>
          </dd>
        </template>
        <template v-if="contacts.workingHours">
          <dt>Часы работы</dt>
          <dd>{{ contacts.workingHours }}</dd>
        </template>
      </dl>
    </section>
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

.card {
  padding: var(--fs-space-3);
  border: 1px solid var(--fs-color-border);
  border-radius: var(--site-radius-md);
  background: var(--fs-color-surface);
}

.org {
  font-size: var(--fs-text-xl);
  font-weight: var(--fs-weight-semibold);
  margin-bottom: var(--fs-space-3);
}

.list {
  display: grid;
  gap: var(--fs-space-2);

  dt {
    font-size: var(--fs-text-sm);
    font-weight: var(--fs-weight-semibold);
    color: var(--fs-color-text-muted);
    margin-bottom: 2px;
  }

  dd {
    margin: 0;
    font-size: var(--fs-text-base);

    a {
      color: var(--site-color-primary);

      &:hover {
        text-decoration: underline;
      }
    }
  }
}
</style>
