<script setup lang="ts">
import { useSectionPageBreadcrumbs } from '~/composables/useBreadcrumbs'
import type { ListResponse, Paper, Tariff } from '#shared/types/api'
import { buildPaperOrderRequest } from '#shared/utils/normalizeSubscriptionApi'
import { nextSubscriptionStartIsoDate } from '#shared/utils/subscriptionStartDate'
import {
  readPaperOrderSubmitError,
  resolvePaperOrderOutcome,
  submitLegacyPaperOrder,
} from '#shared/utils/submitLegacyPaperOrder'

definePageMeta({
  middleware: 'section',
  section: 'price',
})

type LegalBlock =
  | { type: 'p'; text: string }
  | { type: 'ul'; items: readonly string[] }

interface LegalSection {
  id: string
  title: string
  blocks: readonly LegalBlock[]
}

const SUBSCRIPTION_NOTICE =
  'Внимание! При оформлении подписки на электронную версию районных газет рассылка начинается с первого номера следующего полугодия (с января или с июля, одновременно с началом доставки бумажной версии), независимо от даты оформления подписки. Если вас интересует другой вариант — измените дату в поле «Дата начала».'

const LEGAL_SECTIONS: readonly LegalSection[] = [
  {
    id: 'user-agreement',
    title: 'Пользовательское соглашение',
    blocks: [
      {
        type: 'p',
        text: 'Политика конфиденциальности объясняет пользователям ресурса, с какой целью собирается личная информация и как она используется. Обработка персональных данных производится исключительно в целях, указанных в настоящем соглашении.',
      },
      { type: 'p', text: 'Цели обработки персональных данных:' },
      {
        type: 'ul',
        items: [
          'осуществление связи с пользователем;',
          'направление электронных уведомлений и оформление подписки на электронные образы документов (печатных СМИ — газет);',
          'приём обращений пользователей и предоставление ответов;',
          'проведение исследований использования ресурса;',
          'выполнение обязанностей, предусмотренных законодательством РФ.',
        ],
      },
      {
        type: 'p',
        text: 'Обработка персональных данных прекращается после прекращения договорных отношений по подписке; персональные данные уничтожаются в срок не более тридцати дней.',
      },
    ],
  },
  {
    id: 'delivery',
    title: 'Условия доставки товара',
    blocks: [
      {
        type: 'p',
        text: 'Доставка издания в виде PDF-файла, заказанного на интернет-сайте, осуществляется на адрес электронной почты, указанный покупателем при оплате.',
      },
    ],
  },
  {
    id: 'payment',
    title: 'Способы оплаты',
    blocks: [
      {
        type: 'p',
        text: 'Оплата банковской картой через ПАО СБЕРБАНК. Поддерживаются платёжные системы МИР, VISA International и Mastercard Worldwide.',
      },
    ],
  },
  {
    id: 'refund',
    title: 'Описание возврата товара / услуги',
    blocks: [
      {
        type: 'p',
        text: 'Срок возврата товара надлежащего качества составляет 30 дней с момента получения товара. Возврат переведённых средств производится на банковский счёт в течение 5–30 рабочих дней.',
      },
    ],
  },
  {
    id: 'data-transfer',
    title: 'Описание процесса передачи данных',
    blocks: [
      {
        type: 'p',
        text: 'Для оплаты вы будете перенаправлены на платёжный шлюз ПАО СБЕРБАНК. Соединение с платёжным шлюзом и передача информации осуществляются в защищённом режиме с использованием протокола шифрования SSL.',
      },
    ],
  },
]

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const { data: tariffsData, pending: tariffsPending, error: tariffsError } =
  useApiFetch<ListResponse<Tariff>>('/api/tariffs', { key: 'price-tariffs' })

const { data: papersData, pending: papersPending, error: papersError } =
  useApiFetch<ListResponse<Paper>>('/api/papers', { key: 'price-papers' })

const tariffs = computed(() => tariffsData.value?.data ?? [])
const papers = computed(() => papersData.value?.data ?? [])
const pending = computed(() => tariffsPending.value || papersPending.value)
const loadError = computed(() => Boolean(tariffsError.value || papersError.value))

const email = ref('')
const selectedPaperIds = ref<string[]>([])
const selectedTariffId = ref('')
const startDate = ref(nextSubscriptionStartIsoDate())
const consent = ref(false)
const formError = ref('')
const formNotice = ref('')
const submitting = ref(false)

