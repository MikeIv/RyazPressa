import {
  applyRootFontSize,
  FONT_SIZE_DEFAULT_PX,
  readStoredFontSize,
} from '#shared/constants/fontScale'

/** Восстанавливает размер шрифта до первого рендера, чтобы не было скачка. */
export default defineNuxtPlugin({
  name: 'font-scale',
  enforce: 'pre',
  setup() {
    const initial = readStoredFontSize()
    const fontSizePx = useState('font-size-px', () => FONT_SIZE_DEFAULT_PX)
    fontSizePx.value = initial
    applyRootFontSize(initial)
  },
})
