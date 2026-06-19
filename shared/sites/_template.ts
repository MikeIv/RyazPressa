/**
 * Шаблон добавления сайта — справочный файл, **не импортируется** в реестр.
 *
 * @see docs/dev-multi-site.md — пошаговая инструкция
 * @see shared/sites/manifest.json — базовые издания (25 шт.)
 * @see shared/sites/ryazpressa.ts — расширенный сайт (округа, проекты)
 */

import type { SiteConfig } from '#shared/types/site'
import {
  BASE_SITE_SECTIONS,
  EXTENDED_SITE_NAV_ORDER,
  navFromSections,
} from '#shared/sites/baseSections'

// --- Вариант A: базовое издание (gallery + documents + contacts) ---
//
// 1. Добавьте запись в shared/sites/manifest.json:
//    { "slug": "example", "name": "Пример", "domain": "example.ru" }
// 2. Добавьте цвета в shared/sites/siteBrandColors.ts
// 3. pnpm generate:logos && pnpm validate:sites
//
// Конфиг собирается автоматически через createBaseSiteConfig() в baseSites.ts.

const _baseSiteExample: SiteConfig = {
  slug: 'example',
  name: 'Пример',
  domains: ['example.ru', 'www.example.ru'],
  // apiBase: не указываем для базовых — fallback на глобальный NUXT_PUBLIC_API_BASE (см. createBaseSiteConfig).
  // При необходимости переопределить — указать здесь строкой.
  theme: {
    colorPrimary: '#1e73be',
    colorAccent: '#008ca8',
    colorText: '#1a1a1a',
    colorBackground: '#ffffff',
    radiusSm: '4px',
    radiusMd: '12px',
    logoSrc: '/sites/example/logo.svg',
    logoAlt: 'Пример — региональное издание',
  },
  sections: { ...BASE_SITE_SECTIONS },
  nav: navFromSections(BASE_SITE_SECTIONS),
  articlePathPrefix: '/news',
}

// --- Вариант B: расширенный сайт (как ryazpressa) ---
//
// 1. Создайте shared/sites/{slug}.ts по образцу ниже
// 2. Импортируйте в shared/sites/index.ts перед baseSiteConfigs
// 3. public/sites/{slug}/logo.svg + pnpm validate:sites

const _extendedSections = {
  gallery: false,
  documents: true,
  contacts: true,
  okruga: true,
  ryadomSNami: true,
  projects: true,
  price: false,
} as const

const _extendedSiteExample: SiteConfig = {
  slug: 'example-extended',
  name: 'Пример расширенный',
  domains: ['example-extended.ru', 'www.example-extended.ru'],
  // apiBase: не указываем — будет использован глобальный fallback (NUXT_PUBLIC_API_BASE).
  // Для site-specific базы укажите значение здесь (как в ryazpressa.ts).
  theme: {
    colorPrimary: '#1a4b8c',
    colorAccent: '#c62828',
    colorText: '#1a1a1a',
    colorBackground: '#ffffff',
    radiusSm: '4px',
    radiusMd: '8px',
    logoSrc: '/sites/example-extended/logo.svg',
    logoAlt: 'Пример расширенный',
  },
  sections: { ..._extendedSections },
  nav: navFromSections(_extendedSections, EXTENDED_SITE_NAV_ORDER),
  articlePathPrefix: '',
}

export {}
