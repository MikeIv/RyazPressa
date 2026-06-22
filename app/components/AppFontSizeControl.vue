<script setup lang="ts">
const { fontSizePx, announcement, increase, decrease, canIncrease, canDecrease } = useFontScale()
</script>

<template>
  <div :class="$style.root" role="group" aria-label="Размер шрифта">
    <p class="visually-hidden" aria-live="polite" aria-atomic="true">{{ announcement }}</p>

    <button
      type="button"
      :class="$style.button"
      :disabled="!canDecrease"
      aria-label="Уменьшить шрифт"
      @click="decrease"
    >
      <span aria-hidden="true">−</span>
    </button>

    <span :class="$style.value" aria-hidden="true">{{ fontSizePx }}</span>

    <button
      type="button"
      :class="$style.button"
      :disabled="!canIncrease"
      aria-label="Увеличить шрифт"
      @click="increase"
    >
      <span aria-hidden="true">+</span>
    </button>
  </div>
</template>

<style module lang="scss">
.root {
  position: fixed;
  right: var(--fs-space-2);
  bottom: calc(var(--fs-space-2) + env(safe-area-inset-bottom, 0px));
  z-index: 140;
  display: flex;
  align-items: center;
  gap: var(--fs-space-1);
  padding: 6px var(--fs-space-1);
  background: var(--fs-color-bg);
  border: 1px solid var(--fs-color-border);
  border-radius: 999px;
  box-shadow: 0 4px 16px rgb(0 0 0 / 12%);
}

.button {
  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  font-size: var(--fs-text-2xl);
  font-weight: var(--fs-weight-bold);
  line-height: 1;
  color: var(--site-color-primary);
  background: color-mix(in srgb, var(--site-color-primary) 14%, var(--fs-color-surface-alt));
  transition:
    background-color 0.15s ease,
    color 0.15s ease,
    transform 0.15s ease;

  &:hover:not(:disabled) {
    background: color-mix(in srgb, var(--site-color-primary) 22%, var(--fs-color-surface-alt));
    color: var(--site-color-accent);
  }

  &:active:not(:disabled) {
    transform: scale(0.96);
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.4;
  }

  &:focus-visible {
    outline-color: var(--site-color-primary);
  }
}

.value {
  min-width: 32px;
  padding-inline: 2px;
  font-size: var(--fs-text-base);
  font-weight: var(--fs-weight-semibold);
  text-align: center;
  color: var(--fs-color-text-muted);
  user-select: none;
}

@media (prefers-reduced-motion: reduce) {
  .button {
    transition: none;

    &:active:not(:disabled) {
      transform: none;
    }
  }
}
</style>
