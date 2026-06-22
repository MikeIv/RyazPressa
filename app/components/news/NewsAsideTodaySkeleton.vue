<template>
  <aside :class="$style.aside" aria-hidden="true">
    <div :class="$style.panel">
      <div :class="$style.heading">
        <UiSkeleton width="72%" height="22px" />
      </div>
      <ul :class="$style.list">
        <li v-for="index in 2" :key="index" :class="$style.item">
          <UiSkeleton width="100%" height="16px" />
          <UiSkeleton width="42%" height="12px" />
        </li>
      </ul>
    </div>
  </aside>
</template>

<style module lang="scss">
@use '~/assets/styles/tools/mixins' as mx;

.aside {
  min-width: 0;
  max-width: 100%;

  @include mx.from-desktop {
    position: sticky;
    top: 120px;
    align-self: start;
  }
}

.panel {
  padding: var(--fs-space-2);
  background: var(--fs-color-surface);
  border: 1px solid var(--fs-color-border);
  border-radius: var(--site-radius-md);
}

.heading {
  margin-bottom: var(--fs-space-2);
  padding-bottom: var(--fs-space-2);
  border-bottom: 2px solid var(--fs-color-border);
}

.list {
  margin: 0;
  padding: 0;
  list-style: none;
}

.item {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding-block: var(--fs-space-1);
  border-bottom: 1px solid var(--fs-color-border);

  &:last-child {
    border-bottom: none;
  }
}
</style>
