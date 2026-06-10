<script setup lang="ts">
import { formatNowDate, formatNowTime } from '#shared/utils/formatDate'

const now = ref(new Date())

let timer: ReturnType<typeof setInterval> | undefined

onMounted(() => {
  timer = setInterval(() => {
    now.value = new Date()
  }, 60_000)
})

onUnmounted(() => {
  if (timer !== undefined) {
    clearInterval(timer)
  }
})

const dateLabel = computed(() => formatNowDate(now.value))
const timeLabel = computed(() => formatNowTime(now.value))
const datetimeAttr = computed(() => now.value.toISOString())
</script>

<template>
  <p :class="$style.now" role="status" aria-live="polite">
    <time :datetime="datetimeAttr">
      <span :class="$style.date">{{ dateLabel }}</span>
      <span :class="$style.time">{{ timeLabel }}</span>
    </time>
  </p>
</template>

<style module lang="scss">
.now {
  margin: 0;
  text-align: left;
}

.date,
.time {
  font-size: var(--fs-text-sm);
  line-height: var(--fs-leading-snug);
}

.date {
  color: var(--fs-color-text-muted);
  text-transform: capitalize;
}

.time {
  margin-left: var(--fs-space-2);
  font-weight: var(--fs-weight-semibold);
  color: var(--site-color-primary);
}
</style>
