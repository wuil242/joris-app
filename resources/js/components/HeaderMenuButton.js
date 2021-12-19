import Sticky from "./Sticky"

export default class HeaderMenuButton {
  /**
   * @param {{
   * openButtonSelector:string,
   * menuSelector:string,
   * closeElementSelector:string
   * }} options options du boutton dans le menu
   */
  constructor(options) {
    this.$openBtn = document.querySelector(options.openButtonSelector)
    this.$menu = document.querySelector(options.menuSelector)    
    this.$closeBtn = this.$menu.querySelector(options?.closeBtnSelector || '#button-close')
    this.$closeElement = document.querySelector(options?.closeElementSelector)

    console.log(this.$closeBtn)

    if (!this.$openBtn) throw new Error('selecteur du boutton de menu non defini')
    if (!this.$menu) throw new Error('element reprseting menu not dinfined, please set correct selector to "menuSelector" option')
    if (!this.$closeBtn) throw new Error('button element use to close menu not define, please set correct selector "closeBtnSelector" option')
    if (!this.$closeElement) throw new Error('background element use to close menu not define, please set correct selector "closeElementSelector" option')

    this.init()
  }

  init() {
    this.$openBtn.addEventListener('click', this.openMenu.bind(this))

    this.$closeBtn.addEventListener('click', this.closeMenu.bind(this))

    Sticky.define({
      element: this.$openBtn,
      scrollValue: 45,
      activeClass: 'scroll'
    })
  }


  openMenu() {
    this.$menu.classList.replace('hide', 'show')
    this.$closeElement.style.setProperty('display', 'block')
    this.$menu.addEventListener('animationend', () => {
      this.$closeElement.addEventListener('click', this.closeMenu.bind(this), { once: true })
    })
  }

  closeMenu() {
    this.$closeElement.style.setProperty('display', 'none')
    this.$menu.classList.replace('show', 'leave')
    this.$menu.addEventListener('animationend', (e) => {
      this.$menu.classList.replace('leave', 'hide')
    })
  }

  /**
   * @param {{
   * buttonSelector:string
   * }} options options du boutton dans le menu
   */
  static create(options) {
    return new HeaderMenuButton(options)
  }
}
