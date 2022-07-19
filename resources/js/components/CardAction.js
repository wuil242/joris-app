import '../../css/service_provider/card-action.css'

export default class CardAction {

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
    const icon = document.createElement('i')
    const btn = document.createElement('button')

    icon.classList.add('fa', 'fa-lg', 'fa-times')
    btn.classList.add('button', 'card-action-close')
    btn.appendChild(icon)

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