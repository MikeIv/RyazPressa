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
  gap: 2px;
  padding: 4px;
  background: var(--fs-color-bg);
  border: 1px solid var(--fs-color-border);
  border-radius: var(--site-radius-md);
  box-shadow: 0 4px 16px rgb(0 0 0 / 12%);
}

.button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: var(--site-radius-sm);
  font-size: var(--fs-text-xl);
  font-weight: var(--fs-weight-bold);
  line-height: 1;
  color: var(--site-color-primary);
  transition:
    background-color 0.15s ease,
    color 0.15s ease;

  &:hover:not(:disabled) {
    background: var(--fs-color-surface);
    color: var(--site-color-accent);
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.35;
  }

  &:focus-visible {
    outline-color: var(--site-color-primary);
  }
}

.value {
  min-width: 28px;
  font-size: var(--fs-text-sm);
  font-weight: var(--fs-weight-semibold);
  text-align: center;
  color: var(--fs-color-text-muted);
  user-select: none;
}

@media (prefers-reduced-motion: reduce) {
  .button {
    transition: none;
  }
}
</style>
