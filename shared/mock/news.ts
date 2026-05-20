import type { Article, NewsItem } from '#shared/types/api'

const baseImage = {
  url: '/mock/news-placeholder.jpg',
  alt: 'Иллюстрация к новости',
  width: 800,
  height: 450,
}

export const mockNewsBySite: Record<string, NewsItem[]> = {
  ryazpressa: [
    {
      id: '1',
      slug: 'gorodskaya-infrastruktura',
      title: 'Обновление городской инфраструктуры в Рязани',
      lead: 'В центре города начались работы по модернизации общественных пространств.',
      image: baseImage,
      category: 'Город',
      publishedAt: '2026-05-18T09:00:00+03:00',
    },
    {
      id: '2',
      slug: 'kulturnaya-programma',
      title: 'Культурная программа на выходные',
      lead: 'Театры и музеи региона представили афишу мероприятий.',
      category: 'Культура',
      publishedAt: '2026-05-17T14:30:00+03:00',
    },
    {
      id: '3',
      slug: 'sportivnye-dostizheniya',
      title: 'Спортивные достижения рязанских команд',
      lead: 'Региональные команды показали результат на всероссийских соревнованиях.',
      category: 'Спорт',
      publishedAt: '2026-05-16T11:15:00+03:00',
    },
  ],
  nesecretno: [
    {
      id: 'n1',
      slug: 'mestnye-novosti',
      title: 'Местные новости недели',
      lead: 'Краткий обзор главных событий региона.',
      image: baseImage,
      publishedAt: '2026-05-18T08:00:00+03:00',
    },
    {
      id: 'n2',
      slug: 'obschestvennaya-initsiativa',
      title: 'Общественная инициатива получила поддержку',
      lead: 'Жители предложили улучшения для общественных пространств.',
      publishedAt: '2026-05-15T16:00:00+03:00',
    },
  ],
}

const ryazpressaNews = mockNewsBySite.ryazpressa ?? []
const nesecretnoNews = mockNewsBySite.nesecretno ?? []

export const mockArticlesBySite: Record<string, Article[]> = {
  ryazpressa: ryazpressaNews.map((item) => ({
    ...item,
    content:
      '<p>Подробный текст новости. Здесь будет HTML-разметка от бэкенда: абзацы, списки, цитаты.</p>',
    author: 'Редакция',
    tags: ['город', 'развитие'],
  })),
  nesecretno: nesecretnoNews.map((item) => ({
    ...item,
    content: '<p>Текст статьи для сайта «Не секретно».</p>',
    author: 'Редакция',
  })),
}
