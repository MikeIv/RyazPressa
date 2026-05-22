/** Панель футера, открываемая кнопкой-бургером в шапке. */
export function useFooterPanel() {
  const isOpen = useState('footer-panel-open', () => false)

  function toggle(): void {
    isOpen.value = !isOpen.value
  }

  function close(): void {
    isOpen.value = false
  }

  return { isOpen, toggle, close }
}
