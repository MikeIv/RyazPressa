import type { Article, ImageAsset, NewsItem } from '#shared/types/api'
import { RYADOM_S_NAMI_SEGMENT } from '#shared/utils/newsArticlePath'

function mockNewsImage(file: string, alt: string): ImageAsset {
  return {
    url: `/mock/news/${file}`,
    alt,
    width: 800,
    height: 450,
  }
}

export const mockNewsBySite: Record<string, NewsItem[]> = {
  ryazpressa: [
    {
      id: '1',
      slug: 'gorodskaya-infrastruktura',
      title: 'Обновление городской инфраструктуры в Рязани',
      lead: 'В центре города начались работы по модернизации общественных пространств и благоустройству набережной.',
      image: mockNewsImage('city.svg', 'Городской пейзаж — иллюстрация к новости'),
      category: 'Город',
      publishedAt: '2026-05-22T09:00:00+03:00',
    },
    {
      id: '2',
      slug: 'kulturnaya-programma',
      title: 'Культурная программа на выходные',
      lead: 'Театры и музеи региона представили афишу мероприятий для всей семьи.',
      image: mockNewsImage('culture.svg', 'Культурное мероприятие — иллюстрация к новости'),
      category: 'Культура',
      publishedAt: '2026-05-21T14:30:00+03:00',
    },
    {
      id: '3',
      slug: 'sportivnye-dostizheniya',
      title: 'Спортивные достижения рязанских команд',
      lead: 'Региональные команды показали результат на всероссийских соревнованиях.',
      image: mockNewsImage('sport.svg', 'Спортивное событие — иллюстрация к новости'),
      category: 'Спорт',
      publishedAt: '2026-05-20T11:15:00+03:00',
    },
    {
      id: '4',
      slug: 'obrazovanie-it-kursy',
      title: 'В школах области запускают новые IT-курсы',
      lead: 'Учебные программы по программированию и цифровой грамотности появятся в десятках школ Рязанской области.',
      image: mockNewsImage('education.svg', 'Образование — иллюстрация к новости'),
      category: 'Образование',
      publishedAt: '2026-05-19T16:45:00+03:00',
    },
    {
      id: '5',
      slug: 'sotsialnaya-podderzhka-semyam',
      title: 'Расширена программа социальной поддержки семей с детьми',
      lead: 'Регион увеличил число мер поддержки для молодых родителей и многодетных семей.',
      image: mockNewsImage('default.svg', 'Социальная поддержка — иллюстрация к новости'),
      category: 'Общество',
      publishedAt: '2026-05-18T10:20:00+03:00',
    },
    {
      id: '6',
      slug: 'transportnaya-infrastruktura',
      title: 'Обновят расписание пригородных поездов в области',
      lead: 'Изменения вступят в силу с начала летнего сезона на ключевых направлениях.',
      image: mockNewsImage('city.svg', 'Транспорт — иллюстрация к новости'),
      category: 'Транспорт',
      publishedAt: '2026-05-18T07:40:00+03:00',
    },
    {
      id: '7',
      slug: 'ekologicheskaya-akciya',
      title: 'В регионе стартовала экологическая акция по высадке деревьев',
      lead: 'Волонтёры и муниципалитеты высадили более тысячи саженцев в парках и скверах.',
      image: mockNewsImage('sport.svg', 'Экология — иллюстрация к новости'),
      category: 'Экология',
      publishedAt: '2026-05-17T18:05:00+03:00',
    },
    {
      id: '8',
      slug: 'medicinskie-kabinet-shkoly',
      title: 'В школах области обновят медицинские кабинеты',
      lead: 'Закуплено новое оборудование для профилактических осмотров учащихся.',
      image: mockNewsImage('education.svg', 'Медицина — иллюстрация к новости'),
      category: 'Здоровье',
      publishedAt: '2026-05-17T12:00:00+03:00',
    },
    {
      id: '9',
      slug: 'volonterskaya-akciya-ryazan',
      title: 'Волонтёры провели субботник у редакции',
      lead: 'Участники акции привели в порядок прилегающую территорию и высадили кустарники.',
      image: mockNewsImage('city.svg', 'Волонтёрская акция — иллюстрация к материалу'),
      category: RYADOM_S_NAMI_SEGMENT,
      publishedAt: '2026-05-16T10:00:00+03:00',
    },
    {
      id: '10',
      slug: 'sosedskii-festival',
      title: 'Соседский фестиваль собрал жителей микрорайона',
      lead: 'На площадке рядом с редакцией прошли мастер-классы, концерт и ярмарка.',
      image: mockNewsImage('culture.svg', 'Соседский фестиваль — иллюстрация к материалу'),
      category: RYADOM_S_NAMI_SEGMENT,
      publishedAt: '2026-05-15T15:30:00+03:00',
    },
  ],
  nesecretno: [
    {
      id: 'n1',
      slug: 'mestnye-novosti',
      title: 'Местные новости недели',
      lead: 'Краткий обзор главных событий региона.',
      image: mockNewsImage('default.svg', 'Иллюстрация к новости'),
      publishedAt: '2026-05-18T08:00:00+03:00',
    },
    {
      id: 'n2',
      slug: 'obschestvennaya-initsiativa',
      title: 'Общественная инициатива получила поддержку',
      lead: 'Жители предложили улучшения для общественных пространств.',
      image: mockNewsImage('city.svg', 'Общественная инициатива — иллюстрация к новости'),
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
