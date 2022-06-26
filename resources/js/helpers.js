/**
 *
 * @param {Function} callback
 * @param {number} delay
 * @returns
 */
export function debounce(callback, delay) {
  let timer
  return function () {
    let args = arguments
    let context = this
    clearTimeout(timer)
    timer = setTimeout(function () {
      callback.apply(context, args)
    }, delay)
  }
}

/**
 *
 * @param {Function} callback
 * @param {number} delay
 * @returns
 */
export function throttle(callback, delay) {
  let last
  let timer
  return function () {
    const context = this
    const now = +new Date()
    const args = arguments
    if (last && now < last + delay) {
      // le délai n'est pas écoulé on reset le timer
      clearTimeout(timer)
      timer = setTimeout(function () {
        last = now
        callback.apply(context, args)
      }, delay)
    } else {
      last = now
      callback.apply(context, args)
    }
  }
}

/**
 *
 * @param {string} str
 * @returns
 */
export function str2Dom(str) {
  return document.createRange().createContextualFragment(str).firstElementChild
}

/**
 * scroll vers un l'element
 *
 * @param {HTMLElement} $el
 */
export function scrollToElement($el) {
  window.scroll({
    behavior: 'smooth',
    top: $el.offsetTop,
  })
}

/**
 * ajout d'element servant de loader dans un autre element parent
 * 
 * renvoi une methode remove() premettant de supprimer le loader courrent
 *
 * @param {HTMLDivElement} $el element acceuillant le loader
 * @param {HTMLElement} $loader element servant de loader
 * @returns { {remove: () => void} }
 */
export function addLoaderToElement($el, $loader) {
  console.log($loader)
  $loader = $loader.cloneNode(true)
  const { position } = window.getComputedStyle($el, null)

  if (position === '' || position === 'static') {
    $el.style.setProperty('position', 'relative')
  }

  $el.appendChild($loader)

  return {remove: () => removeLoaderToElement($el, $loader)}
}

/**
 * ajout une classe loader en position absolue a l'element
 *
 * @param {HTMLDivElement} $el
 * @param {HTMLElement} $loader
 */
export function removeLoaderToElement($el, $loader) {
  $el.removeChild($loader)
  $el.style.removeProperty('position', 'relative')
}

/**
 * ajout le loader en position absolue a l'element represantant un boutton
 *
 * @param {HTMLElement} $el
 * @param {HTMLElement} $loader
 * @returns { {remove: () => void} }
 */
export function addLoaderToButton($el, $loader) {
  $loader = $loader.cloneNode(true)
  $el.style.setProperty('pointer-events', 'none')
  $el.appendChild($loader)
  return {remove: () => removeLoaderToButton($el, $loader)}
}

/**
 * retire le loader loader en position absolue a l'element represantant un boutton
 *
 * @param {HTMLElement} $el
 * @param {HTMLElement} $loader
 */
export function removeLoaderToButton($el, $loader) {
  $el.style.removeProperty('pointer-events')
  $el.removeChild($loader)
}

/**
 * url complet avec les query parameters du formulaire
 *
 * @returns {URL}
 */
export function getFullUrl($form) {
  const url = new URL(document.URL)
  const queries = new FormData($form)

  for (const query of queries.keys()) {
    url.searchParams.set(query, queries.get(query))
  }
  return url
}

/**
 *
 * @param {string} inputSelector
 * @param {string} errorsSelector
 */
export function removeInputErrorsAfterFocus(
  inputSelector = '.form-input, .form-textarea',
  errorsSelector = '.form-errors'
) {
  document.querySelectorAll(inputSelector).forEach(($input) => {
    $input.addEventListener('focus', () => $input.classList.remove('is-error'))
  })
}

export function isLargeScreen() {
  return window.innerWidth > 650
}

/**
 * 
 * @param {string} selector 
 * @returns {HTMLElement}
 */
export function getElementFromTemplate(selector) {
  return document.querySelector(selector).content.firstElementChild
}
