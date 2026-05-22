function parseHex(hex: string): [number, number, number] {
  const normalized = hex.trim().replace('#', '')
  const full =
    normalized.length === 3
      ? normalized
          .split('')
          .map((char) => char + char)
          .join('')
      : normalized

  if (full.length !== 6) {
    throw new Error(`Invalid hex color: ${hex}`)
  }

  return [
    Number.parseInt(full.slice(0, 2), 16),
    Number.parseInt(full.slice(2, 4), 16),
    Number.parseInt(full.slice(4, 6), 16),
  ]
}

function toHex(r: number, g: number, b: number): string {
  const channel = (value: number): string =>
    Math.round(Math.min(255, Math.max(0, value)))
      .toString(16)
      .padStart(2, '0')

  return `#${channel(r)}${channel(g)}${channel(b)}`
}

function mix(hex1: string, hex2: string, weight: number): string {
  const [r1, g1, b1] = parseHex(hex1)
  const [r2, g2, b2] = parseHex(hex2)
  const ratio = Math.min(1, Math.max(0, weight))

  return toHex(
    r1 * (1 - ratio) + r2 * ratio,
    g1 * (1 - ratio) + g2 * ratio,
    b1 * (1 - ratio) + b2 * ratio,
  )
}

function relativeLuminance(hex: string): number {
  const channels = parseHex(hex).map((value) => {
    const channel = value / 255
    return channel <= 0.03928 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4
  })

  const [r, g, b] = channels
  return 0.2126 * (r ?? 0) + 0.7152 * (g ?? 0) + 0.0722 * (b ?? 0)
}

function colorDistance(hex1: string, hex2: string): number {
  const [r1, g1, b1] = parseHex(hex1)
  const [r2, g2, b2] = parseHex(hex2)

  return Math.sqrt((r1 - r2) ** 2 + (g1 - g2) ** 2 + (b1 - b2) ** 2) / 441.67
}

/** Градиент верхней плашки header из primary/accent текущего сайта. */
export function buildHeaderGradient(colorPrimary: string, colorAccent: string): string {
  const start = mix(colorPrimary, '#000000', 0.22)
  let end = colorAccent

  if (relativeLuminance(colorAccent) < 0.08) {
    end = mix(colorPrimary, '#ffffff', 0.32)
  } else if (colorDistance(colorPrimary, colorAccent) < 0.06) {
    end = mix(colorAccent, '#ffffff', 0.18)
  }

  return `linear-gradient(90deg, ${start} 0%, ${colorPrimary} 45%, ${end} 100%)`
}
