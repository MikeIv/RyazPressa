<script setup lang="ts">
const { site } = useSiteConfig()
const route = useRoute()

const isMenuOpen = ref(false)

function toggleMenu() {
  isMenuOpen.value = !isMenuOpen.value
}

function closeMenu() {
  isMenuOpen.value = false
}

function isActive(to: string): boolean {
  if (to === '/') return route.path === '/'
  return route.path === to || route.path.startsWith(to + '/')
}

watch(
  () => route.path,
  () => {
    isMenuOpen.value = false
  },
)
</script>

<template>
  <header :class="$style.header" role="banner">
    <div :class="[$style.inner, 'container']">
      <NuxtLink
        to="/"
        :class="$style.logo"
        :aria-label="`${site?.name ?? 'Главная'} — перейти на главную страницу`"
      >
        <img
          v-if="site?.theme.logoSrc"
          :src="site.theme.logoSrc"
          :alt="site.theme.logoAlt"
          :class="$style.logoImg"
          width="160"
          height="40"
        />
        <span v-else :class="$style.logoText">{{ site?.name }}</span>
      </NuxtLink>

      <button
        :class="[$style.menuBtn, isMenuOpen && $style.menuBtnOpen]"
        type="button"
        :aria-expanded="isMenuOpen"
        aria-controls="main-nav"
        :aria-label="isMenuOpen ? 'Закрыть меню' : 'Открыть меню навигации'"
        @click="toggleMenu"
      >
        <span :class="$style.menuIcon" aria-hidden="true" />
        <span :class="$style.menuIcon" aria-hidden="true" />
        <span :class="$style.menuIcon" aria-hidden="true" />
      </button>

      <nav
        id="main-nav"
        :class="[$style.nav, isMenuOpen && $style.navOpen]"
        aria-label="Основная навигация"
      >
        <ul :class="$style.navList" role="list">
          <li v-for="item in site?.nav" :key="item.to">
            <NuxtLink
              :to="item.to"
              :class="[$style.navLink, isActive(item.to) && $style.navLinkActive]"
              @click="closeMenu"
            >
              {{ item.label }}
            </NuxtLink>
          </li>
        </ul>
      </nav>
    </div>
  </header>
</template>

<style module lang="scss">
@use '~/assets/styles/tools/mixins' as mx;

.header {
  background-color: var(--site-color-primary);
  color: #fff;
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: 0 2px 8px rgb(0 0 0 / 15%);
}

.inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 64px;
  gap: var(--fs-space-2);

  @include mx.from-desktop {
    min-height: 72px;
  }
}

/* Логотип */
.logo {
  display: flex;
  align-items: center;
  flex-shrink: 0;
  color: #fff;

  &:focus-visible {
    outline-color: #fff;
  }
}

.logoImg {
  height: 40px;
  width: auto;
}

.logoText {
  font-size: var(--fs-text-xl);
  font-weight: var(--fs-weight-bold);
  letter-spacing: -0.02em;
  line-height: 1;
}

/* Кнопка мобильного меню */
.menuBtn {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 5px;
  width: 40px;
  height: 40px;
  padding: 8px;
  color: #fff;
  border-radius: var(--site-radius-sm);
  transition: background 0.2s ease;
  flex-shrink: 0;

  &:hover {
    background: rgb(255 255 255 / 15%);
  }

  &:focus-visible {
    outline-color: #fff;
  }

  @include mx.from-desktop {
    display: none;
  }
}

.menuIcon {
  display: block;
  width: 100%;
  height: 2px;
  background: currentcolor;
  border-radius: 1px;
  transition: transform 0.2s ease, opacity 0.2s ease;
}

.menuBtnOpen {
  .menuIcon:nth-child(1) {
    transform: translateY(7px) rotate(45deg);
  }

  .menuIcon:nth-child(2) {
    opacity: 0;
  }

  .menuIcon:nth-child(3) {
    transform: translateY(-7px) rotate(-45deg);
  }
}

/* Навигация */
.nav {
  display: none;
  width: 100%;

  @include mx.from-desktop {
    display: block;
    width: auto;
  }
}

.navOpen {
  display: block;
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background-color: var(--site-color-primary);
  box-shadow: 0 4px 8px rgb(0 0 0 / 15%);
  padding-block: var(--fs-space-1);
  z-index: 99;
}

.navList {
  display: flex;
  flex-direction: column;

  @include mx.from-desktop {
    flex-direction: row;
    align-items: center;
    gap: var(--fs-space-1);
  }
}

.navLink {
  display: block;
  padding: 10px var(--fs-space-2);
  font-size: var(--fs-text-sm);
  font-weight: var(--fs-weight-medium);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: rgb(255 255 255 / 85%);
  border-radius: var(--site-radius-sm);
  transition: color 0.15s ease, background 0.15s ease;
  white-space: nowrap;

  &:hover {
    color: #fff;
    background: rgb(255 255 255 / 12%);
  }

  &:focus-visible {
    outline-color: #fff;
  }

  @include mx.from-desktop {
    padding: 6px 12px;
  }
}

.navLinkActive {
  color: #fff;
  background: rgb(255 255 255 / 18%);
}
</style>
