<script setup lang="ts">
import type { ContactInfo } from '#shared/types/api'
import { contactInfoHasContent } from '#shared/utils/normalizeContactsApi'

definePageMeta({
  middleware: 'section',
  section: 'contacts',
})

const { site } = useSiteConfig()
const { data: contacts, pending, error } = useApiFetch<ContactInfo>('/api/contacts')

const hasContent = computed(() => contactInfoHasContent(contacts.value))

const orgTitle = computed(
  () => contacts.value?.title?.trim() || site.value?.name?.trim() || 'Редакция',
)

function telHref(phone: string): string {
  return `tel:${phone.replace(/[^\d+]/g, '')}`
}

useHead({ title: 'Контакты' })
</script>

<template>
  <div :class="$style.page">
    <h1 :class="$style.title">Контакты</h1>

    <p v-if="pending" :class="$style.status" role="status">Загрузка…</p>
    <p v-else-if="error" :class="$style.status" role="alert">Не удалось загрузить контакты.</p>
    <p v-else-if="!hasContent" :class="$style.status">Контактная информация пока недоступна.</p>

    <div v-else-if="contacts" :class="$style.layout">
      <section :class="$style.mainCard" aria-labelledby="contacts-org-heading">
        <p id="contacts-org-heading" :class="$style.org">{{ orgTitle }}</p>

        <p v-if="contacts.chief" :class="$style.chief">
          <span :class="$style.chiefLabel">Главный редактор</span>
          {{ contacts.chief }}
        </p>

        <dl :class="$style.facts">
          <template v-if="contacts.address">
            <div :class="$style.fact">
              <dt>Адрес</dt>
              <dd>{{ contacts.address }}</dd>
            </div>
          </template>
          <template v-if="contacts.workingHours">
            <div :class="$style.fact">
              <dt>Часы работы</dt>
              <dd>{{ contacts.workingHours }}</dd>
            </div>
          </template>
          <template v-if="contacts.ageRating">
            <div :class="$style.fact">
              <dt>Возрастная маркировка</dt>
              <dd>{{ contacts.ageRating }}</dd>
            </div>
          </template>
        </dl>
      </section>

      <div
        v-if="contacts.phones?.length || contacts.emails?.length"
        :class="$style.sideGrid"
      >
        <section
          v-if="contacts.phones?.length"
          :class="$style.sideCard"
          aria-labelledby="contacts-phones-heading"
        >
          <h2 id="contacts-phones-heading" :class="$style.sideTitle">Телефоны</h2>
          <ul :class="$style.entryList" role="list">
            <li v-for="phone in contacts.phones" :key="phone.number" :class="$style.entry">
              <a :href="telHref(phone.number)" :class="$style.entryLink">{{ phone.number }}</a>
              <span v-if="phone.label" :class="$style.entryLabel">{{ phone.label }}</span>
            </li>
          </ul>
        </section>

        <section
          v-if="contacts.emails?.length"
          :class="$style.sideCard"
          aria-labelledby="contacts-emails-heading"
        >
          <h2 id="contacts-emails-heading" :class="$style.sideTitle">Email</h2>
          <ul :class="$style.entryList" role="list">
            <li v-for="email in contacts.emails" :key="email.address" :class="$style.entry">
              <a :href="`mailto:${email.address}`" :class="$style.entryLink">{{ email.address }}</a>
              <span v-if="email.label" :class="$style.entryLabel">{{ email.label }}</span>
            </li>
          </ul>
        </section>
      </div>

      <section
        v-if="contacts.mapEmbedUrl"
        :class="$style.mapCard"
        aria-labelledby="contacts-map-heading"
      >
        <h2 id="contacts-map-heading" class="visually-hidden">Карта</h2>
        <iframe
          :src="contacts.mapEmbedUrl"
          :class="$style.map"
          title="Карта проезда"
          loading="lazy"
          referrerpolicy="no-referrer-when-downgrade"
        />
      </section>

      <p v-if="contacts.rknRegistration" :class="$style.legal">
        {{ contacts.rknRegistration }}
      </p>
    </div>
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

.layout {
  display: grid;
  gap: var(--fs-space-3);
}

.mainCard,
.sideCard,
.mapCard {
  padding: var(--fs-space-3);
  background: var(--site-color-background);
  border: 1px solid var(--fs-color-border);
  border-radius: var(--site-radius-md);
  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease;

  &:hover {
    border-color: color-mix(in srgb, var(--site-color-primary) 24%, var(--fs-color-border));
    box-shadow: 0 8px 24px rgb(0 0 0 / 6%);
  }
}

.org {
  margin: 0 0 var(--fs-space-2);
  font-size: var(--fs-text-xl);
  font-weight: var(--fs-weight-semibold);
  color: var(--site-color-text);
}

.chief {
  margin: 0 0 var(--fs-space-3);
  font-size: var(--fs-text-base);
  line-height: var(--fs-leading-relaxed);
}

.chiefLabel {
  display: block;
  margin-bottom: 2px;
  font-size: var(--fs-text-sm);
  font-weight: var(--fs-weight-semibold);
  color: var(--fs-color-text-muted);
}

.facts {
  display: grid;
  gap: var(--fs-space-2);
  margin: 0;
}

.fact {
  dt {
    margin-bottom: 2px;
    font-size: var(--fs-text-sm);
    font-weight: var(--fs-weight-semibold);
    color: var(--fs-color-text-muted);
  }

  dd {
    margin: 0;
    font-size: var(--fs-text-base);
    line-height: var(--fs-leading-relaxed);
  }
}

.sideGrid {
  display: grid;
  gap: var(--fs-space-3);

  @include mx.from-tablet {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

.sideTitle {
  margin: 0 0 var(--fs-space-2);
  font-size: var(--fs-text-lg);
  font-weight: var(--fs-weight-semibold);
  color: var(--site-color-text);
}

.entryList {
  display: grid;
  gap: var(--fs-space-2);
  margin: 0;
  padding: 0;
  list-style: none;
}

.entry {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.entryLink {
  font-size: var(--fs-text-base);
  font-weight: var(--fs-weight-medium);
  color: var(--site-color-primary);
  text-decoration: none;
  word-break: break-word;

  &:hover {
    text-decoration: underline;
  }

  &:focus-visible {
    outline: 2px solid var(--site-color-primary);
    outline-offset: 2px;
    border-radius: 2px;
  }
}

.entryLabel {
  font-size: var(--fs-text-sm);
  color: var(--fs-color-text-muted);
}

.mapCard {
  padding: 0;
  overflow: hidden;
}

.map {
  display: block;
  width: 100%;
  min-height: 280px;
  border: 0;

  @include mx.from-tablet {
    min-height: 360px;
  }
}

.legal {
  margin: 0;
  font-size: var(--fs-text-sm);
  line-height: var(--fs-leading-relaxed);
  color: var(--fs-color-text-muted);
  white-space: pre-line;
}

@media (prefers-reduced-motion: reduce) {
  .mainCard,
  .sideCard,
  .mapCard {
    transition: none;
  }
}
</style>
