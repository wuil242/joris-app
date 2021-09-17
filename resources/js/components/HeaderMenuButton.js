
export default class HeaderMenuButton {
  /**
   *
   * @param {{
   * openBtnSelector:string,
   * menuSelector:string,
   * closeBtnSelector?:string,
   * closeElementSelector?:string
   * }} options options de configurations 
   */
  constructor(options) {
    this.$openBtn = document.querySelector(options.openBtnSelector)
    this.$menu = document.querySelector(options.menuSelector)
    this.$closeBtn = this.$menu.querySelector(options?.closeBtnSelector || '#button-close')
    this.$closeElement = document.querySelector(options?.closeElementSelector)
  
    if (!this.$openBtn || !this.$menu || !this.$closeBtn || !this.$closeElement) {
      throw new Error('define all options')
    }

    this.openMenu = this.openMenu.bind(this)
    this.closeMenu = this.closeMenu.bind(this)

    this.init()
  }

  openMenu() {
    this.$menu.classList.replace('hide', 'show')
    this.$closeElement.style.setProperty('display', 'block')
    this.$menu.addEventListener('animationend', () => {
      this.$closeElement.addEventListener('click', this.closeMenu, {once: true})
    })
  }
  
  closeMenu() {
    this.$closeElement.style.setProperty('display', 'none')
    this.$menu.classList.replace('show', 'leave')
    this.$menu.addEventListener('animationend', e => {
      this.$menu.classList.replace('leave', 'hide')
    })
  }

  init () {
    this.$openBtn.addEventListener('click', this.openMenu)
  
    this.$closeBtn.addEventListener('click', this.closeMenu)
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
    return new HeaderMenuButton(options)
  }
}
