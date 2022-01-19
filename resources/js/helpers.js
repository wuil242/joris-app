/**
 * 
 * @param {Function} callback 
 * @param {number} delay 
 * @returns 
 */
export function debounce(callback, delay) {
  let timer
  return function() {
    let args = arguments
    let context = this
    clearTimeout(timer)
    timer = setTimeout(function(){
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
  let last;
  let timer;
  return function () {
      const context = this;
      const now = +new Date();
      const args = arguments;
      if (last && now < last + delay) {
          // le délai n'est pas écoulé on reset le timer
          clearTimeout(timer);
          timer = setTimeout(function () {
              last = now;
              callback.apply(context, args);
          }, delay);
      } else {
          last = now;
          callback.apply(context, args);
      }
  };
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
   top: $el.offsetTop
 })
}

/**
 * ajout un loader en position absolue a l'element
 * 
 * @param {HTMLElement} $el 
 */
export function addLoaderToElement($el) {
  $el.innerHTML = 'loading...'
}

/**
 * ajout un loader en position absolue a l'element represantant un boutton
 * 
 * @param {HTMLElement} $el 
 */
export function addLoaderToButton($el) {
    $el.setAttribute('disabled', '')
    $el.innerHTML += '<div class="loader-button"></div>'
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
