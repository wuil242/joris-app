import Sticky from "./Sticky"

export default class HeaderMenuButton {
  /**
   * @param {{
   * buttonSelector:string
   * }} options options du boutton dans le menu
   */
  constructor(options) {
    this.$btn = document.querySelector(options.buttonSelector)

    if (!this.$btn) throw new Error('selecteur du boutton de menu non defini')

    this.stickyMenu = null

    this.init()
  }

  init() {
    this.stickyMenu = Sticky.define({
      element: this.$btn,
      scrollValue: 45,
      activeClass: 'scroll'
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
