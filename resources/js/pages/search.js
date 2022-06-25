import '../../css/service_provider/all.css'
import '../../css/search/all.css'
import FormSelect from '../components/FormSelect'
import { debounce, scrollToElement, addLoaderToElement, addLoaderToButton, getFullUrl, throttle, str2Dom } from '../helpers'
import Sticky from '../components/Sticky'
import FetchApi from '../class/FetchApi'
import { StarNotation } from '../components/StarNotation'
import CardAction from '../components/CardAction'

// TODO: ajout d'un panier permettant d'accumuler les prestataire


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

function init_page() {
  const searchFilter = document.getElementById('search-filter')
  const btnShowFilter = document.getElementById('search-show-button')
  const btnHideFilter = document.getElementById('search-hide-button')
  const {show, hide} = { show: 'is-show', hide: 'is-hide' } 

  searchFilter.classList.add('is-hide')

  btnShowFilter.addEventListener('click', () => searchFilter.classList.replace(hide, show))

  btnHideFilter.addEventListener('click', () => searchFilter.classList.replace(show, hide))
}

init_page()

FormSelect.init()

Sticky.define({
  element: '.top-button',
  scrollValue: 150,
})

CardAction.create('.js-sp-card-pencil', '.js-sp-card-notation')
CardAction.create('.js-sp-card-comment', '.js-sp-card-comments')
          .forEach(card => card.onOpen(showComments))

StarNotation.init('.js-star-notation', '.js-star')
StarNotation.initInput('.js-card-notation-star', '#sp-card-note')
