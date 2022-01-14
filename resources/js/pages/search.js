import '../../css/search/all.css'
import FormSelect from '../components/FormSelect'
import { debounce, scrollToElement, addLoader, addButtonLoader, getFullUrl } from '../helpers'
import Sticky from '../components/Sticky'
import FetchApi from '../class/FetchApi'


const $firstProviderCard = document.querySelector('.service-provider-card')
let FETCH_STATUS = {
  IDLE: 0,
  WORKING: 1,
  DONE: 2
}

let FETCH_STATE = FETCH_STATUS.IDLE

if($firstProviderCard) {
  scrollToElement($firstProviderCard)
}

Sticky.define({
  element: '.top-button',
  scrollValue: 150,
})

initSearchFilter(true)


function initSearchFilter(withMore = false) {
  const $form = document.querySelector('#form-search-provider')
  const $range = document.querySelector('#limit-slider')
  const $limitInput = document.querySelector('#limit-input')
  const $limit = document.querySelector("#search-limit")
  const $search_fields = Array.from($form.querySelectorAll('.search-field .js-select'))
// const $search_empty_message = document.getElementById('search-empty-message')
  const $search_result = document.getElementById('search-result')
  const $search_filter = document.getElementById('search-filter')
  const $search_form_submit = document.getElementById('search-submit')

  $form.addEventListener('submit', () => handleFormSubmit({
    $form, $search_result, $search_filter, $search_fields
  }))

  $form.addEventListener('change', e => handleFormChange({e, $form, $search_fields, $search_filter}))

  $search_fields.forEach(field => {
    field.addEventListener('form-select', e => handleFormChange({e, $form, $search_fields, $search_filter}))
  })

  $range.addEventListener('pointerup', e => updateLimitValue(e, $limit, $limitInput))
  $range.addEventListener('pointerdown', e => {
    updateLimitValue(e, $form, $limitInput)
    $range.addEventListener('pointermove', () => updateLimitValue(e, $form, $limitInput))

    $range.addEventListener('pointerup', () => {
      $range.removeEventListener('pointermove', e => updateLimitValue(e, $form, $limitInput))
    }, {once: true})
  })

  $limitInput.addEventListener('change', e => updateLimitSlider({
    e, $range, $limitInput, $limit
  }))

  $limitInput.addEventListener('keyup', e => updateLimitSlider({
    e, $range, $limitInput, $limit
  }))

  $search_form_submit.addEventListener('click', e => {
    e.preventDefault()
    addButtonLoader($search_form_submit)
    submitForm($form, $search_fields)
  })


  FormSelect.init()

  if(withMore) {
    more($search_fields, $search_result, $search_filter)
  }

}



/**
 * 
 * @param {{
 * e: SubmitEvent, 
 * $form: HTMLFormElement,  
 * $search_result: HTMLFormElement,  
 * $search_filter: HTMLFormElement,  
 * $search_fields: HTMLFormElement
 * }} options
 */
function handleFormSubmit({$form, $search_result, $search_filter, $search_fields}) {
  const url = getFullUrl($form)

  fecthServiceProviders({url, $root: $search_result, before: false, $search_result})
    .then(({html, filter}) => {
      $search_result.innerHTML = html
      $search_filter.innerHTML = filter
      initSearchFilter()
      more($search_fields, $search_result, $search_filter)
    })
}



/**
 * recuperation des perstataires et du formulaire de recherce au format html
 * 
 * @param {{
 * url:URL, 
 * $root:HTMLElement,  
 * before:boolean,
 * middleware: () => void,
 * $search_result:HTMLElement
 * }}  options
 * @returns 
 */
function fecthServiceProviders({url, $root, before, $search_result, middleware = null}) {
  addLoader($root)
  return new Promise((resolve, reject) => {
    const headers = {'X-Requested-With': 'XMLHttpRequest'}
    url.searchParams.set('count', '')
    fetch(url.href, {headers})
      .then(r => r.json())
      .then(({count}) => {
        const skeleton_cards = addSkeletonCard($root, count, before)
        if(middleware) {
          middleware()
        }

        if(count) {
          scrollToElement($search_result.firstElementChild)
        }
        else {
          addLoader($root)
        }

        url.searchParams.delete('count')
        return skeleton_cards
      })
      .then(skeleton_cards => {
        fetch(url.href, {headers})
        .then(r => r.json())
        .then((response) => {
          url.searchParams.delete('page')
          window.history.replaceState(undefined, '', url)
          resolve({...response, skeleton_cards})
        })
      })
  })
}

/**
 * 
 * @param {HTMLElement} $root 
 * @param {number} limit nombre d'element a afficher 
 * @param {boolean} before ajout les element avant l'element principale
 */
function addSkeletonCard($root, limit, before = false) {
  const $service_provider_skeleton_template = document.querySelector('#service-provider-card-skeleton') 
  const skeleton_cards = []
  $root.innerHTML = ''
  for (let i = 0; i < limit; i++) {
    const $element = $service_provider_skeleton_template.content.firstElementChild.cloneNode(true)
    if(before) {
      skeleton_cards.push($element)
      $root.before($element)
      continue
    }
    
    $root.appendChild($element)
  }

  return skeleton_cards
}

