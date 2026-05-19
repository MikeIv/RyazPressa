<script setup lang="ts"></script>

<template>
  <div :class="$style.root">
    <a href="#main-content" class="skip-link">Перейти к основному содержимому</a>
    <AppHeader />
    <main id="main-content" :class="$style.main" tabindex="-1">
      <slot />
    </main>
    <AppFooter />
  </div>
</template>

<style module lang="scss">
.root {
  display: flex;
  flex-direction: column;
  min-height: 100dvh;
}

.main {
  flex: 1;

  /* Убираем outline при программном фокусе (skip-link) */
  &:focus {
    outline: none;
  }
}
</style>
