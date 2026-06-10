/** Убирает HTML-теги и схлопывает пробелы (анонс в ленте из `content`). */
export function htmlToPlainText(html: string): string {
  if (!html.trim()) return ''

  return html
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&#(\d+);/g, (_, code: string) => String.fromCharCode(Number(code)))
    .replace(/&[a-z]+;/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}