/**
 * @param {{
 * e: Event,
 * $form: HTMLFormElement 
 * $search_fields: HTMLElement 
 * $search_filter: HTMLElement
 * }} options 
 */
function handleFormChange({e, $form, $search_fields, $search_filter}) {
  const name = e.target.querySelector('select')?.getAttribute('name')

  const $serch_fields_inputs = $search_fields.map($search_field => $search_field.querySelector('select'))

  if(name === 'job') return

  if(name === 'city') {
    const $search_fieleds_filtered =  $serch_fields_inputs.filter(field => {
      const field_name = field.getAttribute('name')
      return field_name === 'arrondissement' || field_name === 'quater'
    })
    
    $search_fieleds_filtered.forEach((field, index) => {
      field.value = '0'
      if(index === $search_fieleds_filtered.length - 1) {
        updateForm($form, $search_filter, $search_fields)
      }
    })
  }
  else if(name === 'arrondissement') {
    $serch_fields_inputs.filter(field => field.name === 'quater')
      .forEach(field => {
        field.value = '0'
        updateForm($form, $search_filter, $search_fields)
      })
  }
  else {
    updateForm($form, $search_filter, $search_fields)
  }
}

/**
 * 
 * @param {HTMLFormElement} $form 
 * @param {HTMLFormElement} $search_filter 
 * @param {HTMLFormElement} $search_fields 
 */
function updateForm($form, $search_filter, $search_fields) {
  startFormLoading($search_fields)
  FetchApi.getForm($form)
    .then(({filter}) => {
      $search_filter.innerHTML = filter
      initSearchFilter()
    })
}

/**
 * @param {HTMLElement} $search_fields 
 * @param {HTMLElement} $form 
 */
function submitForm($form, $search_fields) {
  startFormLoading($search_fields)
  $form.dispatchEvent(new Event('submit'))
}

/**
 * remplace le boutton voir plus par le nouveau contentu
 * 
 * @param {HTMLElement} $search_fields 
 * @param {HTMLElement} $search_filter  
 * @param {HTMLElement} $search_filter 
 * @returns 
 */
function more($search_fields, $search_result, $search_filter) {
  const $moreButton = document.querySelector("#more-button")

  if(!$moreButton) {
    return
  }

  $moreButton.addEventListener('click', e => {
    const url = new URL(document.URL)
    
    e.preventDefault()
    startFormLoading($search_fields)

    url.searchParams.set('page', $moreButton.dataset.page)
    
    fecthServiceProviders({
      url, $root: $moreButton, before: true, $search_result, 
      middleware() {
        $moreButton.style.setProperty('display', 'none')
      }
    })
    .then(({html, filter, skeleton_cards}) => {
      $moreButton.remove()
      const last_index = $search_result.children.length
      skeleton_cards.forEach(card => card.remove())
      $search_result.innerHTML += html

      Array.from($search_result.children).forEach(($card, index) => {
        if(index === last_index) {
          scrollToElement($card)
        }

        if(index === last_index - 1) {
          $search_filter.innerHTML = filter
          initSearchFilter(false)
          more($search_fields, $search_result, $search_filter)
        }
      })
    })
  })
}


/**
 * @param {HTMLElement} $search_fields 
 */
function startFormLoading($search_fields ) {
  modifySearchFields('disable', $search_fields)
}

/**
 * @param {HTMLElement} $search_fields 
 */
 function stopFormLoading($search_fields) {
  modifySearchFields('enable', $search_fields )
}

/**
 * 
 * @param {string} eventName nom de l'event declancher pour desactiver ou activer les champs des metiers, des villes, ...
 * @param {HTMLElement} $search_fields 
 */
function modifySearchFields(eventName, $search_fields) {
  const isEnable = eventName === 'disable'
  $search_fields.forEach($field => $field.dispatchEvent(new Event(eventName)))

  document.querySelectorAll('.search-fields-page input, #search-submit')
    .forEach($input => {
        if($input.getAttribute('name') !== 'limit') {
          if(isEnable) {
            $input.setAttribute('disabled', '')
          }
          else {
            $input.removeAttribute('disabled')
          }
        }
    })

    document.querySelectorAll('.search-field')
    .forEach($field => {
      if(isEnable) {
        $field.classList.add('disabled')
      } else {
        $field.classList.remove('disabled')
      }
    })
}


/**
 * 
 * @param {PointerEvent} e 
 * @param {HTMLElement} $limit 
 * @param {HTMLElement} $limitInput
 */
function updateLimitValue(e, $limit, $limitInput) {
  $limit.value = $limitInput.value = e.target.value
}

/**
 * 
 * @param {{
 * e: PointerEvent|KeyboardEvent, 
 * $range: HTMLElement,
 * $limitInput: HTMLElement,
 * $limit: HTMLInputElement
 * }} options
 */
 function updateLimitSlider({e, $range,  $limitInput, $limit}) {
  
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
