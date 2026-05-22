/**
 * Smoke-тест multi-tenant: нужен запущенный `pnpm dev` (или preview).
 * Проверяет изоляцию сайтов по заголовку Host (через node:http — fetch блокирует Host).
 *
 * Usage: pnpm smoke:sites
 */

import fs from 'node:fs'
import http from 'node:http'
import path from 'node:path'
import { fileURLToPath, URL } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const manifest = JSON.parse(fs.readFileSync(path.join(root, 'shared/sites/manifest.json'), 'utf8'))

const BASE = (process.env.SMOKE_BASE ?? 'http://localhost:3000').replace(/\/$/, '')

function requestJson(pathname, host) {
  const url = new URL(pathname, BASE)

  return new Promise((resolve, reject) => {
    http
      .get(
        {
          hostname: url.hostname,
          port: url.port || 80,
          path: url.pathname + url.search,
          headers: { Host: host },
        },
        (res) => {
          let raw = ''
          res.on('data', (chunk) => {
            raw += chunk
          })
          res.on('end', () => {
            let body = raw
            try {
              body = JSON.parse(raw)
            } catch {
              /* not json */
            }
            resolve({ status: res.statusCode ?? 0, body })
          })
        },
      )
      .on('error', reject)
  })
}

function assert(condition, message) {
  if (!condition) throw new Error(message)
}

async function main() {
  console.log(`Smoke: ${BASE}\n`)

  const ryaz = await requestJson('/api/_site', 'ryazpressa.ru')
  assert(ryaz.status === 200, `ryazpressa.ru /api/_site: expected 200, got ${ryaz.status}`)
  assert(ryaz.body.slug === 'ryazpressa', `expected slug ryazpressa, got ${ryaz.body.slug}`)
  assert(ryaz.body.sections.gallery === false, 'ryazpressa: gallery must be disabled')
  console.log('✓ ryazpressa.ru → slug, sections')

  for (const entry of manifest) {
    const res = await requestJson('/api/_site', entry.domain)
    assert(res.status === 200, `${entry.domain} /api/_site: expected 200, got ${res.status}`)
    assert(
      res.body.slug === entry.slug,
      `${entry.domain}: expected slug ${entry.slug}, got ${res.body.slug}`,
    )
    assert(res.body.sections.gallery === true, `${entry.slug}: gallery must be enabled`)
    console.log(`✓ ${entry.domain} → ${entry.slug}`)
  }

  const galleryRyaz = await requestJson('/api/gallery', 'ryazpressa.ru')
  assert(galleryRyaz.status === 404, `ryazpressa gallery: expected 404, got ${galleryRyaz.status}`)
  console.log('✓ ryazpressa.ru /api/gallery → 404')

  const sample = manifest[0]
  const galleryBase = await requestJson('/api/gallery', sample.domain)
  assert(
    galleryBase.status === 200,
    `${sample.slug} gallery: expected 200, got ${galleryBase.status}`,
  )
  assert(Array.isArray(galleryBase.body.data), `${sample.slug} gallery: expected data array`)
  console.log(`✓ ${sample.domain} /api/gallery → 200`)

  const newsSample = await requestJson('/api/news', 'denzadnem.su')
  assert(newsSample.status === 200 && newsSample.body.data?.length > 0, 'denzadnem news empty')
  console.log('✓ denzadnem.su /api/news → data')

  const unknown = await requestJson('/api/_site', 'unknown.example')
  assert(unknown.status === 404, `unknown host: expected 404, got ${unknown.status}`)
  console.log('✓ unknown host → 404')

  console.log(`\nВсе проверки пройдены (${manifest.length + 1} сайтов).`)
}

main().catch((err) => {
  console.error('\n✗ Smoke failed:', err.message)
  console.error('Запустите dev-сервер: pnpm dev')
  process.exit(1)
})
