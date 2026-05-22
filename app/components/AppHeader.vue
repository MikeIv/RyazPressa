<script setup lang="ts">
const { site } = useSiteConfig()
const route = useRoute()
const { isOpen: isFooterOpen, toggle: toggleFooter, close: closeFooter } = useFooterPanel()

const logoFailed = ref(false)

watch(
  () => site.value?.theme.logoSrc,
  () => {
    logoFailed.value = false
  },
)

function isActive(to: string): boolean {
  if (to === '/') return route.path === '/'
  return route.path === to || route.path.startsWith(to + '/')
}

function onSearchSubmit(event: Event): void {
  event.preventDefault()
}

watch(
  () => route.path,
  () => {
    closeFooter()
  },
)
</script>

<template>
  <header :class="$style.header" role="banner">
    <div :class="$style.gradientBar">
      <div :class="[$style.gradientInner, 'site-shell']">
        <AppHeaderLogo variant="mobile" :image-failed="logoFailed" @image-error="logoFailed = true" />

        <div :class="$style.gradientActions">
          <form
            :class="$style.search"
            role="search"
            aria-label="Поиск по сайту"
            @submit="onSearchSubmit"
          >
            <label class="visually-hidden" for="site-search">Поиск</label>
            <input
              id="site-search"
              :class="$style.searchInput"
              type="search"
              name="q"
              placeholder="Поиск…"
              autocomplete="off"
            />
            <button :class="$style.searchBtn" type="submit" aria-label="Найти">
              <svg
                :class="$style.searchIcon"
                viewBox="0 0 24 24"
                aria-hidden="true"
                focusable="false"
              >
                <path
                  fill="currentColor"
                  d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"
                />
              </svg>
            </button>
          </form>

          <button
            :class="[$style.burgerBtn, isFooterOpen && $style.burgerBtnOpen]"
            type="button"
            aria-controls="site-footer-panel"
            :aria-expanded="isFooterOpen"
            :aria-label="isFooterOpen ? 'Скрыть меню сайта' : 'Открыть меню сайта'"
            @click="toggleFooter"
          >
            <span :class="$style.burgerIcon" aria-hidden="true" />
            <span :class="$style.burgerIcon" aria-hidden="true" />
            <span :class="$style.burgerIcon" aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>

    <div :class="$style.mainBar">
      <div :class="[$style.mainInner, 'site-shell']">
        <AppHeaderLogo variant="desktop" :image-failed="logoFailed" @image-error="logoFailed = true" />

        <nav id="main-nav" :class="$style.nav" aria-label="Основная навигация">
          <ul :class="$style.navList" role="list">
            <li v-for="item in site?.nav" :key="item.to">
              <NuxtLink
                :to="item.to"
                :class="[$style.navLink, isActive(item.to) && $style.navLinkActive]"
              >
                {{ item.label }}
              </NuxtLink>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  </header>
</template>

<style module lang="scss">
@use '~/assets/styles/tools/mixins' as mx;

.header {
  position: sticky;
  top: 0;
  z-index: 100;
}

.gradientBar {
  background: var(--site-header-gradient);
}

.gradientInner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--fs-space-1);
  min-height: 44px;
  padding-block: 6px;

  @include mx.from-desktop {
    justify-content: flex-end;
    gap: var(--fs-space-2);
    min-height: 48px;
    padding-block: var(--fs-space-1);
  }
}

.gradientActions {
  display: flex;
  align-items: center;
  flex-shrink: 0;
  gap: 6px;

  @include mx.from-desktop {
    gap: var(--fs-space-2);
  }
}

.search {
  display: flex;
  align-items: center;
  flex: 1;
  min-width: 0;
  max-width: 132px;
  background: rgb(255 255 255 / 22%);
  border-radius: 999px;
  overflow: hidden;
  border: 1px solid rgb(255 255 255 / 35%);

  @include mx.from-desktop {
    flex: none;
    max-width: 280px;
    width: 100%;
  }
}

