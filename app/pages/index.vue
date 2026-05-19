<script setup lang="ts">
const { site, pending, error } = useSiteConfig()
</script>

<template>
  <div :class="$style.root">
    <h1>Ryazpressa Platform</h1>

    <p v-if="pending" :class="$style.status">Загрузка конфигурации сайта…</p>
    <p v-else-if="error" :class="$style.status" role="alert">
      Не удалось загрузить конфигурацию сайта.
    </p>
    <template v-else-if="site">
      <p :class="$style.lead">
        Текущий сайт: <strong>{{ site.name }}</strong> ({{ site.slug }})
      </p>
      <nav aria-label="Разделы сайта">
        <ul :class="$style.navList">
          <li v-for="item in site.nav" :key="item.to">
            <NuxtLink :to="item.to">{{ item.label }}</NuxtLink>
          </li>
        </ul>
      </nav>
    </template>
  </div>
</template>

<style module lang="scss">
.root {
  padding: var(--fs-space-6);
}

.lead {
  margin-block: var(--fs-space-4);
}

.status {
  margin-block: var(--fs-space-4);
  color: var(--fs-color-muted, #666);
}

.navList {
  display: flex;
  flex-wrap: wrap;
  gap: var(--fs-space-3);
  padding: 0;
  margin: 0;
  list-style: none;
}
</style>
