/** Регистрирует apex и www; для IDN добавляет punycode-вариант. */
export function expandSiteDomains(domain: string): readonly string[] {
  const variants = new Set<string>()
  const normalized = domain.trim().toLowerCase()

  const register = (host: string): void => {
    variants.add(host)
    if (!host.startsWith('www.')) {
      variants.add(`www.${host}`)
    }
  }

  register(normalized)

  try {
    const asciiHost = new URL(`http://${normalized}`).hostname
    register(asciiHost)
  } catch {
    /* домен остаётся только в normalized */
  }

  return [...variants]
}
