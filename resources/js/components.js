/**
 *
 * @param {string} btnSelector css class of open menu button
 * @param {string} menuSelector css class of menu
 * @param {string} closeBtnSelector css class of close menu button
 */
export function headerMenuButton(
  openBtnSelector,
  menuSelector,
  closeBtnSelector = '#button-close'
) {
  const $openBtn = document.querySelector(openBtnSelector)
  const $menu = document.querySelector(menuSelector)
  const $closeBtn = $menu.querySelector(closeBtnSelector)

  if (!$openBtn || !$menu || !$closeBtn) return

  $openBtn.addEventListener('click', (e) => {
    $menu.classList.replace('hide', 'show')
  })

  $closeBtn.addEventListener('click', (_) => {
    $menu.classList.replace('show', 'hide')
  })
}
