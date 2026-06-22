<template>
  <article :class="$style.row" aria-hidden="true">
    <div :class="$style.link">
      <div :class="$style.media">
        <UiSkeleton tag="div" width="100%" height="100%" :radius="'var(--site-radius-sm)'" />
      </div>
      <div :class="$style.content">
        <UiSkeleton width="95%" height="18px" />
        <UiSkeleton width="72%" height="18px" />
        <UiSkeleton width="38%" height="14px" />
      </div>
    </div>
  </article>
</template>

<style module lang="scss">
@use '~/assets/styles/tools/mixins' as mx;

$row-thumb-width-mobile: 96px;
$row-thumb-height-mobile: 64px;
$row-thumb-width-desktop: 168px;
$row-thumb-height-desktop: 112px;

.row {
  min-width: 0;
  border-bottom: 1px solid var(--fs-color-border);

  &:last-child {
    border-bottom: none;
  }

  @include mx.from-desktop {
    border-bottom: none;
  }
}

.link {
  display: grid;
  grid-template-columns: $row-thumb-width-mobile minmax(0, 1fr);
  gap: var(--fs-space-2);
  min-width: 0;
  padding-block: var(--fs-space-2);

  @include mx.from-tablet {
    grid-template-columns: $row-thumb-width-desktop minmax(0, 1fr);
    gap: var(--fs-space-3);
    padding-block: var(--fs-space-3);
  }
}

.media {
  width: $row-thumb-width-mobile;
  height: $row-thumb-height-mobile;

  @include mx.from-tablet {
    width: $row-thumb-width-desktop;
    height: $row-thumb-height-desktop;
  }
}

.content {
  display: flex;
  flex-direction: column;
  gap: var(--fs-space-1);
  min-width: 0;
  padding-top: 2px;
}
</style>
