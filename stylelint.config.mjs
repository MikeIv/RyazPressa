/** @type {import('stylelint').Config} */
export default {
  extends: ['stylelint-config-recommended-vue'],
  ignoreFiles: ['**/node_modules/**', '.nuxt/**', '.output/**', 'dist/**'],
  rules: {
    /** Пустой `<style>` в SFC допустим на этапе заготовки */
    'no-empty-source': null,
    /** BEM / CSS modules — не навязываем паттерн имён классов */
    'selector-class-pattern': null,
    /** Гибче для вложенности в блоках `<style>` SFC (в т.ч. CSS modules) */
    'rule-empty-line-before': null,
  },
}
