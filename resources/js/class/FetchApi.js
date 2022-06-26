import { getFullUrl } from "../helpers"

const headers = {'X-Requested-With': 'XMLHttpRequest'}

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
          window.history.replaceState(null, document.title, url)
          res(data)
        })
    })
  }

  /**
   * 
   * @param {string|number} serviceProviderId 
   * @param {string|number} page 
   */
  static getComments(serviceProviderId, page) {
    return new Promise((res, rej) => {
      const url = window.location.origin + `/comments/${serviceProviderId}/${page}`

      fetch(url, {headers})
        .then(r => r.json())
        .then(({html}) => res(html))
        .catch(reason => rej(reason))
    })
  }

}