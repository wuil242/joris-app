
export default class HeaderMenuButton {
  /**
   * @param {{
   * buttonSelector:string
   * }} options options du boutton dans le menu
   */
  constructor(options) {
    this.$btn = document.querySelector(options.buttonSelector)

    if(!this.$btn) throw new Error('selecteur du boutton de menu non defini')

    this.scrolling = this.scrolling.bind(this)

    this.init()
  }

  scrolling() {
    if(window.scrollY >= 45) {
      this.$btn.classList.add('scroll')
    }else if(window.scrollY < 45) {
      this.$btn.classList.remove('scroll')
    }
  }

  init () {

    this.scrolling()

    window.addEventListener('scroll', this.scrolling)
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