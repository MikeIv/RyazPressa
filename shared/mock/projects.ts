import type { Project, ProjectDetail } from '#shared/types/api'

export const mockProjects: Project[] = [
  {
    slug: 'gorod-budushchego',
    title: 'Город будущего',
    lead: 'Спецпроект о развитии городской среды.',
    image: { url: '/mock/project-1.jpg', alt: 'Город будущего' },
    publishedAt: '2026-04-01T10:00:00+03:00',
  },
  {
    slug: 'lyudi-regiona',
    title: 'Люди региона',
    lead: 'Истории жителей и их вклад в развитие области.',
    publishedAt: '2026-03-15T10:00:00+03:00',
  },
]

export function getMockProjectDetail(slug: string): ProjectDetail | undefined {
  const project = mockProjects.find((p) => p.slug === slug)
  if (!project) return undefined

  return {
    ...project,
    content: '<p>Описание спецпроекта. Контент приходит с бэкенда в HTML.</p>',
  }
}
