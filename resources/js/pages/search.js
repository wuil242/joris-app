import '../../css/search/all.css'
import FormSelect from '../components/FormSelect'
import { debounce, scrollToElement, addLoaderToElement, addLoaderToButton, getFullUrl, throttle } from '../helpers'
import Sticky from '../components/Sticky'
import FetchApi from '../class/FetchApi'
import { StarNotation } from '../components/StarNotation'

// TODO: ajout d'un panier permettant d'accumuler les prestataire

let FETCH_STATUS = {
  IDLE: 0,
  WORKING: 1,
  DONE: 2
}

let FETCH_STATE = FETCH_STATUS.IDLE

FormSelect.init()

Sticky.define({
  element: '.top-button',
  scrollValue: 150,
})

StarNotation.init('.js-star-notation', '.js-star')

class CardAction {

  constructor(opener, modal) {
    /**
     * @type {HTMLElement} 
     */
    this.opener = opener

    /**
     * @type {HTMLElement}
     */
    this.modal = modal
    this.id = +this.opener.dataset.id
    this.modal_id = +this.modal.dataset.id
    /**
     * @type {HTMLElement|null}
     */
    this.close_btn = this.addHideButton()

    this.modal.classList.add('card-action-layout')
    this.modal.classList.add('card-action-hide')
    this.modal.classList.add('card-action-hide-enter')
    this.bindEvents()
    this.openModal()
  }

  addHideButton() {
    const btn = document.createElement('button')
    btn.innerText = 'close'
    btn.classList.add('button')
    btn.classList.add('card-action-close')
    this.modal.appendChild(btn)
    return btn
  }

  bindEvents() {
    this.opener.addEventListener('click', e => {
      e.preventDefault()
      if (this.IsModalHide) {
        this.openModal()
      }
      else {
        this.closeModal()
      }
    })

    this.close_btn.addEventListener('click', this.closeModal.bind(this))
  }

  openModal() {
    this.opener.classList.add('active')
    this.modal.classList.remove('card-action-hide-enter')
    this.modal.getBoundingClientRect()
    this.modal.classList.remove('card-action-hide')
    this.modal.classList.add('card-action-show')

    this.modal.addEventListener('transitionend', () => {
    })
  }

  closeModal() {
    this.opener.classList.remove('active')
    this.modal.classList.remove('card-action-show')
    this.modal.classList.add('card-action-hide')

    this.modal.addEventListener('transitionend', () => {
      if (this.IsModalHide) {
        this.modal.classList.add('card-action-hide-enter')
      }
    }, { once: true })
  }

  get IsModalHide() { return this.modal.classList.contains('card-action-hide') }

  /**
   * 
   * @param {string} selector 
   * @param {string} modal_layout_selector 
   * @returns 
   */
  static create(selector, modal_layout_selector) {
    const elems = Array.from(document.querySelectorAll(selector))
    const modals = Array.from(document.querySelectorAll(modal_layout_selector))
    return elems.map(el => {
      const id = +el.dataset.id
      const modal = modals.find(elem => +elem.dataset.id === id)
      if (modal) {
        return new CardAction(el, modal)
      }
      console.log(el, modals)
      throw new Error(`element id [${el.dataset.id}] not correspond to layout id [${modal?.dataset.id}]`)
    })
  }

}

CardAction.create('.js-sp-card-pencil', '.js-sp-card-notation')

const items = Array.from(document.querySelectorAll('.js-card-notation-star'))
const el_note_input = document.getElementById('sp-card-note')

items.forEach(el => {

  el.addEventListener('pointerenter', () => {
    const value = +el.dataset.value

    items.forEach(elem => elem.classList.replace('fa', 'far'))
    
    el_note_input.value = value

    for (let i = 0; i < value; i++) {
      const index = i

      items[index].classList.replace('far', 'fa')
    }

  })

})