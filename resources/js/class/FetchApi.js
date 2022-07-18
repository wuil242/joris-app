import { getFullUrl } from "../helpers"

const headers = {'X-Requested-With': 'XMLHttpRequest'}

export let API_LAST_URL = new URL(window.location.href)


export default class FetchApi {

  /**
   * @param {HTMLElement} $form
   * 
   * @returns {Promise<{filter: string, html: string, count: number}>}
   */
  static getCardWithFilter($form) {
    return new Promise((res, rej) => {
      const url = getFullUrl($form)
      url.searchParams.set('count', '')
      url.searchParams.set('ajax', '')
      
      fetch(url, {headers})
      .then(r => r.json())
      .then(data => {
          url.searchParams.delete('count')
          url.searchParams.delete('ajax')
          url.searchParams.delete('page')
          API_LAST_URL.href = window.location.href
          window.history.replaceState(null, document.title, url)
          res(data)
        })
    })
  }

}