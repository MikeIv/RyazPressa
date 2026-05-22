<script setup lang="ts">
const props = defineProps<{
  variant: 'mobile' | 'desktop'
  imageFailed: boolean
}>()

const emit = defineEmits<{
  imageError: []
}>()

const { site } = useSiteConfig()

const ariaLabel = computed(
  () => `${site.value?.name ?? 'Главная'} — перейти на главную страницу`,
)

const showImage = computed(
  () => Boolean(site.value?.theme.logoSrc) && !props.imageFailed,
)
</script>

<template>
  <NuxtLink
    to="/"
    :class="[$style.logo, props.variant === 'mobile' ? $style.mobile : $style.desktop]"
    :aria-label="ariaLabel"
  >
    <img
      v-if="showImage"
      :src="site?.theme.logoSrc"
      :alt="site?.theme.logoAlt ?? ''"
      :class="$style.img"
      width="300"
      height="28"
      @error="emit('imageError')"
    />
    <span v-else :class="$style.text">{{ site?.name }}</span>
  </NuxtLink>
</template>

<style module lang="scss">
@use '~/assets/styles/tools/mixins' as mx;

.logo {
  display: flex;
  align-items: center;
  color: var(--site-color-primary);

  &:focus-visible {
    outline-color: var(--site-color-primary);
  }
}

.mobile {
  flex: 1;
  min-width: 0;
  max-width: min(200px, 48vw);

  @include mx.from-desktop {
    display: none;
  }

  .img {
    max-height: 32px;
  }

  .text {
    font-size: var(--fs-text-sm);
  }
}

.desktop {
  display: none;
  flex-shrink: 0;
  max-width: 300px;

  @include mx.from-desktop {
    display: flex;
  }

  .img {
    max-height: 56px;
  }

  .text {
    font-size: var(--fs-text-xl);
  }
}

.img {
  display: block;
  width: 100%;
  height: auto;
  object-fit: contain;
  object-position: left center;
}

.text {
  font-family: var(--fs-font-display);
  font-weight: var(--fs-weight-bold);
  letter-spacing: -0.02em;
  line-height: 1;
}
</style>
