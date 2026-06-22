import {
  FONT_SCALE_STORAGE_KEY,
  FONT_SIZE_DEFAULT_PX,
  FONT_SIZE_STEP_PX,
  FONT_SIZE_MAX_PX,
  FONT_SIZE_MIN_PX,
  applyRootFontSize,
  clampFontSize,
} from '#shared/constants/fontScale'

/** Масштаб корневого шрифта (rem-токены) с сохранением в localStorage. */
export function useFontScale() {
  const fontSizePx = useState('font-size-px', () => FONT_SIZE_DEFAULT_PX)
  const announcement = useState('font-size-announcement', () => '')

  function persist(px: number): void {
    const next = clampFontSize(px)
    if (next === fontSizePx.value) return

    fontSizePx.value = next
    applyRootFontSize(next)

    try {
      localStorage.setItem(FONT_SCALE_STORAGE_KEY, String(next))
    } catch {
      /* private mode / quota */
    }

    announcement.value = `Размер шрифта: ${next} пикселей`
  }

  function increase(): void {
    persist(fontSizePx.value + FONT_SIZE_STEP_PX)
  }

  function decrease(): void {
    persist(fontSizePx.value - FONT_SIZE_STEP_PX)
  }

  const canIncrease = computed(() => fontSizePx.value < FONT_SIZE_MAX_PX)
  const canDecrease = computed(() => fontSizePx.value > FONT_SIZE_MIN_PX)

  return {
    fontSizePx,
    announcement,
    increase,
    decrease,
    canIncrease,
    canDecrease,
  }
}
