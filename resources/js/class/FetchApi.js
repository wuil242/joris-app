import { getFullUrl } from "../helpers"

const headers = {'X-Requested-With': 'XMLHttpRequest'}

export default class FetchApi {

  /**
   * @param {HTMLElement} $form
   * 
   * @returns 
   */
  static getForm($form) {
    return new Promise((res, rej) => {
      const url = getFullUrl($form)
      url.searchParams.set('count', '')
      
      fetch(url, {headers})
        .then(r => r.json())
        .then(data => {
          url.searchParams.delete('count')
          window.history.replaceState(null, undefined, url)
          res(data)
        })
    })
  }

}