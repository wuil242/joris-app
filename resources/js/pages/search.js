import '../../css/service_provider/all.css'
import '../../css/search/all.css'
import FormSelect from '../components/FormSelect'
import { debounce, scrollToElement, addLoaderToElement, addLoaderToButton, getFullUrl, throttle, str2Dom, isLargeScreen } from '../helpers'
import Sticky from '../components/Sticky'
import FetchApi from '../class/FetchApi'
import { StarNotation } from '../components/StarNotation'
import CardAction from '../components/CardAction'

// TODO: ajout d'un panier permettant d'accumuler les prestataire

const $searchFilter = document.getElementById('search-filter')
const $searchResult = document.getElementById('search-result')
const $skeleton = document.getElementById('service-provider-card-skeleton')
const {show, hide, fixed} = { show: 'is-show', hide: 'is-hide', static: 'fixed' } 

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

/**
 * 
 * @param {HTMLElement} $el
 * 
 */
 function bind_more_button_event($el) {
  $el.addEventListener('click', () => {
    const page = $el.dataset.page
    
  })
}

function init_filter() {
  const $btnShowFilter = document.getElementById('search-show-button')
  const $btnHideFilter = document.getElementById('search-hide-button')
  const $more_button = document.getElementById('more-button')

  $searchFilter.classList.add('is-hide')

  $btnShowFilter.addEventListener('click', () => {
    if(LAST_FILTER_CONTENT === '') {
      LAST_FILTER_CONTENT = $searchFilter.innerHTML
    }
    
    $searchFilter.classList.replace(hide, show)
    $searchFilter.classList.add(fixed)
    $searchFilter.focus()
  })
  
  $btnHideFilter.addEventListener('click', () => {
    $searchFilter.classList.replace(show, hide)
    $searchFilter.classList.remove(fixed)
    $searchFilter.innerHTML = LAST_FILTER_CONTENT
    LAST_FILTER_CONTENT = ''
    init_page_events_binding()
  })
      
  if($more_button) bind_more_button_event($more_button)
}


/**
 * 
 * @param {HTMLFormElement} $form 
 */
function auto_filter($form) {


  FetchApi.getCardWithFilter($form)
    .then(({filter, count, html}) => {
      $searchFilter.innerHTML = filter

      $searchFilter.getBoundingClientRect()
      
      if($searchFilter.classList.contains(fixed)) {
        init_page_events_binding()
        document.querySelector('#search-show-button').click()
        return
      }

      $searchResult.innerHTML = ''
      for (let index = 0; index < 10; index++) {
        const element = $skeleton.content.cloneNode(true)
        $searchResult.appendChild(element)
      }
      
      if(count <= 0) {
        $searchResult.innerHTML = html
        init_page_events_binding()
        return
      }

      for (let index = 0; index < count; index++) {
        $searchResult.removeChild($searchResult.lastElementChild)
      }

      $searchResult.innerHTML = html

      init_page_events_binding()
    })
}

function init_filtering() {
  const $form = document.getElementById('form-search-provider')
  const $filterFields = $form.querySelectorAll('.js-select')

  $filterFields.forEach($filter => {

    $filter.addEventListener(FormSelect.EVENT.SELECTED, (e) => {
      const filter_value = e.detail
      
      if(LAST_FILTER_CHOICE === filter_value) return
      
      LAST_FILTER_CHOICE = filter_value
     
      auto_filter($form)
    })
  })
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
  scrollValue: 150
})

