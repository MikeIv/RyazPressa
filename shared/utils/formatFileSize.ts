/** Размер файла для отображения (ru). */
export function formatFileSize(bytes?: number): string | undefined {
  if (bytes === undefined) return undefined
  if (bytes < 1024) return `${bytes} Б`
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} КБ`
  return `${(bytes / (1024 * 1024)).toFixed(1)} МБ`
}
