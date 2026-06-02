/** Основной домен сайта (без `www.`) — для заголовка `X-Site-Slug` на бэкенде. */
export function getPrimarySiteDomain(domains: readonly string[]): string | undefined {
  const apex = domains.find((domain) => !domain.startsWith('www.'))
  return apex ?? domains[0]
}
