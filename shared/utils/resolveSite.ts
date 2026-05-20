import type { H3Event } from 'h3'
import { getRequestHeader } from 'h3'
import { getSiteByDomain, getSiteBySlug } from '#shared/sites'
import type { SiteConfig } from '#shared/types/site'

const LOCAL_HOSTS = new Set(['localhost', '127.0.0.1'])

function parseHostname(host: string): string {
  return host.split(':')[0]?.toLowerCase() ?? ''
}

/** Host из запроса: `X-Forwarded-Host` (прокси) или `Host`. */
export function getRequestHost(event: H3Event): string {
  const forwarded = getRequestHeader(event, 'x-forwarded-host')
  const raw = forwarded?.split(',')[0]?.trim() || getRequestHeader(event, 'host') || ''
  return raw
}

/**
 * Определяет сайт по Host и опциональному slug (для localhost).
 */
export function resolveSite(host: string, fallbackSlug: string): SiteConfig | undefined {
  const hostname = parseHostname(host)

  if (LOCAL_HOSTS.has(hostname)) {
    return getSiteBySlug(fallbackSlug)
  }

  return getSiteByDomain(hostname)
}
