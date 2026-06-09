/** Убирает `www.` / `web.` — для `X-Site-Slug` до первого `/api/_site` (бэкенд ждёт apex-домен). */
export function guessApiSiteHostFromHostname(hostname: string): string {
  let host = hostname.split(':')[0]?.toLowerCase() ?? ''
  if (host.startsWith('www.')) host = host.slice(4)
  if (host.startsWith('web.')) host = host.slice(4)
  return host
}
