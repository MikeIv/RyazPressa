<script setup lang="ts">
withDefaults(
  defineProps<{
    tag?: string
    width?: string
    height?: string
    radius?: string
  }>(),
  {
    tag: 'span',
    width: undefined,
    height: undefined,
    radius: undefined,
  },
)
</script>

<template>
  <component
    :is="tag"
    :class="$style.bone"
    :style="{ width, height, borderRadius: radius }"
    aria-hidden="true"
  />
</template>

<style module lang="scss">
@use '~/assets/styles/tools/skeleton' as sk;

.bone {
  @include sk.bone;
}
</style>
