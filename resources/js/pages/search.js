import '../../css/search/all.css'
import FetchApi from '../class/FetchApi'
import { debounce } from '../helpers'

const $form = document.forms[0]
const $service_provider_card_template = document.querySelector('#service-provider-card')
const $service_provider_skeleton_template = document.querySelector('#service-provider-card-skeleton') 
const $range = document.querySelector('#limit-slider')
const $limitInput = document.querySelector('#limit-input')
const $limit = document.querySelector("#search-limit")

const fields = Array.from($form.querySelectorAll('.search-field > select'))

const $firstProviderCard = document.querySelector('.service-provider-card')

if($firstProviderCard) {
  window.scroll({
    behavior: 'smooth',
    top: $firstProviderCard.offsetTop
  })
}

$form.addEventListener('change', (e) => {
  const id = e.target.id

  updateLimitValue({target: $limitInput})
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

  startFormLoading()
})

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

// startFormLoader()
more()

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

      window.scroll({
        behavior: 'smooth',
        top: $sp.offsetTop
      })
      
      stopFormLoading()
      more()
    })
  })
}

/**
 * 
 */
function startFormLoading() {
  document.querySelectorAll('.search-fields')
    .forEach($fields => {
      $fields.classList.add('loading')
      $fields.querySelectorAll('input').forEach(input => {
        input.setAttribute('disabled', 'true')
      })
    })
}

/**
 * 
 */
 function stopFormLoading() {
  document.querySelectorAll('.search-fields')
    .forEach($fields => {
      $fields.classList.remove('loading')
      $fields.querySelectorAll('input').forEach(input => {
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
