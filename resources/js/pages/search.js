import '../../css/search/all.css'
import FormSelect from '../components/FormSelect'
import { debounce } from '../helpers'
import Sticky from '../components/Sticky'

const $form = document.querySelector('#form-search-provider')
const $service_provider_card_template = document.querySelector('#service-provider-card')
const $service_provider_skeleton_template = document.querySelector('#service-provider-card-skeleton') 
const $range = document.querySelector('#limit-slider')
const $limitInput = document.querySelector('#limit-input')
const $limit = document.querySelector("#search-limit")
const $search_fields = Array.from($form.querySelectorAll('.search-field .js-select'))
const $firstProviderCard = document.querySelector('.service-provider-card')
const $search_empty_message = document.getElementById('search-empty-message')

if($search_empty_message) {
  scrollToElement($search_empty_message)
}

if($firstProviderCard) {
  scrollToElement($firstProviderCard)
}

$form.addEventListener('change', handleFormChange)

$search_fields.forEach(field => field.addEventListener('form-select', handleFormChange))

$range.addEventListener('pointerup', updateLimitValue)
$range.addEventListener('pointerdown', e => {
  updateLimitValue(e)
  $range.addEventListener('pointermove', () => updateLimitValue(e))

  $range.addEventListener('pointerup', () => {
    $range.removeEventListener('pointermove', updateLimitValue)
    $form.submit()
    startFormLoading()
  }, {once: true})
})

$limitInput.addEventListener('change', updateLimitSlider)
$limitInput.addEventListener('change', debounce(function() {
  $form.submit()
  startFormLoading()
}, 300))

$limitInput.addEventListener('keyup', updateLimitSlider)
$limitInput.addEventListener('keyup', debounce(function() {
  $form.submit()
  startFormLoading()
}, 800))


Sticky.define({
  element: '.top-button',
  scrollValue: 150,
})


FormSelect.init()

more()

/**
 * @param {Event} e
 */
function handleFormChange(e) {
  const name = e.target.querySelector('select').getAttribute('name')

  const $serch_fields_inputs = $search_fields.map($search_field => $search_field.querySelector('select'))

  updateLimitValue({target: $limitInput})
  if(name === 'city') {
    const $search_fieleds_filtered =  $serch_fields_inputs.filter(field => {
      const field_name = field.getAttribute('name')
      return field_name === 'arrondissement' || field_name === 'quater'
    })
    
    $search_fieleds_filtered.forEach((field, index) => {
      field.value = '0'
      if(index === $search_fieleds_filtered.length - 1) {
        startFormLoading()
        $form.submit()
      }
    })
  }
  else if(name === 'arrondissement') {
    $serch_fields_inputs.filter(field => field.name === 'quater')
      .forEach(field => {
        field.value = '0'

        $form.submit()
        startFormLoading()
      })
  }
  else {
    startFormLoading()
    $form.submit()
  }
}

/**
 * remplace le boutton voir plus par le nouveau contentu
 */
function more() {
  const $moreButton = document.querySelector("#more-button")
  if(!$moreButton) return

  $moreButton.addEventListener('click', e => {
    startFormLoading()
    e.preventDefault()
    const url = new URL(document.URL)
    url.searchParams.set('page', $moreButton.dataset.page)
    fetch(url.href, {
      headers: {'X-Requested-With': 'XMLHttpRequest'}
    }).then(r => r.json()).then(res => {
      const $el = document.createElement('div')
      $el.innerHTML = res.html
      const $sp =  $el.firstElementChild
      const $more =  $el.lastElementChild
      const $cards = $moreButton.parentElement

      $cards.replaceChild($sp, $moreButton)
      $cards.appendChild($more)

     scrollToElement($sp)
      
      stopFormLoading()
      more()
    })
  })
}


/**
 * 
 * @param {HTMLElement} $el 
 */
function scrollToElement($el) {
  window.scroll({
    behavior: 'smooth',
    top: $el.offsetTop
  })
}

/**
 * 
 */
function startFormLoading() {
 $search_fields.forEach($field => $field.dispatchEvent(new Event('disable')))

  document.querySelectorAll('.search-fields')
    .forEach($fields => {
      // $fields.classList.add('loading')
      $fields.querySelectorAll('input').forEach(input => {
        input.setAttribute('disabled', 'true')
      })
    })
}

/**
 * 
 */
 function stopFormLoading() {
  $search_fields.forEach($field => $field.dispatchEvent(new Event('enable')))

  document.querySelectorAll('.search-fields')
    .forEach($fields => {
      $fields.classList.remove('loading')
      $fields.querySelectorAll('input, select').forEach(input => {
        input.removeAttribute('disabled')
      })
    })
}


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
