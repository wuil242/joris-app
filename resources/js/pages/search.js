import '../../css/search/all.css'
import FetchApi from '../class/FetchApi'
import { debounce } from '../helpers'

const $form = document.forms[0]
const $service_provider_card_template = document.querySelector('#service-provider-card')
const $service_provider_skeleton_template = document.querySelector('#service-provider-card-skeleton') 
const $service_provider_results = document.querySelector('#services-provider-results')
const $range = document.querySelector('#limit-slider')
const $limitInput = document.querySelector('#limit-input')
const $limit = document.querySelector("#limit")

const fields = Array.from($form.querySelectorAll('.search-field > select'))
const LAST_QUERY = {}
const ASSETS_URL = 'http://localhost:8000/assets/'

$form.addEventListener('change', (e) => {
  const id = e.target.id
  if(id === 'city') {
    fields.filter(field => field.id === 'arrondissement' || field.id === 'quater')
      .forEach(field => {
        field.value = 0
        $form.submit()
      })
  }
  else if(id === 'arrondissement') {
    fields.filter(field => field.id === 'quater')
      .forEach(field => {
        field.value = 0
        $form.submit()
      })
  }
  else {
    $form.submit()
  }
})

$range.addEventListener('pointerdown', e => {
  updateLimitValue(e)
  $range.addEventListener('pointermove', () => updateLimitValue(e))

  $range.addEventListener('pointerup', () => {
    $range.removeEventListener('pointermove', updateLimitValue)
    $form.submit()
  }, {once: true})
})

$limitInput.addEventListener('change', updateLimitSlider)
$limitInput.addEventListener('change', debounce(function() {
  $form.submit()
}, 300))

$limitInput.addEventListener('keyup', updateLimitSlider)
$limitInput.addEventListener('keyup', debounce(function() {
  $form.submit()
}, 500))

/**
 * 
 * @param {PointerEvent} e 
 */
function updateLimitValue(e) {
  $limit.value = $limitInput.value = e.target.value
}

/**
 * 
 * @param {PointerEvent|KeyboardEvent} e 
 */
 function updateLimitSlider(e) {
  
  const min = +$limitInput.getAttribute('min')
  const max = +$limitInput.getAttribute('max')
  const value = +e.target.value

  if(value < min) {
    $limit.value = $range.value = min
  }
  else if(value > max) {
    $limit.value = $range.value = max
  }
  else {
    $limit.value = $range.value =  value
  }
  
}

/**
 * 
 * @param {number} value 
 */
function fillLimitFields(value) {
  $limit.value = $limitInput.value = $range.value = value
}

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
