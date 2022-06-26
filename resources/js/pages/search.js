  import '../../css/search/all.css'
import FormSelect from '../components/FormSelect'
import { debounce, scrollToElement, addLoaderToElement, addLoaderToButton, getFullUrl, throttle, str2Dom, isLargeScreen, removeLoaderToElement } from '../helpers'
import Sticky from '../components/Sticky'
import FetchApi from '../class/FetchApi'

// TODO: ajout d'un panier permettant d'accumuler les prestataire

const $searchFilter = document.getElementById('search-filter')
const $searchResult = document.getElementById('search-result')
const $skeleton = document.getElementById('service-provider-card-skeleton')
const $loader_element = document.getElementById('loader-element')
const $search_content = document.getElementById('search-content')

const FILTER_STATE = { SHOW: 'is-show', HIDE: 'is-hide', FIXED: 'fixed' }


let LAST_FILTER_CHOICE = ''
let LAST_FILTER_CONTENT = ''


function active_loading() {
  return addLoaderToElement($search_content, $loader_element)
}

/**
 * 
 * @param {HTMLElement} $loader_element 
 */
function deactive_loading($loader_element) {
  removeLoaderToElement($search_content, $loader_element)
}

/**
 * 
 * @param {HTMLElement} $el
 * @param {HTMLFormElement} $form formulaire contenant le champ de la page actuelle
 * 
 */
function bind_more_button_event($form) {
  const $more_button = document.getElementById('more-button')
  
  if(!$more_button) return

  const $add_card_position = document.getElementById('service-provider-replace')
  
  $more_button.addEventListener('click', () => {
    const $loader = active_loading()
    const page = $more_button.dataset.page
    $form.querySelector('#search-page').value = page

    FetchApi.getCardWithFilter($form)
      .then(({html, count}) => {
        if(count > 0) {
          $add_card_position.innerHTML = html
          bind_more_button_event($form)
          deactive_loading($loader)
        }
      })
  })
}

function init_filter() {
  const $btnShowFilter = document.getElementById('search-show-button')
  const $btnHideFilter = document.getElementById('search-hide-button')

  $searchFilter.classList.add('is-hide')

  $btnShowFilter.addEventListener('click', () => {
    if(LAST_FILTER_CONTENT === '') {
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
  const $loader = active_loading()

  FetchApi.getCardWithFilter($form)
    .then(({filter, html}) => {
      $searchFilter.innerHTML = filter

      if($searchFilter.classList.contains(FILTER_STATE.FIXED)) {
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

      deactive_loading($loader)
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
  scrollValue: 150
})
