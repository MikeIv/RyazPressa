/** Общие HTTP-типы и контракт API платформы. */

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'HEAD' | 'OPTIONS'

/** ISO 8601, например `2026-05-19T10:00:00+03:00` */
export type IsoDateTime = string

export interface ImageAsset {
  url: string
  alt: string
  width?: number
  height?: number
}

export interface PaginatedMeta {
  page: number
  perPage: number
  total: number
  totalPages: number
}

export interface PaginatedResponse<T> {
  data: T[]
  meta: PaginatedMeta
}

/** Ответ со списком без пагинации. */
export interface ListResponse<T> {
  data: T[]
}

export interface ApiErrorBody {
  statusCode: number
  message: string
}

/** Карточка новости в ленте (главная, списки). */
export interface NewsItem {
  id: string
  slug: string
  title: string
  lead: string
  image?: ImageAsset
  category?: string
  publishedAt: IsoDateTime
}

/** Полная статья. */
export interface Article extends NewsItem {
  content: string
  author?: string
  tags?: string[]
}

export interface NewsListParams {
  page?: number
  perPage?: number
  category?: string
  district?: string
}

/** Элемент фотогалереи. */
export interface GalleryItem {
  id: string
  title: string
  image: ImageAsset
  publishedAt: IsoDateTime
}

/** Документ для скачивания. */
export interface DocumentItem {
  id: string
  title: string
  fileUrl: string
  fileSize?: number
  publishedAt: IsoDateTime
}

/** Контакты редакции. */
export interface ContactInfo {
  title: string
  address?: string
  phone?: string
  email?: string
  workingHours?: string
  mapEmbedUrl?: string
}

/** Округ (раздел ryazpressa.ru). */
export interface District {
  slug: string
  name: string
  description?: string
}

export interface DistrictDetail extends District {
  news: NewsItem[]
}

/** Спецпроект редакции. */
export interface Project {
  slug: string
  title: string
  lead: string
  image?: ImageAsset
  publishedAt: IsoDateTime
}

export interface ProjectDetail extends Project {
  content: string
}

/** Раздел «Рядом с нами». */
export interface NearUsSection {
  title: string
  content: string
}
