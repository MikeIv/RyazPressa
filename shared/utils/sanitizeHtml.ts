import DOMPurify from 'isomorphic-dompurify'

/** Безопасная HTML-разметка CMS для `v-html` (defense-in-depth поверх санитизации бэкенда). */
export function sanitizeHtml(html: string): string {
  if (!html.trim()) return ''

  return DOMPurify.sanitize(html, {
    USE_PROFILES: { html: true },
  })
}
