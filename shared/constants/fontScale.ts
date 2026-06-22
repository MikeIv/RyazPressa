export const FONT_SCALE_STORAGE_KEY = 'ryazpressa-font-size'

/** Синхронизировано с `$base-font-size` в SCSS. */
export const FONT_SIZE_DEFAULT_PX = 18
export const FONT_SIZE_MIN_PX = 16
export const FONT_SIZE_MAX_PX = 24
export const FONT_SIZE_STEP_PX = 1

export const FONT_ROOT_VAR = '--fs-root-font-size'

export function clampFontSize(px: number): number {
  return Math.min(FONT_SIZE_MAX_PX, Math.max(FONT_SIZE_MIN_PX, px))
}

export function parseStoredFontSize(raw: string | null): number | null {
  if (!raw) return null
  const parsed = Number.parseInt(raw, 10)
  if (Number.isNaN(parsed)) return null
  return clampFontSize(parsed)
}

export function readStoredFontSize(): number {
  try {
    return parseStoredFontSize(localStorage.getItem(FONT_SCALE_STORAGE_KEY)) ?? FONT_SIZE_DEFAULT_PX
  } catch {
    return FONT_SIZE_DEFAULT_PX
  }
}

export function applyRootFontSize(px: number): void {
  document.documentElement.style.setProperty(FONT_ROOT_VAR, `${px}px`)
}
