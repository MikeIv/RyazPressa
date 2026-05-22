/** Блокировка скролла и закрытие панели футера по Escape. */
export default defineNuxtPlugin(() => {
  const { isOpen, close } = useFooterPanel()

  watch(isOpen, (open) => {
    document.body.style.overflow = open ? 'hidden' : ''
  })

  const onEscape = (event: KeyboardEvent): void => {
    if (event.key === 'Escape' && isOpen.value) close()
  }

  window.addEventListener('keydown', onEscape)

  onScopeDispose(() => {
    document.body.style.overflow = ''
    window.removeEventListener('keydown', onEscape)
  })
})
