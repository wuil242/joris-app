import '../../css/search/all.css'
import FetchApi from '../class/FetchApi'

const $form = document.forms[0]
const $service_provider_card_template = document.querySelector('#service-provider-card')
const $service_provider_skeleton_template = document.querySelector('#service-provider-card-skeleton') 
const $service_provider_results = document.querySelector('#services-provider-results')

const fields = Array.from($form.querySelectorAll('.search-field > select'))
const LAST_QUERY = {}
const ASSETS_URL = 'http://localhost:8000/assets/'

$form.addEventListener('change', handleFormChange)

for (const field of fields) {
  LAST_QUERY[field.id] = field.value
}

console.log(LAST_QUERY)
getServiceProviders(LAST_QUERY)

/**
 * 
 * @param {SubmitEvent} e 
 */
function handleFormChange(e) {
  e.preventDefault()
  const id = e.target.id 
  LAST_QUERY[id] = e.target.value
  if( id === 'job' || id === 'quater' ) {
    console.log('find sp')
    getServiceProviders(LAST_QUERY)
    return
  }

  FetchApi.getForm(LAST_QUERY).then(data => {
    $form.innerHTML = data
  })
  .then(() => getServiceProviders(LAST_QUERY))

}

function getServiceProviders(query) {
  console.log(query)
  FetchApi.getServiceProviders(query).then(data => addServiceProviders(data))
}

function addServiceProviders(data) {
  const content = $service_provider_card_template.content.firstElementChild
  let res = ''
  data.forEach(d => {
    const clone = content.cloneNode(true)
    const photo_url = d.photo ? ASSETS_URL + d.photo : '/favicon.jpg'
    clone.querySelector('#photo').setAttribute('src', photo_url) 
    clone.querySelector('#job').innerHTML = d.lastname
    clone.querySelector('#devis').setAttribute('href', '/devis/client/'+ d.id)
    res += clone.innerHTML
  })

  $service_provider_results.innerHTML = res
}
