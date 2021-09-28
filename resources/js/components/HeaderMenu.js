import CustumError from "../class/CustumError"
import Sticky from "./Sticky"

export default class HeaderMenu {
  /**
   *
   * @param {{
   * openBtnSelector:string,
   * menuSelector:string,
   * closeBtnSelector?:string,
   * closeElementSelector?:string
   * stickyMenu?:string
   * }} options options de configurations
   */
  constructor(options) {
    this.$openBtn = document.querySelectorAll(options.openBtnSelector)
    this.$menu = document.querySelector(options.menuSelector)
    this.$closeBtn = this.$menu.querySelector(options?.closeBtnSelector || '#button-close')
    this.$closeElement = document.querySelector(options?.closeElementSelector)
    this.$stickyMenu =  document.querySelector(options?.stickyMenu || '.js-header-sticky')

    

    if (!this.$openBtn || !this.$menu || !this.$closeBtn || !this.$closeElement) {
      throw new Error('define all options')
    }

    if(!this.$stickyMenu) {
      CustumError.create('menu sticky not found with class "$0"', options.stickyMenu || '.js-header-sticky')
    }

    this.openMenu = this.openMenu.bind(this)
    this.closeMenu = this.closeMenu.bind(this)    
    this.createStickyMenu = this.createStickyMenu.bind(this)

    this.init()
  }

  createStickyMenu () {
    Sticky.define({
      element: this.$stickyMenu,
      scrollValue: 45,
      activeClass: 'scroll'
    })
  }

  openMenu() {
    this.$menu.classList.replace('hide', 'show')
    this.$closeElement.style.setProperty('display', 'block')
    this.$menu.addEventListener('animationend', () => {
      this.$closeElement.addEventListener('click', this.closeMenu, { once: true })
    })
  }

  closeMenu() {
    this.$closeElement.style.setProperty('display', 'none')
    this.$menu.classList.replace('show', 'leave')
    this.$menu.addEventListener('animationend', (e) => {
      this.$menu.classList.replace('leave', 'hide')
    })
  }

  init() {

    console.log(this.$openBtn)

    this.$openBtn.forEach(btn => btn.addEventListener('click', this.openMenu))

    this.$closeBtn.addEventListener('click', this.closeMenu)

    this.createStickyMenu()
  }

  /**
   *
   * @param {{
   * openBtnSelector:string,
   * menuSelector:string,
   * closeBtnSelector?:string,
   * closeElementSelector?:string
   * }} options options de configurations
   */
  static create(options) {
    return new HeaderMenu(options)
  }
}