watch(
  tariffs,
  (items) => {
    if (!selectedTariffId.value && items[0]) {
      selectedTariffId.value = items[0].id
    }
  },
  { immediate: true },
)

function validateForm(): string | null {
  const trimmedEmail = email.value.trim()

  if (!trimmedEmail) return 'Заполните поле «E-mail».'
  if (!EMAIL_RE.test(trimmedEmail)) return 'Укажите корректный E-mail.'
  if (!selectedPaperIds.value.length) return 'Выберите хотя бы одно издание.'
  if (!selectedTariffId.value) return 'Укажите срок подписки.'
  if (!startDate.value) return 'Укажите дату начала подписки.'
  if (!consent.value) return 'Необходимо согласие на обработку персональных данных.'

  return null
}

async function onSubmit(event: Event): Promise<void> {
  event.preventDefault()
  formNotice.value = ''

  const error = validateForm()
  if (error) {
    formError.value = error
    return
  }

  formError.value = ''
  submitting.value = true

  try {
    const order = buildPaperOrderRequest({
      email: email.value,
      tariffId: selectedTariffId.value,
      startDateIso: startDate.value,
      paperIds: selectedPaperIds.value,
    })

    const outcome = resolvePaperOrderOutcome(order, await submitLegacyPaperOrder(order))

    if (outcome.kind === 'redirect') {
      window.location.assign(outcome.url)
      return
    }

    if (outcome.kind === 'success') {
      formNotice.value = outcome.message
      return
    }

    formError.value = outcome.message
  } catch (submitError) {
    formError.value = readPaperOrderSubmitError(submitError)
  } finally {
    submitting.value = false
  }
}

useHead({ title: 'Прайс лист' })

const breadcrumbs = useSectionPageBreadcrumbs('price', 'Прайс лист')
</script>

