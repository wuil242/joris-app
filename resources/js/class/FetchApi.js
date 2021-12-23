const QUERY = new URLSearchParams()


QUERY.append('fields', `
  id,
  lastname,
  photo
`)


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

  static getServiceProviders(filters = {}) {
    const filterQuery = {
      filter: '',
      value: ''
    }
    
    if(filters.city && filters.city > 0) {
      filterQuery.filter = `filter[address_id][city_id][id][_eq]`
      filterQuery.value = filters.city
      
      QUERY.set(filterQuery.filter, '' + filterQuery.value)
    }

    const query = '?' + QUERY.toString()
    console.log('DFF', query)
    return new Promise((res, rej) => {
      fetch(FetchApi.itemsUrl('service_providers' + query)).then(r => {
        r.json().then(sp => res(sp.data))
        QUERY.delete(filterQuery.filter)
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