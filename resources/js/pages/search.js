import '../../css/search/all.css'
import FormSelect from '../components/FormSelect'
import { debounce, scrollToElement, addLoaderToElement, addLoaderToButton, getFullUrl, throttle } from '../helpers'
import Sticky from '../components/Sticky'
import FetchApi from '../class/FetchApi'

// TODO: ajout d'un panier permettant d'accumuler les prestataire


function init_page() {
  const $searchFilter = document.getElementById('search-filter')
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


