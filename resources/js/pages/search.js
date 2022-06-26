import '../../css/service_provider/all.css'
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
import { StarNotation } from '../components/StarNotation'
import CardAction from '../components/CardAction'

// TODO: ajout d'un panier permettant d'accumuler les prestataire

const $searchFilter = document.getElementById('search-filter')
const $searchResult = document.getElementById('search-result')
const $skeleton = document.getElementById('service-provider-card-skeleton')
const $loader_element = document.getElementById('loader-element')
const $search_content = document.getElementById('search-content')

const FILTER_STATE = { SHOW: 'is-show', HIDE: 'is-hide', FIXED: 'fixed' }

/**
 * 
 * @param {string|number} serviceProviderId 
 * @param {HTMLElement} $cardCommentsView 
 */
function bindMoreCommentEvent(serviceProviderId, $cardCommentsView) {
  const $btn = $cardCommentsView.querySelector('#btn-more-comment')
 
  if(!$btn) return

  const page = $btn.dataset.page

  $btn.addEventListener('click', () => {
    FetchApi.getComments(serviceProviderId, page)
            .then(html => {
              const $list = $cardCommentsView.querySelector('#service-provider-comments-list')
              $btn.remove()
              $list.innerHTML += html
              bindMoreCommentEvent(serviceProviderId, $cardCommentsView)
            })
  })
  
}

function showComments({target}) {
  const serviceProviderId = target.dataset.id
  const $cardCommentsView = target.querySelector('#service-provider-comments')

  FetchApi.getComments(serviceProviderId, 1)
          .then(html => {
            $cardCommentsView.innerHTML = html
            bindMoreCommentEvent(serviceProviderId, $cardCommentsView)
          })
}

let LAST_FILTER_CHOICE = ''
let LAST_FILTER_CONTENT = ''


function active_loading() {
  return addLoaderToElement($search_content, $loader_element)
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
    $form.querySelector('#search-page').value = page

    FetchApi.getCardWithFilter($form).then(({ html, count }) => {
        $add_card_position.innerHTML = html
        bind_more_button_event($form)
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

    $searchResult.innerHTML = ''
    for (let index = 0; index < 10; index++) {
      const element = $skeleton.content.cloneNode(true)
      $searchResult.appendChild(element)
    }

    $searchResult.innerHTML = html

    init_page_events_binding()

    if (loader) loader.remove()
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
  const loader = addLoaderToElement($searchFilter, $loader_element)

  FetchApi.getCardWithFilter($form).then(({ html, filter }) => {
    $searchResult.innerHTML = html
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

CardAction.create('.js-sp-card-pencil', '.js-sp-card-notation')
CardAction.create('.js-sp-card-comment', '.js-sp-card-comments')
          .forEach(card => card.onOpen(showComments))
Sticky.define({
  element: '#search-filter',
  scrollValue: 150,
})
