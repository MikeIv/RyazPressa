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
  category?: string | number
  publishedAt: IsoDateTime
}

/** Полная статья. */
export interface Article extends NewsItem {
  content: string
  author?: string
  tags?: string[]
}

/** Период выборки для ленты новостей. */
export type NewsListPeriod = 'today-yesterday'

export interface NewsListParams {
  page?: number
  perPage?: number
  category?: string
  district?: string
  /** Только сегодня и вчера (блок «Главное сегодня»). */
  period?: NewsListPeriod
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
  /** Имя файла при скачивании (если отличается от заголовка). */
  fileName?: string
  fileSize?: number
  publishedAt: IsoDateTime
}

export interface ContactPhoneEntry {
  number: string
  label?: string
}

export interface ContactEmailEntry {
  address: string
  label?: string
}

/** Контакты редакции. */
export interface ContactInfo {
  title?: string
  chief?: string
  address?: string
  coords?: string
  ageRating?: string
  rknRegistration?: string
  phones?: ContactPhoneEntry[]
  emails?: ContactEmailEntry[]
  /** Legacy mock: одна строка — нормализатор приводит к `phones`. */
  phone?: string
  /** Legacy mock: одна строка — нормализатор приводит к `emails`. */
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

/** Тариф подписки на газету. */
export interface Tariff {
  id: string
  name: string
  /** Стоимость в рублях (десятичная строка, например `"500.00"`). */
  price: string
  createdAt?: IsoDateTime
  updatedAt?: IsoDateTime
}

/** Региональное издание (газета) для подписки. */
export interface Paper {
  id: string
  title: string
}

/** Тело заказа подписки (legacy `type`/`dt`/`paper[]`, будущий `POST /api/paper-orders`). */
export interface PaperOrderRequest {
  email: string
  /** ID тарифа. */
  type: string
  /** Дата начала в формате `DD.MM.YYYY`. */
  dt: string
  /** ID выбранных изданий. */
  paper: string[]
}

/** Ответ оформления подписки (редирект на оплату или успех без оплаты). */
export interface PaperOrderResponse {
  success: boolean
  orderId: string
  error?: string
  /** URL платёжного шлюза (Сбербанк). */
  formUrl?: string
}