.searchInput {
  flex: 1;
  min-width: 0;
  padding: 6px 8px 6px 12px;
  border: none;
  background: transparent;
  color: #fff;
  font-size: var(--fs-text-xs);
  font-family: inherit;
  outline: none;

  &::placeholder {
    color: rgb(255 255 255 / 75%);
  }

  @include mx.from-desktop {
    padding: 8px 12px 8px 16px;
    font-size: var(--fs-text-sm);
  }
}

.searchBtn {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 32px;
  height: 32px;
  color: #fff;
  transition: background 0.15s ease;

  &:hover {
    background: rgb(255 255 255 / 12%);
  }

  &:focus-visible {
    outline-color: #fff;
  }

  @include mx.from-desktop {
    width: 40px;
    height: 40px;
  }
}

.searchIcon {
  display: block;
  width: 16px;
  height: 16px;

  @include mx.from-desktop {
    width: 18px;
    height: 18px;
  }
}

.burgerBtn {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 3px;
  flex-shrink: 0;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: #fff;
  color: var(--site-color-primary);
  box-shadow: 0 2px 8px rgb(0 0 0 / 12%);
  transition: box-shadow 0.2s ease;

  &:hover {
    box-shadow: 0 4px 12px rgb(0 0 0 / 18%);
  }

  &:focus-visible {
    outline-color: #fff;
    outline-offset: 2px;
  }

  @include mx.from-desktop {
    gap: 4px;
    width: 44px;
    height: 44px;
  }
}

.burgerIcon {
  display: block;
  width: 14px;
  height: 2px;
  background: currentcolor;
  border-radius: 1px;
  transition: transform 0.2s ease, opacity 0.2s ease;

  @include mx.from-desktop {
    width: 18px;
  }
}

.burgerBtnOpen {
  .burgerIcon:nth-child(1) {
    transform: translateY(5px) rotate(45deg);

    @include mx.from-desktop {
      transform: translateY(6px) rotate(45deg);
    }
  }

  .burgerIcon:nth-child(2) {
    opacity: 0;
  }

  .burgerIcon:nth-child(3) {
    transform: translateY(-5px) rotate(-45deg);

    @include mx.from-desktop {
      transform: translateY(-6px) rotate(-45deg);
    }
  }
}

.mainBar {
  background: var(--fs-color-bg);
  border-bottom: 1px solid var(--fs-color-border);
}

.mainInner {
  display: flex;
  align-items: center;
  min-height: 48px;
  padding-block: var(--fs-space-1);

  @include mx.from-desktop {
    justify-content: space-between;
    gap: var(--fs-space-2);
    min-height: 80px;
    padding-block: var(--fs-space-2);
  }
}

.nav {
  flex: 1;
  min-width: 0;
  width: 100%;

  @include mx.from-desktop {
    display: flex;
    justify-content: flex-end;
    width: auto;
  }
}

.navList {
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
  gap: var(--fs-space-2);
  margin: 0 calc(-1 * var(--fs-space-2));
  padding: 2px var(--fs-space-2);
  overflow-x: auto;
  overscroll-behavior-x: contain;
  scroll-padding-inline: var(--fs-space-2);
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
  touch-action: pan-x;

  &::-webkit-scrollbar {
    display: none;
  }

  @include mx.from-desktop {
    flex-wrap: wrap;
    justify-content: flex-end;
    margin: 0;
    padding: 0;
    overflow: visible;
    touch-action: auto;
    scroll-padding-inline: 0;
    gap: var(--fs-space-2) var(--fs-space-3);
  }

  > li {
    flex-shrink: 0;
  }
}

.navLink {
  display: block;
  padding: 4px 2px;
  font-size: var(--fs-text-xs);
  font-weight: var(--fs-weight-semibold);
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--site-color-primary);
  white-space: nowrap;
  transition: opacity 0.15s ease;

  &:hover {
    opacity: 0.75;
  }

  &:focus-visible {
    outline-color: var(--site-color-primary);
  }

  @include mx.from-tablet {
    font-size: var(--fs-text-sm);
  }
}

.navLinkActive {
  opacity: 1;
  text-decoration: underline;
  text-underline-offset: 4px;
  text-decoration-thickness: 2px;
}
</style>
