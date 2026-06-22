<template>
  <article :class="$style.featured" aria-hidden="true">
    <div :class="$style.link">
      <div :class="$style.media">
        <UiSkeleton tag="div" width="100%" height="100%" :radius="'var(--site-radius-md)'" />
      </div>
      <div :class="$style.body">
        <UiSkeleton width="28%" height="12px" />
        <UiSkeleton width="92%" height="28px" :radius="'var(--site-radius-sm)'" />
        <UiSkeleton width="88%" height="28px" :radius="'var(--site-radius-sm)'" />
        <UiSkeleton width="75%" height="16px" />
        <UiSkeleton width="65%" height="16px" />
        <UiSkeleton width="40%" height="14px" />
      </div>
    </div>
  </article>
</template>

<style module lang="scss">
@use '~/assets/styles/tools/mixins' as mx;

.featured {
  min-width: 0;
}

.link {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: var(--fs-space-2);
  min-width: 0;
  padding: var(--fs-space-2);
  background: var(--fs-color-surface);
  border-radius: var(--site-radius-md);

  @include mx.from-tablet {
    grid-template-columns: minmax(0, 1.2fr) minmax(0, 1fr);
    gap: var(--fs-space-3);
    padding: var(--fs-space-3);
    align-items: stretch;
  }
}

.media {
  width: 100%;
  min-height: 180px;

  @include mx.from-tablet {
    min-height: 220px;
  }
}

.body {
  display: flex;
  flex-direction: column;
  gap: var(--fs-space-2);
  min-width: 0;
  min-height: 100%;
  justify-content: flex-start;

  > :last-child {
    margin-top: auto;
    padding-top: var(--fs-space-2);
  }
}
</style>