<template>
  <div :class="$style.page">
    <UiBreadcrumbs :items="breadcrumbs" />
    <h1 :class="$style.pageTitle">Прайс лист</h1>

    <p v-if="pending" :class="$style.status" role="status">Загрузка…</p>
    <p v-else-if="loadError" :class="$style.status" role="alert">
      Не удалось загрузить данные подписки.
    </p>

    <template v-else>
      <section :class="$style.section" aria-labelledby="subscription-heading">
        <h2 id="subscription-heading" :class="$style.sectionTitle">Подписка</h2>

        <p :class="$style.notice">{{ SUBSCRIPTION_NOTICE }}</p>

        <form :class="$style.form" novalidate @submit="onSubmit">
          <div :class="$style.field">
            <label :class="$style.label" for="subscription-email">E-mail</label>
            <input
              id="subscription-email"
              v-model="email"
              :class="$style.input"
              type="email"
              name="email"
              autocomplete="email"
              placeholder="example@mail.ru"
              required
            />
          </div>

          <fieldset :class="$style.field">
            <legend :class="$style.label">Районные газеты</legend>
            <ul v-if="papers.length" :class="$style.papersList" role="list">
              <li v-for="paper in papers" :key="paper.id" :class="$style.paperItem">
                <label :class="$style.paperLabel">
                  <input
                    v-model="selectedPaperIds"
                    :class="$style.checkbox"
                    type="checkbox"
                    :name="`paper-${paper.id}`"
                    :value="paper.id"
                  />
                  <span>{{ paper.title }}</span>
                </label>
              </li>
            </ul>
            <p v-else :class="$style.status">Список изданий пока пуст.</p>
          </fieldset>

          <div :class="$style.formRow">
            <div :class="$style.field">
              <label :class="$style.label" for="subscription-tariff">Срок подписки</label>
              <select
                id="subscription-tariff"
                v-model="selectedTariffId"
                :class="$style.select"
                name="type"
                required
              >
                <option value="" disabled>Выберите вариант подписки…</option>
                <option v-for="tariff in tariffs" :key="tariff.id" :value="tariff.id">
                  {{ tariff.name }} / {{ tariff.price }} руб.
                </option>
              </select>
            </div>

            <div :class="$style.field">
              <label :class="$style.label" for="subscription-start">Дата начала</label>
              <input
                id="subscription-start"
                v-model="startDate"
                :class="$style.input"
                type="date"
                name="dt"
                required
              />
            </div>
          </div>

          <label :class="$style.consent">
            <input v-model="consent" :class="$style.checkbox" type="checkbox" name="consent" />
            <span>
              Даю согласие на
              <a href="#user-agreement" :class="$style.inlineLink">обработку персональных данных</a>
            </span>
          </label>

          <p v-if="formError" :class="$style.formError" role="alert">{{ formError }}</p>
          <p v-if="formNotice" :class="$style.formNotice" role="status">{{ formNotice }}</p>

          <button :class="$style.submitBtn" type="submit" :disabled="submitting">
            {{ submitting ? 'Оформление…' : 'Оформить подписку' }}
          </button>
        </form>
      </section>

      <section :class="$style.section" aria-labelledby="price-list-heading">
        <h2 id="price-list-heading" :class="$style.sectionTitle">Прайс лист</h2>

        <div v-if="tariffs.length" :class="$style.tableWrap">
          <table :class="$style.priceTable">
            <caption class="visually-hidden">
              Стоимость подписки на электронные газеты
            </caption>
            <thead>
              <tr>
                <th scope="col">№ п/п</th>
                <th scope="col">Количество экземпляров / срок подписки</th>
                <th scope="col">Стоимость подписки, руб. с НДС</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(tariff, index) in tariffs" :key="tariff.id">
                <td>{{ index + 1 }}</td>
                <td>{{ tariff.name }}</td>
                <td>{{ tariff.price }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p v-else :class="$style.status">Тарифы пока не опубликованы.</p>
      </section>

      <section
        v-for="section in LEGAL_SECTIONS"
        :id="section.id"
        :key="section.id"
        :class="$style.section"
        :aria-labelledby="`${section.id}-heading`"
      >
        <h2 :id="`${section.id}-heading`" :class="$style.sectionTitle">{{ section.title }}</h2>
        <div :class="$style.legalText">
          <template v-for="(block, index) in section.blocks" :key="`${section.id}-${index}`">
            <p v-if="block.type === 'p'">{{ block.text }}</p>
            <ul v-else>
              <li v-for="item in block.items" :key="item">{{ item }}</li>
            </ul>
          </template>
        </div>
      </section>

      <section :class="$style.section" aria-labelledby="publisher-contacts-heading">
        <h2 id="publisher-contacts-heading" :class="$style.sectionTitle">Контакты</h2>
        <address :class="[$style.legalText, $style.contacts]">
          <p>
            Фактический адрес: 390000, г. Рязань, ул. Горького, дом 86, помещение Н 25<br />
            Электронная почта:
            <a href="mailto:ryazpressa@ryazangov.ru" :class="$style.inlineLink"
              >ryazpressa@ryazangov.ru</a
            ><br />
            Тел./факс: (4912) 28-98-13, (4912) 28-98-14
          </p>
          <p>
            ГАУ РО «Издательство «Пресса»» · ИНН 6231006360 · ОГРН 1026201263923<br />
            Юридический адрес: 390000, г. Рязань, ул. Горького, дом 86, помещение Н 25
          </p>
        </address>
      </section>
    </template>
  </div>
</template>

<style module lang="scss">
@use '~/assets/styles/tools/mixins' as mx;

.page {
  padding-block: var(--fs-space-4);
  max-width: 960px;
}

.pageTitle {
  font-size: var(--fs-text-3xl);
  font-weight: var(--fs-weight-bold);
  margin-bottom: var(--fs-space-4);
}

.status {
  color: var(--fs-color-text-muted);
}

.section {
  margin-bottom: var(--fs-space-5);
}

.sectionTitle {
  margin: 0 0 var(--fs-space-3);
  font-size: var(--fs-text-2xl);
  font-weight: var(--fs-weight-bold);
  color: var(--site-color-text);
  text-transform: uppercase;
  letter-spacing: 0.02em;
}

.notice {
  margin: 0 0 var(--fs-space-3);
  padding: var(--fs-space-3);
  font-size: var(--fs-text-sm);
  line-height: var(--fs-leading-relaxed);
  color: var(--site-color-text);
  background: color-mix(in srgb, var(--site-color-accent) 8%, var(--fs-color-surface-alt));
  border-left: 4px solid var(--site-color-accent);
  border-radius: var(--site-radius-sm);
}

.form {
  display: grid;
  gap: var(--fs-space-3);
  padding: var(--fs-space-3);
  background: var(--site-color-background);
  border: 1px solid var(--fs-color-border);
  border-radius: var(--site-radius-md);
}

.formRow {
  display: grid;
  gap: var(--fs-space-3);

  @include mx.from-tablet {
    grid-template-columns: minmax(0, 1.2fr) minmax(0, 0.8fr);
  }
}

.field {
  display: grid;
  gap: var(--fs-space-1);
  min-width: 0;
  margin: 0;
  padding: 0;
  border: 0;
}

.label {
  font-size: var(--fs-text-sm);
  font-weight: var(--fs-weight-semibold);
  color: var(--fs-color-text-muted);
}

.input,
.select {
  width: 100%;
  min-height: 44px;
  padding: 0.55rem 0.75rem;
  font: inherit;
  color: var(--site-color-text);
  background: var(--site-color-background);
  border: 1px solid var(--fs-color-border);
  border-radius: var(--site-radius-sm);

  &:focus-visible {
    outline: 2px solid var(--site-color-primary);
    outline-offset: 2px;
  }
}

.papersList {
  display: grid;
  gap: var(--fs-space-1);
  max-height: 280px;
  margin: 0;
  padding: var(--fs-space-2);
  overflow: auto;
  list-style: none;
  background: var(--fs-color-surface-alt);
  border: 1px solid var(--fs-color-border);
  border-radius: var(--site-radius-sm);

  @include mx.from-tablet {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

.paperItem {
  min-width: 0;
}

.paperLabel {
  display: flex;
  gap: var(--fs-space-2);
  align-items: flex-start;
  font-size: var(--fs-text-sm);
  line-height: 1.35;
  cursor: pointer;
}

.checkbox {
  flex-shrink: 0;
  width: 1rem;
  height: 1rem;
  margin-top: 2px;
  accent-color: var(--site-color-primary);
}

.consent {
  display: flex;
  gap: var(--fs-space-2);
  align-items: flex-start;
  font-size: var(--fs-text-sm);
  line-height: var(--fs-leading-relaxed);
  cursor: pointer;
}

.inlineLink {
  color: var(--site-color-primary);
  text-decoration: underline;

  &:hover {
    text-decoration: none;
  }
}

.formError {
  margin: 0;
  font-size: var(--fs-text-sm);
  color: var(--site-color-accent);
}

.formNotice {
  margin: 0;
  font-size: var(--fs-text-sm);
  color: var(--fs-color-text-muted);
}

.submitBtn {
  justify-self: start;
  min-height: 44px;
  padding: 0.65rem 1.5rem;
  font: inherit;
  font-weight: var(--fs-weight-semibold);
  color: var(--site-color-background);
  cursor: pointer;
  background: var(--site-color-primary);
  border: none;
  border-radius: var(--site-radius-sm);
  transition: background 0.2s ease;

  &:hover {
    background: color-mix(in srgb, var(--site-color-primary) 88%, #000);
  }

  &:focus-visible {
    outline: 2px solid var(--site-color-primary);
    outline-offset: 2px;
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.7;
  }
}

.tableWrap {
  overflow-x: auto;
}

.priceTable {
  width: 100%;
  border-collapse: collapse;
  font-size: var(--fs-text-sm);
  background: var(--site-color-background);
  border: 1px solid var(--fs-color-border);

  th,
  td {
    padding: 0.75rem 1rem;
    text-align: left;
    vertical-align: top;
    border: 1px solid var(--fs-color-border);
  }

  th {
    font-weight: var(--fs-weight-semibold);
    color: var(--site-color-text);
    background: color-mix(in srgb, var(--site-color-primary) 8%, var(--fs-color-surface-alt));
  }
}

.legalText {
  font-size: var(--fs-text-sm);
  line-height: var(--fs-leading-relaxed);
  color: var(--site-color-text);

  p {
    margin: 0 0 var(--fs-space-2);
  }

  ul {
    margin: 0 0 var(--fs-space-2);
    padding-left: 1.25rem;
  }

  li + li {
    margin-top: 0.35rem;
  }
}

.contacts {
  font-style: normal;
}

@media (prefers-reduced-motion: reduce) {
  .submitBtn {
    transition: none;
  }
}
</style>
