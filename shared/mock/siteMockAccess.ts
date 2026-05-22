import type { Article, ContactInfo, DocumentItem, GalleryItem, NewsItem } from '#shared/types/api'
import { mockArticlesBySite, mockNewsBySite } from '#shared/mock/news'
import { mockContactsBySite } from '#shared/mock/contacts'
import { mockDocumentsBySite } from '#shared/mock/documents'
import { mockGalleryBySite } from '#shared/mock/gallery'

/** Эталон mock-данных для базовых сайтов без собственного набора. */
export const BASE_SITE_MOCK_SLUG = 'nesecretno'

export function getNewsForSite(slug: string): NewsItem[] {
  return mockNewsBySite[slug] ?? mockNewsBySite[BASE_SITE_MOCK_SLUG] ?? []
}

export function getArticlesForSite(slug: string): Article[] {
  if (mockArticlesBySite[slug]) {
    return mockArticlesBySite[slug]
  }

  return getNewsForSite(slug).map((item) => ({
    ...item,
    content: `<p>Текст статьи для сайта «${slug}».</p>`,
    author: 'Редакция',
  }))
}

export function getContactsForSite(slug: string): ContactInfo | undefined {
  return mockContactsBySite[slug] ?? mockContactsBySite[BASE_SITE_MOCK_SLUG]
}

export function getDocumentsForSite(slug: string): DocumentItem[] {
  return mockDocumentsBySite[slug] ?? mockDocumentsBySite[BASE_SITE_MOCK_SLUG] ?? []
}

export function getGalleryForSite(slug: string): GalleryItem[] {
  return mockGalleryBySite[slug] ?? mockGalleryBySite[BASE_SITE_MOCK_SLUG] ?? []
}
