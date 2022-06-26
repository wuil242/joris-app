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
} from '../helpers'
import Sticky from '../components/Sticky'
import FetchApi from '../class/FetchApi'

// TODO: ajout d'un panier permettant d'accumuler les prestataire

const $searchFilter = document.getElementById('search-filter')
const $searchResult = document.getElementById('search-result')
const $searchResultContent = document.getElementById('search-result-content')
const $loader_element = document.getElementById('loader-element')

const FILTER_STATE = { SHOW: 'is-show', HIDE: 'is-hide', FIXED: 'fixed' }

let LAST_FILTER_CHOICE = ''
let LAST_FILTER_CONTENT = ''


function active_loading() {
  return addLoaderToElement($searchResult, $loader_element)
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

    FetchApi.getCardWithFilter($form).then(({ html, count }) => {
        $add_card_position.innerHTML = html
        bind_more_button_event($form)
        $pageField.value = ''
        loader.remove()
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
 * @param {HTMLFormElement} $form
 */
function submit_filter(e, $form) {
  e.preventDefault()

  const $btnHideFilter = document.getElementById('search-hide-button')

  if(LAST_FILTER_CONTENT === $searchFilter.innerHTML) {
    $btnHideFilter.click()
    return 
  }

  const loader = addLoaderToElement($searchFilter, $loader_element)

  FetchApi.getCardWithFilter($form).then(({ html, filter }) => {
    $searchResultContent.innerHTML = html
    loader.remove()
    $btnHideFilter.click()
    $searchFilter.innerHTML = filter
    init_page_events_binding()
  })
}


/**
 * 
 * @param {CustomEvent<string>} e
 * @param {HTMLFormElement} $form
 * @returns 
 */
function submit_auto_filter(e, $form) {
  const filter_value = e.detail

  if (LAST_FILTER_CHOICE === filter_value) return

  LAST_FILTER_CHOICE = filter_value

  auto_filter($form)
}

function init_filtering() {
  const $form = document.getElementById('form-search-provider')
  const $filterFields = $form.querySelectorAll('.js-select')

  $form.addEventListener('submit', (e) => submit_filter(e, $form))

  $filterFields.forEach(($filter) => {
    $filter.addEventListener(FormSelect.EVENT.SELECTED, (e) => submit_auto_filter(e, $form))
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
