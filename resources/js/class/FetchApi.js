export default class FetchApi {
  static URL = 'http://localhost:8000'

  /**
   * 
   * @param {{
   *  job:number, 
   *  arrondissement:number, 
   *  quater:number
   * }} query 
   * @returns 
   */
  static getForm(query) {
    return new Promise((res, rej) => {
      const qs = new URLSearchParams()
      for (const key in query) {
        qs.append(key, query[key])
      }
  
      query = '?' + qs.toString()

      fetch('/api/form' + query).then(r => {
        r.text().then(data => res(data))
      })
    })
  }

  static getServiceProviders() {
    return new Promise((res, rej) => {
      fetch(FetchApi.itemsUrl('service_providers')).then(r => {
        r.json().then(data => res(data))
      })
    })
  }

  /**
   * 
   * @param {string} name name of model
   * @param {any} fileds 
   * @param {any} filter 
   * @returns {string}
   */
  static itemsUrl(name, fields, filter) {
    return `${FetchApi.URL}/items/${name}`
  }

}