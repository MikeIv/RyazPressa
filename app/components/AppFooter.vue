<script setup lang="ts">
const { site } = useSiteConfig()
const year = new Date().getFullYear()
</script>

<template>
  <footer :class="$style.footer" role="contentinfo">
    <div :class="[$style.inner, 'site-shell']">
      <p :class="$style.copy">
        &copy; {{ year }}&nbsp;{{ site?.name ?? '' }}. Все права защищены.
      </p>
      <nav v-if="site?.nav.length" aria-label="Навигация в футере">
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
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }
}

.copy {
  font-size: var(--fs-text-sm);
  color: var(--fs-color-text-muted);
}

.navList {
  display: flex;
  flex-wrap: wrap;
  gap: var(--fs-space-1) var(--fs-space-2);
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
