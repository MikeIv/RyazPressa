import type { ContactInfo } from '#shared/types/api'

export const mockContactsBySite: Record<string, ContactInfo> = {
  ryazpressa: {
    title: 'Редакция «Рязпресса»',
    address: 'г. Рязань, ул. Примерная, д. 1',
    phone: '+7 (4912) 00-00-00',
    email: 'info@ryazpressa.ru',
    workingHours: 'Пн–Пт: 9:00–18:00',
  },
  nesecretno: {
    title: 'Редакция «Не секретно»',
    address: 'г. Рязань, ул. Примерная, д. 2',
    phone: '+7 (4912) 11-11-11',
    email: 'info@nesecretno.ru',
    workingHours: 'Пн–Пт: 10:00–19:00',
  },
}
