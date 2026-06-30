<script setup lang="ts">
import { useSiteBoot } from '~/composables/useSiteBoot'

const { isOpen: isFooterOpen, close: closeFooter } = useFooterPanel()
const { showBootScreen } = useSiteBoot()
</script>

<template>
  <SiteBootScreen v-if="showBootScreen" />

  <div v-else :class="$style.root">
    <a href="#main-content" class="skip-link">Перейти к основному содержимому</a>
    <AppHeader />
    <main id="main-content" :class="$style.main" tabindex="-1">
      <div class="site-shell">
        <slot />
      </div>
    </main>

    <button
      v-if="isFooterOpen"
      type="button"
      :class="$style.backdrop"
      aria-label="Закрыть меню сайта"
      @click="closeFooter"
    />

    <div
      id="site-footer-panel"
      :class="[$style.footerPanel, isFooterOpen && $style.footerPanelOpen]"
      :aria-hidden="!isFooterOpen"
      :inert="!isFooterOpen"
    >
      <AppFooter />
    </div>

    <AppFontSizeControl />
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
  min-width: 0;

  &:focus {
    outline: none;
  }
}

.backdrop {
  position: fixed;
  inset: 0;
  z-index: 150;
  border: none;
  padding: 0;
  margin: 0;
  background: rgb(0 0 0 / 40%);
  cursor: pointer;
  animation: backdrop-in 0.25s ease;
}

.footerPanel {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 160;
  max-height: min(85dvh, 640px);
  overflow-y: auto;
  transform: translateY(100%);
  visibility: hidden;
  pointer-events: none;
  transition:
    transform 0.35s cubic-bezier(0.32, 0.72, 0, 1),
    visibility 0.35s;
  box-shadow: 0 -8px 32px rgb(0 0 0 / 18%);
}

.footerPanelOpen {
  transform: translateY(0);
  visibility: visible;
  pointer-events: auto;
}

@keyframes backdrop-in {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}

@media (prefers-reduced-motion: reduce) {
  .backdrop {
    animation: none;
  }

  .footerPanel {
    transition: none;
  }
}
</style>
