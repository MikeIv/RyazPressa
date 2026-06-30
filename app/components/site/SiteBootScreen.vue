<script setup lang="ts">
const HOME_LIST_SKELETON_COUNT = 8
</script>

<template>
  <div :class="$style.screen" role="status" aria-live="polite" aria-busy="true">
    <p class="visually-hidden">Загрузка сайта…</p>
    <div :class="$style.progress" aria-hidden="true" />

    <header :class="$style.header" aria-hidden="true">
      <div :class="$style.topBar">
        <div class="site-shell" :class="$style.topInner">
          <UiSkeleton tag="div" width="min(160px, 42vw)" height="32px" :radius="'var(--site-radius-sm)'" />
          <UiSkeleton tag="div" width="100%" height="36px" :radius="'999px'" />
        </div>
      </div>
      <div :class="$style.navBar">
        <div class="site-shell" :class="$style.navInner">
          <UiSkeleton tag="div" width="min(200px, 36vw)" height="40px" :radius="'var(--site-radius-sm)'" />
          <div :class="$style.navPills">
            <UiSkeleton
              v-for="index in 4"
              :key="index"
              tag="div"
              width="72px"
              height="14px"
              :radius="'999px'"
            />
          </div>
        </div>
      </div>
    </header>

    <main :class="$style.main">
      <div class="site-shell" :class="$style.home">
        <NewsFeedFeaturedSkeleton />
        <NewsFeedListSkeleton :count="HOME_LIST_SKELETON_COUNT" />
      </div>
    </main>
  </div>
</template>

<style module lang="scss">
@use '~/assets/styles/tools/mixins' as mx;

.screen {
  display: flex;
  flex-direction: column;
  min-height: 100dvh;
  background: var(--site-color-background);
}

.progress {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 300;
  height: 3px;
  overflow: hidden;
  background: color-mix(in srgb, var(--site-color-primary) 12%, var(--fs-color-surface));

  &::after {
    content: '';
    display: block;
    width: 40%;
    height: 100%;
    background: linear-gradient(
      90deg,
      transparent,
      var(--site-color-primary),
      color-mix(in srgb, var(--site-color-accent) 85%, var(--site-color-primary))
    );
    animation: boot-progress 1.1s ease-in-out infinite;
  }
}

.header {
  flex-shrink: 0;
}

.topBar {
  padding-block: var(--fs-space-2);
  background: var(--fs-color-surface);
  border-bottom: 1px solid var(--fs-color-border);
}

.topInner {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr);
  gap: var(--fs-space-2);
  align-items: center;
}

.navBar {
  display: none;
  padding-block: var(--fs-space-2);
  background: var(--site-color-background);
  border-bottom: 1px solid var(--fs-color-border);

  @include mx.from-desktop {
    display: block;
  }
}

.navInner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--fs-space-3);
}

.navPills {
  display: flex;
  flex-wrap: wrap;
  gap: var(--fs-space-3);
}

.main {
  flex: 1;
  min-width: 0;
  padding-block: var(--fs-space-3) var(--fs-space-5);

  @include mx.from-desktop {
    padding-block: var(--fs-space-4) var(--fs-space-6);
  }
}

.home {
  display: flex;
  flex-direction: column;
  gap: var(--fs-space-3);
  min-width: 0;

  @include mx.from-desktop {
    gap: var(--fs-space-4);
  }
}

@keyframes boot-progress {
  0% {
    transform: translateX(-120%);
  }

  100% {
    transform: translateX(320%);
  }
}

@media (prefers-reduced-motion: reduce) {
  .progress::after {
    animation: none;
    width: 100%;
    opacity: 0.45;
  }
}
</style>
