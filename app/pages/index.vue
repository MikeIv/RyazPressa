<script setup lang="ts"></script>

<template>
  <div :class="$style.root">
    <h1>Nuxt 4</h1>
    <p>
      Стартовый каркас: линтинг, стили, HTTP API (<code>useApi</code> / <code>useApiFetch</code>). Скопируйте
      <code>.env.example</code> в <code>.env</code>, задайте <code>NUXT_PUBLIC_API_BASE</code> при необходимости.
    </p>
  </div>
</template>

<style module lang="scss">
.root {
  padding: 1.5rem;
}
</style>
