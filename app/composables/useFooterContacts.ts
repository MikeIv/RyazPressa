import type { ContactInfo } from '#shared/types/api'
import { normalizeApiBaseUrl } from '#shared/utils/normalizeApiBaseUrl'
import { contactInfoHasFooterContent } from '#shared/utils/normalizeContactsApi'

/** Контакты в футере — только при реальном API (`NUXT_PUBLIC_API_BASE`) и включённом разделе. */
export function useFooterContacts() {
  const runtimeConfig = useRuntimeConfig()
  const { site } = useSiteConfig()

  const isEnabled = computed(() =>
    Boolean(normalizeApiBaseUrl(runtimeConfig.public.apiBase) && site.value?.sections.contacts),
  )

  const { data: contacts, execute } = useApiFetch<ContactInfo>('/api/contacts', {
    immediate: false,
    lazy: true,
  })

  watch(
    isEnabled,
    (enabled) => {
      if (enabled) execute()
    },
    { immediate: true },
  )

  const showContacts = computed(
    () => isEnabled.value && contactInfoHasFooterContent(contacts.value),
  )

  return { contacts, showContacts }
}
