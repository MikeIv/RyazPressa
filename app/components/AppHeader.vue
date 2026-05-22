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
      <div :class="[$style.gradientInner, 'container']">
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
              width="18"
              height="18"
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

    <div :class="$style.mainBar">
      <div :class="[$style.mainInner, 'container']">
        <NuxtLink
          to="/"
          :class="$style.logo"
          :aria-label="`${site?.name ?? 'Главная'} — перейти на главную страницу`"
        >
          <img
            v-if="site?.theme.logoSrc && !logoFailed"
            :src="site.theme.logoSrc"
            :alt="site.theme.logoAlt"
            :class="$style.logoImg"
            width="300"
            height="28"
            @error="logoFailed = true"
          />
          <span v-else :class="$style.logoText">{{ site?.name }}</span>
        </NuxtLink>

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

/* Верхняя градиентная полоса (образец goodgoodgood.co) */
.gradientBar {
  background: linear-gradient(
    90deg,
    #b81d5c 0%,
    #e85d04 45%,
    #f2b705 100%
  );
}

.gradientInner {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: var(--fs-space-2);
  min-height: 48px;
  padding-block: var(--fs-space-1);
}

.search {
  display: flex;
  align-items: center;
  gap: 0;
  max-width: 280px;
  width: 100%;
  background: rgb(255 255 255 / 22%);
  border-radius: 999px;
  overflow: hidden;
  border: 1px solid rgb(255 255 255 / 35%);
}

.searchInput {
  flex: 1;
  min-width: 0;
  padding: 8px 12px 8px 16px;
  border: none;
  background: transparent;
  color: #fff;
  font-size: var(--fs-text-sm);
  font-family: inherit;
  outline: none;

  &::placeholder {
    color: rgb(255 255 255 / 75%);
  }
}

.searchBtn {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 40px;
  height: 40px;
  color: #fff;
  transition: background 0.15s ease;

  &:hover {
    background: rgb(255 255 255 / 12%);
  }

  &:focus-visible {
    outline-color: #fff;
  }
}

.searchIcon {
  display: block;
}

/* Круглая кнопка-бургер */
.burgerBtn {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  flex-shrink: 0;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: #fff;
  color: #1e2a5a;
  box-shadow: 0 2px 8px rgb(0 0 0 / 12%);
  transition: transform 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    box-shadow: 0 4px 12px rgb(0 0 0 / 18%);
  }

  &:focus-visible {
    outline-color: #fff;
    outline-offset: 2px;
  }
}

.burgerIcon {
  display: block;
  width: 18px;
  height: 2px;
  background: currentcolor;
  border-radius: 1px;
  transition: transform 0.2s ease, opacity 0.2s ease;
}

.burgerBtnOpen {
  .burgerIcon:nth-child(1) {
    transform: translateY(6px) rotate(45deg);
  }

  .burgerIcon:nth-child(2) {
    opacity: 0;
  }

  .burgerIcon:nth-child(3) {
    transform: translateY(-6px) rotate(-45deg);
  }
}

/* Нижняя полоса: логотип + навигация */
.mainBar {
  background: var(--fs-color-bg);
  border-bottom: 1px solid var(--fs-color-border);
}

.mainInner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--fs-space-2);
  min-height: 72px;
  padding-block: var(--fs-space-2);

  @include mx.from-desktop {
    min-height: 80px;
  }
}

.logo {
  display: flex;
  align-items: center;
  flex-shrink: 0;
  max-width: 300px;
  color: var(--site-color-primary);

  &:focus-visible {
    outline-color: var(--site-color-primary);
  }
}

.logoImg {
  display: block;
  width: 100%;
  height: auto;
  max-height: 56px;
  object-fit: contain;
  object-position: left center;
}

.logoText {
  font-family: var(--fs-font-display);
  font-size: var(--fs-text-xl);
  font-weight: var(--fs-weight-bold);
  letter-spacing: -0.02em;
  line-height: 1;
}

.nav {
  flex: 1;
  min-width: 0;
  display: flex;
  justify-content: flex-end;
}

.navList {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  align-items: center;
  gap: var(--fs-space-1) var(--fs-space-2);

  @include mx.from-desktop {
    gap: var(--fs-space-2) var(--fs-space-3);
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
  transition: color 0.15s ease, opacity 0.15s ease;

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
