import '../../css/search/all.css'
import FormSelect from '../components/FormSelect'
import {
  debounce,
  scrollToElement,
  addLoaderToElement,
  addLoaderToButton,
  getFullUrl,
  throttle,
  str2Dom,
  isLargeScreen,
  removeLoaderToElement,
  getElementFromTemplate,
} from '../helpers'
import Sticky from '../components/Sticky'
import FetchApi from '../class/FetchApi'

// TODO: ajout d'un panier permettant d'accumuler les prestataire

const $searchFilter = document.getElementById('search-filter')
const $searchResult = document.getElementById('search-result')
const $searchResultContent = document.getElementById('search-result-content')
const $loaderElement = getElementFromTemplate('#loader-element-template')
const $loaderButton = getElementFromTemplate('#loader-button-template')

const FILTER_STATE = { SHOW: 'is-show', HIDE: 'is-hide', FIXED: 'fixed' }
const FILTER_FIELD_NAMES = ['city', 'arrondissement', 'quater']

let LAST_FILTER_CHOICE = ''
let LAST_FILTER_CONTENT = ''


function active_loading() {
  return addLoaderToElement($searchResult, $loaderElement)
}

/**
 * 
 * @param {NodeListOf<HTMLElement> | HTMLElement[] | HTMLFormElement}  $el can be collection of fields or form connaints fields
 * @returns {Promise<{remove: () => void}[]}
 */
 function active_filter_loading($el) {
  const loaders = []
  if($el?.nodeName?.toLowerCase() === 'form') {
    $el = $el.querySelectorAll('.js-select')
  }

  const [$btnSubmitFilter, $btnShowFilter] = document.querySelectorAll('#search-submit, #search-hide-button')//document.querySelectorAll('#search-show-button', '#search-submit')
  
  $el = [...$el, $btnShowFilter, $btnSubmitFilter]
  
  return new Promise((res, rej) => {
    $el.forEach(($filter, index) => {
      const loader = addLoaderToButton($filter, $loaderButton) //, $loaderElement)
      loaders.push(loader)
      if(index === $el.length - 1) res(loaders)
    })
  })
}


/**
 *
 * @param {HTMLElement} $el
 * @param {HTMLFormElement} $form formulaire contenant le champ de la page actuelle
 *
 */
function bind_more_button_event($form) {
  const $more_button = document.getElementById('more-button')

  if (!$more_button) return

  const $add_card_position = document.getElementById('service-provider-replace')

  $more_button.addEventListener('click', () => {
    const loader = active_loading()
    const page = $more_button.dataset.page
    const $pageField = $form.querySelector('#search-page')
    
    $pageField.value = page

    const filter_loader = active_filter_loading($form)

    FetchApi.getCardWithFilter($form).then(({ html, count }) => {
        $add_card_position.innerHTML = html
        bind_more_button_event($form)
        $pageField.value = ''
        loader.remove()
        filter_loader.then( loaders => loaders.forEach(l => l.remove()) )
    })
  })
}

function init_filter() {
  const $btnShowFilter = document.getElementById('search-show-button')
  const $btnHideFilter = document.getElementById('search-hide-button')

  $searchFilter.classList.add('is-hide')

  $btnShowFilter.addEventListener('click', () => {
    if (LAST_FILTER_CONTENT === '') {
      LAST_FILTER_CONTENT = $searchFilter.innerHTML
    }

    $searchFilter.classList.replace(FILTER_STATE.HIDE, FILTER_STATE.SHOW)
    $searchFilter.classList.add(FILTER_STATE.FIXED)
    $searchFilter.focus()
  })

  $btnHideFilter.addEventListener('click', () => {
    $searchFilter.classList.replace(FILTER_STATE.SHOW, FILTER_STATE.HIDE)
    $searchFilter.classList.remove(FILTER_STATE.FIXED)
    $searchFilter.innerHTML = LAST_FILTER_CONTENT
    LAST_FILTER_CONTENT = ''
    init_page_events_binding()
  })
}

/**
 *
 * @param {HTMLFormElement} $form
 */
function auto_filter($form) {
  const isFixedFilterBox = $searchFilter.classList.contains(FILTER_STATE.FIXED)
  let loader = null

  if (!isFixedFilterBox) loader = active_loading()

  FetchApi.getCardWithFilter($form).then(({ filter, html }) => {
    $searchFilter.innerHTML = filter

    if (isFixedFilterBox) {
      init_page_events_binding()
      document.querySelector('#search-show-button').click()
      return
    }

    $searchResultContent.innerHTML = html
    init_page_events_binding()
    if(loader) loader.remove()
  })
}

/**
 *
 * @param {SubmitEvent} e
 * @param {HTMLFormElement}  $filterFields
 * @param {HTMLFormElement} $form
 */
function submit_filter(e, $filterFields, $form) {
  e.preventDefault()

  const $btnHideFilter = document.getElementById('search-hide-button')

  if(LAST_FILTER_CONTENT === $searchFilter.innerHTML) {
    $btnHideFilter.click()
    return 
  }

  const loader = addLoaderToElement($searchFilter, $loaderElement)

  active_filter_loading($filterFields)

  FetchApi.getCardWithFilter($form).then(({ html, filter }) => {
    $searchResultContent.innerHTML = html
    loader.remove()
    $btnHideFilter.click()
    $searchFilter.innerHTML = filter
    init_page_events_binding()
  })
}

/**
 * reset all field on right depend to left field
 * 
 * @param {string} field 
 * @param {string[]} filterFieldNames 
 * @param {HTMLFormElement} $form 
 */
function reset_filter_fields_dependence(field, filterFieldNames, $form) {
  for (let index in filterFieldNames) {
    if(field === filterFieldNames[index]) {
      while(index < filterFieldNames.length - 1) {
        index++
        const $filter_field = $form.querySelector(`[name=${filterFieldNames[index]}]`)
        $filter_field.value = 0
      }
    }
  }
}

/**
 * 
 * @param {CustomEvent<{field: string, text: string, value: string}>} e
 * @param {HTMLFormElement} $filterFields
 * @param {HTMLFormElement} $form
 * @returns 
 */
function submit_auto_filter(e, $filterFields, $form) {
  const {field, text} = e.detail

  reset_filter_fields_dependence(field, FILTER_FIELD_NAMES, $form)

  if (LAST_FILTER_CHOICE === text) return

  LAST_FILTER_CHOICE = text

  active_filter_loading($filterFields)
  auto_filter($form)
}

function init_filtering() {
  const $form = document.getElementById('form-search-provider')
  const $filterFields = $form.querySelectorAll('.js-select')

  $form.addEventListener('submit', (e) => submit_filter(e, $filterFields, $form))

  $filterFields.forEach(($filter) => {
    $filter.addEventListener(FormSelect.EVENT.SELECTED, (e) => submit_auto_filter(e, $filterFields, $form))
  })

  bind_more_button_event($form)
}

/**
 * init all binding event functions
 */
function init_page_events_binding() {
  FormSelect.init()
  init_filter()
  init_filtering()
}

init_page_events_binding()

Sticky.define({
  element: '#top-button',
  scrollValue: 150,
})

Sticky.define({
  element: '#search-filter',
  scrollValue: 150,
})
