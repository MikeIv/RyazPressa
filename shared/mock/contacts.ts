import type { ContactInfo } from '#shared/types/api'

/** Mock в формате, близком к бэкенду (`phones`/`emails` как объекты — нормализуются в handler). */
type MockContactSource = Omit<
  ContactInfo,
  'phones' | 'emails' | 'rknRegistration' | 'ageRating'
> & {
  phones?: Record<string, string>
  emails?: Record<string, string>
  age?: string
  rknregistr?: string
  phone?: string
  email?: string
}

export const mockContactsBySite: Record<string, MockContactSource> = {
  ryazpressa: {
    title: 'Редакция «Рязпресса»',
    chief: 'Ю.Ф. Фукс',
    address: '390023, г. Рязань, ул. Горького, д. 14',
    coords: '54.625585721394,39.743564898564',
    age: '16+',
    phones: {
      '+7 (4912) 28-98-13': 'Телефон главного офиса',
      '+7 980 501-30-34': 'Коммерческий отдел',
      '+7 (4912) 28-37-63': 'Редакция',
    },
    emails: {
      'ryazpressa@ryazan.gov.ru': 'редакция',
      'reklamarzn.pressa@yandex.ru': 'реклама',
    },
    workingHours: 'Пн–Пт: 9:00–18:00',
    rknregistr:
      'Сетевое издание зарегистрировано Федеральной службой по надзору в сфере связи, информационных технологий и массовых коммуникаций РФ 18.12.2015. Реестровая запись СМИ №ФС77-64106',
  },
  nesecretno: {
    title: 'Редакция «Не секретно»',
    address: 'г. Рязань, ул. Примерная, д. 2',
    phone: '+7 (4912) 11-11-11',
    email: 'info@nesecretno.ru',
    workingHours: 'Пн–Пт: 10:00–19:00',
  },
}
