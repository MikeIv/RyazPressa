/**
 * Smoke-тест multi-tenant: нужен запущенный `pnpm dev` (или preview).
 * Проверяет изоляцию сайтов по заголовку Host (через node:http — fetch блокирует Host).
 *
 * Usage: pnpm smoke:sites
 */

import http from 'node:http'
import { URL } from 'node:url'

const BASE = (process.env.SMOKE_BASE ?? 'http://localhost:3000').replace(/\/$/, '')

function requestJson(path, host) {
  const url = new URL(path, BASE)

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

  const nese = await requestJson('/api/_site', 'nesecretno.ru')
  assert(nese.status === 200, `nesecretno.ru /api/_site: expected 200, got ${nese.status}`)
  assert(nese.body.slug === 'nesecretno', `expected slug nesecretno, got ${nese.body.slug}`)
  assert(nese.body.sections.gallery === true, 'nesecretno: gallery must be enabled')
  console.log('✓ nesecretno.ru → slug, sections')

  const galleryRyaz = await requestJson('/api/gallery', 'ryazpressa.ru')
  assert(galleryRyaz.status === 404, `ryazpressa gallery: expected 404, got ${galleryRyaz.status}`)
  console.log('✓ ryazpressa.ru /api/gallery → 404')

  const galleryNese = await requestJson('/api/gallery', 'nesecretno.ru')
  assert(galleryNese.status === 200, `nesecretno gallery: expected 200, got ${galleryNese.status}`)
  assert(Array.isArray(galleryNese.body.data), 'nesecretno gallery: expected data array')
  console.log('✓ nesecretno.ru /api/gallery → 200')

  const newsNese = await requestJson('/api/news', 'nesecretno.ru')
  assert(newsNese.status === 200 && newsNese.body.data?.length > 0, 'nesecretno news empty')
  console.log('✓ nesecretno.ru /api/news → data')

  console.log('\nВсе проверки пройдены.')
}

main().catch((err) => {
  console.error('\n✗ Smoke failed:', err.message)
  console.error('Запустите dev-сервер: pnpm dev')
  process.exit(1)
})
