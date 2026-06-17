<script setup lang="ts">
import { contactTelHref } from '#shared/utils/normalizeContactsApi'

const { site } = useSiteConfig()
const { contacts, showContacts } = useFooterContacts()
const year = new Date().getFullYear()
</script>

<template>
  <footer :class="$style.footer" role="contentinfo">
    <div :class="[$style.inner, 'site-shell']">
      <div :class="$style.main">
        <div v-if="showContacts && contacts" :class="$style.contacts">
          <p v-if="contacts.phones?.length" :class="$style.contactsText">
            <template v-for="(phone, index) in contacts.phones" :key="phone.number">
              <span v-if="index > 0" :class="$style.sep" aria-hidden="true">·</span>
              <a :href="contactTelHref(phone.number)" :class="$style.contactLink">{{
                phone.number
              }}</a>
            </template>
          </p>
          <p v-if="contacts.emails?.length" :class="$style.contactsText">
            <template v-for="(email, index) in contacts.emails" :key="email.address">
              <span v-if="index > 0" :class="$style.sep" aria-hidden="true">·</span>
              <a :href="`mailto:${email.address}`" :class="$style.contactLink">{{
                email.address
              }}</a>
            </template>
          </p>
          <p v-if="contacts.address" :class="$style.contactsText">{{ contacts.address }}</p>
        </div>

        <p :class="$style.copy">
          &copy; {{ year }}&nbsp;{{ site?.name ?? '' }}. Все права защищены.
        </p>
      </div>

      <nav v-if="site?.nav.length" :class="$style.nav" aria-label="Навигация в футере">
        <ul :class="$style.navList" role="list">
          <li v-for="item in site.nav" :key="item.to">
            <NuxtLink :to="item.to" :class="$style.navLink">{{ item.label }}</NuxtLink>
          </li>
        </ul>
      </nav>
    </div>
  </footer>
</template>

<style module lang="scss">
@use '~/assets/styles/tools/mixins' as mx;

.footer {
  background-color: var(--fs-color-surface);
  border-top: 1px solid var(--fs-color-border);
  margin-top: auto;
}

.inner {
  display: flex;
  flex-direction: column;
  gap: var(--fs-space-2);
  padding-block: var(--fs-space-3);

  @include mx.from-tablet {
    display: grid;
    grid-template-columns: minmax(0, 1fr) auto;
    align-items: start;
    column-gap: var(--fs-space-4);
  }
}

.main {
  display: flex;
  flex-direction: column;
  gap: var(--fs-space-2);
  min-width: 0;
}

.contacts {
  display: flex;
  flex-direction: column;
  gap: 2px;
  text-align: center;

  @include mx.from-tablet {
    text-align: left;
  }
}

.contactsText {
  margin: 0;
  font-size: var(--fs-text-xs);
  line-height: 1.4;
  color: var(--fs-color-text-muted);
}

.sep {
  margin-inline: 0.4em;
  opacity: 0.55;
}

.contactLink {
  color: inherit;
  text-decoration: none;
  white-space: nowrap;

  &:hover {
    color: var(--site-color-primary);
    text-decoration: underline;
  }

  &:focus-visible {
    outline: 2px solid var(--site-color-primary);
    outline-offset: 2px;
    border-radius: 2px;
  }
}

.nav {
  @include mx.from-tablet {
    justify-self: end;
  }
}

.copy {
  margin: 0;
  font-size: var(--fs-text-sm);
  color: var(--fs-color-text-muted);
  text-align: center;

  @include mx.from-tablet {
    text-align: left;
  }
}

.navList {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  margin: 0;
  padding: 0;
  list-style: none;
  justify-content: center;
  gap: var(--fs-space-1) var(--fs-space-2);

  @include mx.from-tablet {
    justify-content: flex-end;
  }
}

.navLink {
  font-size: var(--fs-text-sm);
  color: var(--fs-color-text-muted);
  transition: color 0.15s ease;

  &:hover {
    color: var(--site-color-primary);
  }
}
</style>
