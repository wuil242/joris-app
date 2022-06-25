import '../../css/search/all.css'
import FormSelect from '../components/FormSelect'
import { debounce, scrollToElement, addLoaderToElement, addLoaderToButton, getFullUrl, throttle, str2Dom, isLargeScreen } from '../helpers'
import Sticky from '../components/Sticky'
import FetchApi from '../class/FetchApi'

// TODO: ajout d'un panier permettant d'accumuler les prestataire

const $searchFilter = document.getElementById('search-filter')
const $searchResult = document.getElementById('search-result')
const $skeleton = document.getElementById('service-provider-card-skeleton')

let LAST_FILTER_CHOICE = ''


function init_page() {
  const $btnShowFilter = document.getElementById('search-show-button')
  const $btnHideFilter = document.getElementById('search-hide-button')
  const {show, hide} = { show: 'is-show', hide: 'is-hide' } 

  $searchFilter.classList.add('is-hide')

  $btnShowFilter.addEventListener('click', () => {
    $searchFilter.classList.replace(hide, show)
    $searchFilter.focus()
  })

  $btnHideFilter.addEventListener('click', () => $searchFilter.classList.replace(show, hide))
}

/**
 * 
 * @param {HTMLFormElement} $form 
 */
function auto_filter($form) {
  $searchResult.innerHTML = ''
  for (let index = 0; index < 10; index++) {
    const element = $skeleton.content.cloneNode(true)
    $searchResult.appendChild(element)
  }

  FetchApi.getCardWithFilter($form)
    .then(({filter, count, html}) => {
      $searchFilter.innerHTML = filter
      FormSelect.init()
      init_filtering()
      init_page()

      if(count <= 0) {
        $searchResult.innerHTML = html
        return
      }

      for (let index = 0; index < count; index++) {
        $searchResult.removeChild($searchResult.lastElementChild)
      }

      $searchResult.innerHTML = html
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

init_page()

FormSelect.init()

Sticky.define({
  element: '#top-button',
  scrollValue: 150,
})

Sticky.define({
  element: '#search-filter',
  scrollValue: 150
})

init_filtering()


